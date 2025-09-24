'use client';
import type { Option } from 'artplayer';
import type { FC } from 'react';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import CloseIcon from '@ricons/material/CloseFilled';
import { useCallback } from 'react';

import { cn } from '@/_components/shadcn/utils';
import { deepMerge } from '@/libs/utils';

import {
    Dialog,
    DialogDescription,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
} from '../../shadcn/ui/dialog';
import { Player } from '../player';
import $styles from './video.module.css';
interface Props {
    className?: string;
    video: Omit<Option, 'container'>;
    open: boolean;
    setOpen: (open: boolean) => void;
}

export const VideoModal: FC<Props> = ({ className, video, open, setOpen }) => {
    const videoOption = deepMerge(video, { autoplay: true, muted: false }, 'replace');
    const close = useCallback(() => setOpen(false), []);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogHeader className="hidden">
                <DialogTitle></DialogTitle>
                <DialogDescription />
            </DialogHeader>
            <DialogPortal>
                <DialogOverlay className={$styles.overlay} />
                <DialogPrimitive.Content
                    aria-describedby={undefined}
                    className={cn($styles.content, className)}
                    // onEscapeKeyDown={(event) => event.preventDefault()}
                    onInteractOutside={(event) => event.preventDefault()}
                >
                    <div className="mb-2 flex w-full items-center justify-center">
                        <button type="button" className={$styles.closeBtn} onClick={close}>
                            <span className="xicon">
                                <CloseIcon />
                            </span>
                        </button>
                    </div>

                    <Player option={videoOption} />
                </DialogPrimitive.Content>
            </DialogPortal>
        </Dialog>
    );
};
