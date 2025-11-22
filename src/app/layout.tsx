import type { Metadata } from 'next';
import { Suspense, type FC, type PropsWithChildren, type ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './styles/index.css';

import DesktopBackground from '@/_components/desktop-background';
import { DockMenu } from '@/_components/home-icons/dock-menu';
import { Toaster } from '@/_components/shadcn/ui/sonner';
import { ThemeProvider } from '@/_components/theme-provider';

import $styles from './layout.module.css';
import { Auth } from '@/_components/auth';
export const metadata: Metadata = {
    title: "AMingDrift's Blog",
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
        <html lang="zh-CN" suppressHydrationWarning data-scroll-behavior="smooth">
            <body className="overflow-hidden">
                <ThemeProvider enableSystem defaultTheme="dark" disableTransitionOnChange>
                    <Auth>
                        <div className={$styles.layout}>
                            <div className="relative min-h-screen overflow-hidden">
                                {/* 桌面图标 */}
                                {children}
                                {/* 点击桌面图标时显示的模态框 */}
                                {modal}

                                {/* 底部任务栏 */}
                                <DockMenu className="bg-taskbar-bg bg-blur-win fixed right-1 bottom-1 left-1 z-(--z-index-dock-menu) flex items-center" />
                                <Suspense>
                                    <DesktopBackground />
                                </Suspense>
                            </div>
                        </div>
                    </Auth>
                    <Toaster />
                </ThemeProvider>
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
};

export default RootLayout;
