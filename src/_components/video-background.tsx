'use client';

import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';

import { docApi } from '@/api/doc';

const VideoBackground = () => {
    const { resolvedTheme } = useTheme();
    const [videoUrl, setVideoUrl] = useState('');
    const getBackgroundVideo = async (prefix: string) => {
        const result = await docApi.list(prefix);
        if (!result.ok) throw new Error((await result.json()).message);
        return (await result.json())?.[0]?.url;
    };
    useEffect(() => {
        setVideoUrl('');
        const videoName = resolvedTheme === 'dark' ? 'xqtd.webm' : 'xl.webm';
        if (process.env.NEXT_PUBLIC_MOCK_BLOB === 'true') {
            const localUrl = `/test/${videoName}`;
            setVideoUrl(localUrl);
        } else {
            const prefix = `video/${videoName}`;
            getBackgroundVideo(prefix).then((url) => setVideoUrl(url));
        }
    }, [resolvedTheme]);

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
