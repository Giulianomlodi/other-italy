// src/types/campaign.ts
export interface CampaignConfig {
  TOTAL_TOKENS: number;
  CAMPAIGN_DAYS: number;
  TIER_MULTIPLIERS: {
    Uncommon: number;
    Rare: number;
    Epic: number;
    Legendary: number;
    OG: number;
  };
  START_DATE: string;
}
