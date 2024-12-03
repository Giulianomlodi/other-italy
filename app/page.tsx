'use client'

import React, { useState, useEffect } from 'react';
import { Inter } from 'next/font/google';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAccount } from 'wagmi';
import { useChainConfig } from '@/config/network';
import NFTMintingInterface from '@/components/web3/boredComps/NFTMintingInterface';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import StakingBanner from '@/components/web3/StakingBanner';

// Move font initialization outside component
const deliusSwashCaps = Inter({
  weight: '400',
  subsets: ['latin'],
});

const Hero = () => {
  const { addresses } = useChainConfig();
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);


  return (
    <div className="min-h-screen w-full pt-4 px-10 md:px-20">

      <StakingBanner

        src="/images/banners/Other_Italy.jpg" // Image source
        alt="Staking Banner"               // Alt text for the image
        fill={true}                         // Fill the parent container
        className="object-cover"           // Additional class for styling
        priority={true}                  // Load the image with priority
      />
      <section className="w-full overflow-hidden flex flex-col items-center justify-start">

      </section>
    </div>
  );
};

export default Hero;