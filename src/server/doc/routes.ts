import type { HandleUploadBody } from '@vercel/blob/client';

import { handleUpload } from '@vercel/blob/client';
import { describeRoute } from 'hono-openapi';
import { validator } from 'hono-openapi/zod';
import z from 'zod';

import { createHonoApp } from '../common/app';
import { createErrorResult, defaultValidatorErrorHandler } from '../common/error';
import {
    createServerErrorResponse,
    createSuccessResponse,
    createValidatorErrorResponse,
} from '../common/response';
import {
    docDeleteByUrlRequestParamsSchema,
    docRequestQuerySchema,
    listBlobResultSchema,
} from './schema';
import { deleteDocBlobByUrl, queryDocBlobByType } from './service';
export const docTags = ['对象存储操作'];
export const docPath = '/doc';
export type DocApiType = typeof docRoutes;

const app = createHonoApp();
export const docRoutes = app
    .get(
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
                const options = Object.fromEntries(
                    Object.entries(query).map(([k, v]) => [
                        k,
                        ['limit'].includes(k) ? Number(v) : v,
                    ]),
                );
                const result = await queryDocBlobByType(options);
                console.log(`[${String(new Date())}]: 对象存储查询`);
                return c.json(result, 200);
            } catch (error) {
                return c.json(createErrorResult('查询对象存储数据失败', error), 500);
            }
        },
    )
    .post(
        '/upload',
        describeRoute({
            tags: docTags,
            summary: '对象存储上传',
            description: '对象存储上传',
            responses: {
                ...createSuccessResponse(listBlobResultSchema), // TODO: change
                ...createValidatorErrorResponse(),
                ...createServerErrorResponse('上传对象存储数据失败'),
            },
        }),
        // TODO: validate schema
        async (c) => {
            try {
                const request = c.req.raw;
                const body = (await c.req.json()) as HandleUploadBody;
                const jsonResponse = await handleUpload({
                    body,
                    request,
                    onBeforeGenerateToken: async (
                        pathname,
                        /* clientPayload */
                    ) => {
                        // Generate a client token for the browser to upload the file
                        // Make sure to authenticate and authorize users before generating the token.
                        // Otherwise, you're allowing anonymous uploads.

                        return {
                            allowedContentTypes: [
                                'image/jpeg',
                                'image/png',
                                'image/webp',
                                'video/mp4',
                                'video/webm',
                            ],
                            addRandomSuffix: true,
                        };
                    },
                    onUploadCompleted: async ({ blob, tokenPayload }) => {
                        // Called by Vercel API on client upload completion
                        // Use tools like ngrok if you want this to work locally

                        console.log('blob upload completed', blob, tokenPayload);

                        try {
                            // Run any logic after the file upload completed
                            // const { userId } = JSON.parse(tokenPayload);
                            // await db.update({ avatar: blob.url, userId });
                        } catch (error) {
                            throw new Error('Could not update user');
                        }
                    },
                });
                return c.json(jsonResponse, 200);
            } catch (error) {
                return c.json(createErrorResult('上传对象存储数据失败', error), 500);
            }
        },
    )
    .delete(
        '/',
        describeRoute({
            tags: docTags,
            summary: '对象存储删除',
            description: '对象存储删除',
            responses: {
                ...createSuccessResponse(z.object({}), '删除成功'), // TODO: change
                ...createValidatorErrorResponse(),
                ...createServerErrorResponse('删除对象存储数据失败'),
            },
        }),
        validator('query', docDeleteByUrlRequestParamsSchema, defaultValidatorErrorHandler),
        async (c) => {
            try {
                const { url } = c.req.valid('query');
                await deleteDocBlobByUrl(url);
                return c.json({}, 200);
            } catch (error) {
                return c.json(createErrorResult('删除对象存储数据失败', error), 500);
            }
        },
    );
