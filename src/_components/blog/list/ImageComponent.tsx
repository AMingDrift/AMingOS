'use client';

import { useEffect, useState } from 'react';

import { checkRandomNumberParity } from '@/app/@modal/@blog/blog/utils/randomNumberChecker';

interface ImageComponentProps {
    src: string;
    alt: string;
    id: string;
}

export default function ImageComponent({ src, alt, id }: ImageComponentProps) {
    const [aspectRatio, setAspectRatio] = useState('aspect-[4/3]');

    let newSrc = src;

    if (process.env.NODE_ENV === 'production') {
        const { isEven } = checkRandomNumberParity();
        if (isEven) {
            newSrc = '/hengping.png';
        } else {
            newSrc = '/shuping.png';
        }
    } else {
        newSrc = src;
    }

    useEffect(() => {
        const img = new Image();
        img.src = newSrc;
        img.onload = () => {
            const isLandscape = img.naturalWidth > img.naturalHeight;
            setAspectRatio(isLandscape ? 'aspect-[4/3]' : 'aspect-[3/4]');
        };
    }, [newSrc]);

    return (
        <img
            key={id}
            className={`rounded-lg object-cover w-full ${aspectRatio}`}
            src={newSrc}
            alt={alt}
        />
    );
}
