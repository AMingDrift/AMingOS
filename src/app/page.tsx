import Image from 'next/image';

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
            {/* 桌面背景图 */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/bg-dark.png"
                    alt="桌面背景"
                    fill
                    className="object-cover opacity-70"
                    priority
                />
            </div>

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
            <div className="fixed bottom-0 left-0 right-0 h-14 bg-taskbar-bg bg-blur-win z-50 border-t border-white/10 flex items-center px-4">
                {/* 开始菜单按钮 */}
                <div className="taskbar-item mr-2">
                    <Image src="/windows-logo.svg" alt="开始菜单" width={24} height={24} />
                </div>

                {/* 固定程序 */}
                <div className="flex items-center space-x-1">
                    <div className="taskbar-item">
                        <Image src="/edge.svg" alt="Edge浏览器" width={24} height={24} />
                    </div>
                    <div className="taskbar-item">
                        <Image
                            src="/file-explorer.svg"
                            alt="文件资源管理器"
                            width={24}
                            height={24}
                        />
                    </div>
                </div>

                {/* 右侧系统托盘 */}
                <div className="ml-auto flex items-center space-x-2">
                    <div className="taskbar-item">
                        <span className="text-white text-sm">18:30</span>
                    </div>
                    <div className="taskbar-item">
                        <Image src="/volume.svg" alt="音量" width={20} height={20} />
                    </div>
                    <div className="taskbar-item">
                        <Image src="/network.svg" alt="网络" width={20} height={20} />
                    </div>
                </div>
            </div>
        </div>
    );
}
