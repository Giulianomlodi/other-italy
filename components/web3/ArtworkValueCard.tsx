import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Image from 'next/image';
import { CircleDollarSign, Info, Crown, Loader2 } from 'lucide-react';
import { abi } from '@/presale-abi';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_PRESALE_ADDRESS as `0x${string}`;
const STARTING_VALUE = 1500000; // Fixed starting value

interface AuctionData {
    currentValue: number;
    targetValue: number;
    isLive: boolean;
    lastUpdated: Date;
}

const ArtworkValueCard = () => {
    const [newCurrentValue, setNewCurrentValue] = useState('');
    const [newTargetValue, setNewTargetValue] = useState('');
    const [auctionData, setAuctionData] = useState<AuctionData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const { address } = useAccount();

    const { data: contractOwner } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: 'owner'
    });

    const isOwner = address && contractOwner && address.toLowerCase() === contractOwner.toLowerCase();

    const fetchAuctionData = async () => {
        try {
            const response = await fetch('/api/auction');
            if (!response.ok) {
                throw new Error('Failed to fetch auction data');
            }
            const { data } = await response.json();
            setAuctionData(data);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to fetch auction data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAuctionData();
        const interval = setInterval(fetchAuctionData, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleUpdateAuctionData = async (type: 'current' | 'target') => {
        const value = type === 'current' ? newCurrentValue : newTargetValue;

        if (!value) return;

        setIsUpdating(true);
        setError(null);
        setSuccess(null);

        try {
            const updateData: Partial<AuctionData> = {
                [type === 'current' ? 'currentValue' : 'targetValue']: parseFloat(value)
            };

            const response = await fetch('/api/auction', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to update ${type} value`);
            }

            const { data } = await response.json();
            setAuctionData(data);

            if (type === 'current') setNewCurrentValue('');
            else setNewTargetValue('');

            setSuccess(`${type.charAt(0).toUpperCase() + type.slice(1)} value updated successfully`);
            await fetchAuctionData();
        } catch (error) {
            setError(error instanceof Error ? error.message : `Failed to update ${type} value`);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleToggleAuction = async () => {
        setIsUpdating(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch('/api/auction', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    isLive: !auctionData?.isLive
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to toggle auction status');
            }

            const { data } = await response.json();
            setAuctionData(data);
            setSuccess(`Auction ${data.isLive ? 'started' : 'stopped'} successfully`);
            await fetchAuctionData();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to toggle auction status');
        } finally {
            setIsUpdating(false);
        }
    };

    const calculateProgress = (current: number, target: number): number => {
        if (current <= STARTING_VALUE) return 0;
        if (current >= target) return 100;
        return ((current - STARTING_VALUE) / (target - STARTING_VALUE)) * 100;
    };

    const auctionProgress = auctionData
        ? calculateProgress(auctionData.currentValue, auctionData.targetValue)
        : 0;

    const formatUSD = (value: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(value);
    };

    if (isLoading) {
        return (
            <Card className="bg-white bg-opacity-20 rounded-2xl shadow-lg backdrop-blur-sm border border-white border-opacity-30">
                <CardContent className="flex items-center justify-center h-[600px]">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-white bg-opacity-20 rounded-2xl shadow-lg backdrop-blur-sm border border-white border-opacity-30">
            <CardHeader>
                <CardTitle className="text-white">Cattelan's Banana Auction Value</CardTitle>
                {auctionData && (
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${auctionData.isLive ? 'bg-green-500' : 'bg-red-500'}`} />
                        <p className="text-sm text-white">
                            {auctionData.isLive ? 'Auction Live' : 'Auction Ended'}
                        </p>
                    </div>
                )}
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {success && (
                        <Alert>
                            <AlertDescription>{success}</AlertDescription>
                        </Alert>
                    )}

                    <div className="relative w-full aspect-square">
                        <Image
                            src="/images/Cattelan.png"
                            alt="Maurizio Cattelan Banana"
                            fill
                            className="object-cover rounded-lg"
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 bg-black/20 rounded-lg">
                            <h3 className="text-white font-bold flex items-center gap-2">
                                <Info className="w-4 h-4" />
                                Auction Details
                            </h3>
                            {auctionData && (
                                <div className="mt-3 space-y-2 text-white/80">
                                    <p className="text-sm">• Starting Value: 1.5 Million $</p>
                                    {/* <p className="text-sm">• Current Value: {formatUSD(auctionData.currentValue)}</p> */}
                                    {/* <p className="text-sm">• Target Value: {formatUSD(auctionData.targetValue)}</p> */}
                                    <p className="text-sm">• Auctioner: Sotheby's</p>
                                    <p className="text-sm">• Auction Value: 6.2 Million $</p>
                                    <p className="text-sm">• Auction Winner: Justin Sun</p>

                                </div>
                            )}
                        </div>

                        {/* <div className="p-4 bg-black/20 rounded-lg">
                            <h3 className="text-white font-bold flex items-center gap-2 mb-4">
                                <CircleDollarSign className="w-4 h-4" />
                                Auction Progress
                            </h3>
                            <Progress
                                value={auctionProgress}
                                className="h-2 bg-gray-700/50"
                            />
                            {auctionData && (
                                <div className="mt-2 flex justify-between text-sm text-white/70">
                                    <span>{formatUSD(STARTING_VALUE)}</span>
                                    <span>Current:{formatUSD(auctionData.currentValue)}</span>
                                    <span>{formatUSD(auctionData.targetValue)}</span>
                                </div>
                            )}
                        </div> */}

                        {isOwner && (
                            <div className="p-4 bg-black/20 rounded-lg">
                                <h3 className="text-white font-bold flex items-center gap-2">
                                    <Crown className="w-4 h-4" />
                                    Admin Controls
                                </h3>
                                <div className="mt-4 space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm text-white/70">Update Current Value (USD)</label>
                                        <div className="flex gap-2">
                                            <Input
                                                type="number"
                                                value={newCurrentValue}
                                                onChange={(e) => setNewCurrentValue(e.target.value)}
                                                placeholder="New current value"
                                                className="bg-white/10 text-white"
                                                disabled={isUpdating}
                                            />
                                            <Button
                                                onClick={() => handleUpdateAuctionData('current')}
                                                disabled={!newCurrentValue || isUpdating}
                                                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50"
                                            >
                                                {isUpdating ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    'Update'
                                                )}
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm text-white/70">Update Target Value (USD)</label>
                                        <div className="flex gap-2">
                                            <Input
                                                type="number"
                                                value={newTargetValue}
                                                onChange={(e) => setNewTargetValue(e.target.value)}
                                                placeholder="New target value"
                                                className="bg-white/10 text-white"
                                                disabled={isUpdating}
                                            />
                                            <Button
                                                onClick={() => handleUpdateAuctionData('target')}
                                                disabled={!newTargetValue || isUpdating}
                                                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50"
                                            >
                                                {isUpdating ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    'Update'
                                                )}
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm text-white/70">Auction Status</label>
                                        <Button
                                            onClick={handleToggleAuction}
                                            disabled={isUpdating}
                                            className={`w-full ${auctionData?.isLive
                                                ? 'bg-red-500 hover:bg-red-600'
                                                : 'bg-green-500 hover:bg-green-600'
                                                } disabled:opacity-50`}
                                        >
                                            {isUpdating ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                auctionData?.isLive ? 'Stop Auction' : 'Start Auction'
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ArtworkValueCard;