import { describeRoute } from 'hono-openapi';
import { validator } from 'hono-openapi/zod';

import { createHonoApp } from '../common/app';
import { createErrorResult, defaultValidatorErrorHandler } from '../common/error';
import {
    createServerErrorResponse,
    createSuccessResponse,
    createValidatorErrorResponse,
} from '../common/response';
import { docRequestQuerySchema, listBlobResultSchema } from './schema';
import { queryDocBlobByType } from './service';

export const docTags = ['对象存储操作'];

const app = createHonoApp();
export const docApi = app.get(
    '/',
    describeRoute({
        tags: docTags,
        summary: '对象存储查询',
        description: '对象存储查询',
        responses: {
            ...createSuccessResponse(listBlobResultSchema),
            ...createValidatorErrorResponse(),
            ...createServerErrorResponse('查询对象存储数据失败'),
        },
    }),
    validator('query', docRequestQuerySchema, defaultValidatorErrorHandler),
    async (c) => {
        try {
            const query = c.req.valid('query');
            const prefix = query.prefix ? query.prefix : '';
            const result = await queryDocBlobByType({ prefix });
            return c.json(result, 200);
        } catch (error) {
            return c.json(createErrorResult('查询对象存储数据失败', error), 500);
        }
    },
);
