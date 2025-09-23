import React from 'react';

import { cn } from '@/_components/shadcn/utils';

const HoverInfo = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="absolute group h-full w-full">
            <div
                className={cn(
                    'absolute bottom-0 left-0 right-0 h-20 bg-black/20 dark:bg-black/50 opacity-0 translate-y-full transition-all duration-300 ease-out p-3',
                    'group-hover:opacity-100 group-hover:translate-y-0',
                )}
            >
                {children}
            </div>
        </div>
    );
};

export default HoverInfo;
