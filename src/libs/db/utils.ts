import type { PaginationResult } from 'prisma-paginate';

import { base, en, Faker, zh_CN } from '@faker-js/faker';
import { omit } from 'lodash';

import type { PaginateReturn } from './types';
/**
 * 创建faker实例
 */
export const faker = new Faker({
    locale: [zh_CN, en, base],
});

export const paginateTransform = <M, R extends PaginationResult<M[]>>(
    data: R,
): PaginateReturn<M> => {
    const { result } = data;
    return {
        items: result,
        meta: {
            itemCount: result.length,
            totalItems: data.count,
            perPage: data.limit,
            totalPages: data.totalPages,
            currentPage: data.page,
            ...omit(data, ['result', 'count', 'limit', 'page', 'totalPages']),
        },
    };
};
