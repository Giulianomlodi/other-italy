import React from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { stakingABI } from '@/staking-abi';
import { formatUnits } from 'viem';
import { useChainConfig } from '@/config/network';

const AdminDashboard = () => {
    const { addresses } = useChainConfig();
    const { address } = useAccount();

    // Read owner status
    const { data: owner } = useReadContract({
        address: addresses.STAKING_ADDRESS,
        abi: stakingABI,
        functionName: 'owner',
        query: {
            refetchInterval: 30000
        }
    });

    // Read contract state
    const { data: isPaused } = useReadContract({
        address: addresses.STAKING_ADDRESS,
        abi: stakingABI,
        functionName: 'paused',
        query: {
            refetchInterval: 30000
        }
    });

    const { data: rewardPool } = useReadContract({
        address: addresses.STAKING_ADDRESS,
        abi: stakingABI,
        functionName: 'getRewardPool',
        query: {
            refetchInterval: 30000
        }
    });

    const { data: rewardsPerSecond } = useReadContract({
        address: addresses.STAKING_ADDRESS,
        abi: stakingABI,
        functionName: 'rewardsPerSecond',
        query: {
            refetchInterval: 30000
        }
    });

    // Write functions
    const { writeContract: writeStaking, isPending } = useWriteContract();

    // Handle admin actions
    const handlePause = async () => {
        try {
            await writeStaking({
                address: addresses.STAKING_ADDRESS,
                abi: stakingABI,
                functionName: 'pause'
            });
        } catch (error) {
            console.error('Error pausing contract:', error);
        }
    };

    const handleUnpause = async () => {
        try {
            await writeStaking({
                address: addresses.STAKING_ADDRESS,
                abi: stakingABI,
                functionName: 'unpause'
            });
        } catch (error) {
            console.error('Error unpausing contract:', error);
        }
    };

    const handleInitializeRewardPool = async () => {
        try {
            await writeStaking({
                address: addresses.STAKING_ADDRESS,
                abi: stakingABI,
                functionName: 'initializeRewardPool'
            });
        } catch (error) {
            console.error('Error initializing reward pool:', error);
        }
    };

    // Check if current user is owner
    const isOwner = address && owner && address.toLowerCase() === owner.toLowerCase();

    // Format values safely
    const formattedRewardPool = React.useMemo(() => {
        if (!rewardPool) return '0';
        try {
            const formatted = formatUnits(rewardPool, 9);
            return Number(formatted).toFixed(9);
        } catch {
            return '0';
        }
    }, [rewardPool]);

    const formattedRewardsPerSecond = React.useMemo(() => {
        if (!rewardsPerSecond) return '0';
        try {
            const formatted = formatUnits(rewardsPerSecond, 9);
            return Number(formatted).toFixed(9);
        } catch {
            return '0';
        }
    }, [rewardsPerSecond]);

    // Check if initialization is needed - using string comparison to avoid BigInt issues
    const needsInitialization = !rewardsPerSecond || rewardsPerSecond.toString() === '0';

    if (!isOwner) {
        return null;
    }

    return (
        <div className="space-y-6 mt-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Admin Dashboard 🔧</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Contract State Card */}
                <Card className="bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30">
                    <CardHeader>
                        <CardTitle className="text-white">Contract State</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-white mb-1">Reward Pool</p>
                            <p className="text-xl font-bold text-white">
                                {formattedRewardPool} BANANOSHIS
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white mb-1">Rewards Per Second</p>
                            <p className="text-xl font-bold text-white">
                                {formattedRewardsPerSecond} BANANOSHIS/s
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white mb-1">Contract Status</p>
                            <div className="flex items-center gap-2">
                                <div className={`h-2 w-2 rounded-full ${!isPaused ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                <p className="text-xl font-bold text-white">
                                    {isPaused ? 'Paused' : 'Active'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Admin Actions Card */}
                <Card className="bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30">
                    <CardHeader>
                        <CardTitle className="text-white">Admin Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-white mb-2">Contract Control</p>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={handlePause}
                                        disabled={isPaused || isPending}
                                        className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isPending ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                Processing...
                                            </>
                                        ) : (
                                            'Pause Contract'
                                        )}
                                    </Button>
                                    <Button
                                        onClick={handleUnpause}
                                        disabled={!isPaused || isPending}
                                        className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isPending ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                Processing...
                                            </>
                                        ) : (
                                            'Unpause Contract'
                                        )}
                                    </Button>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white mb-2">Reward Pool</p>
                                <Button
                                    onClick={handleInitializeRewardPool}
                                    disabled={isPending || !needsInitialization}
                                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            Processing...
                                        </>
                                    ) : (
                                        'Initialize Reward Pool'
                                    )}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;