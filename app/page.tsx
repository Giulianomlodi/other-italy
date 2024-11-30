'use client'

import React, { useState, useEffect } from 'react';
import { Inter } from 'next/font/google';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAccount } from 'wagmi';
import { useChainConfig } from '@/config/network';
import NFTMintingInterface from '@/components/web3/boredComps/NFTMintingInterface';

// Move font initialization outside component
const deliusSwashCaps = Inter({
  weight: '400',
  subsets: ['latin'],
});

const Hero = () => {
  const { addresses } = useChainConfig();
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Render content based on connection state
  const renderContent = () => {
    if (!mounted) return null;

    if (!isConnected) {
      return (
        <div className="min-h-screen w-full max-w-4xl mx-auto px-4 py-20">
          <Alert className="bg-black/50 border border-yellow-500/50">
            <AlertDescription className={deliusSwashCaps.className}>
              Please connect your wallet to mint NFTs
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    if (!addresses.BORED_ITALY_ADDRESS) {
      return (
        <div className="min-h-screen w-full max-w-4xl mx-auto px-4">
          <Alert variant="destructive" className="bg-black/50 border border-red-500/50">
            <AlertDescription className={deliusSwashCaps.className}>
              Contract configuration not found for the current network.
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return (
      <NFTMintingInterface
        contractAddress={addresses.BORED_ITALY_ADDRESS}
      />
    );
  };

  return (
    <div className="min-h-screen w-full">
      <section className="w-full overflow-hidden flex flex-col items-center justify-start">
        {renderContent()}
      </section>
    </div>
  );
};

export default Hero;