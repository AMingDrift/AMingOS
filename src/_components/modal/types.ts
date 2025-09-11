export type appType = 'doc' | 'blog' | 'about'; // 与路径名/doc,/blog对应

export interface AppItem {
    id: appType;
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
            [appName in appType]: AppItem;
        };
        hz: number;
        windowStack: AppItem[];
    };
}

export interface ModalActions {
    toggleWindow: (appName: appType) => void;
    full: (appName: appType) => void;
    hide: (appName: appType) => void;
    mxmz: (appName: appType) => void;
    close: (appName: appType) => void;
    resize: (appName: appType, dimP: AppItem['dim']) => void;
    front: (appName: appType) => void;
    setActivePath: (appName: appType, path: string) => void;
}
