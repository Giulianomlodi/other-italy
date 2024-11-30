'use client'

import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Toast from '../layout/Toast';
import { abi } from '@/presale-abi';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_PRESALE_ADDRESS as `0x${string}`;

const AdminWhitelistSale = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [merkleRoot, setMerkleRoot] = useState('');
    const [newMerkleRoot, setNewMerkleRoot] = useState('');
    const { address, isConnected } = useAccount();

    // Read current whitelist sale status
    const { data: isWhitelistActive } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: 'isWhitelistSaleActive',
    });

    const { data: currentMerkleRoot } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: 'merkleRoot',
    });

    const { writeContract } = useWriteContract();

    const validateMerkleRoot = (root: string) => {
        const merkleRootRegex = /^0x[a-fA-F0-9]{64}$/;
        return merkleRootRegex.test(root);
    };

    const startWhitelistSale = async () => {
        if (!address) {
            setToastMessage('Please connect your wallet.');
            return;
        }

        if (!merkleRoot) {
            setToastMessage('Please enter a merkle root.');
            return;
        }

        if (!validateMerkleRoot(merkleRoot)) {
            setToastMessage('Invalid merkle root format. It should be a 32-byte hex string starting with 0x.');
            return;
        }

        setIsProcessing(true);

        try {
            await writeContract({
                address: CONTRACT_ADDRESS,
                abi,
                functionName: 'startWhitelistSale',
                args: [merkleRoot as `0x${string}`],
            });

            setToastMessage('Whitelist sale started successfully! 🎉');
            setMerkleRoot('');
        } catch (err) {
            console.error('Error starting whitelist sale:', err);
            setToastMessage(err instanceof Error ? err.message : 'Error starting whitelist sale. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const updateMerkleRoot = async () => {
        if (!address) {
            setToastMessage('Please connect your wallet.');
            return;
        }

        if (!newMerkleRoot) {
            setToastMessage('Please enter a new merkle root.');
            return;
        }

        if (!validateMerkleRoot(newMerkleRoot)) {
            setToastMessage('Invalid merkle root format. It should be a 32-byte hex string starting with 0x.');
            return;
        }

        setIsProcessing(true);

        try {
            await writeContract({
                address: CONTRACT_ADDRESS,
                abi,
                functionName: 'updateMerkleRoot',
                args: [newMerkleRoot as `0x${string}`],
            });

            setToastMessage('Merkle root updated successfully! 🎉');
            setNewMerkleRoot('');
        } catch (err) {
            console.error('Error updating merkle root:', err);
            setToastMessage(err instanceof Error ? err.message : 'Error updating merkle root. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const endWhitelistSale = async () => {
        if (!address) {
            setToastMessage('Please connect your wallet.');
            return;
        }

        setIsProcessing(true);

        try {
            await writeContract({
                address: CONTRACT_ADDRESS,
                abi,
                functionName: 'endWhitelistSale',
            });

            setToastMessage('Whitelist sale ended successfully! 🎉');
        } catch (err) {
            console.error('Error ending whitelist sale:', err);
            setToastMessage(err instanceof Error ? err.message : 'Error ending whitelist sale. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <div className="flex flex-col justify-center items-center bg-white bg-opacity-20 rounded-2xl shadow-lg backdrop-blur-sm border border-white border-opacity-30 p-8 w-full max-w-md z-20">
            <h2 className="text-2xl font-bold text-white mb-6">Manage Whitelist Sale</h2>

            {isConnected ? (
                <>
                    <div className="w-full mb-6">
                        <div className="text-white mb-2 font-semibold">Sale Status:</div>
                        <div className="bg-black bg-opacity-30 p-3 rounded-md text-gray-300">
                            {isWhitelistActive ? 'Active' : 'Inactive'}
                        </div>
                    </div>

                    <div className="w-full mb-6">
                        <div className="text-white mb-2 font-semibold">Current Merkle Root:</div>
                        <div className="bg-black bg-opacity-30 p-3 rounded-md text-gray-300 break-all">
                            {currentMerkleRoot || 'Not set'}
                        </div>
                    </div>

                    {!isWhitelistActive && (
                        <div className="w-full space-y-4 mb-4">
                            <div>
                                <label className="block text-white mb-2 font-semibold">Merkle Root:</label>
                                <input
                                    type="text"
                                    placeholder="Enter merkle root (32 bytes)"
                                    value={merkleRoot}
                                    onChange={(e) => setMerkleRoot(e.target.value)}
                                    className="w-full px-4 py-2 rounded-md bg-white text-black"
                                    disabled={isProcessing}
                                />
                                <p className="text-xs text-gray-300 mt-1">
                                    Example: 0x1234...abcd (32 bytes)
                                </p>
                            </div>

                            <button
                                onClick={startWhitelistSale}
                                disabled={isProcessing || !merkleRoot}
                                className={`w-full px-6 py-3 rounded-[8px] font-bold
                                    ${isProcessing || !merkleRoot
                                        ? 'bg-gray-500 cursor-not-allowed'
                                        : 'bg-[#FBBF24] hover:opacity-70'
                                    } 
                                    transition-opacity duration-500 text-white`}
                            >
                                {isProcessing ? 'Starting Sale...' : 'Start Whitelist Sale'}
                            </button>
                        </div>
                    )}

                    {isWhitelistActive && (
                        <>
                            <div className="w-full space-y-4 mb-4">
                                <div>
                                    <label className="block text-white mb-2 font-semibold">New Merkle Root:</label>
                                    <input
                                        type="text"
                                        placeholder="Enter new merkle root (32 bytes)"
                                        value={newMerkleRoot}
                                        onChange={(e) => setNewMerkleRoot(e.target.value)}
                                        className="w-full px-4 py-2 rounded-md bg-white text-black"
                                        disabled={isProcessing}
                                    />
                                    <p className="text-xs text-gray-300 mt-1">
                                        Example: 0x1234...abcd (32 bytes)
                                    </p>
                                </div>

                                <button
                                    onClick={updateMerkleRoot}
                                    disabled={isProcessing || !newMerkleRoot}
                                    className={`w-full px-6 py-3 rounded-[8px] font-bold
                                        ${isProcessing || !newMerkleRoot
                                            ? 'bg-gray-500 cursor-not-allowed'
                                            : 'bg-blue-500 hover:opacity-70'
                                        } 
                                        transition-opacity duration-500 text-white`}
                                >
                                    {isProcessing ? 'Updating Merkle Root...' : 'Update Merkle Root'}
                                </button>
                            </div>

                            <button
                                onClick={endWhitelistSale}
                                disabled={isProcessing}
                                className={`w-full px-6 py-3 rounded-[8px] font-bold
                                    ${isProcessing
                                        ? 'bg-gray-500 cursor-not-allowed'
                                        : 'bg-red-500 hover:opacity-70'
                                    } 
                                    transition-opacity duration-500 text-white`}
                            >
                                {isProcessing ? 'Ending Sale...' : 'End Whitelist Sale'}
                            </button>
                        </>
                    )}

                    {isProcessing && (
                        <div className="mt-2 text-yellow-400">
                            Transaction in progress...
                        </div>
                    )}

                    <div className="text-sm text-gray-300 mt-4">
                        <p className="font-semibold mb-2">Important Notes:</p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                            <li>Merkle root must be a valid 32-byte hex string</li>
                            <li>Starting the sale requires a valid merkle root</li>
                            <li>Merkle root can only be updated during active whitelist sale</li>
                            <li>Ending the sale cannot be undone</li>
                            <li>Only contract owner can manage the whitelist sale</li>
                            <li>Verify your merkle tree generation before starting</li>
                        </ul>
                    </div>

                    <p className="text-sm text-gray-300 mt-4">
                        These functions are restricted to contract owner only.
                    </p>
                </>
            ) : (
                <ConnectButton />
            )}

            {toastMessage && <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast>}
        </div>
    );
};

export default AdminWhitelistSale;