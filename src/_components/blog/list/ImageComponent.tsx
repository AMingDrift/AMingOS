'use client';

import { useEffect, useState } from 'react';
import NextImage from 'next/image';

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
        <NextImage
            key={id}
            className={`w-full rounded-lg object-cover ${aspectRatio}`}
            width={800}
            height={400}
            style={{ width: '100%', height: 'auto' }}
            src={src}
            alt={alt}
        />
    );
}
