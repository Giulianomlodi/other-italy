// src/app/referral/[code]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, GiftIcon, Banana } from 'lucide-react';
import AnimatedPatternBackground from '@/components/layout/AnimatedPatternBackground';

interface ReferralData {
    code: string;
    referrerAddress: string;
    used: boolean;
    referredAddress?: string;
}

export default function ReferralPage() {
    const { code } = useParams();
    const router = useRouter();
    const { address, isConnected } = useAccount();
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [referralData, setReferralData] = useState<ReferralData | null>(null);

    // Fetch referral data
    useEffect(() => {
        const fetchReferralData = async () => {
            try {
                const response = await fetch(`/api/referrals?code=${code}`);
                const data = await response.json();

                if (data.error) {
                    throw new Error(data.error);
                }

                setReferralData(data.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Invalid referral code');
            } finally {
                setChecking(false);
            }
        };

        if (code) {
            fetchReferralData();
        }
    }, [code]);

    // Check if already claimed when wallet connects
    useEffect(() => {
        const checkExistingClaim = async () => {
            if (!address) return;

            try {
                const response = await fetch(`/api/referrals?address=${address}`);
                const data = await response.json();

                if (data.data?.some((ref: ReferralData) => ref.referredAddress === address)) {
                    setError('This wallet has already claimed a whitelist spot');
                }
            } catch (err) {
                console.error('Error checking existing claim:', err);
            }
        };

        if (isConnected) {
            checkExistingClaim();
        }
    }, [address, isConnected]);

    const claimReferral = async () => {
        if (!address || !code) return;

        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/referrals', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, address }),
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            setSuccess(true);
            // Redirect to thank you page after successful claim
            setTimeout(() => router.push('/thank-you'), 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to claim referral');
        } finally {
            setLoading(false);
        }
    };

    if (checking) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center p-4">
                <Card className="w-full max-w-md bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30">
                    <CardContent className="pt-6 flex justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-white" />
                    </CardContent>
                </Card>
                <AnimatedPatternBackground />
            </div>
        );
    }

    if (error && !loading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center p-4">
                <Card className="w-full max-w-md bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30">
                    <CardHeader>
                        <CardTitle className="text-white">Invalid Referral</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                        {/* Remove dashboard redirect button */}
                    </CardContent>
                </Card>
                <AnimatedPatternBackground />
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Banana className="h-6 w-6 text-yellow-400" />
                        Claim Your Whitelist Spot
                    </CardTitle>
                    <CardDescription className="text-white text-opacity-80">
                        Connect your wallet to claim your whitelist spot
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!isConnected ? (
                        <div className="text-center">
                            <ConnectButton />
                        </div>
                    ) : (
                        <>
                            {success ? (
                                <Alert>
                                    <AlertDescription className="text-green-500">
                                        Successfully claimed! Redirecting to confirmation page...
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <div className="space-y-4">
                                    {referralData && (
                                        <div className="text-sm text-white text-opacity-80">
                                            <p>Referral Code: {referralData.code}</p>
                                            <p>From: {referralData.referrerAddress.slice(0, 6)}...{referralData.referrerAddress.slice(-4)}</p>
                                        </div>
                                    )}
                                    <Button
                                        onClick={claimReferral}
                                        disabled={loading}
                                        className="w-full"
                                    >
                                        {loading ? (
                                            <div className="flex items-center gap-2">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Processing...
                                            </div>
                                        ) : (
                                            'Claim Whitelist Spot'
                                        )}
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
            <AnimatedPatternBackground />
        </div>
    );
}