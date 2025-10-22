import type { Hono } from 'hono';

import { hc } from 'hono/client';

import { appConfig } from '@/config/app';

/**
 * Headers provider type for hc client
 */
export type HeadersProvider =
    | Record<string, string>
    | (() => Record<string, string> | Promise<Record<string, string>>);

/**
 * 在服务端组件中创建hono api客户端
 * @param route - api route path
 * @param headers - optional headers or headers provider to pass to hc client
 */
export const buildClient = <T extends Hono<any, any, any>>(
    route?: string,
    headers?: HeadersProvider,
) => hc<T>(`${appConfig.baseUrl}${appConfig.apiPath}${route}`, { headers });

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
