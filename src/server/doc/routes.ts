import { createHonoApp } from '../common/app';
import { createErrorResult } from '../common/error';
import { getPrivateDownloadUrl, queryKodoByType } from './service';

// ...
const app = createHonoApp();
export const docApi = app
    .get('/', async (c) => {
        try {
            const query = c.req.query();
            const result = await queryKodoByType(query as any);
            return c.json(result, 200);
        } catch (error) {
            return c.json(createErrorResult('查询文章分页数据失败', error), 500);
        }
    })
    .get('/url', async (c) => {
        try {
            const query = c.req.query();
            const result = await getPrivateDownloadUrl(query as any);
            return c.json(result, 200);
        } catch (error) {
            return c.json(createErrorResult('查询文章分页数据失败', error), 500);
        }
    });
