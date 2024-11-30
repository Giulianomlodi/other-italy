// src/app/rarity/page.tsx
'use client'

import RarityChecker from '@/components/web3/RarityChecker';
import AnimatedPatternBackground from '@/components/layout/AnimatedPatternBackground';

export default function RarityPage() {
    return (
        <section className="min-h-screen w-full overflow-hidden flex flex-col items-center justify-center py-[150px]">
            <RarityChecker />
            <AnimatedPatternBackground />
        </section>
    );
}