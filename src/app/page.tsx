import Image from 'next/image';

import { DockDemo } from '@/_components/dock-menu';

// 桌面图标数据
const desktopIcons = [
    { name: '我的电脑', icon: '/window.svg', position: { top: '10%', left: '5%' } },
    { name: '文档', icon: '/window.svg', position: { top: '10%', left: '15%' } },
    { name: '回收站', icon: '/window.svg', position: { top: '10%', left: '25%' } },
    { name: '设置', icon: '/window.svg', position: { top: '25%', left: '5%' } },
];

export default function Desktop() {
    return (
        <div className="min-h-screen relative overflow-hidden bg-win-dark">
            {/* 桌面图标 */}
            <div className="absolute inset-0 z-10 p-4">
                {desktopIcons.map((icon, index) => (
                    <div
                        key={index}
                        className="desktop-icon absolute"
                        style={{ top: icon.position.top, left: icon.position.left }}
                    >
                        <div className="w-12 h-12 flex items-center justify-center">
                            <Image src={icon.icon} alt={icon.name} width={48} height={48} />
                        </div>
                        <span className="desktop-icon-label">{icon.name}</span>
                    </div>
                ))}
            </div>

            {/* 底部任务栏 */}
            <DockDemo className="fixed bottom-1 left-1 right-1 h-14 bg-taskbar-bg bg-blur-win z-50 flex items-center" />
        </div>
    );
}
