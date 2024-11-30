// src/components/web3/components/TierBreakdown/types.ts
import type { HolderBreakdown } from "@/types/holder";

export interface TierBreakdownProps {
  breakdown: {
    [key: string]: HolderBreakdown;
  };
}

export interface TierItemProps {
  tier: string;
  data: HolderBreakdown;
  color: string;
}
