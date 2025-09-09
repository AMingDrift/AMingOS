'use client';

import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';

const VideoBackground = () => {
    const { theme } = useTheme();
    const [videoUrl, setVideoUrl] = useState('');

    // const getBackgroundVideo = unstable_cache(
    //     async () => {
    //         const result = await fetchApi(async (c) =>
    //             c.api.doc.$get({
    //                 query: { prefix: 'video/xqtd.mp4' },
    //                 // query: { prefix: '' },
    //             }),
    //         );
    //         if (!result.ok) throw new Error((await result.json()).message);
    //         return (await result.json())?.[0]?.url;
    //     },
    //     ['bg-video-cache'],
    //     { revalidate: 60 * 60 * 24 },
    // );

    // if (process.env.NODE_ENV === 'production') {
    //     videoUrl = await getBackgroundVideo();
    // }

    useEffect(() => {
        setVideoUrl(theme === 'dark' ? '/test/xqtd.webm' : '/test/xl.webm');
    }, [theme]);

    return (
        <div className="absolute inset-0 z-[-1] overflow-hidden w-full h-full min-h-full">
            <div
                className="fixed top-0 left-0 object-cover h-full w-full z-[-2] bg-[url('/xl.png')] dark:bg-[url('/xqtd.png')] bg-cover bg-center"
                aria-hidden="true"
            />
            {videoUrl && (
                <video
                    key={videoUrl} // 添加key属性，当videoUrl改变时强制重新创建视频元素
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

export default VideoBackground;
