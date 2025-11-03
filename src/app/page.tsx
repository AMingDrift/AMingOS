'use client';
import { Cloud, FileUser, NotebookPen } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import DesktopIcon from '@/_components/home-icons/desktop-icon';
import { AppType } from '@/_components/store/modalStore/types';
import { getCSSVariable } from '@/libs/utils';

const DesktopIcons = () => {
    const icons: { name: AppType; icon: React.ReactNode }[] = [
        {
            name: 'about',
            icon: <FileUser />,
        },
        {
            name: 'blog',
            icon: <NotebookPen />,
        },
        {
            name: 'storage',
            icon: <Cloud />,
        },
    ];
    const [iconPositions, setIconPositions] = useState<{ top: number; left: number }[]>([
        {
            top: 22,
            left: 22,
        },
        {
            top: 127,
            left: 22,
        },
        {
            top: 232,
            left: 22,
        },
    ]);

    const dockMenuHeight = Number(getCSSVariable('--height-dock-menu').replace('px', ''));

    useEffect(() => {
        const calculatePositions = () => {
            const spacing = 105; // 图标之间的间距
            const padding = 22; // 图标与屏幕边缘的间距
            const screenHeight = window.innerHeight - dockMenuHeight - padding * 2;

            const positions = icons.map((_, index) => {
                const rows = Math.floor(screenHeight / spacing);
                const column = Math.floor(index / rows);
                const row = index % rows;
                const x = column * spacing + padding;
                const y = row * spacing + padding;
                return { top: y, left: x };
            });

            setIconPositions(positions);
        };

        calculatePositions();
        window.addEventListener('resize', calculatePositions);
        return () => window.removeEventListener('resize', calculatePositions);
    }, [dockMenuHeight]);

    return (
        <>
            {icons.map((icon, index) => (
                <div
                    key={icon.name}
                    style={{
                        position: 'absolute',
                        top: iconPositions[index]?.top,
                        left: iconPositions[index]?.left,
                    }}
                >
                    <DesktopIcon name={icon.name} icon={icon.icon} />
                </div>
            ))}
        </>
    );
};

export default DesktopIcons;
