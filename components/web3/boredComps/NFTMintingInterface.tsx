'use client'

import { useEffect, useRef, useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useWhitelistStatus } from './useWhitelistStatus';
import { italyABI } from '@/other-italy-abi';
import { Inter } from 'next/font/google';

// Move font initialization outside component
const inter = Inter({
    weight: '400',
    subsets: ['latin'],
});

const whitelistConfig = {
    members: [
        "0xaaa2da255df9ee74c7075bcb6d81f97940908a5d",
        "0x29469395eaf6f95920e59f858042f0e28d98a20b",
        "0x6C44aBA1aFEd210C7886095d0780cc9d92D6bd0d",
        "0x129EBc4A440a15abA29978A22F676b2795a851c6",
        // ... other member addresses
    ] as `0x${string}`[],
    topMembers: [
        "0xe2a83b15fc300d8457eb9e176f98d92a8ff40a49",
        "0xa858ddc0445d8131dac4d1de01f834ffcba52ef1",
        "0x6C44aBA1aFEd210C7886095d0780cc9d92D6bd0d",
        "0xFed314FFc6Dd40315F7D5c27a03f223F2297a7D7",
        // ... other top member addresses
    ] as `0x${string}`[]
};

export default function NFTMintingInterface({
    contractAddress
}: {
    contractAddress: `0x${string}`
}) {
    const { address } = useAccount();
    const [mounted, setMounted] = useState(false);
    const memberVideoRef = useRef<HTMLVideoElement>(null);
    const topMemberVideoRef = useRef<HTMLVideoElement>(null);

    const {
        isMemberWhitelisted,
        isTopMemberWhitelisted,
        memberMerkleProof,
        topMemberMerkleProof
    } = useWhitelistStatus(address, whitelistConfig);

    const { writeContract: mint, isPending } = useWriteContract();

    // Handle client-side mounting
    useEffect(() => {
        setMounted(true);
    }, []);

    // Handle video playback
    useEffect(() => {
        const playVideos = async () => {
            if (memberVideoRef.current) {
                try {
                    memberVideoRef.current.play();
                } catch (error) {
                    console.error('Member video playback failed:', error);
                }
            }
            if (topMemberVideoRef.current) {
                try {
                    topMemberVideoRef.current.play();
                } catch (error) {
                    console.error('Top member video playback failed:', error);
                }
            }
        };

        // Play videos when component mounts and when user interacts
        playVideos();

        // Add click event listener to document for iOS
        const handleUserInteraction = () => {
            playVideos();
            document.removeEventListener('click', handleUserInteraction);
        };
        document.addEventListener('click', handleUserInteraction);

        return () => {
            document.removeEventListener('click', handleUserInteraction);
        };
    }, [mounted]);

    const handleMint = async (type: 'basic' | 'pro') => {
        try {
            await mint({
                address: contractAddress,
                abi: italyABI,
                functionName: type === 'basic' ? 'mintBasic' : 'mintPro',
                args: [type === 'basic' ? memberMerkleProof : topMemberMerkleProof]
            });
        } catch (error) {
            console.error('Minting error:', error);
        }
    };

    // Prevent hydration issues by not rendering until mounted
    if (!mounted) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-40 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Member NFT Card */}
                <Card className="bg-black/50 backdrop-blur border border-white/10">
                    <CardHeader>
                        <CardTitle className={`text-2xl text-white ${inter.className}`}>
                            Member NFT
                        </CardTitle>
                        <CardDescription className="text-gray-300">
                            Join our exclusive community of Italian culture enthusiasts
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <video
                            ref={memberVideoRef}
                            className="w-full rounded-lg shadow-xl"
                            src="/video/memberNFT.mp4"
                            autoPlay
                            playsInline
                            muted
                            loop
                        />
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        {isMemberWhitelisted ? (
                            <Button
                                className="w-full bg-zinc-400 hover:bg-zinc-400 hover:opacity-70 transition-opacity"
                                onClick={() => handleMint('basic')}
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Minting...
                                    </>
                                ) : (
                                    'Mint Member NFT'
                                )}
                            </Button>
                        ) : (
                            <Alert variant="destructive" className="bg-black/50 border border-red-500/50">
                                <AlertDescription className={inter.className}>
                                    Your address is not whitelisted for the Member NFT.
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardFooter>
                </Card>

                {/* Top Member NFT Card */}
                <Card className="bg-black/50 backdrop-blur border border-white/10">
                    <CardHeader>
                        <CardTitle className={`text-2xl text-white ${inter.className}`}>
                            Top Member NFT
                        </CardTitle>
                        <CardDescription className="text-gray-300">
                            Experience the pinnacle of Italian cultural membership
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <video
                            ref={topMemberVideoRef}
                            className="w-full rounded-lg shadow-xl"
                            src="/video/topmemberNFT.mp4"
                            autoPlay
                            playsInline
                            muted
                            loop
                        />
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        {isTopMemberWhitelisted ? (
                            <Button
                                className="w-full w-full  bg-yellow-500 hover:bg-yellow-500 hover:opacity-70 transition-opacity"
                                onClick={() => handleMint('pro')}
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Minting...
                                    </>
                                ) : (
                                    'Mint Top Member NFT'
                                )}
                            </Button>
                        ) : (
                            <Alert variant="destructive" className="bg-black/50 border border-red-500/50">
                                <AlertDescription className={inter.className}>
                                    Your address is not whitelisted for the Top Member NFT.
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}