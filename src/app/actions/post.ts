'use server';

import { isNil } from 'lodash';
import { v4 } from 'uuid';

import type { IPost, PaginateOptions, PaginateReturn } from '@/database/types';

import { readDbFile, resetDbFile } from '@/database/generator';
import { paginate } from '@/database/utils';
import { getRandomInt } from '@/libs/random';

//...

/**
 * 查询分页文章列表信息
 * @param options
 */
export const queryPostPaginate = async (
    options?: PaginateOptions,
): Promise<PaginateReturn<IPost>> => {
    // 此处使用倒序,以便新增的文章可以排在最前面
    const posts = (await readDbFile()).reverse();
    return paginate(posts, { page: 1, limit: 8, ...options });
};

/**
 * 根据查询条件获取文章总页数
 * @param limit
 */
export const queryPostTotalPages = async (limit = 8): Promise<number> => {
    const data = await queryPostPaginate({ page: 1, limit });
    return data.meta.totalPages ?? 0;
};

/**
 * 根据ID查询文章信息
 * @param id
 */
export const queryPostItem = async (id: string): Promise<IPost | null> => {
    const posts = await readDbFile();
    const item = posts.find((post) => post.id === id);
    if (isNil(item)) throw new Error('post not exists!');
    return item;
};

/**
 * 根据ID查询文章信息
 * @param id
 */
export const queryPostItemById = async (id: string): Promise<IPost | null> => {
    const posts = await readDbFile();
    const item = posts.find((post) => post.id === id);
    if (isNil(item)) throw new Error('post not exists!');
    return item;
};

/**
 * 新增文章
 * @param data
 */
export const createPostItem = async (data: Omit<IPost, 'id'>): Promise<IPost> => {
    const posts = await readDbFile();
    const item: IPost = {
        ...data,
        id: v4(),
        thumb: `/uploads/thumb/post-${getRandomInt(1, 8)}.png`,
    };
    posts.push(item);
    await resetDbFile(posts);
    return item;
};

/**
 * 更新文章
 * @param id
 * @param data
 */
export const updatePostItem = async (
    id: string,
    data: Partial<Omit<IPost, 'id'>>,
): Promise<IPost | null> => {
    let posts = await readDbFile();
    const item = await queryPostItemById(id);
    if (isNil(item)) return null;
    const result = {
        ...(await queryPostItemById(id)),
        ...data,
    } as IPost;
    posts = posts.map((post) => (post.id === id ? result : post));
    await resetDbFile(posts);
    return result;
};

/**
 * 删除文章
 * @param id
 */
export const deletePostItem = async (id: string): Promise<IPost | null> => {
    let posts = await readDbFile();
    const item = await queryPostItemById(id);
    if (isNil(item)) return null;
    posts = posts.filter((post) => post.id !== id);
    await resetDbFile(posts);
    return item;
};
