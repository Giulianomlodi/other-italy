import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { formatUnits } from 'viem';
import { useNFTWithdrawal } from './useNFTWithdrawal';
import Toast from '@/components/layout/Toast';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

const NFTWithdrawal: React.FC = () => {
    const {
        isProcessing,
        processingStep,
        toastMessage,
        stakerInfo,
        pendingRewards,
        processClaimRewards,
        processWithdrawAll,
        setToastMessage,
        getTotalWithdrawable,
    } = useNFTWithdrawal();

    const getButtonText = (action: 'claim' | 'withdrawAll') => {
        if (!isProcessing) {
            return action === 'claim' ? 'Claim Rewards' : 'Withdraw All';
        }

        if (processingStep === 'claiming' && action === 'claim') {
            return (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Claiming Rewards...
                </>
            );
        }

        if (processingStep === 'withdrawing' && action === 'withdrawAll') {
            return (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Withdrawing All...
                </>
            );
        }

        return 'Please wait...';
    };

    const stakedAmount = stakerInfo?.bananoshisStaked ? formatUnits(stakerInfo.bananoshisStaked, 9) : '0';
    const pendingRewardsFormatted = pendingRewards ? formatUnits(pendingRewards, 9) : '0';
    const totalWithdrawable = formatUnits(getTotalWithdrawable(), 9);
    const stakedNFTIds = stakerInfo?.stakedNFTIds || [];

    // Compute states using proper boolean comparisons
    const hasRewardsToClaim = Boolean(pendingRewards && pendingRewards > BigInt(0));
    const hasStakedTokens = Boolean(stakerInfo?.bananoshisStaked && stakerInfo.bananoshisStaked > BigInt(0));
    const hasStakedNFTs = stakedNFTIds.length > 0;
    const hasAnythingToWithdraw = hasStakedTokens || hasStakedNFTs || hasRewardsToClaim;

    return (
        <Card className="bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30">
            <CardContent className="space-y-6 pt-6">
                {/* Stats Section */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h3 className="text-white font-medium">Your Staking Stats</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm text-white opacity-75">
                            <div>Staked: {Number(stakedAmount).toFixed(9)}</div>
                            <div>Rewards: {Number(pendingRewardsFormatted).toFixed(9)}</div>
                            <div className="col-span-2 border-t border-white border-opacity-20 pt-1">
                                Total Withdrawable: {Number(totalWithdrawable).toFixed(9)}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="flex-1">
                                        <Button
                                            onClick={processClaimRewards}
                                            disabled={isProcessing || !hasRewardsToClaim}
                                            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-500"
                                        >
                                            {getButtonText('claim')}
                                        </Button>
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {hasRewardsToClaim
                                        ? "Claim your pending rewards"
                                        : "No rewards available to claim"}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="flex-1">
                                        <Button
                                            onClick={processWithdrawAll}
                                            disabled={isProcessing || !hasAnythingToWithdraw}
                                            className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-500"
                                        >
                                            {getButtonText('withdrawAll')}
                                        </Button>
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {hasAnythingToWithdraw
                                        ? "Withdraw all staked assets and claim rewards in one transaction"
                                        : "Nothing to withdraw"}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>

                {/* Staked NFTs Display */}
                {stakedNFTIds.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-white font-medium">Currently Staked NFTs</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {stakedNFTIds.map((tokenId) => (
                                <div
                                    key={tokenId.toString()}
                                    className="bg-white bg-opacity-10 p-3 rounded-lg"
                                >
                                    <span className="text-sm text-white">
                                        Banana #{tokenId.toString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Toast Messages */}
                {toastMessage && (
                    <Toast onClose={() => setToastMessage(null)}>
                        {toastMessage}
                    </Toast>
                )}
            </CardContent>
        </Card>
    );
};

export default NFTWithdrawal;