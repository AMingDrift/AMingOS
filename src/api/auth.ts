import { createAuthClient } from 'better-auth/react';
import type { AuthApiType } from '@/server/user/type';
import { buildClient, fetchApi } from '@/libs/hono';
import { appConfig } from '@/config/app';
import { authPath } from '@/server/user/constants';

export const customAuthClient = buildClient<AuthApiType>(authPath);

// Better Auth 官方客户端（支持用户名登录）
export const authClient = createAuthClient({
    baseURL: appConfig.baseUrl,
    basePath: '/api/auth',
});

export const authApi = {
    signInGithub: async (options?: {
        callbackURL?: string;
        onSuccess?: (ctx?: any) => void;
        onError?: (error: any) => void;
    }) => {
        try {
            return await authClient.signIn.social(
                {
                    provider: 'github',
                    callbackURL: options?.callbackURL,
                },
                {
                    onSuccess: options?.onSuccess,
                    onError: options?.onError,
                },
            );
        } catch (error) {
            if (options?.onError) {
                options.onError(error);
            }
            throw error;
        }
    },

    /**
     * 获取会话信息 - 异步方式
     */
    getSession: async () => authClient.getSession(),

    isAdmin: async () => fetchApi(customAuthClient, async (c) => c['is-admin'].$get()),
};
