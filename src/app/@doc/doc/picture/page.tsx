import React from 'react';

import { BlurFade } from '@/_components/magicui/blur-fade';
import { fetchApi } from '@/libs/api';
const PicturePage = async () => {
    let images: any[] = [];
    try {
        const result = await fetchApi(async (c) =>
            c.api.doc.$get({
                query: { prefix: 'picture' },
            }),
        );
        if (!result.ok) throw new Error((await result.json()).message);
        const res = await result.json();

        images = res;
        console.log(res);
    } catch {
        console.error('2222');
    }

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

export default PicturePage;
