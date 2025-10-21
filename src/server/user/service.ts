import { isNil } from 'lodash';

import { auth } from '../../libs/auth';
import db from '../../libs/db/client';

/**
 * 获取当前用户会话信息
 */
export const getCurrentSession = async (request: Request) => {
    return await auth.api.getSession({
        headers: request.headers,
    });
};

/**
 * 用户登录 - 支持用户名或邮箱
 */
export const signIn = async (credential: string, password: string) => {
    // 首先查找用户，支持用户名或邮箱
    const user = await db.user.findFirst({
        where: {
            OR: [{ username: credential }, { email: credential }],
        },
    });

    if (isNil(user)) {
        return null;
    }

    // 使用Better Auth的内部验证方法
    const result = await auth.api.signInEmail({
        body: {
            email: user.email,
            password,
        },
    });

    return result;
};

/**
 * 用户登出
 */
export const signOut = async (request: Request) => {
    return await auth.api.signOut({
        headers: request.headers,
    });
};

/**
 * 获取用户信息
 */
export const getUser = async (request: Request) => {
    const session = await getCurrentSession(request);
    return session?.user || null;
};

/**
 * 验证用户会话
 */
export const verifySession = async (request: Request) => {
    const session = await getCurrentSession(request);
    return !!session?.user;
};

/**
 * 用户注册
 */
// export const signUp = async (username: string, email: string, password: string) => {
//     return await auth.api.signUpEmail({
//         body: {
//             name: username, // Better Auth 内部仍使用 name 字段
//             email,
//             password,
//         },
//     });
// };

/**
 * 检查用户名是否可用
 */
// export const checkUsernameAvailability = async (username: string) => {
//     const existingUser = await db.user.findFirst({
//         where: { username },
//     });
//     return !existingUser;
// };

/**
 * 更新用户信息
 */
// export const updateUserInfo = async (
//     request: Request,
//     data: { username?: string; displayUsername?: string },
// ) => {
//     const session = await getCurrentSession(request);
//     if (!session?.user) {
//         throw new Error('用户未登录');
//     }

//     // 如果要更新用户名，先检查是否可用
//     if (data.username && data.username !== session.user.username) {
//         const isAvailable = await checkUsernameAvailability(data.username);
//         if (!isAvailable) {
//             throw new Error('用户名已被使用');
//         }
//     }

//     // 更新用户信息
//     const updatedUser = await db.user.update({
//         where: { id: session.user.id },
//         data: {
//             ...(data.username && { username: data.username }),
//             ...(data.displayUsername !== undefined && { displayUsername: data.displayUsername }),
//         },
//     });

//     return updatedUser;
// };
