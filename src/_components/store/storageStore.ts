import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface StorageItem {
    url: string;
    pathname: string;
    size: number;
    uploadedAt: string;
    downloadUrl: string;
    displayUrl: string;
    [key: string]: any;
}

interface StorageState {
    list: StorageItem[];
    setList: (list: StorageItem[]) => void;
}

export const useStorageStore = create<StorageState>()(
    immer((set) => ({
        list: [],
        setList: (list) =>
            set((state) => {
                state.list = list;
            }),
    })),
);
