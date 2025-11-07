'use client';

import type { ReactNode } from 'react';

import React from 'react';

import type { AppType } from '@/_components/store/modalStore/types';

import { AppSidebar } from '@/_components/app-sidebar';
import Modal from '@/_components/modal';
import { SidebarProvider } from '@/_components/shadcn/ui/sidebar';

import { MenuItems } from '../constant';
import { useAdmin } from '@/_components/auth/hooks';

const ModalWrapper = ({
    children,
    routerName,
    calcRouteHighlight,
}: {
    children: ReactNode;
    routerName: AppType;
    calcRouteHighlight?: (originUrl: string) => boolean;
}) => {
    return (
        <Modal name={routerName}>
            <SidebarProvider defaultOpen={true}>
                <AppSidebar
                    items={(MenuItems[routerName] || []).filter((it) => {
                        // filter out admin-only items for non-admins
                        if ((it as any).adminOnly) {
                            return useAdmin();
                        }
                        return true;
                    })}
                    calcRouteHighlight={calcRouteHighlight}
                />
                <main className="flex h-full w-full flex-col overflow-x-auto">{children}</main>
            </SidebarProvider>
        </Modal>
    );
};

export default ModalWrapper;
