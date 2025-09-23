import type { ListCommandOptions } from '@vercel/blob';

import type { DocApiType } from '@/server/doc/routes';

import { buildClient, fetchApi } from '@/libs/hono';
import { docPath } from '@/server/doc/routes';

export const docClient = buildClient<DocApiType>(docPath);

export const docApi = {
    list: async (options?: ListCommandOptions) =>
        fetchApi(docClient, async (c) =>
            c.index.$get({
                query: Object.fromEntries(
                    Object.entries(options ?? {}).map(([k, v]) => [k, String(v)]),
                ),
            }),
        ),
    delete: async (url: string) =>
        fetchApi(docClient, async (c) => c.index.$delete({ query: { url } })),
};
