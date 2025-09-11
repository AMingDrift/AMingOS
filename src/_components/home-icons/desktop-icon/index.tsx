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
            className="w-16 text-center cursor-pointer hover:text-primary transition-colors duration-200 group"
            onClick={() => {
                toggleWindow(name);
            }}
        >
            <div className="size-14 mx-auto bg-primary/10 rounded-lg flex items-center justify-center mb-1 group-hover:bg-primary/20 transition-colors">
                {icon}
            </div>
            <div className="text-sm font-medium truncate">{app.title}</div>
        </div>
    );
};

export default DesktopIcon;
