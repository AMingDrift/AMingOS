import type { FC, PropsWithChildren } from 'react';

import { useRef } from 'react';
import { useShallow } from 'zustand/shallow';

import type { appType, ModalOptions } from '@/_components/modal/types';

import { ToolBar } from '../toolbar';
import { useModalStore } from './hooks';
const Modal: FC<
    PropsWithChildren & {
        app: ModalOptions['modalApp']['list'][appType];
        name: appType;
    }
> = ({ children, app, name }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const { front } = useModalStore(
        useShallow((state) => ({
            front: state.actions.front,
        })),
    );
    return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
            className="msfiles floatTab dpShad"
            ref={modalRef}
            data-size={app.size}
            data-max={app.max}
            data-hide={app.hide}
            style={{
                ...(app.size === 'cstm' ? app.dim : null),
                zIndex: app.z,
            }}
            onMouseDown={(e) => {
                e.stopPropagation();
                front(name);
            }}
        >
            <ToolBar name={name} app={app} parentRef={modalRef} />
            <div className="windowScreen flex flex-col">{children}</div>
        </div>
    );
};

export default Modal;
