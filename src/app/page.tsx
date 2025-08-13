'use client';

import { Folders } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

const Desktop = () => {
    const router = useRouter();
    return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div
            id="computer-icon"
            className="w-16 text-center cursor-pointer hover:text-primary transition-colors duration-200 group"
            onClick={() => router.push('/document')}
        >
            <div className="size-14 mx-auto bg-primary/10 rounded-lg flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
                <Folders />
            </div>
            <div className="text-sm font-medium truncate">Document</div>
        </div>
    );
};

export default Desktop;
