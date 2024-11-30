// src/components/web3/components/TokenList/types.ts
import type { TierType, TokenTier } from "@/types/holder";

export interface TokenListProps {
  tokenIds: number[];
  tokenTiers: TokenTier[];
  colors: Record<TierType, string>;
}
