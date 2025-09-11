'use client';

import { nextTick } from 'node:process';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import type { appType, ModalActions, ModalOptions } from './types';

/**
 * 创建modal store
 * hide: true, max: true | null     => 关闭
 * hide: false, max: true           => 打开
 * hide: false, max: false          => 最小化
 */
export const createModalStore = () =>
    create<ModalOptions & { actions: ModalActions }>()(
        immer(
            devtools(
                (set) => ({
                    modalApp: {
                        list: {
                            doc: {
                                id: 'doc',
                                title: 'Document',
                                size: 'full',
                                hide: true,
                                max: true,
                                z: 1,
                                activePath: '',
                            },
                            blog: {
                                id: 'blog',
                                title: 'Blog',
                                size: 'full',
                                hide: true,
                                max: true,
                                z: 1,
                                activePath: '',
                            },
                            about: {
                                id: 'about',
                                title: 'About',
                                size: 'full',
                                hide: true,
                                max: true,
                                z: 1,
                                activePath: '',
                            },
                        },
                        hz: 2,
                        windowStack: [],
                    },
                    actions: {
                        toggleWindow: (appName: appType) => {
                            set((state) => {
                                const app = state.modalApp.list[appName];
                                const windowStack = state.modalApp.windowStack;
                                const { full } = state.actions;
                                const existApp = windowStack.find((win) => win.id === app.id);
                                if (!existApp) {
                                    windowStack.push(app);
                                    nextTick(() => {
                                        full(appName);
                                    });
                                }
                            });
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
                                const size = (['mini', 'full'] as const)[
                                    app.size !== 'full' ? 1 : 0
                                ];
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
                                app.activePath = '';
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
                        setActivePath: (appName: appType, path: string) =>
                            set((state) => {
                                const app = state.modalApp.list[appName];
                                app.activePath = path;
                            }),
                    },
                }),
                { name: 'modalStore' },
            ),
        ),
    );

export const useModalStore = createModalStore();

export type ModalAppStore = ReturnType<typeof createModalStore>;
