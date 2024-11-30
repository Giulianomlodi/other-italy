// src/app/presale/page.tsx
'use client'

import AnimatedPatternBackground from '@/components/layout/AnimatedPatternBackground';
import PresaleDashboard from '@/components/web3/PresaleDashboard';

export default function PresalePage() {
    return (
        <section className="min-h-screen w-full overflow-hidden flex flex-col items-center justify-center py-[150px] px-4">
            <PresaleDashboard />
            <AnimatedPatternBackground />
        </section>
    );
}