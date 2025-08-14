import type { ReactNode } from 'react';

import React from 'react';

import { AppSidebar } from '@/_components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/_components/shadcn/ui/sidebar';

const Document = ({ children }: { children?: ReactNode }) => {
    return (
        <div className="windowScreen flex flex-col">
            <SidebarProvider defaultOpen={true}>
                <AppSidebar />
                <main>
                    <SidebarTrigger />
                    <div>{children}</div>
                </main>
            </SidebarProvider>
        </div>
    );
};

export default Document;
