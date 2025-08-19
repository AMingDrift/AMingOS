import { unstable_cache } from 'next/cache';
import React, { Suspense } from 'react';

import { BlurFade } from '@/_components/magicui/blur-fade';
import { Skeleton } from '@/_components/shadcn/ui/skeleton';
import { fetchApi } from '@/libs/api';
const PictureContainer = async () => {
    const getImages = unstable_cache(
        async () => {
            const result = await fetchApi(async (c) =>
                c.api.doc.$get({
                    query: { prefix: 'picture' },
                }),
            );
            if (!result.ok) throw new Error((await result.json()).message);
            return await result.json();
        },
        ['images-picture-cache'],
        { revalidate: 60 },
    );

    const images = await getImages();

    return (
        <div className="columns-2 gap-4 sm:columns-3">
            {images.map((imageUrl, idx) => (
                <BlurFade key={imageUrl.url} delay={0.25 + idx * 0.05} inView>
                    <img
                        key={imageUrl.url}
                        className="mb-4 size-full rounded-lg object-contain"
                        src={imageUrl.url}
                        alt={imageUrl.pathname}
                        width={600}
                        height={800}
                    />
                </BlurFade>
            ))}
        </div>
    );
};

const PicturePage = () => {
    return (
        <Suspense fallback={<Skeleton className="h-[400px] w-[33%] rounded-lg" />}>
            <PictureContainer />
        </Suspense>
    );
};

export default PicturePage;
