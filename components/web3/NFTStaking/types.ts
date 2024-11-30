// NFTStaking/types.ts

import { Hash } from "viem";
import { Dispatch, SetStateAction } from "react";
// Error and Transaction Interfaces
export interface TransactionError {
  message: string;
  code?: number;
  data?: unknown;
}

export interface AllowanceResult {
  allowance: bigint;
}

export interface TransactionResult {
  hash: Hash;
}

// NFT Metadata Interfaces
export interface NFTAttribute {
  readonly trait_type: string;
  readonly value: string;
}

export interface BaseNFTMetadata {
  readonly name: string;
  readonly description: string;
  readonly image: string;
  readonly edition: number;
  readonly date: number;
  readonly attributes: readonly NFTAttribute[];
  readonly compiler: string;
  readonly rarityTier: string;
}

export interface OwnedNFT extends BaseNFTMetadata {
  readonly tokenId: string;
}

// NFT Query Interfaces
export interface TokenHolder {
  address: string;
  tokenIds: string[];
  balance: string;
  lastUpdated: string;
}

export interface NFTQueryResponse {
  tokenHolder?: TokenHolder | null; // Changed this to match GraphQL response
}
// Staking Interfaces
export interface NFTStakeState {
  amount: string;
  selected: boolean;
}

export interface UserStakeInfo {
  stakedNFTs: readonly bigint[];
  bananoshisStaked: bigint;
  lastUpdateTime: bigint;
  rewardDebt: bigint;
  pendingRewards: bigint;
  effectiveStake: bigint;
  lastStakeTime: bigint;
  lastWithdrawTime: bigint;
  accumulatedPrecision: bigint;
}

export interface StakingStats {
  totalStakers: bigint;
  totalStakedAmount: bigint;
  totalEffectiveStakeAmount: bigint;
  currentRewardRate: bigint;
  remainingRewards: bigint;
  remainingTime: bigint;
}

export interface StakerInfo {
  bananoshisStaked: bigint;
  lastUpdateTime: bigint;
  rewardDebt: bigint;
  pendingRewards: bigint;
  effectiveStake: bigint;
  lastStakeTime: bigint;
  lastWithdrawTime: bigint;
  accumulatedPrecision: bigint;
  stakedNFTIds: readonly bigint[];
}

export type StakerInfoTuple = readonly [
  readonly bigint[], // stakedNFTIds
  bigint, // bananoshisStaked
  bigint, // lastUpdateTime
  bigint, // rewardDebt
  bigint, // pendingRewards
  bigint, // effectiveStake
  bigint, // lastStakeTime
  bigint, // lastWithdrawTime
  bigint // accumulatedPrecision
];

// Hook Return Types
export interface TokenOnlyStakingProps {
  tokenOnlyStakeAmount: string;
  onAmountChange: (amount: string) => void;
  onStake: () => Promise<void>;
  onMaxClick: () => void;
  isProcessing: boolean;
  tokenBalance?: bigint;
  processingStep?: "approval" | "staking" | null;
}

export interface TokenStakingHookReturn {
  tokenOnlyStakeAmount: string;
  isProcessing: boolean;
  processingStep: "approval" | "staking" | null;
  toastMessage: string | null;
  tokenBalance?: bigint;
  validateTokenOnlyAmount: (amount: string) => void;
  processTokenOnlyStaking: () => Promise<void>;
  setMaxAmount: () => void;
  setToastMessage: React.Dispatch<React.SetStateAction<string | null>>;
  stakingStats?: StakingStats;
}

// Additional Types
export type AddressType = `0x${string}`;
export type GetSkipNFTResult = AddressType | boolean | undefined;

// Props Interfaces
export interface StakingHeaderProps {
  totalStaked: string;
  stakingStats?: StakingStats;
}

export interface ContractError extends Error {
  data?: {
    message?: string;
    code?: string;
  };
}

export type StakingStatsResponse = [
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint
];

export interface NFTStakingListProps {
  ownedNFTs: OwnedNFT[];
  nftStakeStates: Record<string, NFTStakeState>;
  isProcessing: boolean;
  processingStep: "approval" | "staking" | null;
  totalStakeAmount: number;
  handleNFTSelection: (tokenId: string, checked: boolean) => void;
  validateStakeAmount: (id: string, value: string) => void;
  processStaking: () => Promise<void>;
  toastMessage: string | null;
  setToastMessage: React.Dispatch<React.SetStateAction<string | null>>;
}
export type ProcessingStep = "approval" | "staking" | null;
export type NFTApprovalStatus = "needed" | "approving" | "approved" | null;

// Hook Return Type
export interface NFTStakingHookReturn {
  ownedNFTs: OwnedNFT[];
  nftStakeStates: Record<string, NFTStakeState>;
  isProcessing: boolean;
  isLoading: boolean;
  processingStep: ProcessingStep;
  toastMessage: string | null;
  totalStakeAmount: number;
  nftApprovalStatus: NFTApprovalStatus;
  handleNFTSelection: (tokenId: string, checked: boolean) => void;
  validateStakeAmount: (id: string, value: string) => void;
  processStaking: () => Promise<void>;
  approveNFTs: () => Promise<void>;
  setToastMessage: Dispatch<SetStateAction<string | null>>;
}

export interface GraphQLResponse {
  data: {
    tokenHolder: TokenHolder | null;
  };
}
