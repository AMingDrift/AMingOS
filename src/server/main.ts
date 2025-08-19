/* eslint-disable unused-imports/no-unused-vars */
import { swaggerUI } from '@hono/swagger-ui';
import { Scalar } from '@scalar/hono-api-reference';
import { openAPISpecs } from 'hono-openapi';
import { prettyJSON } from 'hono/pretty-json';

import { createHonoApp } from './common/app';
import { docApi } from './doc/routes';

const app = createHonoApp().basePath('/api');
app.use(prettyJSON());
app.get('/', (c) => c.text('AmingOS Blog API'));
app.notFound((c) => c.json({ message: 'Not Found', ok: false }, 404));
const routes = app.route('/doc', docApi);
app.get(
    '/data',
    openAPISpecs(app, {
        documentation: {
            info: {
                version: 'v1',
                title: 'AMing OS',
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
