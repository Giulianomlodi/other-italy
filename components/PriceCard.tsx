// PriceCard.tsx
import React from 'react';
import { PhaseStatus } from './PhaseStatus';

interface PriceCardProps {
    isActive: boolean;
    phase: 'whitelist' | 'public';
    price: string;
    boost?: string;
}

export const PriceCard: React.FC<PriceCardProps> = ({
    isActive,
    phase,
    price,
    boost
}) => (
    <div className={`
        p-4 rounded-lg transition-all duration-300
        ${isActive
            ? 'bg-blue-500/20 border-2 border-blue-500'
            : 'bg-black/20 border-2 border-transparent'
        }
    `}>
        <div className="flex items-center justify-between mb-2">
            <h4 className="text-white font-semibold">
                {phase === 'whitelist' ? 'Whitelist Phase - Starts 11/15/2024 18:00 UTC' : 'Public Phase - Starts 11/17/2024 18:00 UTC'}
            </h4>
            {isActive && (
                <span className="px-2 py-1 text-xs bg-blue-500 text-white rounded-full">
                    Active
                </span>
            )}
        </div>
        <p className="text-white text-base font-bold">{price}</p>
        {boost && (
            <p className="text-green-400 text-sm mt-1">+ {boost}</p>
        )}
        <PhaseStatus isActive={isActive} phase={phase} />
    </div>
);