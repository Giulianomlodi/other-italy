// src/components/web3/components/StatsCard.tsx
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    icon: LucideIcon;
    label: string;
    value: string | number;
    iconColor?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
    icon: Icon,
    label,
    value,
    iconColor = 'text-blue-400'
}) => (
    <Card className="bg-white bg-opacity-10">
        <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
                <Icon className={`h-8 w-8 ${iconColor}`} />
                <div>
                    <p className="text-sm font-medium text-white">{label}</p>
                    <p className="text-2xl font-bold text-white">
                        {typeof value === 'number' ? new Intl.NumberFormat().format(value) : value}
                    </p>
                </div>
            </div>
        </CardContent>
    </Card>
);