import type { ReactNode } from 'react';

import React from 'react';

import { SidebarTrigger } from '@/_components/shadcn/ui/sidebar';

const Layout = ({ children, subtoolbar }: { children: ReactNode; subtoolbar?: ReactNode }) => {
    return (
        <>
            <div className="sticky top-0 flex h-(--height-modal-subtoolbar) flex-none items-center p-1">
                <SidebarTrigger />
                {/* subtoolbar menu */}
                {subtoolbar}
            </div>

            <div className="scrollbar-custom h-[calc(100%-var(--height-modal-subtoolbar))] w-full overflow-auto rounded-md pb-5">
                {children}
            </div>
        </>
    );
};

export default Layout;
