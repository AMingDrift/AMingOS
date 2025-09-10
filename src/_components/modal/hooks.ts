'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import type { appType, ModalActions, ModalOptions } from './types';

export const createModalStore = () =>
    create<ModalOptions & ModalActions>()(
        immer(
            devtools(
                (set) => ({
                    modalApp: {
                        list: {
                            doc: {
                                title: 'Document',
                                size: 'full',
                                hide: true,
                                max: true,
                                z: 1,
                                preMiniPath: '',
                            },
                            blog: {
                                title: 'Blog',
                                size: 'full',
                                hide: true,
                                max: true,
                                z: 1,
                                preMiniPath: '',
                            },
                            about: {
                                title: 'About',
                                size: 'full',
                                hide: true,
                                max: true,
                                z: 1,
                                preMiniPath: '',
                            },
                        },
                        hz: 2,
                    },
                    full: (appName: appType) =>
                        set((state) => {
                            const app = state.modalApp.list[appName];
                            app.size = 'full';
                            app.hide = false;
                            app.max = true;
                            state.modalApp.hz++;
                            app.z = state.modalApp.hz;
                        }),
                    hide: (appName: appType) =>
                        set((state) => {
                            const app = state.modalApp.list[appName];
                            app.size = 'full';
                            app.hide = false;
                            app.max = false;
                        }),
                    mxmz: (appName: appType) =>
                        set((state) => {
                            const app = state.modalApp.list[appName];
                            const size = (['mini', 'full'] as const)[app.size !== 'full' ? 1 : 0];
                            app.size = size;
                            app.hide = false;
                            app.max = true;
                            state.modalApp.hz++;
                            app.z = state.modalApp.hz;
                        }),
                    close: (appName: appType) =>
                        set((state) => {
                            const app = state.modalApp.list[appName];
                            app.hide = true;
                            app.max = null;
                            app.preMiniPath = '';
                            app.z = -1;
                            state.modalApp.hz--;
                        }),
                    resize: (appName: appType, dimP) =>
                        set((state) => {
                            const app = state.modalApp.list[appName];
                            app.size = 'cstm';
                            app.hide = false;
                            app.max = true;
                            app.dim = dimP;
                            if (app.z !== state.modalApp.hz) state.modalApp.hz++;
                            app.z = state.modalApp.hz;
                        }),
                    front: (appName: appType) =>
                        set((state) => {
                            const app = state.modalApp.list[appName];
                            if (app.z !== state.modalApp.hz) {
                                state.modalApp.hz++;
                                app.z = state.modalApp.hz;
                            }
                        }),
                    setPreMiniPath: (appName: appType, path: string) =>
                        set((state) => {
                            const app = state.modalApp.list[appName];
                            app.preMiniPath = path;
                        }),
                }),
                { name: 'modalStore' },
            ),
        ),
    );

export const useModalStore = createModalStore();

export type ModalAppStore = ReturnType<typeof createModalStore>;
