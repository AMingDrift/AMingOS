/* eslint-disable unused-imports/no-unused-vars */
import { swaggerUI } from '@hono/swagger-ui';
import { Scalar } from '@scalar/hono-api-reference';
import { openAPIRouteHandler } from 'hono-openapi';
import { cors } from 'hono/cors';
import { prettyJSON } from 'hono/pretty-json';

import { categoryPath } from './category/constants';
import { categoryRoutes } from './category/routes';
import { createHonoApp } from './common/app';
import { postPath } from './post/constants';
import { postRoutes } from './post/routes';
import { storagePath } from './storage/constants';
import { storageRoutes } from './storage/routes';
import { tagPath, tagRoutes } from './tag/routes';
import { authPath } from './user/constants';
import { authRoutes } from './user/routes/auth';
import { auth } from '@/libs/auth';
const app = createHonoApp().basePath('/api');
app.use(prettyJSON());
app.get('/', (c) => c.text('AmingOS Blog API'));
app.notFound((c) => c.json({ message: 'Not Found', ok: false }));

const routes = app
    .use(
        '*',
        cors({
            origin: [
                process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001',
                'http://192.168.2.20:3001',
            ],
            allowHeaders: ['Content-Type', 'Authorization'],
            allowMethods: ['POST', 'GET', 'OPTIONS'],
            exposeHeaders: ['Content-Length'],
            maxAge: 600,
            credentials: true,
        }),
    )
    .route(tagPath, tagRoutes)
    .route(categoryPath, categoryRoutes)
    .route(postPath, postRoutes)
    .route(storagePath, storageRoutes)
    .route(authPath, authRoutes);

const VERCEL_BLOB_URL = process.env.VERCEL_BLOB_URL;
app.get('/:type{images|videos}/:path{.*}', async (c) => {
    const type = c.req.param('type');
    const path = c.req.param('path');
    const originalUrl = `${VERCEL_BLOB_URL}/${type}/${path}`;

    // 转发客户端的 Range 请求头（如果有）
    const rangeHeader = c.req.header('Range');

    const res = await fetch(originalUrl, {
        headers: rangeHeader ? { Range: rangeHeader } : {},
    });

    if (!res.ok) {
        if (res.status === 404) return c.notFound();
        return c.text('Internal error', 500);
    }

    // 透传关键响应头
    const headers: Record<string, string> = {};
    for (const [key, value] of res.headers.entries()) {
        // 只透传安全的头，避免安全问题
        if (
            [
                'content-type',
                'content-length',
                'accept-ranges',
                'content-range',
                'cache-control',
            ].includes(key.toLowerCase())
        ) {
            headers[key] = value;
        }
    }

    // 强制缓存（可选）
    headers['Cache-Control'] = 'public, max-age=86400, immutable';
    headers['Access-Control-Allow-Origin'] = '*'; // 支持跨域播放

    // 返回流式响应，状态码可能是 200 或 206
    return new Response(res.body, {
        status: res.status,
        statusText: res.statusText,
        headers,
    });
});

app.get('/region', (c) => {
    return c.text(`Deployed in: ${process.env.VERCEL_REGION || 'unknown'}`);
});

app.on(['POST', 'GET'], '/auth/*', (c) => {
    return auth.handler(c.req.raw);
});

app.get(
    '/data',
    openAPIRouteHandler(app, {
        documentation: {
            info: {
                version: 'v1',
                title: 'AMing OS API',
                description: 'AMing OS的后端API',
            },
        },
    }),
);

app.get('/swagger', swaggerUI({ url: '/api/data' }));

app.get(
    '/docs',
    Scalar({
        theme: 'saturn',
        url: '/api/data',
    }),
);
type AppType = typeof routes;
export { app, type AppType };
