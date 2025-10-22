'use client';

import type { FC, JSX, PropsWithChildren } from 'react';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Spinner } from '../loading/spinner';
import { AuthContext } from './constants';
import { useAdmin, useSetAdmin } from './hooks';
import { checkIsAdmin } from './actions';
import { AdminType } from './types';

const DefaultLoading = () => {
    return (
        <Spinner
            className="rounded-sm bg-white/80 transition-opacity duration-300 dark:bg-black/50"
            icon={false}
        />
    );
};

const AuthSetter: FC<PropsWithChildren> = ({ children }) => {
    const admin = useAdmin();
    const setAdmin = useSetAdmin();
    useEffect(() => {
        (async () => {
            if (admin === false) {
                try {
                    // const auth = await authApi.getAuth();
                    const admin = await checkIsAdmin();
                    setAdmin(admin);
                } catch (error) {
                    toast.error('网络连接错误', {
                        description: `${(error as Error).message}, 请尝试刷新页面`,
                    });
                }
            }
        })();
    }, [admin]);
    return <>{children}</>;
};

/**
 * 全局用户认证状态设置组件
 * @param param0
 */
export const Auth: FC<PropsWithChildren> = ({ children }) => {
    const [admin, changeAdmin] = useState<AdminType>(false);
    const setAdmin = useCallback((value: AdminType) => changeAdmin(value), []);
    const value = useMemo(() => ({ admin, setAdmin }), [admin]);

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
    render: <P extends Record<string, any> & { admin: boolean }>(props: P) => JSX.Element;
}> = (props) => {
    const { loading = <DefaultLoading />, render } = props;
    const admin = useAdmin();
    return !admin ? loading : render({ admin });
};

/**
 * Admin 认证组件保护器
 * @param props
 */
export const AdminChecker: FC<PropsWithChildren> = ({ children }) => {
    const admin = useAdmin();
    return admin ? <>{children}</> : null;
};
