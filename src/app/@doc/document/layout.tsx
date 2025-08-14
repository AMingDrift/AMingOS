'use client';

import type { ReactNode } from 'react';

import React from 'react';

import { AppSidebar } from '@/_components/app-sidebar';
import Modal from '@/_components/modal';
import { SidebarProvider, SidebarTrigger } from '@/_components/shadcn/ui/sidebar';

const Page = ({ children }: { children?: ReactNode }) => {
    return (
        <Modal>
            <div className="windowScreen flex flex-col">
                <SidebarProvider defaultOpen={true}>
                    <AppSidebar />
                    <main>
                        <SidebarTrigger />
                        <div>{children}</div>
                    </main>
                </SidebarProvider>
            </div>
        </Modal>
    );
};

export default Page;
