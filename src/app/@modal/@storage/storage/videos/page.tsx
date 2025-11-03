'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { BlurFade } from '@/_components/magicui/blur-fade';
import ItemActionCard from '../components/ItemActionCard';
import { HomeVideoCard } from './components/video';
import { StorageVideoSkeleton } from '@/_components/blog/skeleton';
import { useStorageStore } from '@/_components/store/storageStore';
import { classifyFileType } from '@/libs/utils';

export const dynamic = 'force-dynamic';

function VideoContent() {
    const storageList = useStorageStore((s) => s.list);
    const [videos, setVideos] = useState<typeof storageList>([]);
    useEffect(() => {
        const thumbExts = ['png', 'jpg'];
        const videos = storageList
            .filter((item) => classifyFileType(item.pathname) === 'video')
            .map((item) => {
                // 查找缩略图
                const fileNameWithoutExt = item.pathname.replace(/\.[^.]+$/, '');
                const thumb = storageList.find((f) =>
                    thumbExts.some((ext) => f.pathname === `${fileNameWithoutExt}.${ext}`),
                );
                return {
                    ...item,
                    thumb: `url(${thumb?.url || ''})`,
                };
            });
        setVideos(videos);
    }, [storageList]);

    return (
        <div className="mx-10 mt-7 columns-1 gap-10 md:columns-2">
            {videos.map((video, idx) => (
                <BlurFade
                    key={video.url}
                    delay={0.25 + idx * 0.05}
                    inView
                    className="mb-10 flex break-inside-avoid flex-col"
                >
                    <div className="group relative flex aspect-video transform flex-col overflow-hidden rounded-xl p-3 transition-all duration-300 ease-out select-none hover:scale-105 hover:shadow-(--card-shadow) hover:backdrop-blur-md">
                        <HomeVideoCard image={video?.thumb} video={video.url} />
                        <ItemActionCard blobInfo={video} storageType="video" />
                    </div>
                </BlurFade>
            ))}
        </div>
    );
}

const VideoPage = () => (
    <Suspense fallback={<StorageVideoSkeleton />}>
        <VideoContent />
    </Suspense>
);

export default VideoPage;
