export type appType = 'doc' | 'blog'; // 与路径名/doc,/blog对应

export interface ModalOptions {
    modalApp: {
        list: {
            [appName in appType]: {
                title: string;
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
        };
        hz: number;
    };
}

export interface ModalActions {
    full: (appName: appType) => void;
    hide: (appName: appType) => void;
    mxmz: (appName: appType) => void;
    close: (appName: appType) => void;
    resize: (appName: appType, dimP: ModalOptions['modalApp']['list'][appType]['dim']) => void;
    front: (appName: appType) => void;
    setPreMiniPath: (appName: appType, path: string) => void;
}
