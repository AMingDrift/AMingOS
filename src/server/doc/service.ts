'use server';

import type { ListBlobResultBlob } from '@vercel/blob';

import { list } from '@vercel/blob';

/**
 * 查询kodo指定类型文件列表
 * @param options
 */
export const queryKodoByType = async (options: {
    prefix: 'picture' | 'video';
}): Promise<ListBlobResultBlob[]> => {
    const { blobs } = await list({ prefix: options.prefix });
    console.log(blobs);
    return blobs.filter((item) => item.size > 0);
};
