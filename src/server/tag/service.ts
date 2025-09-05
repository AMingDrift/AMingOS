'use server';

import db from '@/libs/db/client';
/**
 * 查询标签信息
 * @param item
 */
export const queryTagItem = async (item: string) => {
    return await db.tag.findFirst({
        where: { OR: [{ text: decodeURIComponent(item) }, { id: item }] },
    });
};

/**
 * 查询标签列表信息
 */
export const queryTagList = async () => {
    return await db.tag.findMany();
};
