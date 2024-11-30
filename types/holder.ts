// src/types/holder.ts
export type TierType = "Uncommon" | "Rare" | "Epic" | "Legendary" | "OG";

export interface TokenTier {
  tokenId: number;
  tier: TierType;
}

export interface HolderBreakdown {
  count: number;
  multiplier: number;
  subtotal: number;
}

export interface Distribution {
  date: Date;
  baseAllocation: number;
  adjustedAllocation: number;
  breakdown: {
    [key: string]: HolderBreakdown;
  };
}

export interface CampaignStats {
  totalAccumulatedTokens: number;
  lastProcessedDay: number;
}

export interface Holder {
  address: string;
  tokenCount: number;
  tokenIds: number[];
  tokenTiers: TokenTier[];
  weightedCount: number;
  breakdown: {
    [key: string]: HolderBreakdown;
  };
  distributions: Distribution[];
  campaignStats: CampaignStats;
  lastUpdated: Date;
}
