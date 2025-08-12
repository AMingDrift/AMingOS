'use client';

import React from 'react';

import { SidebarProvider, SidebarTrigger } from '@/_components/shadcn/ui/sidebar';

import { AppSidebar } from './app-sidebar';
import { ToolBar } from './toolbar/toolbar';
const Explorer = ({ docApp, setDocApp }) => {
    return (
        <div
            className="msfiles floatTab dpShad"
            id={`ExplorerApp`}
            data-size={docApp.size}
            data-max={docApp.max}
            data-hide={docApp.hide}
            style={{
                ...(docApp.size === 'cstm' ? docApp.dim : null),
                zIndex: docApp.z,
            }}
        >
            <ToolBar name="Document" docApp={docApp} setDocApp={setDocApp} />
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
