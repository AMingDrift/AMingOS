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

    useEffect(() => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            const isLandscape = img.naturalWidth > img.naturalHeight;
            setAspectRatio(isLandscape ? 'aspect-[4/3]' : 'aspect-[3/4]');
        };
    }, [src]);

    return (
        <img
            key={id}
            className={`w-full rounded-lg object-cover ${aspectRatio}`}
            src={src}
            alt={alt}
        />
    );
}
