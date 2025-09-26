'use server';

import type { ListBlobResultBlob, ListCommandOptions } from '@vercel/blob';

import { del, list } from '@vercel/blob';

/**
 * 查询kodo指定类型文件列表
 * @param options
 */
export const queryStorageBlobByType = async (
    options?: ListCommandOptions,
): Promise<ListBlobResultBlob[]> => {
    let cursor: string | undefined;
    let hasMore = true;
    while (hasMore) {
        const res = await list({ ...options, cursor });
        cursor = res.cursor;
        hasMore = res.hasMore;
    }
    const { blobs } = await list(options);
    // console.log(blobs);
    return blobs.filter((item) => item.size > 0);
};

export const deleteStorageBlobByUrl = async (url: string): Promise<void> => {
    await del(url);
};
