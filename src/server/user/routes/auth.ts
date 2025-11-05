import { describeRoute } from 'hono-openapi';

import { createHonoApp } from '../../common/app';
import { createErrorResult } from '../../common/error';
import {
    createServerErrorResponse,
    createSuccessResponse,
    createUnauthorizedErrorResponse,
    getCacheControl,
} from '../../common/response';
import { authResponseSchema } from '../schema';
import { findAccoundByUserId, getCurrentSession } from '../service';

const app = createHonoApp();

export const userTags = ['用户认证'];

export const authRoutes = app
    // 判断当前用户是否是管理员
    .get(
        '/is-admin',
        describeRoute({
            tags: userTags,
            summary: '判断是否是管理员',
            description: '判断当前用户是否是管理员',
            responses: {
                ...createSuccessResponse(authResponseSchema),
                ...createUnauthorizedErrorResponse(),
                ...createServerErrorResponse('判断管理员失败'),
            },
        }),
        async (c) => {
            try {
                const session = await getCurrentSession(c.req.raw);
                if (!session?.user) {
                    return c.json(false, 200, {
                        'Cache-Control': getCacheControl(),
                    });
                }
                // 通过用户ID查找关联的账户信息
                const account = await findAccoundByUserId(session.user.id);
                if (!account) {
                    return c.json(false, 200, {
                        'Cache-Control': getCacheControl(),
                    });
                }

                return c.json(account.accountId === process.env.ADMIN_GITHUB_ID, 200, {
                    'Cache-Control': getCacheControl(),
                });
            } catch (error) {
                return c.json(createErrorResult('判断管理员失败', error), 500);
            }
        },
    );
