// src/app/actions/post.ts
'use server';

import type { Post, Prisma } from '@prisma/client';

import { isNil } from 'lodash';

import type { PaginateOptions, PaginateReturn } from '@/libs/db/types';

import db from '@/libs/db/client';
import { paginateTransform } from '@/libs/db/utils';
import { getRandomInt } from '@/libs/random';

/**
 * 查询分页文章列表信息
 * @param options
 */
export const queryPostPaginate = async (
    options?: PaginateOptions,
): Promise<PaginateReturn<Post>> => {
    const data = await db.post.paginate({
        orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
        page: 1,
        limit: 15,
        ...options,
    });
    return paginateTransform(data);
};

/**
 * 根据查询条件获取文章总页数
 * @param limit
 */
export const queryPostTotalPages = async (limit = 15): Promise<number> => {
    const data = await queryPostPaginate({ page: 1, limit });
    return data.meta.totalPages ?? 0;
};

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

/**
 * 根据slug查询文章信息
 * @param slug
 */
export const queryPostItemBySlug = async (slug: string): Promise<Post | null> => {
    const item = await db.post.findUnique({ where: { slug } });
    return item;
};

/**
 * 根据ID查询文章信息
 * @param id
 */
export const queryPostItemById = async (id: string): Promise<Post | null> => {
    const item = await db.post.findUnique({ where: { id } });
    return item;
};

/**
 * 新增文章
 * @param data
 */
export const createPostItem = async (data: Prisma.PostCreateInput): Promise<Post> => {
    const item = await db.post.create({
        data: { ...data, thumb: `/uploads/thumb/post-${getRandomInt(1, 15)}.png` },
    });
    return item;
};

/**
 * 更新文章
 * @param id
 * @param data
 */
export const updatePostItem = async (
    id: string,
    data: Partial<Omit<Post, 'id'>>,
): Promise<Post> => {
    const item = await db.post.update({ where: { id }, data });
    return item;
};

/**
 * 删除文章
 * @param id
 */
export const deletePostItem = async (id: string): Promise<Post | null> => {
    const item = await db.post.findUnique({ where: { id } });
    if (!isNil(item)) {
        await db.post.delete({ where: { id } });
        return item;
    }
    return null;
};
