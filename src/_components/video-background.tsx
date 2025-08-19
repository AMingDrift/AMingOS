import type { ListBlobResultBlob } from '@vercel/blob';

import React from 'react';

import type { DateToString } from '@/libs/types';

import { fetchApi } from '@/libs/api';
const videoBackground = async () => {
    let blob: DateToString<ListBlobResultBlob> | null = null;
    try {
        const result = await fetchApi(async (c) =>
            c.api.doc.$get({
                query: { prefix: 'video/xqtd.mp4' },
                // query: { prefix: '' },
            }),
        );
        if (!result.ok) throw new Error((await result.json()).message);
        blob = (await result.json())?.[0];

        console.log(blob);
    } catch {
        console.error('1111');
    }

    return (
        <div className="absolute inset-0 z-[-1] overflow-hidden w-full h-full min-h-full">
            {blob?.url && (
                <video className="object-cover w-full h-full" autoPlay loop muted>
                    <source src={blob.url} type="video/mp4" />
                </video>
            )}
        </div>
    );
};

export default videoBackground;
