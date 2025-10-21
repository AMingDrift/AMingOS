import { usernameClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { isNil } from 'lodash';

import type { LoginRequest, User } from '@/server/user/type';

import { appConfig } from '@/config/app';

// Better Auth 官方客户端（支持用户名登录）
export const authClient = createAuthClient({
    baseURL: appConfig.baseUrl,
    basePath: '/api/auth',
    plugins: [usernameClient()],
});

export const authApi = {
    /**
     * 用户登录 - 智能登录（支持用户名或邮箱）
     * @param data 登录数据（用户名/邮箱 + 密码）
     * @param options 额外选项
     */
    signIn: async (
        data: LoginRequest,
        options?: {
            rememberMe?: boolean;
            callbackURL?: string;
            onSuccess?: (ctx?: any) => void;
            onError?: (error: any) => void;
        },
    ) => {
        try {
            return await authClient.signIn.username(
                {
                    username: data.username,
                    password: data.password,
                    callbackURL: options?.callbackURL,
                    rememberMe: options?.rememberMe ?? true,
                },
                {
                    onSuccess: options?.onSuccess,
                    onError: options?.onError,
                },
            );
            // return await authClient.signIn.social({
            //     provider: 'github',
            // });
        } catch (error) {
            if (options?.onError) {
                options.onError(error);
            }
            throw error;
        }
    },

    /**
     * 用户登出 - 使用 Better Auth 官方客户端
     */
    signOut: async (options?: { onSuccess?: () => void }) => {
        return await authClient.signOut({
            fetchOptions: {
                onSuccess: options?.onSuccess,
            },
        });
    },

    /**
     * 获取会话信息 - 异步方式
     */
    getSession: async () => authClient.getSession(),

    /**
     * 获取当前登录用户信息
     */
    getAuth: async () => {
        const session = await authClient.getSession();
        if (isNil(session) || isNil(session.data?.user)) return null;
        return session.data?.user as any as User;
    },

    /**
     * 检查用户名是否可用
     */
    // isUsernameAvailable: async (username: string) => authClient.isUsernameAvailable({ username }),

    /**
     * 更新用户信息
     */
    // updateUser: async (data: { username?: string; displayUsername?: string }) =>
    //     authClient.updateUser(data),

    /**
     * 用户注册 - 使用 Better Auth 官方客户端
     * @param data 注册数据
     * @param options 额外选项
     */
    // signUp: async (
    //     data: RegisterRequest,
    //     options?: {
    //         callbackURL?: string;
    //         onSuccess?: () => void;
    //         onError?: (error: any) => void;
    //     },
    // ) => {
    //     return await authClient.signUp.email(
    //         {
    //             email: data.email,
    //             password: data.password,
    //             name: data.username, // 用户显示名称
    //             username: data.username, // 用户名（由 username 插件处理）
    //             displayUsername: data.displayUsername, // 可选的显示用户名
    //             callbackURL: options?.callbackURL || '/dashboard',
    //         },
    //         {
    //             onSuccess: options?.onSuccess,
    //             onError: options?.onError,
    //         },
    //     );
    // },
};
