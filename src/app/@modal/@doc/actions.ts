'use server';
import type { ListCommandOptions } from '@vercel/blob';

import { upload } from '@vercel/blob/client';
import { revalidatePath } from 'next/cache';

import { docApi } from '@/api/doc';
import { appConfig } from '@/config/app';
import { docPath } from '@/server/doc/routes';

export const listDoc = async (options?: ListCommandOptions) => {
    'use cache';
    const res = await docApi.list(options);
    if (!res.ok) throw new Error((await res.json()).message);
    return await res.json();
};

export const uploadDoc = async (
    { prefix, file }: { prefix: string; file: File },
    pathname?: string,
) => {
    await upload(`${prefix}${file.name}`, file, {
        access: 'public',
        handleUploadUrl: `${appConfig.baseUrl}${appConfig.apiPath}${docPath}/upload`,
    });
    if (pathname) revalidatePath(pathname);
};

export const deleteDoc = async (url: string, pathname?: string) => {
    const res = await docApi.delete(url);
    if (!res.ok) throw new Error((await res.json()).message);
    if (pathname) revalidatePath(pathname);
};
