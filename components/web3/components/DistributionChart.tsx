import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { COLORS } from '../constants';
import type { HolderBreakdown } from '@/types/holder';

interface DistributionChartProps {
    breakdown: {
        [key: string]: HolderBreakdown;
    };
}

export const DistributionChart: React.FC<DistributionChartProps> = ({ breakdown }) => {
    // Convert the breakdown object to array of data points
    const pieData = Object.entries(breakdown)
        .filter(([_, data]) => data.count > 0) // Only include tiers with tokens
        .map(([tier, data]) => ({
            name: tier,
            value: data.count,
            multiplier: data.multiplier,
            subtotal: data.subtotal
        }))
        .sort((a, b) => {
            // Sort order: OG -> Legendary -> Epic -> Rare -> Uncommon
            const tierOrder = {
                OG: 0,
                Legendary: 1,
                Epic: 2,
                Rare: 3,
                Uncommon: 4
            };
            return (tierOrder[a.name as keyof typeof tierOrder] || 999) -
                (tierOrder[b.name as keyof typeof tierOrder] || 999);
        });

    return (
        <div className="h-64 bg-white bg-opacity-20 rounded-2xl shadow-lg backdrop-blur-sm border border-white border-opacity-30">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({
                            cx,
                            cy,
                            midAngle,
                            innerRadius,
                            outerRadius,
                            value,
                            name
                        }) => {
                            const RADIAN = Math.PI / 180;
                            const radius = 25 + innerRadius + (outerRadius - innerRadius);
                            const x = cx + radius * Math.cos(-midAngle * RADIAN);
                            const y = cy + radius * Math.sin(-midAngle * RADIAN);

                            return (
                                <text
                                    x={x}
                                    y={y}
                                    fill={COLORS[name as keyof typeof COLORS]}
                                    textAnchor={x > cx ? 'start' : 'end'}
                                    dominantBaseline="central"
                                    fontSize="12" // Added smaller font size
                                >
                                    {`${name} (${value})`}
                                </text>
                            );
                        }}
                    >
                        {pieData.map((entry) => (
                            <Cell
                                key={entry.name}
                                fill={COLORS[entry.name as keyof typeof COLORS]}
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                    <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg border border-white/20">
                                        <p className="font-medium">{data.name}</p>
                                        <p>Count: {data.value}</p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};