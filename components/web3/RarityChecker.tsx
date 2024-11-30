import React, { useState } from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import rarityData from '@/app/api/snapshot/snapshots/1_rarity_analysis.json';
import tokenImageData from '@/TokenURI_IMGS.json';
import type { TierType } from '@/types/holder';

// Constants that match your existing styling
const COLORS: Record<TierType, string> = {
    OG: '#561643',
    Legendary: '#FFC800',
    Epic: '#E65F5C',
    Rare: '#00AFB5',
    Uncommon: '#004BE0'
};

const TIER_LABELS: Record<TierType, string> = {
    OG: 'OG',
    Legendary: 'Legendary',
    Epic: 'Epic',
    Rare: 'Rare',
    Uncommon: 'Uncommon'
};

interface NFTData {
    tokenId: number;
    rarityTier: TierType;
    imageUrl?: string;
}

const RarityChecker = () => {
    const [tokenId, setTokenId] = useState('');
    const [nftData, setNftData] = useState<NFTData | null>(null);
    const [error, setError] = useState<string | null>(null);

    const getImageUrl = (tokenId: number) => {
        const tokenData = tokenImageData.tokens.find(t => t.edition === Number(tokenId));
        return tokenData?.url;
    };

    const handleCheck = () => {
        setError(null);
        const id = parseInt(tokenId);

        if (isNaN(id)) {
            setError('Please enter a valid token ID');
            return;
        }

        const foundNft = (rarityData as any).nfts.find(
            (nft: { tokenId: number }) => nft.tokenId === id
        );

        if (foundNft) {
            setNftData({
                ...foundNft,
                imageUrl: getImageUrl(foundNft.tokenId)
            });
        } else {
            setError('Token ID not found');
            setNftData(null);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleCheck();
        }
    };

    return (
        <div className="max-w-2xl mx-auto w-full px-10">
            <Card className="bg-white bg-opacity-20 rounded-2xl shadow-lg backdrop-blur-sm border border-white border-opacity-30">
                <CardHeader>
                    <CardTitle className="text-white">NFT Rarity Checker</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div className="flex space-x-4">
                            <Input
                                type="number"
                                placeholder="Enter Token ID"
                                value={tokenId}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    if (value >= 0 || e.target.value === '') { // Allow empty input
                                        setTokenId(e.target.value);
                                    }
                                }}
                                onKeyPress={handleKeyPress}
                                className="bg-white bg-opacity-10 border-white border-opacity-20 text-white placeholder-white"
                            />
                            <Button
                                onClick={handleCheck}
                                className="bg-blue-500 hover:bg-blue-600 text-white"
                            >
                                <Search className="w-4 h-4 mr-2" />
                                Check
                            </Button>
                        </div>

                        {error && (
                            <Alert variant="destructive">
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {nftData && (
                            <Card
                                className="bg-black bg-opacity-20 border-none p-6"
                                style={{
                                    backgroundColor: `${COLORS[nftData.rarityTier]}20`,
                                    borderColor: `${COLORS[nftData.rarityTier]}40`
                                }}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-700 relative">
                                        {nftData.imageUrl ? (
                                            <Image
                                                src={nftData.imageUrl}
                                                alt={`NFT #${nftData.tokenId}`}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                                priority
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-white text-sm">No image</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4 flex flex-col justify-center">
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-white text-lg">Token ID</span>
                                                <span className="text-white font-bold text-xl">#{nftData.tokenId}</span>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <span className="text-white text-lg">Rarity Tier</span>
                                                <div
                                                    className="font-bold px-4 py-2 rounded-full flex items-center space-x-2"
                                                    style={{
                                                        backgroundColor: COLORS[nftData.rarityTier],
                                                        color: ['Legendary', 'OG'].includes(nftData.rarityTier) ? 'black' : 'white'
                                                    }}
                                                >
                                                    <span>{TIER_LABELS[nftData.rarityTier]}</span>
                                                    <div
                                                        className="w-3 h-3 rounded-full"
                                                        style={{
                                                            backgroundColor: ['Legendary', 'OG'].includes(nftData.rarityTier) ? 'black' : 'white',
                                                            opacity: 0.5
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default RarityChecker;