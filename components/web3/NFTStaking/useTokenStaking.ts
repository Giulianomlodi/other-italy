// NFTStaking/useTokenStaking.ts
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
import { useChainConfig } from "@/config/network";

const MAX_STAKE_WITHOUT_NFT = BigInt(5e6); // 1 million bananoshis

export const useTokenStaking = () => {
  const config = useConfig();
  const { addresses } = useChainConfig();
  const { address } = useAccount();

  const [tokenOnlyStakeAmount, setTokenOnlyStakeAmount] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<
    "approval" | "staking" | null
  >(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [pendingTxHash, setPendingTxHash] = useState<Hash | undefined>();
  const [pendingTransactions] = useState(new Set<Hash>());

  const { writeContractAsync } = useWriteContract();
  const { data: tokenBalance } = useReadContract({
    address: addresses.TOKEN_ADDRESS,
    abi: DNAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const checkAndApproveToken = async (amount: bigint): Promise<boolean> => {
    if (!address) return false;
    try {
      const currentAllowance = await readContract(config, {
        abi: DNAbi,
        address: addresses.TOKEN_ADDRESS,
        functionName: "allowance",
        args: [address, addresses.STAKING_ADDRESS],
      });

      if (!currentAllowance || currentAllowance < amount) {
        setProcessingStep("approval");
        const approvalHash = await writeContractAsync({
          address: addresses.TOKEN_ADDRESS,
          abi: DNAbi,
          functionName: "approve",
          args: [addresses.STAKING_ADDRESS, amount],
        });
        setPendingTxHash(approvalHash);
        pendingTransactions.add(approvalHash);
        setToastMessage("Approving tokens...");
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error checking allowance:", error);
      return false;
    }
  };

  const processTokenOnlyStaking = async () => {
    if (!address || !tokenOnlyStakeAmount) {
      setToastMessage("Please enter a valid amount");
      return;
    }

    try {
      setIsProcessing(true);

      // Convert the user input to actual bananoshis (smallest unit)
      const rawAmount = tokenOnlyStakeAmount.replace(/[^\d.]/g, "");
      const amount = parseUnits(rawAmount, 9);

      console.log("Staking amount:", {
        input: tokenOnlyStakeAmount,
        rawAmount,
        parsedAmount: amount.toString(),
      });

      // Basic validations first
      if (!tokenBalance) {
        throw new Error("Unable to fetch token balance");
      }

      if (amount > tokenBalance) {
        throw new Error("Amount exceeds your balance");
      }

      // Check against max stake without NFTs
      if (amount > MAX_STAKE_WITHOUT_NFT) {
        throw new Error(
          `Maximum stake without NFTs is ${formatUnits(
            MAX_STAKE_WITHOUT_NFT,
            9
          )} BANANOSHIS`
        );
      }

      const isApproved = await checkAndApproveToken(amount);
      if (!isApproved) return;

      setProcessingStep("staking");

      // Convert to bananoshis for contract call
      const stakingHash = await writeContractAsync({
        address: addresses.STAKING_ADDRESS,
        abi: stakingABI,
        functionName: "stake",
        args: [[], amount] as const,
      });

      setPendingTxHash(stakingHash);
      pendingTransactions.add(stakingHash);
      setToastMessage("Processing stake transaction...");
    } catch (error) {
      console.error("Error in staking transaction:", error);
      setToastMessage(
        error instanceof Error ? error.message : "Staking failed"
      );
      setIsProcessing(false);
      setProcessingStep(null);
    }
  };

  const validateTokenOnlyAmount = useCallback(
    (value: string) => {
      // Only allow numbers and a single decimal point
      if (!value || /^\d*\.?\d*$/.test(value)) {
        try {
          if (value) {
            // Convert to bananoshis for validation
            const amount = parseUnits(value, 9);
            console.log("Validating amount:", {
              input: value,
              bananoshis: amount.toString(),
            });

            // Check maximum stake
            if (amount > MAX_STAKE_WITHOUT_NFT) {
              setToastMessage(
                `Maximum stake without NFTs is ${formatUnits(
                  MAX_STAKE_WITHOUT_NFT,
                  9
                )} BANANOSHIS`
              );
              return;
            }

            // Check balance
            if (tokenBalance && amount > tokenBalance) {
              setToastMessage("Amount exceeds your balance");
              return;
            }
          }
          setTokenOnlyStakeAmount(value);
          setToastMessage(null);
        } catch (error) {
          console.error("Error validating amount:", error);
          setToastMessage("Invalid amount format");
        }
      }
    },
    [tokenBalance]
  );

  const setMaxAmount = useCallback(() => {
    if (!tokenBalance) return;

    const maxAmount =
      tokenBalance > MAX_STAKE_WITHOUT_NFT
        ? MAX_STAKE_WITHOUT_NFT
        : tokenBalance;
    // Format the amount back to display value
    const formattedAmount = formatUnits(maxAmount, 9);
    validateTokenOnlyAmount(formattedAmount);
  }, [tokenBalance, validateTokenOnlyAmount]);

  const { isSuccess: isTxSuccess, isError: isTxError } =
    useWaitForTransactionReceipt({
      hash: pendingTxHash,
    });

  useEffect(() => {
    if (!pendingTxHash) return;

    if (isTxSuccess) {
      pendingTransactions.delete(pendingTxHash);

      if (processingStep === "approval") {
        processTokenOnlyStaking();
      } else if (processingStep === "staking") {
        setToastMessage("Staking successful! 🎉");
        setTokenOnlyStakeAmount("");
        setIsProcessing(false);
        setProcessingStep(null);
      }
    }

    if (isTxError) {
      pendingTransactions.delete(pendingTxHash);
      setToastMessage("Transaction failed");
      setIsProcessing(false);
      setProcessingStep(null);
    }
  }, [pendingTxHash, processingStep, isTxSuccess, isTxError]);

  return {
    tokenOnlyStakeAmount,
    isProcessing,
    processingStep,
    toastMessage,
    tokenBalance,
    validateTokenOnlyAmount,
    processTokenOnlyStaking,
    setMaxAmount,
    setToastMessage,
  };
};
