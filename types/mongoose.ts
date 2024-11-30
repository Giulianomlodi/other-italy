// src/types/mongoose.ts
import { Document, Model } from "mongoose";
import type {
  Holder,
  TokenTier,
  TierType,
  HolderBreakdown,
  Distribution,
  CampaignStats,
} from "./holder";

export interface HolderMethods {
  calculateTotalAccumulated(): number;
}

export interface HolderDocument extends Document, HolderMethods {
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

export type MongooseDocToJSON<T> = {
  _id: string;
  __v: number;
} & Omit<T, keyof Document>;

export type HolderModel = Model<HolderDocument, {}, HolderMethods> & {
  findByAddress(address: string): Promise<HolderDocument | null>;
};

function ensureDate(date: Date | string): Date {
  return date instanceof Date ? date : new Date(date);
}

function ensureBreakdown(breakdown: any): { [key: string]: HolderBreakdown } {
  const result: { [key: string]: HolderBreakdown } = {};
  Object.entries(breakdown || {}).forEach(([tier, data]: [string, any]) => {
    result[tier] = {
      count: Number(data.count) || 0,
      multiplier: Number(data.multiplier) || 1,
      subtotal: Number(data.subtotal) || 0,
    };
  });
  return result;
}

function ensureTokenTiers(tiers: any[]): TokenTier[] {
  return (tiers || []).map((tier) => ({
    tokenId: Number(tier.tokenId),
    tier: tier.tier as TierType,
  }));
}

function ensureDistributions(distributions: any[]): Distribution[] {
  return (distributions || []).map((dist) => ({
    date: ensureDate(dist.date),
    baseAllocation: Number(dist.baseAllocation) || 0,
    adjustedAllocation: Number(dist.adjustedAllocation) || 0,
    breakdown: ensureBreakdown(dist.breakdown),
  }));
}

function calculateTotalAccumulated(distributions: Distribution[]): number {
  return distributions.reduce((total, dist) => {
    return total + (Number(dist.adjustedAllocation) || 0);
  }, 0);
}

export function convertMongooseDocToHolder(doc: any): Holder {
  if (!doc) {
    throw new Error("Document is undefined");
  }

  try {
    const distributions = ensureDistributions(doc.distributions || []);
    const totalAccumulated = calculateTotalAccumulated(distributions);

    return {
      address: doc.address.toLowerCase(),
      tokenCount: Number(doc.tokenCount) || 0,
      tokenIds: (doc.tokenIds || []).map(Number),
      tokenTiers: ensureTokenTiers(doc.tokenTiers),
      weightedCount: Number(doc.weightedCount) || 0,
      breakdown: ensureBreakdown(doc.breakdown),
      distributions,
      campaignStats: {
        totalAccumulatedTokens: totalAccumulated,
        lastProcessedDay: distributions.length,
      },
      lastUpdated: ensureDate(doc.lastUpdated || new Date()),
    };
  } catch (error) {
    console.error("Error converting mongoose doc to holder:", error);
    throw new Error("Failed to convert document to holder");
  }
}
