import { unstable_cache } from 'next/cache';
import Image from 'next/image';
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

    const videoUrl =
        process.env.NODE_ENV === 'development' ? '/test/xqtd.mp4' : await getBackgroundVideo();

    const imgUrl = '/xqtd.png';

    return (
        <div className="absolute inset-0 z-[-1] overflow-hidden w-full h-full min-h-full">
            <Image
                src={imgUrl}
                alt="xqtd.png"
                className="fixed top-0 left-0 object-cover h-full w-full z-[-2]"
                priority
                width={1920}
                height={1080}
            ></Image>
            {videoUrl && (
                <video
                    className="fixed top-0 left-0 object-cover w-full h-full z-[-1]"
                    autoPlay
                    loop
                    muted
                >
                    <source src={videoUrl} type="video/mp4" />
                </video>
            )}
        </div>
    );
};

export default videoBackground;
