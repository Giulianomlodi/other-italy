'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Card, CardContent } from '@/components/ui/card';
import { Banana, Wallet, LucideIcon } from 'lucide-react';
import Image from 'next/image';
import NFTGallery from './NFTGallery';
import NFTStaking from './NFTStaking/NFTStaking';
import DashboardStats from './DashboardStats';
import { useChainConfig } from '@/config/network';
import NFTWithdrawal from './NFTStaking/NFTWithdrawal';

// Types
interface StatsCardProps {
    icon: LucideIcon;
    label: string;
    value: string | number;
    iconColor?: string;
}

// Contract ABI
const tokenABI = [
    {
        inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
] as const;

const REFRESH_INTERVAL = 30000; // 30 seconds

// Components
const StatsCard: React.FC<StatsCardProps> = ({
    icon: Icon,
    label,
    value,
    iconColor = 'text-blue-400',
}) => (
    <Card className="bg-white bg-opacity-20 rounded-2xl shadow-lg backdrop-blur-sm border border-white border-opacity-30">
        <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
                <Icon className={`h-8 w-8 ${iconColor}`} />
                <div>
                    <p className="text-sm font-medium text-white">{label}</p>
                    <p className="text-2xl font-bold text-white">
                        {typeof value === 'string' ? value : new Intl.NumberFormat().format(value)}
                    </p>
                </div>
            </div>
        </CardContent>
    </Card>
);

const StakingBanner: React.FC = () => (
    <Card className="bg-white bg-opacity-20 rounded-2xl shadow-lg backdrop-blur-sm border border-white border-opacity-30 overflow-hidden">
        <CardContent className="p-0 relative">
            <div className="relative h-[500px] w-full">
                <Image
                    src="/images/banners/BN404.jpg"
                    alt="Staking Banner"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    {/* <h1 className="text-4xl font-bold text-white tracking-wider">
                        Nanas Farm 🍌 Coming Soon
                    </h1> */}
                </div>
            </div>
        </CardContent>
    </Card>
);

const HolderDashboard: React.FC = () => {
    const { addresses } = useChainConfig();
    const { address, isConnected } = useAccount();
    const [isMounted, setIsMounted] = useState<boolean>(false);

    // Fetch token balance using wagmi
    const { data: tokenBalance, isLoading: tokenBalanceLoading } = useReadContract({
        abi: tokenABI,
        address: addresses.TOKEN_ADDRESS,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        query: {
            enabled: Boolean(address),
            refetchInterval: REFRESH_INTERVAL
        }
    });

    // Fetch NFT balance using wagmi
    const { data: nftBalance, isLoading: nftBalanceLoading } = useReadContract({
        abi: tokenABI, // Same ABI as it's also a balanceOf function
        address: addresses.NFT_ADDRESS,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        query: {
            enabled: Boolean(address),
            refetchInterval: REFRESH_INTERVAL
        }
    });

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    if (!isConnected) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <ConnectButton />
            </div>
        );
    }

    const formattedTokenBalance = tokenBalance ? Number(tokenBalance) / 1e9 : 0;
    const formattedNftBalance = nftBalance ? Number(nftBalance) : 0;

    return (
        <div className="w-full max-w-7xl mx-auto space-y-6 p-4">
            <StakingBanner />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatsCard
                    icon={Banana}
                    label="Banana NFTs"
                    value={nftBalanceLoading ? 'Loading...' : formattedNftBalance}
                    iconColor="text-yellow-400"
                />
                <StatsCard
                    icon={Wallet}
                    label="$🍌 Balance"
                    value={tokenBalanceLoading ? 'Loading...' : formattedTokenBalance.toFixed(9)}
                    iconColor="text-green-400"
                />
            </div>
            <NFTGallery />
            <DashboardStats />
            <NFTStaking />

        </div>
    );
};

export default HolderDashboard;