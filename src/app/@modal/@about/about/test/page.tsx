'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Legend, RadialBar, RadialBarChart, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

import { Button } from '@/_components/shadcn/ui/button';

const data = [
    { name: '18-24', uv: 31.47, pv: 2400, fill: '#8884d8' },
    { name: '25-29', uv: 26.69, pv: 4567, fill: '#83a6ed' },
    { name: '30-34', uv: 15.69, pv: 1398, fill: '#8dd1e1' },
    { name: '35-39', uv: 8.22, pv: 9800, fill: '#82ca9d' },
    { name: '40-49', uv: 8.63, pv: 3908, fill: '#a4de6c' },
    { name: '50+', uv: 2.63, pv: 4800, fill: '#d0ed57' },
    { name: 'unknow', uv: 6.67, pv: 4800, fill: '#ffc658' },
];

const style = {
    top: '50%',
    right: 0,
    transform: 'translate(0, -50%)',
    lineHeight: '24px',
};

export default function SonnerDemo() {
    // 使用 useState 和 useRef 解决 React 18 StrictMode 问题
    const [mounted, setMounted] = useState(false);
    const chartRef = useRef(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // 只有在客户端完全挂载后才渲染图表
    if (!mounted) return null;

    return (
        <div className="flex h-full w-full flex-col items-center p-4">
            <Button
                variant="ghost"
                className="mt-2 ml-2"
                onClick={() =>
                    toast('Event has been created', {
                        description: 'Sunday, December 03, 2023 at 9:00 AM',
                        action: {
                            label: 'Undo',
                            onClick: () => console.log('Undo'),
                        },
                    })
                }
            >
                Show Toast
            </Button>

            {/* 改进的图表容器设置 */}
            <div
                className="mt-4 h-[600px] w-full max-w-[600px] rounded-md border border-gray-200"
                ref={chartRef}
            >
                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                        cx="50%"
                        cy="50%"
                        innerRadius="10%"
                        outerRadius="80%"
                        barSize={10}
                        data={data}
                    >
                        <RadialBar
                            minAngle={15}
                            label={{ position: 'insideStart', fill: '#fff' }}
                            background
                            clockWise
                            dataKey="uv"
                        />
                        <Legend
                            iconSize={10}
                            layout="vertical"
                            verticalAlign="middle"
                            wrapperStyle={style}
                        />
                    </RadialBarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
