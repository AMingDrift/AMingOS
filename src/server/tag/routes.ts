import { describeRoute } from 'hono-openapi';
import { validator } from 'hono-openapi/zod';
import { isNil } from 'lodash';

import { createHonoApp } from '../common/app';
import { createErrorResult, defaultValidatorErrorHandler } from '../common/error';
import {
    createNotFoundErrorResponse,
    createServerErrorResponse,
    createSuccessResponse,
    createValidatorErrorResponse,
} from '../common/response';
import { tagItemRequestParamsSchema, tagListSchema, tagSchema } from './schema';
import { queryTagItem, queryTagList } from './service';

const app = createHonoApp();

export const tagTags = ['标签操作'];

export const tagPath = '/tags';

export type TagApiType = typeof tagRoutes;

export const tagRoutes = app
    .get(
        '/:item',
        describeRoute({
            tags: tagTags,
            summary: '标签详情查询',
            description: '查询单个标签的详细信息',
            responses: {
                ...createSuccessResponse(tagSchema),
                ...createValidatorErrorResponse(),
                ...createNotFoundErrorResponse('标签不存在'),
                ...createServerErrorResponse('查询标签数据数据失败'),
            },
        }),
        validator('param', tagItemRequestParamsSchema, defaultValidatorErrorHandler),
        async (c) => {
            try {
                const { item } = c.req.valid('param');
                const result = await queryTagItem(item);
                if (!isNil(result)) return c.json(result, 200);
                return c.json(createErrorResult('标签不存在'), 404);
            } catch (error) {
                return c.json(createErrorResult('查询标签数据失败', error), 500);
            }
        },
    )
    .get(
        '/',
        describeRoute({
            tags: tagTags,
            summary: '标签列表查询',
            description: '标签列表查询',
            responses: {
                ...createSuccessResponse(tagListSchema),
                ...createValidatorErrorResponse(),
                ...createServerErrorResponse('查询标签列表数据失败'),
            },
        }),
        async (c) => {
            try {
                const result = await queryTagList();
                return c.json(result, 200);
            } catch (error) {
                return c.json(createErrorResult('查询标签列表数据失败', error), 500);
            }
        },
    );
