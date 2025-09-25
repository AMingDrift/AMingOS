import type { ReactNode } from 'react';

import React from 'react';

import { ScrollArea, ScrollBar } from '@/_components/shadcn/ui/scroll-area';
import { SidebarTrigger } from '@/_components/shadcn/ui/sidebar';

const Layout = ({ children, subtoolbar }: { children: ReactNode; subtoolbar?: ReactNode }) => {
    return (
        <>
            {/* TODO: 50px写入css变量中 */}
            <div className="flex h-[50px] flex-none items-center p-1">
                <SidebarTrigger />
                {/* subtoolbar menu */}
                {subtoolbar}
            </div>

            <ScrollArea className="h-[calc(100%-50px)] w-full rounded-md">
                {children}
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </>
    );
};

export default Layout;
