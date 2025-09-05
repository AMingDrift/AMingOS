// src/app/actions/post.ts
'use server';

import type { Post } from '@prisma/client';

import db from '@/libs/db/client';

/**
 * 根据id或slug查询文章信息
 * @param arg
 */
export const queryPostItem = async (arg: string): Promise<Post | null> => {
    const item = await db.post.findFirst({
        where: {
            OR: [
                { id: arg },
                {
                    slug: arg,
                },
            ],
        },
    });
    return item;
};
