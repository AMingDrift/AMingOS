import type { ListCommandOptions } from '@vercel/blob';

import type { StorageApiType } from '@/server/storage/routes';

import { buildClient, fetchApi } from '@/libs/hono';
import { storagePath } from '@/server/storage/routes';

export const storageClient = buildClient<StorageApiType>(storagePath);

export const storageApi = {
    list: async (options?: ListCommandOptions) =>
        fetchApi(storageClient, async (c) =>
            c.index.$get({
                query: Object.fromEntries(
                    Object.entries(options ?? {}).map(([k, v]) => [k, String(v)]),
                ),
            }),
        ),
    delete: async (url: string) =>
        fetchApi(storageClient, async (c) => c.index.$delete({ query: { url } })),
};
