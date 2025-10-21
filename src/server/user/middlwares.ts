import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { isNil } from 'lodash';

import { auth } from '@/libs/auth';

import { createErrorResult } from '../common/error';

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
    if (isNil(session?.user)) {
        c.set('user', null);
        c.set('session', null);
        throw new HTTPException(401, {
            res: new Response(JSON.stringify(createErrorResult('用户未认证'))),
        });
    }

    c.set('user', session.user);
    c.set('session', session.session);
    await next();
});
