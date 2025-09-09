'use client';

import { useTheme } from 'next-themes';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const VideoBackground = () => {
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

    const { theme, setTheme } = useTheme();
    const [videoUrl, setVideoUrl] = useState('');
    // if (process.env.NODE_ENV === 'production') {
    //     videoUrl = await getBackgroundVideo();
    // }

    // const imgUrl = '/xqtd.png';
    const [imgUrl, setImgUrl] = useState<string | null>(null);

    useEffect(() => {
        setVideoUrl(theme === 'dark' ? '/test/xqtd.mp4' : '/test/xl.mp4');
        setImgUrl(theme === 'dark' ? '/xqtd.png' : '/xl.png');
    }, [theme]);

    return (
        <div className="absolute inset-0 z-[-1] overflow-hidden w-full h-full min-h-full">
            {imgUrl && (
                <Image
                    src={imgUrl}
                    alt="xqtd.png"
                    className="fixed top-0 left-0 object-cover h-full w-full z-[-2]"
                    priority
                    width={1920}
                    height={1080}
                ></Image>
            )}
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
