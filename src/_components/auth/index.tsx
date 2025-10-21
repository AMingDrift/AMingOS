'use client';

import type { FC, JSX, PropsWithChildren } from 'react';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import type { User } from '@/server/user/type';

import { authApi } from '@/api/auth';

import type { AuthType } from './types';

import { Spinner } from '../loading/spinner';
import { AuthContext } from './constants';
import { useAuth, useSetAuth } from './hooks';

const DefaultLoading = () => {
    return (
        <Spinner
            className="rounded-sm bg-white/80 transition-opacity duration-300 dark:bg-black/50"
            icon={false}
        />
    );
};

const AuthSetter: FC<PropsWithChildren> = ({ children }) => {
    const auth = useAuth();
    const setAuth = useSetAuth();
    useEffect(() => {
        (async () => {
            if (auth === false) {
                try {
                    const auth = await authApi.getAuth();
                    setAuth(auth);
                } catch (error) {
                    toast.error('网络连接错误', {
                        description: `${(error as Error).message}, 请尝试刷新页面`,
                    });
                }
            }
        })();
    }, [auth]);
    return <>{children}</>;
};

/**
 * 全局用户认证状态设置组件
 * @param param0
 */
export const Auth: FC<PropsWithChildren> = ({ children }) => {
    const [auth, changeAuth] = useState<AuthType>(false);
    const setAuth = useCallback((value: AuthType) => changeAuth(value), []);
    const value = useMemo(() => ({ auth, setAuth }), [auth]);

    return (
        <AuthContext value={value}>
            <AuthSetter>{children}</AuthSetter>
        </AuthContext>
    );
};

/**
 * 认证组件保护器
 * @param props
 */
export const AuthChecker: FC<{
    loading?: JSX.Element;
    render: <P extends Record<string, any> & { auth: User | null }>(props: P) => JSX.Element;
}> = (props) => {
    const { loading = <DefaultLoading />, render } = props;
    const auth = useAuth();
    return auth === false ? loading : render({ auth });
};
