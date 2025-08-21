import type { FC, PropsWithChildren, ReactNode } from 'react';

import { useRef } from 'react';

import type { ModalOptions } from '@/_components/modal/types';

import type { ModalAppStore } from './hooks';

import { ToolBar } from '../toolbar';
const Modal: FC<
    PropsWithChildren & {
        modalApp: ModalOptions['modalApp'];
        id: string;
        name: string;
        useModalAppStore: ModalAppStore;
    }
> = ({
    children,
    modalApp,
    id,
    name,
    useModalAppStore,
}: {
    children?: ReactNode;
    modalApp: ModalOptions['modalApp'];
    id: string;
    name: string;
    useModalAppStore: ModalAppStore;
}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    return (
        <div
            className="msfiles floatTab dpShad"
            id={id}
            ref={modalRef}
            data-size={modalApp.size}
            data-max={modalApp.max}
            data-hide={modalApp.hide}
            style={{
                ...(modalApp.size === 'cstm' ? modalApp.dim : null),
                zIndex: modalApp.z,
            }}
        >
            <ToolBar name={name} parentRef={modalRef} useModalAppStore={useModalAppStore} />
            <div className="windowScreen flex flex-col">{children}</div>
        </div>
    );
};

export default Modal;
