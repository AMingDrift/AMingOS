import type { Metadata } from 'next';
import type { FC, PropsWithChildren, ReactNode } from 'react';

import './styles/index.css';

import DesktopBackground from '@/_components/desktop-background';
import { DockMenu } from '@/_components/home-icons/dock-menu';
import { Toaster } from '@/_components/shadcn/ui/sonner';
import { ThemeProvider } from '@/_components/theme-provider';

import $styles from './layout.module.css';
export const metadata: Metadata = {
    title: 'AMingOS',
    description: 'AMingOS - 阿明的仿操作系统UI界面博客',
};

const RootLayout: FC<PropsWithChildren> = ({
    children,
    modal,
}: {
    children?: ReactNode;
    modal?: ReactNode;
}) => {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="overflow-hidden">
                <ThemeProvider enableSystem defaultTheme="dark" disableTransitionOnChange>
                    <div className={$styles.layout}>
                        <div>
                            <div className="relative min-h-screen overflow-hidden">
                                {/* 桌面图标 */}
                                <div className="absolute inset-0 bottom-[calc(var(--height-dock-menu)+0.5rem)] p-6 contain-layout contain-size">
                                    {children}
                                </div>
                                {/* 点击桌面图标时显示的模态框 */}
                                {modal}

                                {/* 底部任务栏 */}
                                <DockMenu className="bg-taskbar-bg bg-blur-win fixed right-1 bottom-1 left-1 z-[var(--z-index-dock-menu)] flex items-center" />
                            </div>
                        </div>
                    </div>
                    <Toaster />
                    <DesktopBackground />
                </ThemeProvider>
            </body>
        </html>
    );
};

export default RootLayout;
