'use server';
import type { ListCommandOptions } from '@vercel/blob';

import { upload } from '@vercel/blob/client';
import { revalidatePath } from 'next/cache';

import { storageApi } from '@/api/storage';
import { appConfig } from '@/config/app';
import { storagePath } from '@/server/storage/constants';

export const listStorage = async (options?: ListCommandOptions) => {
    'use cache';
    const res = await storageApi.list(options);
    if (!res.ok) throw new Error((await res.json()).message);
    return await res.json();
};

export const uploadStorage = async (
    { prefix, file }: { prefix: string; file: File },
    pathname?: string,
) => {
    await upload(`${prefix}${file.name}`, file, {
        access: 'public',
        handleUploadUrl: `${appConfig.baseUrl}${appConfig.apiPath}${storagePath}/upload`,
    });
    if (pathname) revalidatePath(pathname);
};

export const deleteStorage = async (url: string, pathname?: string) => {
    const res = await storageApi.delete(url);
    if (!res.ok) throw new Error((await res.json()).message);
    if (pathname) revalidatePath(pathname);
};
