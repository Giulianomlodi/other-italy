// src/components/web3/constants.ts
export const COLORS = {
    OG: '#561643',      // Gold
    Legendary: '#FFC800', // Yellow
    Epic: '#E65F5C',    // Red
    Rare: '#00AFB5',    // Cyan
    Uncommon: '#004BE0'  // Blue
} as const;

export const TIER_ORDER = ['OG', 'Legendary', 'Epic', 'Rare', 'Uncommon'] as const;

export const TIER_LABELS = {
    OG: 'OG',
    Legendary: 'Legendary',
    Epic: 'Epic',
    Rare: 'Rare',
    Uncommon: 'Uncommon'
} as const;