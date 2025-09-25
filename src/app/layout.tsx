import type { Metadata } from 'next';
import type { FC, PropsWithChildren, ReactNode } from 'react';

import './styles/index.css';

import { DockDemo } from '@/_components/home-icons/dock-menu';
import { Toaster } from '@/_components/shadcn/ui/sonner';
import { ThemeProvider } from '@/_components/theme-provider';
import VideoBackground from '@/_components/video-background';

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
                <ThemeProvider enableSystem defaultTheme="system" disableTransitionOnChange>
                    <div className={$styles.layout}>
                        <div>
                            <div className="relative min-h-screen overflow-hidden">
                                {/* 桌面图标 */}
                                {/* TODO: 4rem 写成calc(var(--dock-menu-height, 4rem)) */}
                                <div className="absolute inset-0 bottom-[4rem] z-10 p-6 contain-layout contain-size">
                                    {modal}
                                    {children}
                                </div>

                                {/* 底部任务栏 */}
                                <DockDemo className="bg-taskbar-bg bg-blur-win fixed right-1 bottom-1 left-1 z-999 flex h-14 items-center" />
                            </div>
                        </div>
                    </div>
                    <Toaster />
                    <VideoBackground />
                </ThemeProvider>
            </body>
        </html>
    );
};

export default RootLayout;
