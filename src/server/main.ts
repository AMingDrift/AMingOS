/* eslint-disable unused-imports/no-unused-vars */
import { prettyJSON } from 'hono/pretty-json';

import { createHonoApp } from './common/app';
import { postApi } from './doc/api';

const app = createHonoApp().basePath('/api');
app.use(prettyJSON());
app.get('/', (c) => c.text('3R Blog API'));
app.notFound((c) => c.json({ message: 'Not Found', ok: false }, 404));
const routes = app.route('/doc', postApi);
type AppType = typeof routes;
export { app, type AppType };
