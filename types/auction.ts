// src/types/auction.ts
import { Document, Model } from "mongoose";

export interface AuctionData {
  startingValue: number;
  currentValue: number;
  targetValue: number;
  isLive: boolean;
  lastUpdated: Date;
}

export interface AuctionDocument extends Document {
  startingValue: number;
  currentValue: number;
  targetValue: number;
  isLive: boolean;
  lastUpdated: Date;
}

export interface AuctionModelInterface extends Model<AuctionDocument> {
  getCurrentAuction(): Promise<AuctionDocument | null>;
  findByIsLive(isLive: boolean): Promise<AuctionDocument | null>;
}

export type AuctionUpdate = Partial<{
  startingValue: number;
  currentValue: number;
  targetValue: number;
  isLive: boolean;
}>;
