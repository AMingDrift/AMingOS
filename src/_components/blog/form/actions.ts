'use server';
import { revalidatePath } from 'next/cache';

import type { DateToString } from '@/libs/types';
import type { PostItem } from '@/server/post/type';

import { postApi } from '@/api/post';

import type { PostFormData } from './types';

export const updateOrCreate = async (
    params: { type: 'create' } | { type: 'update'; id: string },
    data: PostFormData,
) => {
    let post: DateToString<PostItem> | null;
    if (params.type === 'update') {
        const res = await postApi.update(params.id, data);
        if (!res.ok) throw new Error((await res.json()).message);
        post = await res.json();
    } else {
        const res = await postApi.create(data);
        if (!res.ok) throw new Error((await res.json()).message);
        post = await res.json();
    }
    revalidatePath('/blog');
    return post;
};
