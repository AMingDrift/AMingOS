'use client';

import { nextTick } from 'node:process';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { DefaultMenuUrl } from '@/app/@modal/constant';

import type { AppType, ModalActions, ModalOptions } from './types';

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
                        toggleWindow: (appName: AppType) => {
                            set((state) => {
                                const app = state.modalApp.list[appName];
                                const windowStack = state.modalApp.windowStack;
                                const { full, front, hide } = state.actions;
                                const existApp = windowStack.find((win) => win.id === app.id);
                                if (!existApp) {
                                    // 没有不在显示状态（不包括最小化），推入栈 => open
                                    // 设置DefaultMenuUrl
                                    if (app.hide) {
                                        // close 状态
                                        app.activePath = DefaultMenuUrl[appName];
                                    }
                                    nextTick(() => {
                                        full(appName);
                                    });
                                } else {
                                    const frontApp = windowStack.at(-1)!;
                                    if (existApp.id !== frontApp.id) {
                                        // 不是在栈顶，取出放入栈顶 => front
                                        nextTick(() => {
                                            front(appName);
                                        });
                                    } else {
                                        // 是在栈顶，最小化 => hide
                                        nextTick(() => {
                                            hide(appName);
                                        });
                                    }
                                }
                            });
                        },
                        home: () => {
                            const store = useModalStore.getState();
                            const appIds = store.modalApp.windowStack.map((app) => app.id);

                            set((state) => {
                                state.modalApp.windowStack = [];
                            });

                            // 在set外部调用hide，避免代理对象撤销问题
                            appIds.forEach((appId) => {
                                nextTick(() => {
                                    useModalStore.getState().actions.hide(appId);
                                });
                            });
                        },
                        full: (appName: AppType) =>
                            set((state) => {
                                const app = state.modalApp.list[appName];
                                app.size = 'full';
                                app.hide = false;
                                app.max = true;
                                state.modalApp.hz++;
                                app.z = state.modalApp.hz;

                                const windowStack = state.modalApp.windowStack;
                                windowStack.push(app);
                            }),
                        hide: (appName: AppType) =>
                            set((state) => {
                                const app = state.modalApp.list[appName];
                                app.size = 'full';
                                app.hide = false;
                                app.max = false;

                                const windowStack = state.modalApp.windowStack;
                                const index = windowStack.findIndex((win) => win.id === app.id);
                                windowStack.splice(index, 1);
                            }),
                        mxmz: (appName: AppType) =>
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
                        close: (appName: AppType) =>
                            set((state) => {
                                const app = state.modalApp.list[appName];
                                app.hide = true;
                                app.max = null;
                                app.activePath = '';
                                app.z = -1;
                                state.modalApp.hz--;

                                const windowStack = state.modalApp.windowStack;
                                const index = windowStack.findIndex((win) => win.id === app.id);
                                windowStack.splice(index, 1);
                            }),
                        resize: (appName: AppType, dimP) =>
                            set((state) => {
                                const app = state.modalApp.list[appName];
                                app.size = 'cstm';
                                app.hide = false;
                                app.max = true;
                                app.dim = dimP;
                                if (app.z !== state.modalApp.hz) state.modalApp.hz++;
                                app.z = state.modalApp.hz;
                            }),
                        front: (appName: AppType) =>
                            set((state) => {
                                const app = state.modalApp.list[appName];
                                if (app.z !== state.modalApp.hz) {
                                    state.modalApp.hz++;
                                    app.z = state.modalApp.hz;
                                }

                                const windowStack = state.modalApp.windowStack;
                                const index = windowStack.findIndex((win) => win.id === app.id);
                                windowStack.splice(index, 1);
                                windowStack.push(app);
                            }),
                        setActivePath: (appName: AppType, path: string) =>
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
