import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, Droplet, BarChart2, Clock } from 'lucide-react';
import Image from 'next/image';
import ArtworkValueCard from './ArtworkValueCard';

interface DexData {
    priceUsd: string;
    priceToken: string;
    liquidity: string;
    marketCap: string;
    fdv: string;
    priceChange: {
        h6: number;
        h24: number;
        d7: number;
    };
    lastUpdated: string;
}

const MarketDashboard = () => {
    const [dexData, setDexData] = useState<DexData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchDexData = async () => {
        try {
            const response = await fetch('https://api.dexscreener.com/latest/dex/pairs/apechain/0x735de94d0b805a41e81a58092852516559ac9069');
            const data = await response.json();
            const pair = data.pairs[0];

            setDexData({
                priceUsd: pair.priceUsd,
                priceToken: pair.priceNative,
                liquidity: pair.liquidity.usd,
                marketCap: pair.fdv,
                fdv: pair.fdv,
                priceChange: {
                    h6: pair.priceChange.h6,
                    h24: pair.priceChange.h24,
                    d7: pair.priceChange.d7 || 0,
                },
                lastUpdated: new Date(pair.pairCreatedAt).toLocaleString(),
            });
        } catch (error) {
            console.error('Error fetching DEX data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDexData();
        const interval = setInterval(fetchDexData, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full max-w-7xl mx-auto space-y-6 p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white bg-opacity-20 rounded-2xl shadow-lg backdrop-blur-sm border border-white border-opacity-30">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-white">🍌 Market Data</CardTitle>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-sm text-white opacity-70">Live</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="relative w-full aspect-square">
                                <Image
                                    src="/images/Banana21.png"
                                    alt="Banana21"
                                    fill
                                    className="object-cover rounded-lg"
                                />
                            </div>

                            {loading ? (
                                <div className="animate-pulse space-y-4">
                                    <div className="h-12 bg-white/10 rounded" />
                                    <div className="h-12 bg-white/10 rounded" />
                                    <div className="h-12 bg-white/10 rounded" />
                                </div>
                            ) : dexData && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <div className="p-4 bg-black/20 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="w-5 h-5 text-blue-400" />
                                                    <span className="text-white text-sm">Price USD</span>
                                                </div>
                                                <span className="text-2xl font-bold text-white">${parseFloat(dexData.priceUsd).toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-white opacity-70">Price WAPE</span>
                                                <span className="text-sm text-white">{parseFloat(dexData.priceToken).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-black/20 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Droplet className="w-5 h-5 text-blue-400" />
                                            <span className="text-white text-sm">Liquidity</span>
                                        </div>
                                        <span className="text-xl font-bold text-white">${dexData.liquidity}</span>
                                    </div>

                                    <div className="p-4 bg-black/20 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <BarChart2 className="w-5 h-5 text-blue-400" />
                                            <span className="text-white text-sm">Market Cap</span>
                                        </div>
                                        <span className="text-xl font-bold text-white">${dexData.marketCap}</span>
                                    </div>

                                    <div className="col-span-2">
                                        <div className="p-4 bg-black/20 rounded-lg space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <TrendingUp className="w-5 h-5 text-blue-400" />
                                                    <span className="text-white text-sm">Price Change</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div>
                                                    <span className="text-sm text-white opacity-70">6H</span>
                                                    <p className={`font-bold ${dexData.priceChange.h6 >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                        {dexData.priceChange.h6.toFixed(2)}%
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-sm text-white opacity-70">24H</span>
                                                    <p className={`font-bold ${dexData.priceChange.h24 >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                        {dexData.priceChange.h24.toFixed(2)}%
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-sm text-white opacity-70">7D</span>
                                                    <p className={`font-bold ${dexData.priceChange.d7 >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                        {dexData.priceChange.d7.toFixed(2)}%
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* <div className="col-span-2">
                                        <div className="p-4 bg-black/20 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Clock className="w-5 h-5 text-blue-400" />
                                                <span className="text-white text-sm">Last Updated</span>
                                            </div>
                                            <span className="text-sm text-white opacity-70">{dexData.lastUpdated}</span>
                                        </div>
                                    </div> */}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
                <ArtworkValueCard />
            </div>
        </div>
    );
};

export default MarketDashboard;