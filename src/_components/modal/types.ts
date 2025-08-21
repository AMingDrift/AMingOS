export interface ModalOptions {
    modalApp: {
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

export interface ModalActions {
    full: () => void;
    hide: () => void;
    mxmz: () => void;
    close: () => void;
    resize: (dimP: ModalOptions['modalApp']['dim']) => void;
    setPreMiniPath: (path: string) => void;
}
