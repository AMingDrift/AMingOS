/* eslint-disable react-hooks-extra/no-direct-set-state-in-use-effect */
'use client';
import type { FC } from 'react';

import clsx from 'clsx';
import { trim } from 'lodash';
import glob from 'micromatch';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/_components/shadcn/ui/dialog';

import type { PageModalProps } from './types';

import $styles from './page-modal.module.css';

export const PageModal: FC<PageModalProps> = ({ title, match, className, children }) => {
    const pathname = usePathname();
    const router = useRouter();
    const [show, setShow] = useState(false);
    useEffect(() => {
        setShow(
            glob.isMatch(
                trim(pathname, '/'),
                match.map((m) => trim(m, '/')),
            ),
        );
    }, [pathname, ...match]);
    const close = useCallback(() => router.back(), []);
    return show ? (
        <Dialog open defaultOpen onOpenChange={close}>
            <DialogContent
                className={clsx('sm:max-w-[80%]', className)}
                onEscapeKeyDown={(event) => event.preventDefault()}
                onInteractOutside={(event) => event.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription />
                </DialogHeader>
                <div className={$styles.modalContent}>{children}</div>
            </DialogContent>
        </Dialog>
    ) : null;
};
