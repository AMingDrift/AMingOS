import type { Metadata } from 'next';

import './styles/index.css';

import type { FC, PropsWithChildren } from 'react';

export const metadata: Metadata = {
    title: 'nextapp',
    description: '3r教室Next.js全栈开发课程',
};

const RootLayout: FC<PropsWithChildren> = ({ children }) => (
    <html lang="en" suppressHydrationWarning>
        <body>{children}</body>
    </html>
);

export default RootLayout;
