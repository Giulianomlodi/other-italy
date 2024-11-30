import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Toast from '../layout/Toast';
import { abi } from '@/presale-abi';
import { Address, isAddress } from 'viem';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_PRESALE_ADDRESS as Address;

interface ParticipantData {
    address: Address;
    contribution: {
        totalAmount: string;
        lastTimestamp: number;
        hasParticipated: boolean;
        hasWithdrawn: boolean;
        contributionCount: number;
    };
    phases: {
        isWhitelist: boolean;
        isPublic: boolean;
    };
}

interface PresaleExportData {
    totalParticipants: number;
    whitelistParticipants: number;
    publicParticipants: number;
    totalContributions: string;
    participants: ParticipantData[];
    exportTimestamp: string;
}

const DownloadPresaleData = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const { isConnected } = useAccount();

    const getParticipantData = async (
        contract: ethers.Contract,
        participantAddress: Address
    ) => {
        const [contributionData, phasesData] = await Promise.all([
            contract.getContribution(participantAddress),
            contract.getParticipantPhases(participantAddress),
        ]);

        return {
            address: participantAddress,
            contribution: {
                totalAmount: contributionData[0].toString(),
                lastTimestamp: Number(contributionData[1]),
                hasParticipated: contributionData[2],
                hasWithdrawn: contributionData[3],
                contributionCount: Number(contributionData[4]),
            },
            phases: {
                isWhitelist: phasesData[0],
                isPublic: phasesData[1],
            },
        };
    };

    const generatePresaleData = async () => {
        if (!isConnected) {
            setToastMessage('Please connect your wallet.');
            return;
        }

        try {
            setIsLoading(true);
            setToastMessage('Processing participants data...');

            const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
            if (!rpcUrl) {
                throw new Error('RPC URL not configured');
            }

            const provider = new ethers.JsonRpcProvider(rpcUrl);
            const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

            // Get participants lists
            const [whitelistParticipants, publicParticipants] = await Promise.all([
                contract.getAllParticipants(true),
                contract.getAllParticipants(false),
            ]);

            console.log('Whitelist participants:', whitelistParticipants);
            console.log('Public participants:', publicParticipants);

            // Combine and filter unique addresses
            const rawAddresses = [
                ...whitelistParticipants,
                ...publicParticipants,
            ];

            const uniqueAddresses = Array.from(
                new Set(rawAddresses.filter((addr): addr is Address => isAddress(addr)))
            );

            console.log('Unique addresses:', uniqueAddresses);

            const participantData: ParticipantData[] = [];

            // Process each address
            for (const address of uniqueAddresses) {
                try {
                    const data = await getParticipantData(contract, address);
                    participantData.push(data);
                } catch (error) {
                    console.error(`Error processing address ${address}:`, error);
                }
            }

            console.log('Processed participant data:', participantData);

            const presaleData: PresaleExportData = {
                totalParticipants: participantData.length,
                whitelistParticipants: participantData.filter(
                    (p) => p.phases.isWhitelist
                ).length,
                publicParticipants: participantData.filter(
                    (p) => p.phases.isPublic
                ).length,
                totalContributions: participantData
                    .reduce(
                        (sum, p) => sum + BigInt(p.contribution.totalAmount),
                        BigInt(0)
                    )
                    .toString(),
                participants: participantData,
                exportTimestamp: new Date().toISOString(),
            };

            // Create and trigger download
            const blob = new Blob([JSON.stringify(presaleData, null, 2)], {
                type: 'application/json',
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `presale-data-${new Date().toISOString()}.json`;
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(url);
            document.body.removeChild(a);

            setToastMessage('Download complete! 🎉');
        } catch (err) {
            console.error('Error generating presale data:', err);
            setToastMessage(
                err instanceof Error ? err.message : 'Error generating data. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center bg-white bg-opacity-20 rounded-2xl shadow-lg backdrop-blur-sm border border-white border-opacity-30 p-8 w-full max-w-md z-20">
            <h2 className="text-2xl font-bold text-white mb-6">Download Presale Data</h2>

            {isConnected ? (
                <div className="w-full space-y-4">
                    <button
                        onClick={generatePresaleData}
                        disabled={isLoading}
                        className={`w-full px-6 py-3 rounded-[8px] font-bold
                            ${isLoading
                                ? 'bg-gray-500 cursor-not-allowed'
                                : 'bg-blue-500 hover:opacity-70'
                            } 
                            transition-opacity duration-500 text-white`}
                    >
                        {isLoading ? 'Generating...' : 'Download Presale Data'}
                    </button>

                    <div className="text-sm text-gray-300 mt-4">
                        <p className="font-semibold mb-2">Export Information:</p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                            <li>Downloads a JSON file with all participant data</li>
                            <li>Includes both whitelist and public sale participants</li>
                            <li>Contains contribution amounts and participation details</li>
                            <li>Tracks participation phases for each wallet</li>
                            <li>Includes timestamps and contribution counts</li>
                        </ul>
                    </div>
                </div>
            ) : (
                <ConnectButton />
            )}

            {toastMessage && (
                <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast>
            )}
        </div>
    );
};

export default DownloadPresaleData;