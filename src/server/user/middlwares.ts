import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { isNil } from 'lodash';

import { auth } from '@/libs/auth';

import { createErrorResult } from '../common/error';
import { findAccoundByUserId } from './service';

export const AuthProtectedMiddleware = createMiddleware(async (c, next) => {
    let session: Awaited<ReturnType<typeof auth.api.getSession>> | null = null;
    try {
        session = await auth.api.getSession({ headers: c.req.raw.headers });
    } catch (error) {
        c.set('user', null);
        c.set('session', null);
        throw new HTTPException(500, {
            res: new Response(JSON.stringify(createErrorResult('服务器错误', error))),
        });
    }
    let isAdmin = false;
    if (session?.user.id) {
        const account = await findAccoundByUserId(session.user.id);
        if (account) {
            isAdmin = account.accountId === process.env.ADMIN_GITHUB_ID;
        }
    }
    if (isNil(session) || !isAdmin) {
        c.set('user', null);
        c.set('session', null);
        throw new HTTPException(401, {
            res: new Response(JSON.stringify(createErrorResult('非管理员用户，拒绝操作'))),
        });
    }

    c.set('user', session.user);
    c.set('session', session.session);
    await next();
});
