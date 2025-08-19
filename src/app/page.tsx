/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
'use client';

import { Folders, NotebookPen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

const Desktop = () => {
    const router = useRouter();
    return (
        <div className="flex flex-col flex-wrap h-full justify-start gap-6 max-w-lg">
            <div
                id="computer-icon"
                className="w-16 text-center cursor-pointer hover:text-primary transition-colors duration-200 group"
                onClick={() => router.push('/doc')}
            >
                <div className="size-14 mx-auto bg-primary/10 rounded-lg flex items-center justify-center mb-1 group-hover:bg-primary/20 transition-colors">
                    <Folders />
                </div>
                <div className="text-sm font-medium truncate">Document</div>
            </div>
            <div
                id="blog-icon"
                className="w-16 text-center cursor-pointer hover:text-primary transition-colors duration-200 group"
                onClick={() => router.push('/doc')}
            >
                <div className="size-14 mx-auto bg-primary/10 rounded-lg flex items-center justify-center mb-1 group-hover:bg-primary/20 transition-colors">
                    <NotebookPen />
                </div>
                <div className="text-sm font-medium truncate">Blog</div>
            </div>
        </div>
    );
};

export default Desktop;
