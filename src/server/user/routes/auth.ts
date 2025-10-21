import { describeRoute, validator as zValidator } from 'hono-openapi';
import { isNil } from 'lodash';

import { createHonoApp } from '../../common/app';
import { createErrorResult, defaultValidatorErrorHandler } from '../../common/error';
import {
    createServerErrorResponse,
    createSuccessResponse,
    createUnauthorizedErrorResponse,
    createValidatorErrorResponse,
} from '../../common/response';
import { AuthProtectedMiddleware } from '../middlwares';
import { authResponseSchema, authSignoutResponseSchema, loginRequestSchema } from '../schema';
import { getCurrentSession, signIn, signOut } from '../service';

const app = createHonoApp();

export const userTags = ['用户认证'];

export const authRoutes = app
    .post(
        '/sign-in/username',
        describeRoute({
            tags: userTags,
            summary: '用户名登录',
            description: '支持使用用户名进行登录',
            responses: {
                ...createSuccessResponse(authResponseSchema),
                ...createValidatorErrorResponse(),
                ...createUnauthorizedErrorResponse('认证失败'),
                ...createServerErrorResponse('登录失败'),
            },
        }),
        zValidator('json', loginRequestSchema, defaultValidatorErrorHandler),
        async (c) => {
            try {
                const { username, password } = c.req.valid('json');
                console.log({ username, password });
                // 使用Better Auth API进行认证
                const result = await signIn(username, password);
                if (isNil(result) || isNil(result.token)) {
                    c.json(createErrorResult('认证失败', '用户名密码错误', 401) as any);
                }
                return c.json(result, 200);
            } catch (error: any) {
                return c.json(createErrorResult('登录失败', error), 500);
            }
        },
    )

    // 用户登出
    .post(
        '/sign-out',
        describeRoute({
            tags: userTags,
            summary: '用户登出',
            description: '注销当前用户会话',
            responses: {
                ...createSuccessResponse(authSignoutResponseSchema),
                ...createUnauthorizedErrorResponse(),
                ...createServerErrorResponse('登出失败'),
            },
        }),
        AuthProtectedMiddleware,
        async (c) => {
            try {
                await signOut(c.req.raw);
                return c.json({ message: '登出成功' }, 200);
            } catch (error) {
                return c.json(createErrorResult('登出失败', error), 500);
            }
        },
    )
    // 获取会话信息
    .get(
        '/get-session',
        describeRoute({
            tags: userTags,
            summary: '获取会话信息',
            description: '获取当前用户的会话信息',
            responses: {
                ...createSuccessResponse(authResponseSchema),
                ...createUnauthorizedErrorResponse(),
                ...createServerErrorResponse('获取会话失败'),
            },
        }),
        AuthProtectedMiddleware,
        async (c) => {
            try {
                const session = await getCurrentSession(c.req.raw);
                return c.json(
                    {
                        user: session?.user || null,
                        session: session?.session || null,
                    },
                    200,
                );
            } catch (error) {
                return c.json(createErrorResult('获取会话失败', error), 500);
            }
        },
    );
// 用户注册
// .post(
//     '/sign-up',
//     describeRoute({
//         tags: userTags,
//         summary: '用户注册',
//         description: '创建新用户账户',
//         responses: {
//             ...createSuccessResponse(authResponseSchema),
//             ...createValidatorErrorResponse(),
//             ...createServerErrorResponse('注册失败'),
//         },
//     }),
//     zValidator('json', registerRequestSchema, defaultValidatorErrorHandler),
//     async (c) => {
//         try {
//             const { username, email, password } = c.req.valid('json');

//             // 使用Better Auth API进行注册
//             const authResult = await auth.api.signUpEmail({
//                 body: {
//                     name: username,
//                     username,
//                     email,
//                     password,
//                 },
//             });

//             if (!authResult.user) {
//                 return c.json(createErrorResult('注册失败'), 500);
//             }

//             // 如果注册成功，手动设置session cookie
//             if (authResult.token) {
//                 const cookieName = 'better-auth.session_token';
//                 const cookieValue = `${cookieName}=${authResult.token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`; // 30天
//                 c.header('Set-Cookie', cookieValue);
//             }

//             // 获取会话信息以确认cookie设置成功
//             const session = await getCurrentSession(c.req.raw);

//             return c.json(
//                 {
//                     user: authResult.user,
//                     session: session?.session || null,
//                 },
//                 201,
//             );
//         } catch (error: any) {
//             // 处理重复用户错误
//             if (error.message?.includes('unique') || error.code === 'P2002') {
//                 return c.json(createErrorResult('用户名或邮箱已被使用'), 409);
//             }
//             return c.json(createErrorResult('注册失败', error), 500);
//         }
//     },
// )
// 检查用户名可用性
// .post(
//     '/check-username',
//     describeRoute({
//         tags: userTags,
//         summary: '检查用户名可用性',
//         description: '检查指定用户名是否可以使用',
//         responses: {
//             ...createSuccessResponse(checkUsernameResponseSchema),
//             ...createValidatorErrorResponse(),
//             ...createServerErrorResponse('检查用户名失败'),
//         },
//     }),
//     zValidator('json', checkUsernameRequestSchema, defaultValidatorErrorHandler),
//     async (c) => {
//         try {
//             const { username } = c.req.valid('json');

//             const available = await checkUsernameAvailability(username);

//             return c.json(
//                 {
//                     available,
//                     message: available ? '用户名可用' : '用户名已被使用',
//                 },
//                 200,
//             );
//         } catch (error: any) {
//             return c.json(createErrorResult('检查用户名失败', error), 500);
//         }
//     },
// )
// 更新用户信息
// .put(
//     '/update',
//     describeRoute({
//         tags: userTags,
//         summary: '更新用户信息',
//         description: '更新当前登录用户的信息',
//         responses: {
//             ...createSuccessResponse(userSchema),
//             ...createValidatorErrorResponse(),
//             ...createServerErrorResponse('更新用户信息失败'),
//         },
//     }),
//     zValidator('json', updateUserRequestSchema, defaultValidatorErrorHandler),
//     async (c) => {
//         try {
//             const updateData = c.req.valid('json');

//             const updatedUser = await updateUserInfo(c.req.raw, updateData);

//             return c.json(updatedUser, 200);
//         } catch (error: any) {
//             return c.json(createErrorResult('更新用户信息失败', error), 500);
//         }
//     },
// );
