'use client';

import { create } from 'zustand';

export interface DocOptions {
    docApp: {
        size: 'full' | 'mini' | 'cstm';
        hide: boolean;
        max: boolean | null;
        z: number;
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
}

export const useDocStore = create<DocOptions & DocActions>((set) => ({
    docApp: {
        // name: 'File Explorer',
        // icon: 'explorer',
        // type: 'app',
        // action: 'EXPLORER',
        size: 'full',
        hide: true,
        max: true,
        z: 1,
    },
    full: () =>
        set((state) => ({ docApp: { ...state.docApp, size: 'full', hide: false, max: true } })),
    hide: () =>
        set((state) => ({ docApp: { ...state.docApp, size: 'full', hide: false, max: false } })),
    // hide2: () => set((state) => ({ docApp: { ...state.docApp, hide: true, max: true } })),
    // full: () => set(() => ({ docApp: { size: 'full', hide: false, max: true } })),
    mxmz: () =>
        set((state) => {
            const size = (['mini', 'full'] as const)[state.docApp.size !== 'full' ? 1 : 0];
            return { docApp: { ...state.docApp, size, hide: false, max: true } };
        }),
    close: () =>
        set((state) => ({
            docApp: { ...state.docApp, hide: true, max: null },
        })),
    resize: (dimP) =>
        set((state) => ({
            docApp: { ...state.docApp, size: 'cstm', hide: false, max: true, dim: dimP },
        })),
}));
