'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { useAccount, useWriteContract, useReadContract, useWatchContractEvent } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWhitelistStatus } from './useWhitelistStatus';
import Toast from '../layout/Toast';
import { abi } from '@/contract-abi';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

const MintButton = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [mintAmount, setMintAmount] = useState(1);
    const [isMinting, setIsMinting] = useState(false);
    const { address, isConnected } = useAccount();
    const { isWhitelisted, merkleProof } = useWhitelistStatus(address);

    const { data: activeMint } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: 'activeMint',
    });

    const { data: mintPrice } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: 'mintPrice',
    });

    const { data: maxPerWallet } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: 'MAX_MINT_PER_WALLET',
    });

    const { data: totalSupply, refetch: refetchSupply } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: 'getCurrentMinted',
    });

    const { data: mintedPerWallet, refetch: refetchMintedPerWallet } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: 'mintedPerWallet',
        args: address ? [address] : undefined,
    });

    // Enhanced event watching
    useWatchContractEvent({
        address: CONTRACT_ADDRESS,
        abi,
        eventName: 'NFTMinted',
        onLogs(logs) {
            try {
                refetchSupply?.();
                refetchMintedPerWallet?.();

                // Check if the event was triggered by the current user
                const event = logs[0];
                if (event.args.to === address) {
                    setToastMessage('Mint successful! 🎉');
                    setIsMinting(false);
                }
            } catch (error) {
                console.error('Error processing mint event:', error);
            }
        },
    });

    const { writeContract } = useWriteContract();

    const getMaxMintAmount = useCallback(() => {
        if (!maxPerWallet) return 1;
        return Math.max(0, Number(maxPerWallet) - Number(mintedPerWallet || 0));
    }, [maxPerWallet, mintedPerWallet]);

    const calculateMintPrice = useCallback(() => {
        if (!mintPrice) return BigInt(0);
        return mintPrice as bigint * BigInt(mintAmount);
    }, [mintPrice, mintAmount]);

    const mint = async () => {
        if (!address) {
            setToastMessage('Please connect your wallet to mint.');
            return;
        }

        if (!activeMint) {
            setToastMessage('Minting is not live yet.');
            return;
        }

        const mintPrice = calculateMintPrice();
        setIsMinting(true);

        try {
            if (isWhitelisted) {
                await writeContract({
                    address: CONTRACT_ADDRESS,
                    abi,
                    functionName: 'whitelistMint',
                    args: [BigInt(mintAmount), merkleProof],
                    value: mintPrice,
                });
            } else {
                await writeContract({
                    address: CONTRACT_ADDRESS,
                    abi,
                    functionName: 'mint',
                    args: [BigInt(mintAmount)],
                    value: mintPrice,
                });
            }

            // Immediate refetch after transaction
            await Promise.all([
                refetchSupply?.(),
                refetchMintedPerWallet?.(),
            ]);

            setToastMessage('Minting transaction submitted! Please wait for confirmation.');
        } catch (err) {
            console.error('Error minting:', err);
            setToastMessage(err instanceof Error ? err.message : 'Error minting. Please try again.');
            setIsMinting(false);
        }
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    const maxMintAmount = getMaxMintAmount();
    const isButtonDisabled = !activeMint || isMinting;

    return (
        <div className="flex flex-col justify-center items-center bg-white bg-opacity-20 rounded-2xl shadow-lg backdrop-blur-sm border border-white border-opacity-30 p-8 w-full max-w-md z-20">
            {isConnected ? (
                <>
                    {maxMintAmount > 0 ? (
                        <>
                            <div className="text-center mb-4">
                                <span className="text-xl font-bold text-white">
                                    {Number(totalSupply || 0)}/3000
                                </span>
                                {isMinting && (
                                    <div className="mt-2 text-yellow-400">
                                        Transaction in progress...
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center justify-center mb-4 bg-white rounded-md">
                                <button
                                    onClick={() => setMintAmount(Math.max(1, mintAmount - 1))}
                                    className="bg-[#0052fc] text-white px-4 py-2 text-lg rounded-l-md  hover:opacity-70 transition-colors duration-300"
                                    disabled={isButtonDisabled}
                                >
                                    -
                                </button>
                                <span className="mx-4 text-lg text-black">{mintAmount}</span>
                                <button
                                    onClick={() => setMintAmount(Math.min(maxMintAmount, mintAmount + 1))}
                                    className="bg-[#0052fc] text-white px-4 py-2 text-lg rounded-r-md hover:opacity-70 transition-colors duration-300"
                                    disabled={isButtonDisabled}
                                >
                                    +
                                </button>
                            </div>
                            <button
                                className={`bg-[#FBBF24] text-[#fffff] px-6 py-2 rounded-[8px] hover:opacity-60 transition-opacity duration-500 text-center md:text-left mb-8 mt-4 font-bold 
                                    ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={mint}
                                disabled={isButtonDisabled}
                            >
                                {isMinting ? 'Minting...' :
                                    `${isWhitelisted ? 'Allowlist Mint' : 'Mint'} ${mintAmount} NFT${mintAmount > 1 ? 's' : ''}`}
                            </button>
                            {isWhitelisted && (
                                <p className="mt-4 text-[#B29B49] font-bold">
                                    You are whitelisted! Enjoy the special allowlist price.
                                </p>
                            )}
                            {!activeMint && (
                                <p className="mt-4 text-yellow-500 font-bold">
                                    Minting is not live yet. Please check back later.
                                </p>
                            )}
                        </>
                    ) : (
                        <p className="text-red-500 font-bold">
                            You have reached the maximum mint limit per wallet.
                        </p>
                    )}
                </>
            ) : (
                <ConnectButton />
            )}
            {toastMessage && <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast>}
        </div>
    );
};

export default MintButton;