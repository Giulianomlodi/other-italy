// NFTStaking/NFTStaking.tsx
import { Card, CardContent } from '@/components/ui/card';
import { useTokenStaking } from './useTokenStaking';
import { useNFTWithdrawal } from './useNFTWithdrawal';
import { TokenOnlyStaking } from './TokenOnlyStaking';
import { NFTStakingList } from './NFTStakingList';
import { StakingHeader } from './StakingHeader';
import Toast from '@/components/layout/Toast';
import { useAccount, useReadContract } from 'wagmi';
import NFTWithdrawal from './NFTWithdrawal';
import type { StakingStats } from './types';
import { formatUnits } from 'viem';
import { stakingABI } from '@/staking-abi';
import { useChainConfig } from '@/config/network';
import AdminDashboard from './AdminDashboard';

const MAX_STAKE_WITHOUT_NFT = BigInt(5e6); // 1 million bananoshis

const TokenStakingAndWithdrawal = () => {
    const { addresses } = useChainConfig();
    const { address, isConnected } = useAccount();

    const {
        tokenOnlyStakeAmount,
        isProcessing: isTokenStakingProcessing,
        toastMessage: tokenStakingToastMessage,
        tokenBalance,
        validateTokenOnlyAmount,
        processTokenOnlyStaking,
        setToastMessage: setTokenStakingToastMessage,
        setMaxAmount,
        processingStep: tokenProcessingStep,
    } = useTokenStaking();

    const { data: stakingStats } = useReadContract({
        address: addresses.STAKING_ADDRESS,
        abi: stakingABI,
        functionName: 'getStakingStats',
        query: {
            refetchInterval: 30000
        }
    });

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

    if (!isConnected) {
        return (
            <Card className="bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30">
                <CardContent className="pt-6">
                    <p className="text-white text-center">Please connect your wallet to use the staking feature</p>
                </CardContent>
            </Card>
        );
    }

    // Simplified stats conversion
    let formattedStats: StakingStats | undefined;
    if (Array.isArray(stakingStats)) {
        formattedStats = {
            totalStakers: stakingStats[0] as bigint,
            totalStakedAmount: stakingStats[1] as bigint,
            totalEffectiveStakeAmount: stakingStats[2] as bigint,
            currentRewardRate: stakingStats[3] as bigint,
            remainingRewards: stakingStats[4] as bigint,
            remainingTime: stakingStats[5] as bigint
        };
    }

    return (
        <div className="space-y-6">
            <Card className="bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30">
                <StakingHeader />
                <CardContent className="space-y-6">
                    <div className="text-sm text-white opacity-70 mb-2">
                        Maximum stake without NFTs: {formatUnits(MAX_STAKE_WITHOUT_NFT, 9)} BANANOSHIS
                    </div>
                    <TokenOnlyStaking
                        tokenOnlyStakeAmount={tokenOnlyStakeAmount}
                        onAmountChange={validateTokenOnlyAmount}
                        onStake={processTokenOnlyStaking}
                        onMaxClick={setMaxAmount}
                        isProcessing={isTokenStakingProcessing}
                        tokenBalance={tokenBalance}
                        processingStep={tokenProcessingStep}
                    />
                </CardContent>
                {tokenStakingToastMessage && (
                    <Toast onClose={() => setTokenStakingToastMessage(null)}>
                        {tokenStakingToastMessage}
                    </Toast>
                )}
            </Card>

            <NFTStakingList />

            <NFTWithdrawal />
            <AdminDashboard />
        </div>
    );
};

export default TokenStakingAndWithdrawal;