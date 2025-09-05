//TODO: delete this file when hono support ssr fetch

import { hc } from 'hono/client';

import type { AppType } from '@/server/main';

import { appConfig } from '@/config/app';

/**
 * 在服务端组件中创建hono api客户端
 */
const honoApi = hc<AppType>(appConfig.baseUrl);

/**
 * 在服务端组件中请求hono api
 * @param run
 */
const fetchApi = async <F extends (c: ReturnType<typeof hc<AppType>>) => Promise<any>>(
    run: F,
): Promise<ReturnType<F>> => {
    const result = await run(honoApi);
    return result;
};

export { fetchApi, honoApi };
