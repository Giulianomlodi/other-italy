// src/app/dashboard/page.tsx
'use client'

import AnimatedPatternBackground from '@/components/layout/AnimatedPatternBackground';
// import HolderDashboard from '@/components/web3/HolderDashboard';
import HolderDashboard from '@/components/web3/HolderDashboardS';
import ReferralManager from '@/components/web3/ReferralManager';

export default function DashboardPage() {
    return (
        <section className="min-h-screen w-full overflow-hidden flex flex-col items-center justify-center py-[150px] px-4">


            <HolderDashboard />
            {/* <ReferralManager /> */}
            <AnimatedPatternBackground />

        </section>
    );
}