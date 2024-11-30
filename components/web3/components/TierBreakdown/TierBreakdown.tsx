// src/components/web3/components/TierBreakdown/TierBreakdown.tsx
import { FC } from 'react';
import { COLORS } from '../../constants';
import { TierItem } from './TierItem';
import type { TierBreakdownProps } from './types';

export const TierBreakdown: FC<TierBreakdownProps> = ({ breakdown }) => {
    // Sort tiers by their multiplier value (highest to lowest)
    const sortedTiers = Object.entries(breakdown).sort((a, b) => b[1].multiplier - a[1].multiplier);

    return (
        <div className="space-y-3">
            {sortedTiers.map(([tier, data]) => (
                <TierItem
                    key={tier}
                    tier={tier}
                    data={data}
                    color={COLORS[tier as keyof typeof COLORS]}
                />
            ))}
        </div>
    );
};