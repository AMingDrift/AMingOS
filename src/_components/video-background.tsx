import React from 'react';

import { fetchApi } from '@/libs/api';

const videoBackground = async () => {
    const result = await fetchApi(async (c) =>
        c.api.doc.url.$get({
            query: { filename: 'video/xqtd.mp4' },
        }),
    );
    if (!result.ok) throw new Error((await result.json()).message);
    const url = await result.json();
    return (
        <div className="absolute inset-0 z-[-1] overflow-hidden w-full h-full min-h-full">
            <video className="object-cover w-full h-full" autoPlay loop muted>
                <source src={url} type="video/mp4" />
            </video>
        </div>
    );
};

export default videoBackground;
