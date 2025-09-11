'use client';

import type { ReactNode } from 'react';

import React from 'react';
import { useShallow } from 'zustand/shallow';

import type { appType } from '@/_components/modal/types';

import { AppSidebar } from '@/_components/app-sidebar';
import Modal from '@/_components/modal';
import { useModalStore } from '@/_components/modal/hooks';
import { ScrollArea, ScrollBar } from '@/_components/shadcn/ui/scroll-area';
import { SidebarProvider, SidebarTrigger } from '@/_components/shadcn/ui/sidebar';

import { MenuItems } from '../constant';

const ModalWrapper = ({ children, routerName }: { children: ReactNode; routerName: appType }) => {
    const { list } = useModalStore(
        useShallow((state) => ({
            list: state.modalApp.list,
        })),
    );
    return (
        <Modal app={list[routerName]} name={routerName}>
            <SidebarProvider defaultOpen={true}>
                <AppSidebar items={MenuItems[routerName]} />
                <main className="flex flex-col w-full overflow-x-auto">
                    <SidebarTrigger />
                    <ScrollArea className="h-[calc(100%-28px)] w-full rounded-md p-2">
                        {children}
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </main>
            </SidebarProvider>
        </Modal>
    );
};

export default ModalWrapper;
