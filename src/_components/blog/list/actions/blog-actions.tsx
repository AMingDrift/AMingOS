'use server';

import { postApi } from '@/api/post';

export const getBlogResult = async (page: number, limit: number, tag?: string) => {
    'use cache';
    const result = await postApi.paginate({ page, limit, tag });
    if (!result.ok) throw new Error((await result.json()).message);
    return await result.json();
};
