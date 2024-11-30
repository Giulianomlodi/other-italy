//NFTStaking/TokenOnlyStaking.tsx
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { formatUnits } from 'viem';
import { TokenOnlyStakingProps } from './types';
import { ChangeEvent } from 'react';

export const TokenOnlyStaking: React.FC<TokenOnlyStakingProps> = ({
    tokenOnlyStakeAmount,
    onAmountChange,
    onStake,
    onMaxClick,
    isProcessing,
    tokenBalance,
    processingStep
}) => {
    const formattedBalance = tokenBalance ? Number(formatUnits(tokenBalance, 9)).toFixed(9) : '0';

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        // Only allow numbers and a single decimal point
        const value = e.target.value;
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            onAmountChange(value);
        }
    };

    const getButtonText = () => {
        if (isProcessing) {
            if (processingStep === 'approval') {
                return (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Approving...
                    </>
                );
            }
            if (processingStep === 'staking') {
                return (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Staking...
                    </>
                );
            }
            return (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                </>
            );
        }
        return 'Stake BANANOSHIS';
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-white font-medium">Stake BANANOSHIS Only</h3>
                <span className="text-sm text-white opacity-75">
                    Balance: {formattedBalance}
                </span>
            </div>
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Input
                        type="text"
                        inputMode="decimal"
                        placeholder="Enter BANANOSHIS amount"
                        value={tokenOnlyStakeAmount}
                        onChange={handleInputChange}
                        className="bg-white bg-opacity-20 text-white placeholder:text-white placeholder:opacity-50 pr-16"
                        disabled={isProcessing}
                    />
                    <Button
                        type="button"
                        onClick={onMaxClick}
                        className="absolute right-1 top-1/2 -translate-y-1/2 px-2 py-0.5 h-7 text-xs bg-opacity-50 hover:bg-opacity-75"
                        disabled={isProcessing || !tokenBalance}
                    >
                        MAX
                    </Button>
                </div>
                {/* Da inserire/rimuovere in live */}
                {/* <Button
                    onClick={onStake}
                    disabled={isProcessing || !tokenOnlyStakeAmount}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-gray-500 min-w-[140px]"
                >
                    {getButtonText()}
                </Button> */}
            </div>
        </div>
    );
};