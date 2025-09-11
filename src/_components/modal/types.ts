export type AppType = 'doc' | 'blog' | 'about'; // 与路径名/doc,/blog对应

export interface AppItem {
    id: AppType;
    title: string;
    size: 'full' | 'mini' | 'cstm';
    hide: boolean;
    max: boolean | null;
    z: number;
    activePath: string;
    dim?: {
        width: string;
        height: string;
        top: string;
        left: string;
    };
}

export interface ModalOptions {
    modalApp: {
        list: {
            [appName in AppType]: AppItem;
        };
        hz: number;
        windowStack: AppItem[];
    };
}

export interface ModalActions {
    toggleWindow: (appName: AppType) => void;
    home: () => void;
    full: (appName: AppType) => void;
    hide: (appName: AppType) => void;
    mxmz: (appName: AppType) => void;
    close: (appName: AppType) => void;
    resize: (appName: AppType, dimP: AppItem['dim']) => void;
    front: (appName: AppType) => void;
    setActivePath: (appName: AppType, path: string) => void;
}
