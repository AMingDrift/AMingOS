import type { Metadata } from 'next';
import type { FC, PropsWithChildren } from 'react';

import './styles/index.css';
import { ThemeProvider } from 'next-themes';

import $styles from './layout.module.css';

export const metadata: Metadata = {
    title: 'nextapp',
    description: '3r教室Next.js全栈开发课程',
};

const RootLayout: FC<PropsWithChildren> = ({ children }) => (
    <html lang="en" suppressHydrationWarning>
        <body>
            <ThemeProvider enableSystem={true} defaultTheme="system">
                <div className={$styles.layout}>{children}</div>
            </ThemeProvider>
        </body>
    </html>
);

export default RootLayout;
