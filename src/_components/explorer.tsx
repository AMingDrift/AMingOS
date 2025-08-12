import React from 'react';

import { SidebarProvider, SidebarTrigger } from '@/_components/shadcn/ui/sidebar';

import { AppSidebar } from './app-sidebar';
import { ToolBar } from './toolbar';
const Explorer = () => {
    return (
        <div className="msfiles floatTab dpShad" id={`ExplorerApp`} data-size="mini">
            <ToolBar app="EXPLORER" icon="explorer" name="File Explorer" size="full" />
            <div className="windowScreen flex flex-col">
                <SidebarProvider defaultOpen={true}>
                    <AppSidebar />
                    <main>
                        <SidebarTrigger />
                        <>fff</>
                    </main>
                </SidebarProvider>
            </div>
        </div>
    );
};

export default Explorer;
