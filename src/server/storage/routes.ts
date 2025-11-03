import type { HandleUploadBody } from '@vercel/blob/client';

import { handleUpload } from '@vercel/blob/client';
import { describeRoute, validator as zValidator } from 'hono-openapi';
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
import { deleteStorageBlobByUrl, queryStorageBlobByType } from './service';
import { AuthProtectedMiddleware } from '../user/middlwares';
import { mockStorageList } from './mock';
export const storageTags = ['对象存储操作'];

// 简单2秒内存缓存
let lastStorageQueryTime = 0;
let lastStorageQueryResult: Awaited<ReturnType<typeof queryStorageBlobByType>> | null = null;
let lastStorageQueryOptions: any = null;

const app = createHonoApp();
export const storageRoutes = app
    .get(
        '/',
        describeRoute({
            tags: storageTags,
            summary: '对象存储查询',
            description: '对象存储查询',
            responses: {
                ...createSuccessResponse(listBlobResultSchema),
                ...createValidatorErrorResponse(),
                ...createServerErrorResponse('查询对象存储数据失败'),
            },
        }),
        zValidator('query', docRequestQuerySchema, defaultValidatorErrorHandler),
        async (c) => {
            try {
                const query = c.req.valid('query');
                const options = Object.fromEntries(
                    Object.entries(query).map(([k, v]) => [
                        k,
                        ['limit'].includes(k) ? Number(v) : v,
                    ]),
                );
                const now = Date.now();
                // 只要options相同且2秒内，直接返回缓存
                if (
                    lastStorageQueryResult &&
                    lastStorageQueryOptions &&
                    JSON.stringify(options) === JSON.stringify(lastStorageQueryOptions) &&
                    now - lastStorageQueryTime < 2000
                ) {
                    return c.json(lastStorageQueryResult, 200);
                }
                const result =
                    process.env.NEXT_PUBLIC_MOCK_BLOB === 'true'
                        ? mockStorageList
                        : await queryStorageBlobByType(options);
                lastStorageQueryTime = now;
                lastStorageQueryResult = result;
                lastStorageQueryOptions = options;
                console.log(
                    `==============对象存储查询${process.env.NEXT_PUBLIC_MOCK_BLOB === 'true' ? '(MOCK)' : ''}============== `,
                );
                return c.json(result, 200);
            } catch (error) {
                return c.json(createErrorResult('查询对象存储数据失败', error), 500);
            }
        },
    )
    .post(
        '/upload',
        describeRoute({
            tags: storageTags,
            summary: '对象存储上传',
            description: '对象存储上传',
            responses: {
                ...createSuccessResponse(listBlobResultSchema), // TODO: change
                ...createValidatorErrorResponse(),
                ...createServerErrorResponse('上传对象存储数据失败'),
            },
        }),
        // TODO: validate schema
        AuthProtectedMiddleware,
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
            tags: storageTags,
            summary: '对象存储删除',
            description: '对象存储删除',
            responses: {
                ...createSuccessResponse(z.object({}), '删除成功'), // TODO: change
                ...createValidatorErrorResponse(),
                ...createServerErrorResponse('删除对象存储数据失败'),
            },
        }),
        zValidator('query', docDeleteByUrlRequestParamsSchema, defaultValidatorErrorHandler),
        AuthProtectedMiddleware,
        async (c) => {
            try {
                const { url } = c.req.valid('query');
                await deleteStorageBlobByUrl(url);
                return c.json({}, 200);
            } catch (error) {
                return c.json(createErrorResult('删除对象存储数据失败', error), 500);
            }
        },
    );
