import Image from 'next/image';
import React from 'react';

import { BlurFade } from '@/_components/magicui/blur-fade';
import { fetchApi } from '@/libs/api';
export const dynamic = 'force-dynamic';
const PicturePage = async () => {
    const result = await fetchApi(async (c) =>
        c.api.doc.$get({
            query: { type: 'image' },
        }),
    );
    if (!result.ok) throw new Error((await result.json()).message);
    const res = await result.json();

    const getImageUrl = async (filename: string) =>
        fetchApi(async (c) =>
            c.api.doc.url.$get({
                query: { filename },
            }),
        );

    const images = await Promise.all(
        res.map(async (item) => ({
            ...item,
            url: (await (await getImageUrl(item.key)).json()) as string,
        })),
    );

    return (
        <div className="columns-2 gap-4 sm:columns-3">
            {images.map((imageUrl, idx) => (
                <BlurFade key={imageUrl.key} delay={0.25 + idx * 0.05} inView>
                    <Image
                        className="mb-4 size-full rounded-lg object-contain"
                        src={imageUrl.url}
                        alt={`Random stock ${idx + 1}`}
                        width={600}
                        height={800}
                    />
                </BlurFade>
            ))}
        </div>
    );
};

export default PicturePage;
