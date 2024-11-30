import { useState, useCallback, useEffect } from "react";
import {
  useAccount,
  useConfig,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { readContract } from "wagmi/actions";
import { parseUnits, formatUnits, Hash } from "viem";
import { stakingABI } from "@/staking-abi";
import { DNAbi } from "@/dn-abi";
import { abi as nftABI } from "@/contract-abi";
import { useChainConfig } from "@/config/network";
import {
  NFTStakeState,
  OwnedNFT,
  NFTQueryResponse,
  ProcessingStep,
  NFTApprovalStatus,
  NFTStakingHookReturn,
  GraphQLResponse,
} from "./types";
import { NFTMetadata } from "@/NFTMetadata";

const MAX_STAKE_PER_NFT = BigInt(1e6);
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000;

export const useNFTStaking = (): NFTStakingHookReturn => {
  const config = useConfig();
  const { addresses } = useChainConfig();
  const { address } = useAccount();

  const [ownedNFTs, setOwnedNFTs] = useState<OwnedNFT[]>([]);
  const [nftStakeStates, setNFTStakeStates] = useState<
    Record<string, NFTStakeState>
  >({});
  const [totalStakeAmount, setTotalStakeAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [processingStep, setProcessingStep] = useState<ProcessingStep>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [pendingTxHash, setPendingTxHash] = useState<Hash | undefined>();
  const [nftApprovalStatus, setNFTApprovalStatus] =
    useState<NFTApprovalStatus>(null);

  const { writeContractAsync } = useWriteContract();

  const verifyNFTOwnership = useCallback(
    async (nftId: string): Promise<boolean> => {
      if (!address) return false;

      try {
        const owner = await readContract(config, {
          address: addresses.NFT_ADDRESS,
          abi: nftABI,
          functionName: "ownerOf",
          args: [BigInt(nftId)],
        });

        return owner.toLowerCase() === address.toLowerCase();
      } catch (error) {
        console.error("Error verifying NFT ownership:", error);
        return false;
      }
    },
    [address, config, addresses.NFT_ADDRESS]
  );

  const fetchUserNFTs = useCallback(
    async (userAddress: string, retryCount = 0) => {
      try {
        setIsLoading(true);
        const query = `
          query GetUserNFTs($userAddress: String!) {
            tokenHolder(id: $userAddress) {
              tokenIds
            }
          }
        `;

        const response = await fetch(addresses.GRAPHQL_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query,
            variables: { userAddress: userAddress.toLowerCase() },
          }),
        });

        if (!response.ok) {
          if (response.status === 429 && retryCount < MAX_RETRIES) {
            const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
            await new Promise((resolve) => setTimeout(resolve, delay));
            return fetchUserNFTs(userAddress, retryCount + 1);
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = (await response.json()) as GraphQLResponse;
        if (!result.data?.tokenHolder) {
          setOwnedNFTs([]);
          setNFTStakeStates({});
          return;
        }

        const verifiedNFTs = await Promise.all(
          result.data.tokenHolder.tokenIds.map(async (tokenId: string) => {
            const isOwned = await verifyNFTOwnership(tokenId);
            if (!isOwned) return null;

            const tokenIdNumber = parseInt(tokenId);
            const metadata = NFTMetadata[tokenIdNumber - 1];
            if (!metadata) return null;

            return { ...metadata, tokenId } as OwnedNFT;
          })
        );

        const validNFTs = verifiedNFTs.filter(
          (nft: OwnedNFT | null): nft is OwnedNFT => nft !== null
        );

        setOwnedNFTs(validNFTs);
        initializeStakeStates(validNFTs);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
        setToastMessage(
          error instanceof Error ? error.message : "Failed to fetch NFTs"
        );
        setOwnedNFTs([]);
        setNFTStakeStates({});
      } finally {
        setIsLoading(false);
      }
    },
    [addresses.GRAPHQL_ENDPOINT, verifyNFTOwnership]
  );

  const initializeStakeStates = useCallback((nfts: OwnedNFT[]) => {
    const initialStates: Record<string, NFTStakeState> = {};
    nfts.forEach((nft) => {
      initialStates[nft.tokenId] = {
        amount: "",
        selected: false,
      };
    });
    setNFTStakeStates(initialStates);
  }, []);

  const handleNFTSelection = useCallback(
    (tokenId: string, checked: boolean) => {
      setNFTStakeStates((prev) => ({
        ...prev,
        [tokenId]: {
          ...prev[tokenId],
          selected: checked,
          amount: checked ? prev[tokenId]?.amount || "" : "",
        },
      }));
    },
    []
  );

  const validateStakeAmount = useCallback((id: string, value: string) => {
    try {
      if (value) {
        const amount = parseUnits(value, 9);
        if (amount > MAX_STAKE_PER_NFT) {
          setToastMessage(
            `Maximum stake per NFT is ${formatUnits(
              MAX_STAKE_PER_NFT,
              9
            )} BANANOSHIS`
          );
          return;
        }
      }

      setNFTStakeStates((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          amount: value,
        },
      }));
      setToastMessage(null);
    } catch (error) {
      console.error("Error validating amount:", error);
      setToastMessage("Invalid amount format");
    }
  }, []);

  const checkNFTApproval = useCallback(
    async (nftIds: string[]): Promise<boolean> => {
      if (!address) return false;

      try {
        console.log("Checking NFT approval for:", {
          nftIds,
          owner: address,
          stakingAddress: addresses.STAKING_ADDRESS,
        });

        // Check if approved for all
        const isApprovedForAll = await readContract(config, {
          address: addresses.NFT_ADDRESS,
          abi: nftABI,
          functionName: "isApprovedForAll",
          args: [address, addresses.STAKING_ADDRESS],
        });

        console.log("isApprovedForAll result:", isApprovedForAll);

        if (isApprovedForAll) {
          setNFTApprovalStatus("approved");
          return true;
        }

        // Individual NFT approval check
        for (const nftId of nftIds) {
          const approvedAddress = await readContract(config, {
            address: addresses.NFT_ADDRESS,
            abi: nftABI,
            functionName: "getApproved",
            args: [BigInt(nftId)],
          });

          console.log(`Approval status for NFT ${nftId}:`, {
            approvedAddress,
            expectedAddress: addresses.STAKING_ADDRESS,
          });

          if (
            approvedAddress.toLowerCase() !==
            addresses.STAKING_ADDRESS.toLowerCase()
          ) {
            setNFTApprovalStatus("needed");
            return false;
          }
        }

        setNFTApprovalStatus("approved");
        return true;
      } catch (error) {
        console.error("Error checking NFT approval:", error);
        setNFTApprovalStatus("needed");
        return false;
      }
    },
    [address, config, addresses]
  );

  const approveNFTs = async () => {
    if (!address) return;

    try {
      setNFTApprovalStatus("approving");
      setIsProcessing(true);

      console.log("Approving NFTs:", {
        NFT_ADDRESS: addresses.NFT_ADDRESS,
        STAKING_ADDRESS: addresses.STAKING_ADDRESS,
      });

      const hash = await writeContractAsync({
        address: addresses.NFT_ADDRESS,
        abi: nftABI,
        functionName: "setApprovalForAll",
        args: [addresses.STAKING_ADDRESS, true],
      });

      console.log("Approval transaction hash:", hash);
      setPendingTxHash(hash);
      setToastMessage("Approving NFTs...");
    } catch (error) {
      console.error("Error approving NFTs:", {
        error,
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      });
      setToastMessage("Failed to approve NFTs");
      setNFTApprovalStatus("needed");
      setIsProcessing(false);
    }
  };

  const processStaking = async () => {
    if (!address) {
      setToastMessage("Please connect your wallet");
      return;
    }

    try {
      console.log("Starting staking process", {
        address,
        nftApprovalStatus,
        stakingAddress: addresses.STAKING_ADDRESS,
        nftAddress: addresses.NFT_ADDRESS,
      });

      setIsProcessing(true);
      const selectedNFTs = Object.entries(nftStakeStates)
        .filter(([_, state]) => state.selected)
        .map(([tokenId]) => BigInt(tokenId));

      console.log("Selected NFTs for staking:", {
        selectedNFTs: selectedNFTs.map(String),
        stakeStates: nftStakeStates,
      });

      if (selectedNFTs.length === 0) {
        setToastMessage("Please select at least one NFT");
        setIsProcessing(false);
        return;
      }

      // Verify ownership of selected NFTs
      for (const nftId of selectedNFTs) {
        const isOwned = await verifyNFTOwnership(nftId.toString());
        if (!isOwned) {
          setToastMessage(`You don't own NFT #${nftId}`);
          setIsProcessing(false);
          return;
        }
      }

      // Calculate total amount to stake
      const totalAmount = Object.entries(nftStakeStates)
        .filter(([_, state]) => state.selected && state.amount)
        .reduce(
          (sum, [_, state]) => sum + parseUnits(state.amount || "0", 9),
          BigInt(0)
        );

      console.log("Total amount to stake:", formatUnits(totalAmount, 9));

      // Check NFT approval first
      const nftsApproved = await checkNFTApproval(selectedNFTs.map(String));
      console.log("NFT approval status:", {
        nftsApproved,
        nftApprovalStatus,
      });

      if (!nftsApproved) {
        setToastMessage("Please approve NFTs first");
        await approveNFTs();
        return;
      }

      // Check token approval if needed
      if (totalAmount > 0) {
        console.log("Checking token allowance...");
        const currentAllowance = await readContract(config, {
          abi: DNAbi,
          address: addresses.TOKEN_ADDRESS,
          functionName: "allowance",
          args: [address, addresses.STAKING_ADDRESS],
        });

        console.log("Current token allowance:", {
          allowance: formatUnits(currentAllowance, 9),
          required: formatUnits(totalAmount, 9),
        });

        if (!currentAllowance || currentAllowance < totalAmount) {
          setProcessingStep("approval");
          const approvalHash = await writeContractAsync({
            address: addresses.TOKEN_ADDRESS,
            abi: DNAbi,
            functionName: "approve",
            args: [addresses.STAKING_ADDRESS, totalAmount],
          });
          setPendingTxHash(approvalHash);
          setToastMessage("Approving tokens...");
          return;
        }
      }

      // Process stake transaction
      setProcessingStep("staking");
      console.log("Submitting stake transaction:", {
        nfts: selectedNFTs.map(String),
        amount: totalAmount.toString(),
        staking_address: addresses.STAKING_ADDRESS,
      });

      const hash = await writeContractAsync({
        address: addresses.STAKING_ADDRESS,
        abi: stakingABI,
        functionName: "stake",
        args: [selectedNFTs, totalAmount],
      });

      console.log("Stake transaction submitted:", hash);
      setPendingTxHash(hash);
      setToastMessage("Processing stake transaction...");
    } catch (error) {
      console.error("Error in processStaking:", {
        error,
        message: error instanceof Error ? error.message : "Unknown error",
      });
      setToastMessage(
        error instanceof Error ? error.message : "Staking failed"
      );
      setIsProcessing(false);
      setProcessingStep(null);
    }
  };

  const calculateTotalStakeAmount = useCallback(() => {
    const total = Object.entries(nftStakeStates)
      .filter(([_, state]) => state.selected && state.amount)
      .reduce((sum, [_, state]) => sum + Number(state.amount), 0);
    setTotalStakeAmount(total);
  }, [nftStakeStates]);

  const { isSuccess: isTxSuccess, isError: isTxError } =
    useWaitForTransactionReceipt({
      hash: pendingTxHash,
    });
  useEffect(() => {
    if (!pendingTxHash) return;

    if (isTxSuccess) {
      if (nftApprovalStatus === "approving") {
        setNFTApprovalStatus("approved");
        processStaking(); // Continue with staking after approval
      } else if (processingStep === "approval") {
        processStaking();
      } else if (processingStep === "staking") {
        setToastMessage("Staking successful! 🎉");
        setNFTStakeStates({});
        setTotalStakeAmount(0);
        setIsProcessing(false);
        setProcessingStep(null);
        if (address) {
          fetchUserNFTs(address);
        }
      }
    }

    if (isTxError) {
      setToastMessage("Transaction failed");
      setIsProcessing(false);
      setProcessingStep(null);
      if (nftApprovalStatus === "approving") {
        setNFTApprovalStatus("needed");
      }
    }
  }, [
    pendingTxHash,
    processingStep,
    isTxSuccess,
    isTxError,
    nftApprovalStatus,
    address,
    fetchUserNFTs,
  ]);

  // Fetch NFTs on address change
  useEffect(() => {
    if (address) {
      fetchUserNFTs(address);
    }
  }, [address, fetchUserNFTs]);

  // Update total stake amount when stake states change
  useEffect(() => {
    calculateTotalStakeAmount();
  }, [nftStakeStates, calculateTotalStakeAmount]);

  return {
    ownedNFTs,
    nftStakeStates,
    isProcessing,
    isLoading,
    processingStep,
    toastMessage,
    totalStakeAmount,
    nftApprovalStatus,
    handleNFTSelection,
    validateStakeAmount,
    processStaking,
    approveNFTs,
    setToastMessage,
  };
};

export type NFTStakingHook = ReturnType<typeof useNFTStaking>;
