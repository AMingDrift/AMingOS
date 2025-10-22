'use server';
import { revalidatePath } from 'next/cache';

import type { DateToString } from '@/libs/types';
import type { PostItem } from '@/server/post/type';

import { postApi } from '@/api/post';
import { getCookieHeader } from '@/libs/serverFetch';

import type { PostFormData } from './types';

export const updateOrCreate = async (
    params: { type: 'create' } | { type: 'update'; id: string },
    data: PostFormData,
) => {
    let post: DateToString<PostItem> | null;
    if (params.type === 'update') {
        // forward client cookies from Next request context so backend can validate session
        const cookieHeader = await getCookieHeader();
        const res = await postApi.update(params.id, data, { headers: cookieHeader });
        if (!res.ok) throw new Error((await res.json()).message);
        post = await res.json();
    } else {
        const cookieHeader = await getCookieHeader();
        const res = await postApi.create(data, { headers: cookieHeader });
        if (!res.ok) throw new Error((await res.json()).message);
        post = await res.json();
    }
    // TODO: revalidatePath('/blog/[[...categories]]', 'layout'); is invalid
    revalidatePath('/', 'layout');
    return post;
};

export const deletePost = async (id: string) => {
    const cookieHeader = await getCookieHeader();
    const res = await postApi.delete(id, { headers: cookieHeader });
    if (!res.ok) throw new Error((await res.json()).message);
    revalidatePath('/', 'layout');
    return await res.json();
};
