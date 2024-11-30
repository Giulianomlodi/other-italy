// src/components / web3 / components / CampaignInfo.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CampaignConfig } from '@/types/campaign';

interface CampaignInfoProps {
    config: CampaignConfig;
}

export const CampaignInfo: React.FC<CampaignInfoProps> = ({ config }) => (
    <Card className="bg-white bg-opacity-10 h-100">
        <CardHeader>
            <CardTitle className="text-white">Campaign Details</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                <ul className="text-white">
                    <li>You don't need to stake your Bananas, they grow naturally</li>
                    <li>Hold your Bananas during the daily snapshots to accumulate points</li>
                    <li>Hold your Bananas in the same wallet during the first and the last snapshot to obtain an additional multiplier</li>
                </ul>
                <div className="flex justify-between">
                    <span className="text-white opacity-80">-</span>
                    <span className="text-white font-medium">
                        {new Intl.NumberFormat().format(config.TOTAL_TOKENS)}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-white opacity-80">Duration</span>
                    <span className="text-white font-medium">{config.CAMPAIGN_DAYS} days</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-white opacity-80">Daily Distribution</span>
                    <span className="text-white font-medium">
                        {new Intl.NumberFormat().format(config.TOTAL_TOKENS / config.CAMPAIGN_DAYS)}
                    </span>
                </div>
                {/* <div className="flex justify-between">
                    <span className="text-white opacity-80">Start Date</span>
                    <span className="text-white font-medium">
                        {new Date(config.START_DATE).toLocaleDateString()}
                    </span>
                </div> */}
            </div>
        </CardContent>
    </Card>
);