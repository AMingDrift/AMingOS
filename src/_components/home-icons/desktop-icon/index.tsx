'use client';
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { useShallow } from 'zustand/shallow';

import type { AppType } from '../../modal/types';

import { useModalStore } from '../../modal/hooks';

const DesktopIcon = ({ name, icon }: { name: AppType; icon: React.ReactNode }) => {
    const { app, toggleWindow } = useModalStore(
        useShallow((state) => ({
            app: state.modalApp.list[name],
            toggleWindow: state.actions.toggleWindow,
        })),
    );

    return (
        <div
            id="computer-icon"
            className="group w-16 cursor-pointer text-center transition-colors duration-200 hover:text-primary"
            onClick={() => {
                toggleWindow(name);
            }}
        >
            <div className="mx-auto mb-1 flex size-14 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                {icon}
            </div>
            <div className="truncate text-sm font-medium">{app.title}</div>
        </div>
    );
};

export default DesktopIcon;
