import { describeRoute } from 'hono-openapi';
import { validator as zValidator } from 'hono-openapi/zod';

import { createHonoApp } from '../common/app';
import { createErrorResult, defaultValidatorErrorHandler } from '../common/error';
import {
    createServerErrorResponse,
    createSuccessResponse,
    createValidatorErrorResponse,
} from '../common/response';
import {
    categoryBreadcrumbRequestParamsSchema,
    categoryListRequestParamsSchema,
    categoryListSchema,
    categoryTreeSchema,
} from './schema';
import { queryCategoryBreadcrumb, queryCategoryList, queryCategoryTree } from './service';

const app = createHonoApp();

export const categoryTags = ['分类操作'];

export const categoryPath = '/categories';

export type CategoryApiType = typeof categoryRoutes;

export const categoryRoutes = app
    .get(
        '/:parent?',
        describeRoute({
            tags: categoryTags,
            summary: '分类列表查询',
            description: '查询出分类树,并进行扁平化处理后的一维列表',
            responses: {
                ...createSuccessResponse(categoryListSchema),
                ...createValidatorErrorResponse(),
                ...createServerErrorResponse('查询分类列表数据失败'),
            },
        }),
        zValidator('param', categoryListRequestParamsSchema, defaultValidatorErrorHandler),
        async (c) => {
            try {
                const { parent } = c.req.valid('param');
                const result = await queryCategoryList(parent);

                return c.json(result, 200);
            } catch (error) {
                return c.json(createErrorResult('查询分类树数据失败', error), 500);
            }
        },
    )
    .get(
        '/tree/:parent?',
        describeRoute({
            tags: categoryTags,
            summary: '分类树查询',
            description: '树形嵌套结构的分类数据查询',
            responses: {
                ...createSuccessResponse(categoryTreeSchema),
                ...createValidatorErrorResponse(),
                ...createServerErrorResponse('查询分类树数据失败'),
            },
        }),
        zValidator('param', categoryListRequestParamsSchema, defaultValidatorErrorHandler),
        async (c) => {
            try {
                const { parent } = c.req.valid('param');
                const result = await queryCategoryTree(parent);
                return c.json(result, 200);
            } catch (error) {
                return c.json(createErrorResult('查询分类列表(扁平树)数据失败', error), 500);
            }
        },
    )
    .get(
        '/breadcrumb/:latest',
        describeRoute({
            tags: categoryTags,
            summary: '分类面包屑查询',
            description: '通过一个父分类,查询出其祖先分类并组成一个一维分类列表',
            responses: {
                ...createSuccessResponse(categoryListSchema),
                ...createValidatorErrorResponse(),
                ...createServerErrorResponse('查询分类面包屑数据失败'),
            },
        }),
        zValidator('param', categoryBreadcrumbRequestParamsSchema, defaultValidatorErrorHandler),
        async (c) => {
            try {
                const { latest } = c.req.valid('param');
                const result = await queryCategoryBreadcrumb(latest);
                return c.json(result, 200);
            } catch (error) {
                return c.json(createErrorResult('查询分类面包屑数据失败', error), 500);
            }
        },
    );
