'use client';
import type { DeepNonNullable } from 'utility-types';

import { zodResolver } from '@hookform/resolvers/zod';
import { isNil } from 'lodash';
import { useRouter } from 'next/navigation';
import { use, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import type { LoginRequest, User } from '@/server/user/type';

import { authApi } from '@/api/auth';
import { loginRequestSchema } from '@/server/user/schema';

import { AuthContext } from './constants';

/**
 * 获取当前登录用户
 */
export const useAuth = () => {
    const { auth } = use(AuthContext);
    return useMemo(() => auth, [auth]);
};

/**
 * 设置全局登录用户状态
 */
export const useSetAuth = () => {
    const { setAuth } = use(AuthContext);
    return useCallback((auth: User | null) => setAuth(auth), []);
};

/**
 * 创建登录表单构建器
 */
const useLoginForm = () => {
    const defaultValues = {
        username: '',
        password: '',
    } as DeepNonNullable<LoginRequest>;
    return useForm<LoginRequest>({
        mode: 'all',
        resolver: zodResolver(loginRequestSchema),
        defaultValues,
    });
};

/**
 * 创建登录提交处理器
 * @param setAuthError
 */
const useLoginSubmit = () => {
    const router = useRouter();
    const setAuth = useSetAuth();
    return useCallback(
        async (params: DeepNonNullable<LoginRequest>) => {
            try {
                await authApi.signIn(params, {
                    onSuccess: (c) => {
                        setAuth(c.data?.user as unknown as User);
                        toast.success('登录成功');
                        // // 检查是否有回调URL参数
                        const urlParams = new URLSearchParams(window.location.search);
                        const callbackUrl = urlParams.get('callbackUrl');

                        isNil(callbackUrl) ? router.replace('/') : router.replace(callbackUrl);
                    },
                    onError: (error: any) => {
                        toast.error('登录失败', {
                            description: error.message || '请检查用户名/邮箱和密码',
                        });
                    },
                });
            } catch (error) {
                toast.error('登录失败', {
                    description: (error as Error).message || '服务器错误',
                });
            }
        },
        [router],
    );
};

export const authFormHooks = {
    useLoginForm,
    useLoginSubmit,
};
