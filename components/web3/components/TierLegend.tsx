// src/components/web3/components/TierLegend.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { CampaignConfig } from '@/types/campaign';
import { COLORS } from '../constants';

interface TierLegendProps {
    config: CampaignConfig;
}

export const TierLegend: React.FC<TierLegendProps> = ({ config }) => (
    <Card className="bg-white bg-opacity-20 rounded-2xl shadow-lg backdrop-blur-sm border border-white border-opacity-30">
        <CardHeader>
            <CardTitle className="text-white">Tier System</CardTitle>
            <CardDescription className="text-white opacity-80">
                Understanding the multiplier system
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-3">
                {Object.entries(config.TIER_MULTIPLIERS).reverse().map(([tier, multiplier]) => (
                    <div
                        key={tier}
                        className="flex items-center justify-between p-3 rounded-lg bg-white bg-opacity-20 backdrop-blur-sm shadow-lg border border-white border-opacity-30"
                        style={{ backgroundColor: `${COLORS[tier as keyof typeof COLORS]}20` }}
                    >
                        <div className="flex items-center space-x-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: COLORS[tier as keyof typeof COLORS] }}
                            />
                            <span className="text-white font-medium">{tier}</span>
                        </div>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <div className="flex items-center space-x-1">
                                        <span className="text-white opacity-80">{multiplier}x</span>
                                        <Info className="h-4 w-4 text-white opacity-60" />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Multiplies your token weight by {multiplier}x</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
);

// src/components/web3/components/TokenList/types.ts
import type { TierType } from "@/types/holder";

export interface TokenTier {
    tokenId: number;
    tier: TierType;
}

export interface TokenListProps {
    tokenIds: number[];
    tokenTiers: TokenTier[];
    colors: {
        readonly OG: string;
        readonly Legendary: string;
        readonly Epic: string;
        readonly Rare: string;
        readonly Uncommon: string;
    };
}