import React, { useState } from 'react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { Address, isAddress, PublicClient, WalletClient } from 'viem';
import { parseEther } from 'ethers';
import { abi } from '@/presale-abi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_PRESALE_ADDRESS as Address;

const WithdrawCollectedTokens = () => {
    const [withdrawalAddress, setWithdrawalAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [contractBalance, setContractBalance] = useState<string>('0');

    const { address: userAddress, isConnected } = useAccount();
    const publicClient = usePublicClient();
    const { data: walletClient } = useWalletClient();

    // Fetch contract balance
    const fetchContractBalance = async () => {
        if (!publicClient) {
            console.error('Public client not initialized');
            return;
        }

        try {
            const balance = await publicClient.getBalance({
                address: CONTRACT_ADDRESS,
            });
            setContractBalance(ethers.formatEther(balance));
        } catch (err) {
            console.error('Error fetching balance:', err);
        }
    };

    // Effect to fetch balance on mount and after withdrawals
    React.useEffect(() => {
        if (isConnected && publicClient) {
            fetchContractBalance();
        }
    }, [isConnected, publicClient]);

    const handleWithdraw = async () => {
        if (!isConnected) {
            setError('Please connect your wallet');
            return;
        }

        if (!walletClient) {
            setError('Wallet client not initialized');
            return;
        }

        if (!publicClient) {
            setError('Public client not initialized');
            return;
        }

        if (!userAddress) {
            setError('User address not found');
            return;
        }

        if (!isAddress(withdrawalAddress)) {
            setError('Please enter a valid Ethereum address');
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            console.log('🚀 Initiating withdrawal process...');

            // Prepare the transaction
            const { request } = await publicClient.simulateContract({
                address: CONTRACT_ADDRESS,
                abi,
                functionName: 'withdrawCollectedTokens',
                args: [withdrawalAddress as Address],
                account: userAddress,
            });

            console.log('✍️ Requesting wallet signature...');
            const hash = await walletClient.writeContract(request);
            console.log('📝 Transaction hash:', hash);

            setSuccess(`Withdrawal initiated! Transaction hash: ${hash}`);
            console.log('✅ Withdrawal successful');

            // Refresh the balance after withdrawal
            await fetchContractBalance();
        } catch (err) {
            console.error('❌ Withdrawal error:', err);
            if (err instanceof Error) {
                // Handle specific error types
                if (err.message.includes('user rejected')) {
                    setError('Transaction was rejected by the user');
                } else if (err.message.includes('insufficient funds')) {
                    setError('Insufficient funds for transaction');
                } else {
                    setError(err.message);
                }
            } else {
                setError('Failed to withdraw tokens');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Early return if no public client
    if (!publicClient) {
        return (
            <Card className="w-full max-w-md">
                <CardContent className="pt-6">
                    <Alert>
                        <AlertDescription>
                            Waiting for blockchain connection...
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Withdraw Collected Tokens</CardTitle>
                <CardDescription>
                    Current contract balance: {contractBalance} ETH
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {success && (
                    <Alert>
                        <AlertDescription>{success}</AlertDescription>
                    </Alert>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-medium">Withdrawal Address</label>
                    <Input
                        type="text"
                        placeholder="0x..."
                        value={withdrawalAddress}
                        onChange={(e) => setWithdrawalAddress(e.target.value)}
                        disabled={isLoading}
                    />
                    <p className="text-sm text-gray-500">
                        Enter the address where the collected tokens should be sent
                    </p>
                </div>
            </CardContent>

            <CardFooter>
                <Button
                    className="w-full"
                    onClick={handleWithdraw}
                    disabled={isLoading || !isConnected || !withdrawalAddress}
                >
                    {isLoading ? 'Processing...' : 'Withdraw Tokens'}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default WithdrawCollectedTokens;