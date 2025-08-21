'use client';

import type { ReactNode } from 'react';

import React from 'react';
import { useShallow } from 'zustand/shallow';

import { AppSidebar } from '@/_components/app-sidebar';
import Modal from '@/_components/modal';
import { useBlogStore } from '@/_components/modal/hooks';
import { ScrollArea } from '@/_components/shadcn/ui/scroll-area';
import { SidebarProvider, SidebarTrigger } from '@/_components/shadcn/ui/sidebar';

import { MenuItems } from '../constant';

const Page = ({ children }: { children?: ReactNode }) => {
    const { modalApp } = useBlogStore(
        useShallow((state) => ({
            modalApp: state.modalApp,
        })),
    );

    return (
        <Modal modalApp={modalApp} id="blogApp" name="Blog" useModalAppStore={useBlogStore}>
            <SidebarProvider defaultOpen={true}>
                <AppSidebar items={MenuItems} />
                <main className="flex flex-col w-full">
                    <SidebarTrigger />
                    <ScrollArea className="h-[calc(100%-28px)] w-full rounded-md p-2">
                        {children}
                    </ScrollArea>
                </main>
            </SidebarProvider>
        </Modal>
    );
};

export default Page;
