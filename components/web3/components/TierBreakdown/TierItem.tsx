// src/components/web3/components/TierBreakdown/TierItem.tsx
import { FC } from 'react';
import { COLORS } from '../../constants';
import type { TierItemProps } from './types';

export const TierItem: FC<TierItemProps> = ({ tier, data, color }) => (
    <div
        className="p-3 rounded-lg transition-colors duration-200 hover:bg-opacity-30"
        style={{
            backgroundColor: `${color}20`
        }}
    >
        <div className="flex justify-between items-center mb-2">
            <div className="flex items-center space-x-2">
                <div
                    className="w-3 h-3 rounded-full"
                    style={{
                        backgroundColor: color
                    }}
                />
                <span className="font-medium text-white">
                    {tier} • {data.count} token{data.count !== 1 ? 's' : ''}
                </span>
            </div>
            <span className="text-sm text-white opacity-80">
                {/* {data.multiplier}x multiplier */}
            </span>
        </div>
        <div className="text-sm text-white opacity-80">
            {/* Weighted Value: {data.subtotal.toFixed(2)} */}
        </div>
    </div>
);