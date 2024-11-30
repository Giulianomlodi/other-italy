'use client'

import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useBalance } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { isAddress } from 'viem';
import Toast from '../layout/Toast';
import { abi } from '@/contract-abi';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

const AdminWithdraw = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [toAddress, setToAddress] = useState('');
    const { address, isConnected } = useAccount();

    // Get contract balance
    const { data: contractBalance } = useBalance({
        address: CONTRACT_ADDRESS,
    });

    const { writeContract } = useWriteContract();

    const handleWithdraw = async () => {
        if (!address) {
            setToastMessage('Please connect your wallet.');
            return;
        }

        if (!isAddress(toAddress)) {
            setToastMessage('Please enter a valid recipient address.');
            return;
        }

        if (!withdrawAmount || isNaN(Number(withdrawAmount)) || Number(withdrawAmount) <= 0) {
            setToastMessage('Please enter a valid amount.');
            return;
        }

        const amountInWei = BigInt(Number(withdrawAmount) * 1e18); // Convert ETH to Wei

        if (contractBalance && amountInWei > contractBalance.value) {
            setToastMessage('Amount exceeds contract balance.');
            return;
        }

        setIsWithdrawing(true);

        try {
            await writeContract({
                address: CONTRACT_ADDRESS,
                abi,
                functionName: 'withdraw',
                args: [toAddress as `0x${string}`, amountInWei],
            });

            setToastMessage('Withdrawal successful! 🎉');
            setWithdrawAmount('');
            setToAddress('');
        } catch (err) {
            console.error('Error withdrawing:', err);
            setToastMessage(err instanceof Error ? err.message : 'Error withdrawing funds. Please try again.');
        } finally {
            setIsWithdrawing(false);
        }
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <div className="flex flex-col justify-center items-center bg-white bg-opacity-20 rounded-2xl shadow-lg backdrop-blur-sm border border-white border-opacity-30 p-8 w-full max-w-md z-20">
            <h2 className="text-2xl font-bold text-white mb-6">Withdraw Funds</h2>

            {isConnected ? (
                <>
                    <div className="w-full mb-6">
                        <div className="text-white mb-2 font-semibold">Contract Balance:</div>
                        <div className="bg-black bg-opacity-30 p-3 rounded-md text-gray-300">
                            {contractBalance ? `${Number(contractBalance.formatted).toFixed(4)} ${contractBalance.symbol}` : 'Loading...'}
                        </div>
                    </div>

                    <div className="w-full space-y-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Recipient Address (0x...)"
                                value={toAddress}
                                onChange={(e) => setToAddress(e.target.value)}
                                className="w-full px-4 py-2 rounded-md bg-white text-black mb-2"
                                disabled={isWithdrawing}
                            />
                            <div className="text-xs text-gray-300">
                                Enter the address that will receive the funds
                            </div>
                        </div>

                        <div>
                            <div className="relative">
                                <input
                                    type="number"
                                    placeholder="Amount to withdraw"
                                    value={withdrawAmount}
                                    onChange={(e) => setWithdrawAmount(e.target.value)}
                                    className="w-full px-4 py-2 rounded-md bg-white text-black pr-16"
                                    disabled={isWithdrawing}
                                    step="0.01"
                                    min="0"
                                />
                                <span className="absolute right-3 top-2 text-gray-500">ETH</span>
                            </div>
                            <div className="text-xs text-gray-300 mt-1">
                                Enter the amount in ETH
                            </div>
                        </div>

                        <button
                            onClick={handleWithdraw}
                            disabled={isWithdrawing}
                            className={`w-full px-6 py-3 rounded-[8px] font-bold
                                ${isWithdrawing
                                    ? 'bg-gray-500 cursor-not-allowed'
                                    : 'bg-[#FBBF24] hover:opacity-70'
                                } 
                                transition-opacity duration-500 text-white`}
                        >
                            {isWithdrawing ? 'Processing Withdrawal...' : 'Withdraw Funds'}
                        </button>
                    </div>

                    {isWithdrawing && (
                        <div className="mt-2 text-yellow-400">
                            Transaction in progress...
                        </div>
                    )}

                    <div className="text-sm text-gray-300 mt-4">
                        <p className="font-semibold mb-2">Important:</p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                            <li>Only the contract owner can withdraw funds</li>
                            <li>Double-check the recipient address</li>
                            <li>Ensure sufficient gas for the transaction</li>
                        </ul>
                    </div>
                </>
            ) : (
                <ConnectButton />
            )}

            {toastMessage && <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast>}
        </div>
    );
};

export default AdminWithdraw;