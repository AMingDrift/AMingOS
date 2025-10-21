/* eslint-disable unused-imports/no-unused-vars */
import { swaggerUI } from '@hono/swagger-ui';
import { Scalar } from '@scalar/hono-api-reference';
import { openAPIRouteHandler } from 'hono-openapi';
import { prettyJSON } from 'hono/pretty-json';

import { categoryPath } from './category/constants';
import { categoryRoutes } from './category/routes';
import { createHonoApp } from './common/app';
import { postPath } from './post/constants';
import { postRoutes } from './post/routes';
import { storagePath } from './storage/constants';
import { storageRoutes } from './storage/routes';
import { tagPath, tagRoutes } from './tag/routes';
const app = createHonoApp().basePath('/api');
app.use(prettyJSON());
app.get('/', (c) => c.text('AmingOS Blog API'));
app.notFound((c) => c.json({ message: 'Not Found', ok: false }, 404));
const routes = app
    .route(tagPath, tagRoutes)
    .route(categoryPath, categoryRoutes)
    .route(postPath, postRoutes)
    .route(storagePath, storageRoutes);
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
