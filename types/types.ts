// types/types.ts
export interface ContributionInfo {
  totalAmount: bigint;
  lastTimestamp: number;
  hasParticipated: boolean;
  hasWithdrawn: boolean;
  contributionCount: number;
}
