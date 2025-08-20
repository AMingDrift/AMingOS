'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface DocOptions {
    docApp: {
        size: 'full' | 'mini' | 'cstm';
        hide: boolean;
        max: boolean | null;
        z: number;
        preMiniPath: string;
        dim?: {
            width: string;
            height: string;
            top: string;
            left: string;
        };
    };
}

export interface DocActions {
    full: () => void;
    hide: () => void;
    mxmz: () => void;
    close: () => void;
    resize: (dimP: DocOptions['docApp']['dim']) => void;
    setPreMiniPath: (path: string) => void;
}

export const createDocStore = () =>
    create<DocOptions & DocActions>()(
        immer(
            devtools(
                (set) => ({
                    docApp: {
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
                            state.docApp.size = 'full';
                            state.docApp.hide = false;
                            state.docApp.max = true;
                        }),
                    hide: () =>
                        set((state) => {
                            state.docApp.size = 'full';
                            state.docApp.hide = false;
                            state.docApp.max = false;
                        }),
                    mxmz: () =>
                        set((state) => {
                            const size = (['mini', 'full'] as const)[
                                state.docApp.size !== 'full' ? 1 : 0
                            ];
                            state.docApp.size = size;
                            state.docApp.hide = false;
                            state.docApp.max = true;
                        }),
                    close: () =>
                        set((state) => {
                            state.docApp.hide = true;
                            state.docApp.max = null;
                            state.docApp.preMiniPath = '';
                        }),
                    resize: (dimP) =>
                        set((state) => {
                            state.docApp.size = 'cstm';
                            state.docApp.hide = false;
                            state.docApp.max = true;
                            state.docApp.dim = dimP;
                        }),
                    setPreMiniPath: (path: string) =>
                        set((state) => {
                            state.docApp.preMiniPath = path;
                        }),
                }),
                { name: 'docStore' },
            ),
        ),
    );

export const useDocStore = createDocStore();
