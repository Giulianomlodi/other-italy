'use client'

import React, { useState, useEffect, KeyboardEvent } from 'react';
import { useAccount, useWriteContract, useReadContract, useWatchContractEvent } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Toast from '../layout/Toast';
import { abi } from '@/contract-abi';
import { isAddress } from 'viem';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

const AdminMint = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [mintAmount, setMintAmount] = useState(1);
    const [toAddress, setToAddress] = useState('');
    const [isMinting, setIsMinting] = useState(false);
    const { address, isConnected } = useAccount();

    const { data: totalSupply, refetch: refetchSupply } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: 'getCurrentMinted',
    });

    // Watch for NFTMinted events
    useWatchContractEvent({
        address: CONTRACT_ADDRESS,
        abi,
        eventName: 'NFTMinted',
        onLogs(logs) {
            try {
                refetchSupply?.();
                const event = logs[0];
                if (event.args.to === toAddress) {
                    setToastMessage('Admin mint successful! 🎉');
                    setIsMinting(false);
                }
            } catch (error) {
                console.error('Error processing mint event:', error);
            }
        },
    });

    const { writeContract } = useWriteContract();

    const handleAmountChange = (value: string) => {
        // Remove any non-numeric characters
        const numericValue = value.replace(/[^0-9]/g, '');

        if (numericValue === '') {
            setMintAmount(0);
            return;
        }

        const newAmount = parseInt(numericValue);
        if (!isNaN(newAmount)) {
            setMintAmount(newAmount);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        // Handle arrow up/down keys
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            setMintAmount(prev => prev + 1);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setMintAmount(prev => Math.max(0, prev - 1));
        }
    };

    const mintTo = async () => {
        if (!address) {
            setToastMessage('Please connect your wallet.');
            return;
        }

        if (!isAddress(toAddress)) {
            setToastMessage('Please enter a valid Ethereum address.');
            return;
        }

        if (mintAmount <= 0) {
            setToastMessage('Please enter a valid amount.');
            return;
        }

        setIsMinting(true);

        try {
            await writeContract({
                address: CONTRACT_ADDRESS,
                abi,
                functionName: 'mintTo',
                args: [toAddress as `0x${string}`, BigInt(mintAmount)],
            });

            await refetchSupply?.();
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

    return (
        <div className="flex flex-col justify-center items-center bg-white bg-opacity-20 rounded-2xl shadow-lg backdrop-blur-sm border border-white border-opacity-30 p-8 w-full max-w-md z-20">
            <h2 className="text-2xl font-bold text-white mb-6">Admin Mint</h2>

            {isConnected ? (
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

                    <div className="w-full mb-4">
                        <input
                            type="text"
                            placeholder="Recipient Address (0x...)"
                            value={toAddress}
                            onChange={(e) => setToAddress(e.target.value)}
                            className="w-full px-4 py-2 rounded-md bg-white text-black"
                        />
                    </div>

                    <div className="flex items-center justify-center mb-4 bg-white rounded-md">
                        <button
                            onClick={() => setMintAmount(Math.max(0, mintAmount - 1))}
                            className="bg-[#0052fc] text-white px-4 py-2 text-lg rounded-l-md hover:opacity-70 transition-colors duration-300"
                            disabled={isMinting}
                        >
                            -
                        </button>
                        <input
                            type="text"
                            value={mintAmount}
                            onChange={(e) => handleAmountChange(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-16 mx-2 text-center text-lg text-black bg-transparent outline-none"
                            disabled={isMinting}
                        />
                        <button
                            onClick={() => setMintAmount(mintAmount + 1)}
                            className="bg-[#0052fc] text-white px-4 py-2 text-lg rounded-r-md hover:opacity-70 transition-colors duration-300"
                            disabled={isMinting}
                        >
                            +
                        </button>
                    </div>

                    <button
                        className={`bg-[#FBBF24] text-white px-6 py-2 rounded-[8px] hover:opacity-60 transition-opacity duration-500 text-center md:text-left mb-4 font-bold w-full
                            ${isMinting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={mintTo}
                        disabled={isMinting}
                    >
                        {isMinting ? 'Minting...' : `Mint ${mintAmount} NFT${mintAmount > 1 ? 's' : ''}`}
                    </button>

                    <p className="text-sm text-gray-300 mt-2">
                        This function is restricted to contract owner only.
                    </p>
                </>
            ) : (
                <ConnectButton />
            )}

            {toastMessage && <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast>}
        </div>
    );
};

export default AdminMint;