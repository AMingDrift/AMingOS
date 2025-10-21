import { describeRoute, validator as zValidator } from 'hono-openapi';
import { isNil } from 'lodash';
import z from 'zod';

import { createHonoApp } from '../common/app';
import { createErrorResult, defaultValidatorErrorHandler } from '../common/error';
import {
    create201SuccessResponse,
    createNotFoundErrorResponse,
    createServerErrorResponse,
    createSuccessResponse,
    createValidatorErrorResponse,
} from '../common/response';
import {
    getPostItemRequestSchema,
    postDetailByIdRequestParamsSchema,
    postDetailBySlugRequestParamsSchema,
    postDetailRequestParamsSchema,
    postPageNumbersRequestQuerySchema,
    postPageNumbersSchema,
    postPaginateRequestQuerySchema,
    postPaginateSchema,
    postSchema,
} from './schema';
import {
    createPostItem,
    deletePostItem,
    isSlugUnique,
    queryPostItem,
    queryPostItemById,
    queryPostItemBySlug,
    queryPostPaginate,
    queryPostTotalPages,
    updatePostItem,
} from './service';
export const postTags = ['文章操作'];

const app = createHonoApp();
export const postRoutes = app
    .get(
        '/',
        describeRoute({
            tags: postTags,
            summary: '文章分页查询',
            description: '文章分页查询',
            responses: {
                ...createSuccessResponse(postPaginateSchema),
                ...createValidatorErrorResponse(),
                ...createServerErrorResponse('查询文章分页数据失败'),
            },
        }),
        zValidator('query', postPaginateRequestQuerySchema, defaultValidatorErrorHandler),
        async (c) => {
            try {
                const query = c.req.valid('query');
                const options = Object.fromEntries(
                    Object.entries(query).map(([k, v]) => [
                        k,
                        ['page', 'limit'].includes(k) ? Number(v) : v,
                    ]),
                );
                const result = await queryPostPaginate(options);
                return c.json(result, 200);
            } catch (error) {
                return c.json(createErrorResult('查询文章分页数据失败', error), 500);
            }
        },
    )
    .get(
        '/page-numbers',
        describeRoute({
            tags: postTags,
            summary: '文章页面总数查询',
            description: '文章页面总数查询',
            responses: {
                ...createSuccessResponse(postPageNumbersSchema),
                ...createValidatorErrorResponse(),
                ...createServerErrorResponse('查询页面总数失败'),
            },
        }),
        zValidator('query', postPageNumbersRequestQuerySchema, defaultValidatorErrorHandler),
        async (c) => {
            try {
                const query = c.req.valid('query');
                const options = Object.fromEntries(
                    Object.entries(query).map(([k, v]) => [
                        k,
                        ['page', 'limit'].includes(k) ? Number(v) : v,
                    ]),
                );
                const result = await queryPostTotalPages(options);
                return c.json({ result }, 200);
            } catch (error) {
                return c.json(createErrorResult('查询页面总数失败', error), 500);
            }
        },
    )
    .get(
        '/:item',
        describeRoute({
            tags: postTags,
            summary: '文章详情查询',
            description: '可以传入文章id或者slug查询文章详情',
            responses: {
                ...createSuccessResponse(postSchema),
                ...createValidatorErrorResponse(),
                ...createNotFoundErrorResponse('文章不存在'),
                ...createServerErrorResponse('查询文章失败'),
            },
        }),
        zValidator('param', postDetailRequestParamsSchema, defaultValidatorErrorHandler),
        async (c) => {
            try {
                const { item } = c.req.valid('param');
                const result = await queryPostItem(item);
                if (!isNil(result)) return c.json(result, 200);
                return c.json(createErrorResult('文章不存在'), 404);
            } catch (error) {
                return c.json(createErrorResult('查询文章失败', error), 500);
            }
        },
    )
    .get(
        '/byid/:id',
        describeRoute({
            tags: postTags,
            summary: '通过ID查询文章详情',
            description: '通过ID查询文章详情',
            responses: {
                ...createSuccessResponse(postPaginateSchema),
                ...createValidatorErrorResponse(),
                ...createServerErrorResponse('查询文章分页数据失败'),
            },
        }),
        zValidator('param', postDetailByIdRequestParamsSchema, defaultValidatorErrorHandler),
        async (c) => {
            try {
                const { id } = c.req.valid('param');
                const result = await queryPostItemById(id);
                if (!isNil(result)) return c.json(result, 200);
                return c.json(createErrorResult('文章不存在'), 404);
            } catch (error) {
                return c.json(createErrorResult('查询文章失败', error), 500);
            }
        },
    )
    .get(
        '/byslug/:slug',
        describeRoute({
            tags: postTags,
            summary: '通过slug查询文章详情',
            description: '通过slug查询文章详情',
            responses: {
                ...createSuccessResponse(postPaginateSchema),
                ...createValidatorErrorResponse(),
                ...createServerErrorResponse('查询文章分页数据失败'),
            },
        }),
        zValidator('param', postDetailBySlugRequestParamsSchema, defaultValidatorErrorHandler),
        async (c) => {
            try {
                const { slug } = c.req.valid('param');
                const result = await queryPostItemBySlug(slug);
                return c.json(result, 200);
            } catch (error) {
                return c.json(createErrorResult('查询文章失败', error), 500);
            }
        },
    )
    .post(
        '/',
        describeRoute({
            tags: postTags,
            summary: '创建文章',
            description: '创建文章',
            responses: {
                ...create201SuccessResponse(postSchema.or(z.null())),
                ...createValidatorErrorResponse(),
                ...createServerErrorResponse('创建文章失败'),
            },
        }),
        zValidator('json', getPostItemRequestSchema(), defaultValidatorErrorHandler),
        async (c) => {
            try {
                const schema = getPostItemRequestSchema(await isSlugUnique());
                const validated = await schema.safeParseAsync(await c.req.json());

                if (!validated.success) {
                    return c.json(createErrorResult('请求数据验证失败', validated.error), 400);
                }

                const result = await createPostItem(validated.data);
                return c.json(result, 201);
            } catch (error) {
                return c.json(createErrorResult('创建文章失败', error), 500);
            }
        },
    )
    .patch(
        '/:id',
        describeRoute({
            tags: postTags,
            summary: '更新文章',
            description: '更新文章',
            responses: {
                ...createSuccessResponse(postSchema.or(z.null())),
                ...createValidatorErrorResponse(),
                ...createServerErrorResponse('更新文章失败'),
            },
        }),
        zValidator('param', postDetailByIdRequestParamsSchema, defaultValidatorErrorHandler),
        zValidator('json', getPostItemRequestSchema(), defaultValidatorErrorHandler),
        async (c) => {
            try {
                const params = c.req.valid('param');
                const schema = getPostItemRequestSchema(await isSlugUnique(params.id));
                const validated = await schema.safeParseAsync(await c.req.json());

                if (!validated.success) {
                    return c.json(createErrorResult('请求数据验证失败', validated.error), 400);
                }

                const result = await updatePostItem(params.id, validated.data);
                return c.json(result, 200);
            } catch (error) {
                return c.json(createErrorResult('更新文章失败', error), 500);
            }
        },
    )
    .delete(
        '/:id',
        describeRoute({
            tags: postTags,
            summary: '删除文章',
            description: '删除文章',
            responses: {
                ...createSuccessResponse(postSchema.or(z.null())),
                ...createValidatorErrorResponse(),
                ...createServerErrorResponse('删除文章失败'),
            },
        }),
        zValidator('param', postDetailByIdRequestParamsSchema, defaultValidatorErrorHandler),
        async (c) => {
            try {
                const { id } = c.req.valid('param');
                const result = await deletePostItem(id);
                return c.json(result, 200);
            } catch (error) {
                return c.json(createErrorResult('删除文章失败', error), 500);
            }
        },
    );
