// NFTStaking/StakingHeader.tsx
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { formatUnits } from 'viem';
import { useAccount, useReadContract } from 'wagmi';
import { stakingABI } from '@/staking-abi';
import { useChainConfig } from '@/config/network';
import type { StakerInfoTuple } from './types';

interface StakingHeaderProps {
    className?: string;
}

export const StakingHeader: React.FC<StakingHeaderProps> = ({ className }) => {
    const { addresses } = useChainConfig();
    const { address } = useAccount();

    const { data: stakerInfoData } = useReadContract({
        address: addresses.STAKING_ADDRESS,
        abi: stakingABI,
        functionName: 'getStakerInfo',
        args: address ? [address] : undefined,
        query: {
            enabled: Boolean(address),
            refetchInterval: 30000
        }
    });

    // Parse stakerInfo from tuple
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

    const formattedTotal = stakerInfo?.bananoshisStaked
        ? Number(formatUnits(stakerInfo.bananoshisStaked, 9)).toFixed(9)
        : '0';

    return (
        <CardHeader className={className}>
            <CardTitle className="text-white">
                <div className="flex justify-between items-center">
                    <span>Stake BANANOSHIS</span>
                    <span className="text-sm font-normal opacity-75">
                        Your Total Staked: {formattedTotal} BANANOSHIS
                    </span>
                </div>
            </CardTitle>
        </CardHeader>
    );
};