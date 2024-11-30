import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Toast from '@/components/layout/Toast';
import { useNFTStaking } from './useNFTStaking';
import { formatUnits, parseUnits } from 'viem';

const MAX_STAKE_PER_NFT = BigInt(1e6); // 1 million bananoshis

export const NFTStakingList: React.FC = () => {
    const {
        ownedNFTs,
        nftStakeStates,
        isProcessing,
        isLoading,
        processingStep,
        toastMessage,
        totalStakeAmount,
        nftApprovalStatus,
        handleNFTSelection,
        validateStakeAmount,
        processStaking,
        approveNFTs,
        setToastMessage,
    } = useNFTStaking();

    const handleAmountChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^\d.]/g, '');
        // Basic format validation
        if (!value || /^\d*\.?\d*$/.test(value)) {
            // Don't allow more than 9 decimal places
            const parts = value.split('.');
            if (parts.length > 1 && parts[1].length > 9) {
                return;
            }
            validateStakeAmount(id, value);
        }
    };

    const handleMaxClick = (id: string) => {
        const maxAmount = formatUnits(MAX_STAKE_PER_NFT, 9);
        validateStakeAmount(id, maxAmount);
    };

    const handleMainAction = () => {
        console.log("Main action clicked", {
            nftApprovalStatus,
            isProcessing,
            selectedNFTs: Object.entries(nftStakeStates)
                .filter(([_, state]) => state.selected)
                .map(([tokenId]) => tokenId)
        });

        if (nftApprovalStatus === "needed") {
            approveNFTs();
        } else {
            processStaking();
        }
    };

    const getButtonText = () => {
        if (isProcessing) {
            if (nftApprovalStatus === "approving") {
                return (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Approving NFTs...
                    </>
                );
            }
            if (processingStep === "approval") {
                return (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Approving Tokens...
                    </>
                );
            }
            if (processingStep === "staking") {
                return (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Staking...
                    </>
                );
            }
            return (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                </>
            );
        }

        if (nftApprovalStatus === "needed") {
            return "Approve NFTs";
        }

        const selectedCount = Object.values(nftStakeStates).filter(state => state.selected).length;
        return `Stake ${selectedCount} NFT${selectedCount !== 1 ? 's' : ''}`;
    };

    const canStake = () => {
        const selectedStates = Object.values(nftStakeStates).filter(state => state.selected);
        if (selectedStates.length === 0) return false;

        // When approving NFTs, we don't need to check amounts
        if (nftApprovalStatus === "needed") return true;

        // Check if all selected NFTs have valid amounts and don't exceed MAX_STAKE_PER_NFT
        return selectedStates.every(state => {
            if (!state.amount) return false;
            try {
                const amount = parseUnits(state.amount, 9);
                return amount > 0 && amount <= MAX_STAKE_PER_NFT;
            } catch {
                return false;
            }
        });
    };

    if (isLoading) {
        return (
            <Card className="bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30">
                <CardContent className="p-6 flex justify-center items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                </CardContent>
            </Card>
        );
    }

    if (!ownedNFTs.length) {
        return (
            <Card className="bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30">
                <CardContent className="p-6">
                    <p className="text-white text-center">No NFTs available for staking</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30">
            <CardHeader>
                <CardTitle className="text-white">Stake NFTs and BANANOSHIS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="text-sm text-white opacity-70 mb-2">
                    Maximum stake for each NFTs: {formatUnits(MAX_STAKE_PER_NFT, 9)} BANANOSHIS
                </div>
                {/* Stake Button - Only show when NFTs are selected */}

                {/* Da inserire in live */}
                {/* {Object.values(nftStakeStates).some(state => state.selected) && (
                    <Button
                        onClick={handleMainAction}
                        disabled={isProcessing || !canStake()}
                        className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-500"
                    >
                        {getButtonText()}
                    </Button>
                )} */}

                {/* NFT List */}
                <div className="space-y-3">
                    {ownedNFTs.map((nft) => (
                        <div
                            key={nft.tokenId}
                            className={cn(
                                "flex items-center space-x-4 p-4 rounded-lg",
                                "bg-white bg-opacity-10 hover:bg-opacity-20 transition-colors",
                                nftStakeStates[nft.tokenId]?.selected && "bg-opacity-30"
                            )}
                        >
                            <Checkbox
                                checked={nftStakeStates[nft.tokenId]?.selected}
                                onCheckedChange={(checked) =>
                                    handleNFTSelection(nft.tokenId, checked as boolean)
                                }
                                className="border-white"
                                disabled={isProcessing}
                            />

                            <div className="relative h-16 w-16 flex-shrink-0">
                                <Image
                                    src={nft.image}
                                    alt={nft.name}
                                    fill
                                    className="object-cover rounded-md"
                                    priority={true}
                                />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="text-white font-medium truncate">{nft.name}</h3>
                                <p className="text-sm text-white opacity-70">ID: #{nft.tokenId}</p>
                            </div>

                            <div className="w-48 flex-shrink-0 relative">
                                <Input
                                    type="text"
                                    inputMode="decimal"
                                    placeholder="BANANOSHIS amount"
                                    value={nftStakeStates[nft.tokenId]?.amount || ''}
                                    onChange={(e) => handleAmountChange(nft.tokenId, e)}
                                    className="bg-white bg-opacity-20 text-white placeholder:text-white placeholder:opacity-50 pr-16"
                                    disabled={!nftStakeStates[nft.tokenId]?.selected || isProcessing}
                                />
                                <Button
                                    type="button"
                                    onClick={() => handleMaxClick(nft.tokenId)}
                                    className="absolute right-1 top-1/2 -translate-y-1/2 px-2 py-0.5 h-7 text-xs bg-opacity-50 hover:bg-opacity-75"
                                    disabled={!nftStakeStates[nft.tokenId]?.selected || isProcessing}
                                >
                                    MAX
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary Section - Only show when NFTs are selected */}
                {Object.values(nftStakeStates).some(state => state.selected) && (
                    <div className="p-4 rounded-lg bg-white bg-opacity-10">
                        <div className="text-white space-y-2">
                            <p className="flex justify-between">
                                <span>Selected NFTs:</span>
                                <span>
                                    {Object.values(nftStakeStates).filter(state => state.selected).length}
                                </span>
                            </p>
                            <p className="flex justify-between font-medium">
                                <span>Total stake amount:</span>
                                <span>{totalStakeAmount.toFixed(9)} BANANOSHIS</span>
                            </p>
                            <p className="text-xs opacity-70 mt-2">
                                Maximum stake per NFT: {formatUnits(MAX_STAKE_PER_NFT, 9)} BANANOSHIS
                            </p>
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

export default NFTStakingList;