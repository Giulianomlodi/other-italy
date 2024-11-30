'use client'

import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Toast from '../layout/Toast';
import { abi } from '@/contract-abi';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

const AdminToggleMint = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const { address, isConnected } = useAccount();

    // Read current mint state
    const { data: activeMint, refetch: refetchMintState } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: 'activeMint',
    });

    const { writeContract } = useWriteContract();

    const toggleMintState = async () => {
        if (!address) {
            setToastMessage('Please connect your wallet.');
            return;
        }

        setIsUpdating(true);

        try {
            await writeContract({
                address: CONTRACT_ADDRESS,
                abi,
                functionName: 'setActiveMint',
                args: [!activeMint],
            });

            // Wait a moment before refetching to allow the transaction to be processed
            setTimeout(async () => {
                await refetchMintState();
                setToastMessage(`Minting has been ${!activeMint ? 'activated' : 'deactivated'} successfully! 🎉`);
                setIsUpdating(false);
            }, 2000);

        } catch (err) {
            console.error('Error toggling mint state:', err);
            setToastMessage(err instanceof Error ? err.message : 'Error updating mint state. Please try again.');
            setIsUpdating(false);
        }
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <div className="flex flex-col justify-center items-center bg-white bg-opacity-20 rounded-2xl shadow-lg backdrop-blur-sm border border-white border-opacity-30 p-8 w-full max-w-md z-20">
            <h2 className="text-2xl font-bold text-white mb-6">Toggle Mint Status</h2>

            {isConnected ? (
                <>
                    <div className="text-center mb-4">
                        <span className="text-xl font-bold text-white">
                            Current Status: {' '}
                            <span className={activeMint ? 'text-green-400' : 'text-red-400'}>
                                {activeMint ? 'Active' : 'Inactive'}
                            </span>
                        </span>
                    </div>

                    <div className="flex items-center justify-center w-full mb-4">
                        <button
                            onClick={toggleMintState}
                            disabled={isUpdating}
                            className={`
                                w-full px-6 py-3 rounded-[8px] font-bold
                                transition-all duration-300
                                ${isUpdating
                                    ? 'bg-gray-500 cursor-not-allowed'
                                    : activeMint
                                        ? 'bg-red-500 hover:bg-red-600'
                                        : 'bg-green-500 hover:bg-green-600'
                                }
                                text-white
                            `}
                        >
                            {isUpdating ? (
                                <span className="flex items-center justify-center">
                                    Updating...
                                </span>
                            ) : (
                                `${activeMint ? 'Deactivate' : 'Activate'} Minting`
                            )}
                        </button>
                    </div>

                    {isUpdating && (
                        <div className="mt-2 text-yellow-400">
                            Transaction in progress...
                        </div>
                    )}

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

export default AdminToggleMint;