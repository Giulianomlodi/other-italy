'use client';

import React, { useEffect, useState } from 'react';
import { useAccount, useConfig } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { NFTMetadata } from '@/NFTMetadata';
import { COLORS } from '@/lib/constants/colors';
import { cn } from '@/lib/utils';
import { useChainConfig } from '@/config/network';

// Types
type RarityTier = keyof typeof COLORS;

interface NFTAttribute {
    readonly trait_type: string;
    readonly value: string;
}

interface BaseNFTMetadata {
    readonly name: string;
    readonly description: string;
    readonly image: string;
    readonly edition: number;
    readonly date: number;
    readonly attributes: readonly NFTAttribute[];
    readonly compiler: string;
    readonly rarityTier: string;
}

interface TokenHolder {
    address: string;
    tokenIds: string[];
    balance: string;
    lastUpdated: string;
}

interface NFTQueryResponse {
    tokenHolder: TokenHolder;
}

interface OwnedNFT extends BaseNFTMetadata {
    readonly tokenId: string;
}

// RarityBadge component
const RarityBadge: React.FC<{ rarity: string }> = ({ rarity }) => {
    const style = {
        backgroundColor: COLORS[rarity as RarityTier] || '#808080',
    };

    const getDarkRarities = (rarity: string) => {
        return ['OG'].includes(rarity);
    };

    return (
        <Badge
            variant="outline"
            className={cn(
                'border-none font-medium',
                getDarkRarities(rarity) ? 'text-white' : 'text-black'
            )}
            style={style}
        >
            {rarity}
        </Badge>
    );
};

const NFTGallery: React.FC = () => {
    const config = useConfig();
    const { addresses, chainId } = useChainConfig();
    const { address, isConnected } = useAccount();
    const [ownedNFTs, setOwnedNFTs] = useState<readonly OwnedNFT[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUserNFTs = async (userAddress: string) => {
        try {
            setIsLoading(true);
            setError(null);

            console.log('Current Chain ID:', chainId);
            console.log('Using NFT Address:', addresses.NFT_ADDRESS);
            console.log('Using GraphQL Endpoint:', addresses.GRAPHQL_ENDPOINT);

            const query = `
                query GetUserNFTs($userAddress: String!) {
                    tokenHolder(id: $userAddress) {
                        address
                        tokenIds
                        balance
                        lastUpdated
                    }
                }
            `;

            const response = await fetch(addresses.GRAPHQL_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query,
                    variables: { userAddress: userAddress.toLowerCase() },
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('GraphQL Response:', data);

            if (data.errors) {
                throw new Error(data.errors[0].message);
            }

            const queryResult = data.data as NFTQueryResponse;

            if (!queryResult.tokenHolder) {
                console.log('No token holder data found');
                setOwnedNFTs([]);
                return;
            }

            console.log('Token IDs from query:', queryResult.tokenHolder.tokenIds);

            const nftsWithMetadata = queryResult.tokenHolder.tokenIds.map(tokenId => {
                const tokenIdNumber = parseInt(tokenId);
                console.log('Processing token ID:', tokenIdNumber);

                const metadata = NFTMetadata[tokenIdNumber - 1];

                if (!metadata) {
                    console.warn(`No metadata found for token ID ${tokenId}`);
                    throw new Error(`No metadata found for token ID ${tokenId}`);
                }

                return {
                    ...metadata,
                    tokenId,
                };
            });

            console.log('Processed NFTs:', nftsWithMetadata);
            setOwnedNFTs(nftsWithMetadata);
        } catch (err) {
            console.error('Error in fetchUserNFTs:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch NFTs');
            setOwnedNFTs([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isConnected && address) {
            fetchUserNFTs(address);
        } else {
            setOwnedNFTs([]);
        }
    }, [address, isConnected, chainId]);

    if (!isConnected) {
        return null;
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <Card className="bg-red-50 border-red-200">
                <CardContent className="p-4">
                    <p className="text-red-600">Error: {error}</p>
                </CardContent>
            </Card>
        );
    }

    if (ownedNFTs.length === 0) {
        return (
            <Card className="bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30">
                <CardContent className="p-6">
                    <p className="text-white text-center">No NFTs found for this wallet</p>
                    {process.env.NODE_ENV === 'development' && (
                        <div className="text-white text-center mt-2 opacity-50">
                            Chain ID: {chainId} | NFT Address: {addresses.NFT_ADDRESS}
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30">
            <CardHeader>
                <CardTitle className="text-white">
                    Your Banana NFTs ({ownedNFTs.length})
                    {process.env.NODE_ENV === 'development' && (
                        <div className="text-sm opacity-50">
                            {/* Chain ID: {chainId} | NFT Address: {addresses.NFT_ADDRESS} */}
                        </div>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {ownedNFTs.map((nft) => (
                        <Card key={nft.tokenId} className="bg-white bg-opacity-30 backdrop-blur-sm overflow-hidden">
                            <div className="relative aspect-square">
                                <Image
                                    src={nft.image}
                                    alt={nft.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <CardContent className="p-4">
                                <h3 className="text-white font-bold">{nft.name}</h3>
                                <div className="mt-2 space-y-2">
                                    <p className="text-sm text-white opacity-80">
                                        ID: #{nft.tokenId}
                                    </p>
                                    <RarityBadge rarity={nft.rarityTier} />
                                </div>
                                <div className="mt-3">
                                    <p className="text-xs text-white opacity-70">Attributes:</p>
                                    <div className="mt-1 flex flex-wrap gap-1">
                                        {nft.attributes.map((attr, index) => (
                                            <Badge
                                                key={index}
                                                variant="secondary"
                                                className="text-xs bg-white bg-opacity-20"
                                            >
                                                {attr.trait_type}: {attr.value}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default NFTGallery;