'use client';

import type { ReactNode } from 'react';

import React from 'react';
import { useShallow } from 'zustand/shallow';

import type { AppType } from '@/_components/modal/types';

import { AppSidebar } from '@/_components/app-sidebar';
import Modal from '@/_components/modal';
import { useModalStore } from '@/_components/modal/hooks';
import { SidebarProvider } from '@/_components/shadcn/ui/sidebar';

import { MenuItems } from '../constant';

const ModalWrapper = ({
    children,
    routerName,
    calcRouteHighlight,
}: {
    children: ReactNode;
    routerName: AppType;
    calcRouteHighlight?: (originUrl: string) => boolean;
}) => {
    const { list } = useModalStore(
        useShallow((state) => ({
            list: state.modalApp.list,
        })),
    );
    return (
        <Modal app={list[routerName]} name={routerName}>
            <SidebarProvider defaultOpen={true}>
                <AppSidebar items={MenuItems[routerName]} calcRouteHighlight={calcRouteHighlight} />
                <main className="flex flex-col w-full h-full overflow-x-auto">{children}</main>
            </SidebarProvider>
        </Modal>
    );
};

export default ModalWrapper;
