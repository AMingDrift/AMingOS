import { unstable_cache } from 'next/cache';
import React from 'react';

import { fetchApi } from '@/libs/api';
const videoBackground = async () => {
    const getBackgroundVideo = unstable_cache(
        async () => {
            const result = await fetchApi(async (c) =>
                c.api.doc.$get({
                    query: { prefix: 'video/xqtd.mp4' },
                    // query: { prefix: '' },
                }),
            );
            if (!result.ok) throw new Error((await result.json()).message);
            return (await result.json())?.[0]?.url;
        },
        ['bg-video-cache'],
        { revalidate: 60 * 60 * 24 },
    );

    const videoUrl = await getBackgroundVideo();

    return (
        <div className="absolute inset-0 z-[-1] overflow-hidden w-full h-full min-h-full">
            {videoUrl && (
                <video className="object-cover w-full h-full" autoPlay loop muted>
                    <source src={videoUrl} type="video/mp4" />
                </video>
            )}
        </div>
    );
};

export default videoBackground;
