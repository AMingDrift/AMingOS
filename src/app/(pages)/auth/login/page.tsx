import type { Metadata, ResolvingMetadata } from 'next';
import type { FC } from 'react';

import { AuthLoginForm } from '@/_components/auth/forms/login';
import { cn } from '@/_components/shadcn/utils';

import $styles from './style.module.css';

export const generateMetadata = async (_: any, parent: ResolvingMetadata): Promise<Metadata> => {
    return {
        title: `用户登录 - ${(await parent).title?.absolute}`,
        description: '用户登录页面',
    };
};

const AuthLoginPage: FC = async () => (
    <div className="page-item">
        <div className={cn($styles.item, 'page-container page-block')} style={{ flex: 'none' }}>
            <div className="text-center text-xl font-bold">用户登录</div>
            <AuthLoginForm />
        </div>
    </div>
);
export default AuthLoginPage;
