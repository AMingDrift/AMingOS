'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import type { ModalActions, ModalOptions } from './types';

export const createDocStore = () =>
    create<ModalOptions & ModalActions>()(
        immer(
            devtools(
                (set) => ({
                    modalApp: {
                        // name: 'File Explorer',
                        // icon: 'explorer',
                        // type: 'app',
                        // action: 'EXPLORER',
                        size: 'full',
                        hide: true,
                        max: true,
                        z: 1,
                        preMiniPath: '',
                    },
                    full: () =>
                        set((state) => {
                            state.modalApp.size = 'full';
                            state.modalApp.hide = false;
                            state.modalApp.max = true;
                        }),
                    hide: () =>
                        set((state) => {
                            state.modalApp.size = 'full';
                            state.modalApp.hide = false;
                            state.modalApp.max = false;
                        }),
                    mxmz: () =>
                        set((state) => {
                            const size = (['mini', 'full'] as const)[
                                state.modalApp.size !== 'full' ? 1 : 0
                            ];
                            state.modalApp.size = size;
                            state.modalApp.hide = false;
                            state.modalApp.max = true;
                        }),
                    close: () =>
                        set((state) => {
                            state.modalApp.hide = true;
                            state.modalApp.max = null;
                            state.modalApp.preMiniPath = '';
                        }),
                    resize: (dimP) =>
                        set((state) => {
                            state.modalApp.size = 'cstm';
                            state.modalApp.hide = false;
                            state.modalApp.max = true;
                            state.modalApp.dim = dimP;
                        }),
                    setPreMiniPath: (path: string) =>
                        set((state) => {
                            state.modalApp.preMiniPath = path;
                        }),
                }),
                { name: 'docStore' },
            ),
        ),
    );

export const createBlogStore = () =>
    create<ModalOptions & ModalActions>()(
        immer(
            devtools(
                (set) => ({
                    modalApp: {
                        // name: 'File Explorer',
                        // icon: 'explorer',
                        // type: 'app',
                        // action: 'EXPLORER',
                        size: 'full',
                        hide: true,
                        max: true,
                        z: 1,
                        preMiniPath: '',
                    },
                    full: () =>
                        set((state) => {
                            state.modalApp.size = 'full';
                            state.modalApp.hide = false;
                            state.modalApp.max = true;
                        }),
                    hide: () =>
                        set((state) => {
                            state.modalApp.size = 'full';
                            state.modalApp.hide = false;
                            state.modalApp.max = false;
                        }),
                    mxmz: () =>
                        set((state) => {
                            const size = (['mini', 'full'] as const)[
                                state.modalApp.size !== 'full' ? 1 : 0
                            ];
                            state.modalApp.size = size;
                            state.modalApp.hide = false;
                            state.modalApp.max = true;
                        }),
                    close: () =>
                        set((state) => {
                            state.modalApp.hide = true;
                            state.modalApp.max = null;
                            state.modalApp.preMiniPath = '';
                        }),
                    resize: (dimP) =>
                        set((state) => {
                            state.modalApp.size = 'cstm';
                            state.modalApp.hide = false;
                            state.modalApp.max = true;
                            state.modalApp.dim = dimP;
                        }),
                    setPreMiniPath: (path: string) =>
                        set((state) => {
                            state.modalApp.preMiniPath = path;
                        }),
                }),
                { name: 'docStore' },
            ),
        ),
    );

export const useDocStore = createDocStore();
export const useBlogStore = createBlogStore();

export type ModalAppStore = ReturnType<typeof createDocStore>;
