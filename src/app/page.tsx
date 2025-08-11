import { Folders } from 'lucide-react';

import { DockDemo } from '@/_components/dock-menu';
import Explorer from '@/_components/explorer';

// 桌面图标数据
const desktopIcons = [
    { name: '我的电脑', icon: '/window.svg', position: { top: '10%', left: '5%' } },
    { name: '文档', icon: '/window.svg', position: { top: '10%', left: '15%' } },
    { name: '回收站', icon: '/window.svg', position: { top: '10%', left: '25%' } },
    { name: '设置', icon: '/window.svg', position: { top: '25%', left: '5%' } },
];

export default function Desktop() {
    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* 桌面图标 */}
            <div className="absolute inset-0 z-10 p-4">
                {/* {desktopIcons.map((icon, index) => (
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
                ))} */}
                <Explorer />
                <div
                    id="computer-icon"
                    className="w-16 text-center cursor-pointer hover:text-primary transition-colors duration-200 group"
                >
                    <div className="size-14 mx-auto bg-primary/10 rounded-lg flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
                        <Folders />
                    </div>
                    <div className="text-sm font-medium truncate">Document</div>
                </div>
            </div>

            {/* 底部任务栏 */}
            <DockDemo className="fixed bottom-1 left-1 right-1 h-14 bg-taskbar-bg bg-blur-win z-50 flex items-center" />
        </div>
    );
}
