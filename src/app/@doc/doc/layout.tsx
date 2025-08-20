'use client';

import type { ReactNode } from 'react';

import React from 'react';
import { useShallow } from 'zustand/shallow';

import { AppSidebar } from '@/_components/app-sidebar';
import Modal from '@/_components/modal';
import { ScrollArea } from '@/_components/shadcn/ui/scroll-area';
import { SidebarProvider, SidebarTrigger } from '@/_components/shadcn/ui/sidebar';
import { useDocStore } from '@/app/@doc/doc/hooks';

const Page = ({ children }: { children?: ReactNode }) => {
    const { docApp } = useDocStore(
        useShallow((state) => ({
            docApp: state.docApp,
        })),
    );

    return (
        <Modal docApp={docApp}>
            <div className="windowScreen flex flex-col">
                <SidebarProvider defaultOpen={true}>
                    <AppSidebar />
                    <main className="flex flex-col w-full">
                        <SidebarTrigger />
                        <ScrollArea className="h-[calc(100%-28px)] w-full rounded-md p-2">
                            {children}
                        </ScrollArea>
                    </main>
                </SidebarProvider>
            </div>
        </Modal>
    );
};

export default Page;
