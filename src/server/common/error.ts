import type { Context, Env } from 'hono';

import { Hono } from 'hono';
import { prettyJSON } from 'hono/pretty-json';
import { isNil, isObject } from 'lodash';
/**
 * 创建Hono应用
 */
export const createHonoApp = <E extends Env>() => {
    const app = new Hono<E>();
    app.use(prettyJSON());
    return app;
};

/**
 * 异常响应生成
 * @param title
 * @param error
 * @param code
 */
export const createErrorResult = (title: string, error?: any, code?: number) => {
    let message = title;
    if (!isNil(error)) {
        message =
            error instanceof Error || (isObject(error) && 'message' in error)
                ? `${title}:${error.message}`
                : `${title}:${error.toString()}`;
    }

    return {
        code,
        message,
    };
};

/**
 * 请求数据验证失败的默认响应
 * @param result
 * @param c
 */
export const defaultValidatorErrorHandler = (result: any, c: Context) => {
    if (!result.success) {
        return c.json(
            {
                ...createErrorResult('请求数据验证失败', 400),
                errors: result.error.format(),
            },
            400,
        );
    }
    return result;
};
