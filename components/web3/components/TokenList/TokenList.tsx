import { FC } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { COLORS, TIER_ORDER, TIER_LABELS } from '../../constants';
import type { TokenListProps } from './types';
import tokenImageData from '@/TokenURI_IMGS.json';

export const TokenList: FC<TokenListProps> = ({ tokenIds, tokenTiers, colors }) => {
    // Sort tokens by tier importance
    const sortedTokens = [...tokenIds].sort((a, b) => {
        const tierA = tokenTiers.find(t => t.tokenId === a)?.tier || 'Uncommon';
        const tierB = tokenTiers.find(t => t.tokenId === b)?.tier || 'Uncommon';
        return TIER_ORDER.indexOf(tierA) - TIER_ORDER.indexOf(tierB);
    });

    const getImageUrl = (tokenId: number) => {
        const tokenData = tokenImageData.tokens.find(t => t.edition === Number(tokenId));
        return tokenData?.url;
    };

    return (
        <Card className="bg-white bg-opacity-20 rounded-2xl shadow-lg backdrop-blur-sm border border-white border-opacity-30">
            <CardHeader>
                <CardTitle className="text-white">Your NFTs ({sortedTokens.length})</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {sortedTokens.map((tokenId) => {
                        const tokenTier = tokenTiers.find(t => t.tokenId === tokenId);
                        const tier = tokenTier?.tier || 'Uncommon';
                        const color = colors[tier];
                        const label = TIER_LABELS[tier];
                        const imageUrl = getImageUrl(tokenId);

                        return (
                            <div
                                key={tokenId}
                                className="p-4 rounded-lg border border-white border-opacity-20 bg-white bg-opacity-20 backdrop-blur-sm shadow-lg transition-all duration-200 hover:scale-105"
                                style={{
                                    backgroundColor: `${color}20`,
                                    borderColor: `${color}40`
                                }}
                            >
                                <div className="aspect-square w-full mb-4 overflow-hidden rounded-lg bg-gray-700 relative">
                                    {imageUrl ? (
                                        <Image
                                            src={imageUrl}
                                            alt={`NFT #${tokenId}`}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                                            priority={false}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="text-white text-sm">No image</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-white font-medium">#{tokenId}</span>
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: color }}
                                    />
                                </div>
                                <div className="mt-2 text-sm text-white opacity-80">
                                    {label}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
};

export default TokenList;