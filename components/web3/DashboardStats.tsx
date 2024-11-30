import React from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { stakingABI } from '@/staking-abi';
import { DNAbi } from '@/dn-abi';
import { formatUnits } from 'viem';
import { useChainConfig } from '@/config/network';
import type { StakerInfoTuple } from './NFTStaking/types';

const DashboardStats = () => {
    const { addresses } = useChainConfig();
    const { address, isConnected } = useAccount();

    const { data: isPaused } = useReadContract({
        address: addresses.STAKING_ADDRESS,
        abi: stakingABI,
        functionName: 'paused',
        query: {
            refetchInterval: 30000
        }
    });

    const { data: tokenBalance, isLoading: loadingBalance } = useReadContract({
        address: addresses.TOKEN_ADDRESS,
        abi: DNAbi,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        query: {
            enabled: Boolean(address),
            refetchInterval: 30000
        }
    });

    const { data: stakerInfoData, isLoading: loadingStakerInfo } = useReadContract({
        address: addresses.STAKING_ADDRESS,
        abi: stakingABI,
        functionName: 'getStakerInfo',
        args: address ? [address] : undefined,
        query: {
            enabled: Boolean(address),
            refetchInterval: 30000
        }
    });

    const { data: pendingRewards, isLoading: loadingRewards } = useReadContract({
        address: addresses.STAKING_ADDRESS,
        abi: stakingABI,
        functionName: 'calculatePendingRewards',
        args: address ? [address] : undefined,
        query: {
            enabled: Boolean(address),
            refetchInterval: 30000
        }
    });

    const stakerInfo = React.useMemo(() => {
        if (!stakerInfoData || !Array.isArray(stakerInfoData)) return null;

        const [
            stakedNFTIds,
            bananoshisStaked,
            lastUpdateTime,
            rewardDebt,
            pendingRewards,
            effectiveStake,
            lastStakeTime,
            lastWithdrawTime,
            accumulatedPrecision
        ] = stakerInfoData as StakerInfoTuple;

        return {
            stakedNFTIds,
            bananoshisStaked,
            lastUpdateTime,
            rewardDebt,
            pendingRewards,
            effectiveStake,
            lastStakeTime,
            lastWithdrawTime,
            accumulatedPrecision
        };
    }, [stakerInfoData]);

    if (!isConnected) return null;

    if (loadingBalance || loadingStakerInfo || loadingRewards) {
        return (
            <div className="flex justify-center items-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            </div>
        );
    }

    const totalBalance = tokenBalance ? Number(formatUnits(tokenBalance, 9)).toFixed(9) : '0.000000000';
    const totalStaked = stakerInfo?.bananoshisStaked
        ? Number(formatUnits(stakerInfo.bananoshisStaked, 9)).toFixed(9)
        : '0.000000000';
    const unclaimedRewards = pendingRewards
        ? Number(formatUnits(pendingRewards, 9)).toFixed(9)
        : '0.000000000';
    const stakedNFTsCount = stakerInfo?.stakedNFTIds?.length || 0;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Nanas Farm 🍌</h2>
                <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${!isPaused ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                    <Badge
                        variant={isPaused ? "destructive" : "secondary"}
                        className={`font-medium ${!isPaused ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : ''}`}
                    >
                        {!isPaused ? 'Live' : 'Not Live'}
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-sm font-medium text-white mb-1">Total BANANOSHIS</p>
                            <p className="text-2xl font-bold text-white">{totalBalance}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-sm font-medium text-white mb-1">Total Staked</p>
                            <p className="text-2xl font-bold text-white">{totalStaked}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-sm font-medium text-white mb-1">NFTs Staked</p>
                            <p className="text-2xl font-bold text-white">{stakedNFTsCount}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-sm font-medium text-white mb-1">Unclaimed Rewards</p>
                            <p className="text-2xl font-bold text-white">{unclaimedRewards}</p>
                        </div>
                    </CardContent>
                </Card>


            </div>
        </div>
    );
};

export default DashboardStats;