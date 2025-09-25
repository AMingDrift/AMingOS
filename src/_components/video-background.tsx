'use client';

import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';

import { docApi } from '@/api/doc';

const VideoBackground = () => {
    const { resolvedTheme } = useTheme();
    const [videoUrl, setVideoUrl] = useState('');
    const getBackgroundVideo = async (prefix: string) => {
        const result = await docApi.list({ prefix });
        if (!result.ok) throw new Error((await result.json()).message);
        return (await result.json())?.[0]?.url;
    };
    useEffect(() => {
        setVideoUrl('');
        const videoName = resolvedTheme === 'dark' ? 'xqtd.webm' : 'xl.webm';
        if (process.env.NEXT_PUBLIC_MOCK_BLOB === 'true') {
            const localUrl = `/test/video/${videoName}`;
            setVideoUrl(localUrl);
        } else {
            const prefix = `video/${videoName}`;
            getBackgroundVideo(prefix).then((url) => setVideoUrl(url));
        }
    }, [resolvedTheme]);

    return (
        <div className="absolute inset-0 h-full min-h-full w-full overflow-hidden">
            <div
                className="fixed top-0 left-0 h-full w-full bg-[url('/xl.png')] bg-cover bg-center object-cover dark:bg-[url('/xqtd.png')]"
                aria-hidden="true"
            />
            {videoUrl && (
                <video
                    key={videoUrl} // 添加key属性，当videoUrl改变时强制重新创建视频元素
                    className="fixed top-0 left-0 h-full w-full object-cover"
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
