import type { Hono } from 'hono';

import { hc } from 'hono/client';

import { appConfig } from '@/config/app';

/**
/**
 * 在服务端组件中创建hono api客户端
 */
export const buildClient = <T extends Hono<any, any, any>>(route?: string) =>
    hc<T>(`${appConfig.baseUrl}${appConfig.apiPath}${route}`, {});

/**
 * 在服务端组件中请求hono api
 * @param client
 * @param run
 */
export const fetchApi = async <
    T extends Hono<any, any, any>,
    F extends (c: C) => Promise<any>,
    C = ReturnType<typeof hc<T>>,
>(
    client: C,
    run: F,
): Promise<ReturnType<F>> => {
    const result = await run(client);
    return result;
};
