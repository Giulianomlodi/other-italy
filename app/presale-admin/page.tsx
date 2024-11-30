'use client'

import DownloadPresaleData from '@/components/web3/DownloadContributions';
import AdminWhitelistSale from '@/components/web3/PresaleAdmin';
import WithdrawCollectedTokens from '@/components/web3/WitdrawCollectedToken';

export default function Page() {
    return <>
        <DownloadPresaleData />
        <AdminWhitelistSale />
        <WithdrawCollectedTokens />

    </>
}