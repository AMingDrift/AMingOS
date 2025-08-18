'use client';

import type { ReactNode } from 'react';

import React, { Suspense } from 'react';

import { AppSidebar } from '@/_components/app-sidebar';
import Modal from '@/_components/modal';
import { ScrollArea } from '@/_components/shadcn/ui/scroll-area';
import { SidebarProvider, SidebarTrigger } from '@/_components/shadcn/ui/sidebar';

const Page = ({ children }: { children?: ReactNode }) => {
    return (
        <Modal>
            <div className="windowScreen flex flex-col">
                <SidebarProvider defaultOpen={true}>
                    <AppSidebar />
                    <main className="flex flex-col">
                        <SidebarTrigger />
                        <ScrollArea className="h-full w-full rounded-md p-2">
                            <Suspense fallback={<>Loading...</>}>{children}</Suspense>
                        </ScrollArea>
                    </main>
                </SidebarProvider>
            </div>
        </Modal>
    );
};

export default Page;
