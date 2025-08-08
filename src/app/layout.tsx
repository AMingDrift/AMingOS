import type { Metadata } from 'next';
import type { FC, PropsWithChildren } from 'react';

import './styles/index.css';
import { ThemeProvider } from '@/_components/theme-provider';

import $styles from './layout.module.css';

export const metadata: Metadata = {
    title: 'AMingOS',
    description: '阿明的仿操作系统UI界面博客, 基于Next.js开发',
};

const RootLayout: FC<PropsWithChildren> = ({ children }) => (
    <html lang="en" suppressHydrationWarning>
        <body>
            <ThemeProvider enableSystem defaultTheme="system" disableTransitionOnChange>
                <div className={$styles.layout}>{children}</div>
            </ThemeProvider>
        </body>
    </html>
);

export default RootLayout;
