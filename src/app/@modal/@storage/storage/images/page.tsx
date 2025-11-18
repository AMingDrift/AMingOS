'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Card3D from '@/_components/3D-card';
import ImageComponent from '@/_components/blog/list/ImageComponent';
import { BlurFade } from '@/_components/magicui/blur-fade';
import ItemActionCard from '../components/ItemActionCard';
import { BlogIndexSkeleton } from '@/_components/blog/skeleton';
import { useStorageStore } from '@/_components/store/storageStore';
import { classifyFileType } from '@/libs/utils';

export const dynamic = 'force-dynamic';

function PictureContent() {
    const storageList = useStorageStore((s) => s.list);
    const [images, setImages] = useState<typeof storageList>([]);
    useEffect(() => {
        const imgs = storageList.filter(
            (item) =>
                item.pathname.startsWith('images/') && classifyFileType(item.pathname) === 'image',
        );
        // 按上传时间倒序
        imgs.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
        setImages(imgs);
    }, [storageList]);

    return (
        <div className="mx-10 mt-7 columns-1 gap-10 md:columns-2 2xl:columns-3">
            {images.map((imageInfo, idx) => (
                <BlurFade
                    key={imageInfo.url}
                    delay={0.25 + idx * 0.05}
                    inView
                    className="mb-10 flex break-inside-avoid flex-col"
                >
                    <Card3D>
                        <div className="group relative flex transform flex-col overflow-hidden rounded-xl p-3 transition-all duration-300 ease-out select-none hover:scale-105 hover:shadow-(--card-shadow) hover:backdrop-blur-md">
                            <ImageComponent
                                key={imageInfo.url}
                                src={imageInfo.displayUrl}
                                alt={imageInfo.pathname}
                                id={imageInfo.url}
                            />
                            <ItemActionCard blobInfo={imageInfo} storageType="image" />
                        </div>
                    </Card3D>
                </BlurFade>
            ))}
        </div>
    );
}

const PicturePage = () => (
    <Suspense fallback={<BlogIndexSkeleton />}>
        <PictureContent />
    </Suspense>
);

export default PicturePage;
