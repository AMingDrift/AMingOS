import type { Metadata } from 'next';
import type { FC, PropsWithChildren, ReactNode } from 'react';

import './styles/index.css';

import { DockDemo } from '@/_components/dock-menu';
import { ThemeProvider } from '@/_components/theme-provider';
import VideoBackground from '@/_components/video-background';

import $styles from './layout.module.css';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
    title: 'AMingOS',
    description: '阿明的仿操作系统UI界面博客, 基于Next.js开发',
};

const RootLayout: FC<PropsWithChildren> = ({
    children,
    doc,
}: {
    children?: ReactNode;
    doc?: ReactNode;
}) => {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="overflow-hidden">
                <ThemeProvider enableSystem defaultTheme="system" disableTransitionOnChange>
                    <div className={$styles.layout}>
                        <div>
                            <div className="min-h-screen relative overflow-hidden">
                                {/* 桌面图标 */}
                                {/* TODO: bottom-[4rem] 替换成docker menu 高度 */}
                                <div className="absolute inset-0 z-10 p-6 bottom-[4rem] contain-layout contain-size">
                                    {doc}
                                    {children}
                                </div>

                                {/* 底部任务栏 */}
                                <DockDemo className="fixed bottom-1 left-1 right-1 h-14 bg-taskbar-bg bg-blur-win z-50 flex items-center" />
                            </div>
                        </div>
                    </div>
                    <VideoBackground />
                </ThemeProvider>
            </body>
        </html>
    );
};

export default RootLayout;
