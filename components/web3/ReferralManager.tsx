// src/components/web3/ReferralManager.tsx
import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Share2, Copy, Check, Trophy, Loader2 } from 'lucide-react';
import type { Holder } from '@/types/holder';

interface Referral {
    code: string;
    used: boolean;
    referredAddress?: string;
    createdAt: string;
    usedAt?: string;
}

interface ReferralStats {
    totalGenerated: number;
    totalReferred: number;
    rank: number;
}

interface SuccessResponse {
    data: {
        referrals: Referral[];
        stats: ReferralStats;
    };
    error?: never;
}

interface ErrorResponse {
    error: string;
    data?: never;
}

type ReferralResponse = SuccessResponse | ErrorResponse;

export const ReferralManager: React.FC = () => {
    const { address } = useAccount();
    const [referrals, setReferrals] = useState<Referral[]>([]);
    const [stats, setStats] = useState<ReferralStats | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const [holderData, setHolderData] = useState<Holder | null>(null);
    const [checkingHolder, setCheckingHolder] = useState(true);

    const fetchReferrals = async () => {
        if (!address) return;

        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`/api/referrals?address=${address}`);
            const data: ReferralResponse = await response.json();

            if ('error' in data) throw new Error(data.error);

            setReferrals(data.data.referrals);
            setStats(data.data.stats);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch referrals');
        } finally {
            setLoading(false);
        }
    };

    const generateReferral = async () => {
        if (!address) return;

        try {
            setLoading(true);
            setError(null);
            const response = await fetch('/api/referrals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address }),
            });

            const data: ReferralResponse = await response.json();
            if ('error' in data) throw new Error(data.error);

            await fetchReferrals();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate referral');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = async (code: string) => {
        const referralLink = `${window.location.origin}/referral/${code}`;
        await navigator.clipboard.writeText(referralLink);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    // Check if the connected wallet is a holder
    const checkHolderStatus = async () => {
        if (!address) return;

        try {
            setCheckingHolder(true);
            const response = await fetch(`/api/holders?address=${address}`);
            const result = await response.json();

            if (result.error) {
                setHolderData(null);
                return;
            }

            setHolderData(result.data);
        } catch (err) {
            console.error('Error checking holder status:', err);
            setHolderData(null);
        } finally {
            setCheckingHolder(false);
        }
    };

    useEffect(() => {
        if (address) {
            checkHolderStatus();
        } else {
            setHolderData(null);
            setCheckingHolder(false);
        }
    }, [address]);

    // Only fetch referrals if user is a holder
    useEffect(() => {
        if (address && holderData) {
            fetchReferrals();
        }
    }, [address, holderData]);

    if (checkingHolder) {
        return (
            <Card className="bg-white bg-opacity-20 rounded-2xl shadow-lg backdrop-blur-sm border border-white border-opacity-30">
                <CardContent className="pt-6 flex justify-center items-center h-32">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                </CardContent>
            </Card>
        );
    }

    if (!holderData || holderData.tokenCount === 0) {
        return (
            <Card className="bg-white bg-opacity-20 rounded-2xl shadow-lg backdrop-blur-sm border border-white border-opacity-30">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Share2 className="h-5 w-5" />
                        Referral Program
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Alert>
                        <AlertDescription className="text-white">
                            Only Banana NFT holders can participate in the referral program.
                            {!address ? (
                                " Please connect your wallet."
                            ) : (
                                " This wallet doesn't hold any Banana NFTs."
                            )}
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-white bg-opacity-20 rounded-2xl shadow-lg backdrop-blur-sm border border-white border-opacity-30">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <Share2 className="h-5 w-5" />
                    Referral Program
                </CardTitle>
            </CardHeader>
            <CardContent>
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {stats && (
                    <div className="mb-6 grid grid-cols-3 gap-4">
                        <div className="bg-black/20 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-white">{stats.totalGenerated}</div>
                            <div className="text-sm text-white/60">Links Created</div>
                        </div>
                        <div className="bg-black/20 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-white">{stats.totalReferred}</div>
                            <div className="text-sm text-white/60">Successful Referrals</div>
                        </div>
                        <div className="bg-black/20 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-white flex items-center justify-center gap-1">
                                <Trophy className="h-5 w-5 text-yellow-400" />
                                #{stats.rank}
                            </div>
                            <div className="text-sm text-white/60">Your Rank</div>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-white">
                            Available Links: {referrals.length}/5
                        </span>
                        <Button
                            onClick={generateReferral}
                            disabled={loading || referrals.length >= 5}
                        >
                            Generate Link
                        </Button>
                    </div>

                    <div className="space-y-2">
                        {referrals.map((referral) => (
                            <div
                                key={referral.code}
                                className="flex items-center justify-between p-3 bg-black/20 rounded-lg"
                            >
                                <div className="flex-1">
                                    <p className="text-white font-mono">{referral.code}</p>
                                    {referral.used && (
                                        <p className="text-sm text-white/60">
                                            Used by: {referral.referredAddress?.slice(0, 6)}...
                                            {referral.referredAddress?.slice(-4)}
                                        </p>
                                    )}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(referral.code)}
                                    disabled={referral.used}
                                >
                                    {copiedCode === referral.code ? (
                                        <Check className="h-4 w-4" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ReferralManager;