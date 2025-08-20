import type { FC, PropsWithChildren, ReactNode } from 'react';

import type { DocOptions } from '@/app/@doc/doc/hooks';

import { ToolBar } from './toolbar';
const Modal: FC<PropsWithChildren & { docApp: DocOptions['docApp'] }> = ({
    children,
    docApp,
}: {
    children?: ReactNode;
    docApp: DocOptions['docApp'];
}) => {
    return (
        <div
            className="msfiles floatTab dpShad"
            id={`ExplorerApp`}
            data-size={docApp.size}
            data-max={docApp.max}
            data-hide={docApp.hide}
            style={{
                ...(docApp.size === 'cstm' ? docApp.dim : null),
                zIndex: docApp.z,
            }}
        >
            <ToolBar name="Document" />
            {children}
        </div>
    );
};

export default Modal;
