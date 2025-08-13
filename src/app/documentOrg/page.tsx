import React from 'react';

import { AppSidebar } from '@/_components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/_components/shadcn/ui/sidebar';

const Document = () => {
    return (
        <div className="windowScreen flex flex-col">
            <SidebarProvider defaultOpen={true}>
                <AppSidebar />
                <main>
                    <SidebarTrigger />
                    <>fff</>
                </main>
            </SidebarProvider>
        </div>
    );
};

export default Document;
