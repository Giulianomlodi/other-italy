import { useState, useCallback } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { Hash } from "viem";
import { stakingABI } from "@/staking-abi";
import { useChainConfig } from "@/config/network";

export const useNFTWithdrawal = () => {
  const { addresses } = useChainConfig();
  const { address } = useAccount();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<
    "claiming" | "withdrawing" | null
  >(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [pendingTxHash, setPendingTxHash] = useState<Hash | undefined>();

  const { writeContractAsync } = useWriteContract();

  const { data: stakerInfoResponse, refetch: refetchStakerInfo } =
    useReadContract({
      abi: stakingABI,
      address: addresses.STAKING_ADDRESS,
      functionName: "getStakerInfo",
      args: address ? [address] : undefined,
    });

  const stakerInfo = stakerInfoResponse
    ? {
        stakedNFTIds: stakerInfoResponse[0],
        bananoshisStaked: stakerInfoResponse[1],
        lastUpdateTime: stakerInfoResponse[2],
        rewardDebt: stakerInfoResponse[3],
        pendingRewards: stakerInfoResponse[4],
        effectiveStake: stakerInfoResponse[5],
        lastStakeTime: stakerInfoResponse[6],
        lastWithdrawTime: stakerInfoResponse[7],
        accumulatedPrecision: stakerInfoResponse[8],
      }
    : undefined;

  const { data: stakingStats } = useReadContract({
    abi: stakingABI,
    address: addresses.STAKING_ADDRESS,
    functionName: "getStakingStats",
    args: [],
  });

  const { data: pendingRewards, refetch: refetchPendingRewards } =
    useReadContract({
      abi: stakingABI,
      address: addresses.STAKING_ADDRESS,
      functionName: "calculatePendingRewards",
      args: address ? [address] : undefined,
    });

  const { isSuccess: isTxSuccess, isError: isTxError } =
    useWaitForTransactionReceipt({
      hash: pendingTxHash,
    });

  const getTotalWithdrawable = useCallback(() => {
    const stakedAmount = stakerInfo?.bananoshisStaked || BigInt(0);
    const rewards = pendingRewards || BigInt(0);
    return stakedAmount + rewards;
  }, [stakerInfo, pendingRewards]);

  const processClaimRewards = async () => {
    if (!address) {
      setToastMessage("Please connect your wallet");
      return;
    }

    if (!pendingRewards || pendingRewards === BigInt(0)) {
      setToastMessage("No rewards available to claim");
      return;
    }

    try {
      setIsProcessing(true);
      setProcessingStep("claiming");

      const hash = await writeContractAsync({
        address: addresses.STAKING_ADDRESS,
        abi: stakingABI,
        functionName: "claimRewards",
        args: [],
      });

      setPendingTxHash(hash);
      setToastMessage("Processing rewards claim...");
    } catch (error) {
      console.error("Rewards claim failed:", error);
      setToastMessage(
        error instanceof Error ? error.message : "Rewards claim failed"
      );
      setIsProcessing(false);
      setProcessingStep(null);
    }
  };

  const processWithdraw = async () => {
    if (!address) {
      setToastMessage("Please connect your wallet");
      return;
    }

    if (!stakerInfo) {
      setToastMessage("No staking information available");
      return;
    }

    try {
      // Check if there are pending rewards
      if (pendingRewards && pendingRewards > BigInt(0)) {
        setToastMessage("Please claim your rewards first before withdrawing");
        return;
      }

      setIsProcessing(true);
      setProcessingStep("withdrawing");

      const stakedNFTIds = stakerInfo.stakedNFTIds;
      const stakedAmount = stakerInfo.bananoshisStaked;

      console.log("Starting withdrawal:", {
        stakedNFTIds: stakedNFTIds.map(String),
        stakedAmount: stakedAmount.toString(),
      });

      // Safety check
      if (stakedAmount === BigInt(0) && stakedNFTIds.length === 0) {
        setToastMessage("Nothing to withdraw");
        setIsProcessing(false);
        setProcessingStep(null);
        return;
      }

      const hash = await writeContractAsync({
        address: addresses.STAKING_ADDRESS,
        abi: stakingABI,
        functionName: "withdraw",
        args: [stakedNFTIds, stakedAmount] as const,
      });

      setPendingTxHash(hash);
      setToastMessage("Processing withdrawal...");
    } catch (error) {
      console.error("Withdrawal failed:", error);
      setToastMessage("Withdrawal failed. Please try again.");
      setIsProcessing(false);
      setProcessingStep(null);
    }
  };

  const processWithdrawAll = async () => {
    if (!address) {
      setToastMessage("Please connect your wallet");
      return;
    }

    if (!stakerInfo) {
      setToastMessage("No staking information available");
      return;
    }

    try {
      setIsProcessing(true);
      setProcessingStep("withdrawing");

      const hash = await writeContractAsync({
        address: addresses.STAKING_ADDRESS,
        abi: stakingABI,
        functionName: "withdrawAll",
        args: [],
      });

      setPendingTxHash(hash);
      setToastMessage("Processing complete withdrawal...");
    } catch (error) {
      console.error("Complete withdrawal failed:", error);
      setToastMessage("Complete withdrawal failed. Please try again.");
      setIsProcessing(false);
      setProcessingStep(null);
    }
  };

  // Handle transaction results
  if (pendingTxHash) {
    if (isTxSuccess) {
      setToastMessage(
        processingStep === "claiming"
          ? "Rewards claimed successfully! 🎉"
          : "Withdrawal successful! 🎉"
      );
      setIsProcessing(false);
      setProcessingStep(null);
      setPendingTxHash(undefined);
      // Refresh data after successful transaction
      refetchStakerInfo();
      refetchPendingRewards();
    }

    if (isTxError) {
      setToastMessage(
        processingStep === "claiming"
          ? "Rewards claim failed"
          : "Withdrawal failed"
      );
      setIsProcessing(false);
      setProcessingStep(null);
      setPendingTxHash(undefined);
    }
  }

  return {
    isProcessing,
    processingStep,
    toastMessage,
    stakerInfo,
    stakingStats,
    pendingRewards,
    processClaimRewards,
    processWithdraw,
    processWithdrawAll,
    setToastMessage,
    getTotalWithdrawable,
  };
};
