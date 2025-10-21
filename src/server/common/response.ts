import type { ZodType } from 'zod';

import { resolver } from 'hono-openapi';

import { errorSchema } from './schema';

/**
 * 创建OpenAPI响应信息
 * @param description
 * @param schema
 */
export const createResponse = <T extends ZodType, S extends number>(
    schema: T,
    status: S,
    description: string,
) => {
    return {
        [status]: {
            description,
            content: { 'application/json': { schema: resolver(schema) } },
        },
    };
};

/**
 * 创建OpenAPI成功响应信息
 * @param description
 * @param schema
 */
export const createSuccessResponse = <T extends ZodType>(schema: T, description?: string) => {
    return createResponse(schema, 200, description ?? '请求成功');
};
/**
 * 创建OpenAPI 201 成功响应信息
 * @param description
 * @param schema
 */
export const create201SuccessResponse = <T extends ZodType>(schema: T, description?: string) => {
    return createResponse(schema, 201, description ?? '请求成功');
};

/**
 * 创建OpenAPI异常响应信息
 * @param description
 */
export const createErrorResponse = <S extends number>(description: string, status: S) => {
    return {
        [status]: {
            description,
            content: { 'application/json': { schema: resolver(errorSchema) } },
        },
    };
};

/**
 * 创建请求数据验证失败的响应信息
 * @param description
 */
export const createValidatorErrorResponse = (description?: string) => {
    return createErrorResponse(description ?? '请求数据验证失败', 400);
};

/**
 * 创建服务器错误响应信息
 * @param description
 */
export const createServerErrorResponse = (description?: string) => {
    return createErrorResponse(description ?? '服务器错误', 500);
};

/**
 * 创建数据不存在响应信息
 * @param description
 */
export const createNotFoundErrorResponse = (description?: string) => {
    return createErrorResponse(description ?? '数据不存在', 404);
};
