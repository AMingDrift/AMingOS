'use client';

import React, { useEffect, useState } from 'react';
import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';

import type { ChartConfig } from '@/_components/chart';

import { ChartContainer } from '@/_components/chart';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/_components/shadcn/ui/card';
import { calculatePercentage, convertFileSize } from '@/libs/utils';

const chartConfig = {
    size: {
        label: 'Size',
    },
    used: {
        label: 'Used',
        color: 'white',
    },
} satisfies ChartConfig;

export const Chart = ({ used = 0 }: { used: number }) => {
    // 添加挂载检测逻辑和 ref
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // 只有在客户端完全挂载后才渲染图表
    if (!mounted) return null;

    // 计算百分比并确保endAngle在有效范围内
    const percentage = calculatePercentage(used);
    const safePercentage = Math.min(Math.max(percentage, 0), 100);
    const endAngle = 90 + (safePercentage / 100) * 360;

    const chartData = [{ storage: 'used', 10: used, fill: 'white' }];

    return (
        <Card className="chart">
            <CardContent className="flex-1 p-0">
                <ChartContainer config={chartConfig} className="chart-container">
                    <RadialBarChart
                        data={chartData}
                        startAngle={90}
                        endAngle={endAngle}
                        innerRadius={80}
                        outerRadius={110}
                    >
                        <PolarGrid
                            gridType="circle"
                            radialLines={false}
                            stroke="none"
                            className="polar-grid"
                            polarRadius={[86, 74]}
                        />
                        <RadialBar dataKey="10" cornerRadius={10} />
                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="chart-total-percentage text-4xl font-bold"
                                                >
                                                    {safePercentage > 0
                                                        ? safePercentage.toFixed(1)
                                                        : '0'}
                                                    %
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-white/70"
                                                    style={{ opacity: 0.7 }}
                                                >
                                                    Space used
                                                </tspan>
                                            </text>
                                        );
                                    }
                                    return null;
                                }}
                            />
                        </PolarRadiusAxis>
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
            <CardHeader className="chart-details">
                <CardTitle className="chart-title">Available Storage</CardTitle>
                <CardDescription className="chart-description">
                    {used ? convertFileSize(used) : '0 GB'} / 1 GB
                </CardDescription>
            </CardHeader>
        </Card>
    );
};
