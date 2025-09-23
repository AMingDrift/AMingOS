'use client';

import type { MouseEventHandler } from 'react';

import { DownloadIcon, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useCallback, useState } from 'react';
import { toast } from 'sonner';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/_components/shadcn/ui/alert-dialog';

import type { listDoc } from '../../../actions';

import { deleteDoc } from '../../../actions';
import HoverInfo from './hover-info';

const PictureInfo = ({ imageUrl }: { imageUrl: Awaited<ReturnType<typeof listDoc>>[0] }) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [pedding, setPedding] = useState(false);

    const changeOpen = useCallback((value: boolean) => {
        setOpen(value);
    }, []);

    const close: MouseEventHandler<HTMLButtonElement> = useCallback((e) => {
        e.preventDefault();
        if (!pedding) setOpen(false);
    }, []);

    const deleteItem: MouseEventHandler<HTMLButtonElement> = useCallback(
        async (e) => {
            e.preventDefault();
            setPedding(true);

            try {
                await deleteDoc(imageUrl.url);
                toast.success('删除成功');
            } catch (error) {
                toast.warning('删除失败', {
                    id: 'picture-delete-error',
                    description: (error as Error).message,
                });
            } finally {
                setPedding(false);
                setOpen(false);
            }
            router.refresh();
        },
        [imageUrl.url],
    );
    const openDialog: MouseEventHandler<SVGSVGElement> = useCallback((e) => {
        e.preventDefault();
        changeOpen(true);
    }, []);
    return (
        <HoverInfo>
            <div className="h-full w-full flex items-center justify-between">
                <div className="text-white text-xs truncate">
                    Size: {(imageUrl.size / 1024).toFixed(2)} KB
                </div>
                <div className="flex gap-4">
                    <AlertDialog open={open} onOpenChange={changeOpen}>
                        <AlertDialogTrigger asChild>
                            <Trash2
                                className="w-5! h-5 transition-colors text-red-400 hover:text-red-500 cursor-pointer"
                                onClick={openDialog}
                            />
                        </AlertDialogTrigger>
                        <AlertDialogContent onEscapeKeyDown={(event) => event.preventDefault()}>
                            <AlertDialogHeader>
                                <AlertDialogTitle>是否确认删除该图片？</AlertDialogTitle>
                                <AlertDialogDescription>
                                    当前不支持软删除，删除后将无法恢复
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel disabled={pedding} onClick={close}>
                                    取消
                                </AlertDialogCancel>
                                <AlertDialogAction onClick={deleteItem} disabled={pedding}>
                                    {pedding ? '删除中' : '确认'}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <Link
                        href={imageUrl.downloadUrl}
                        download={imageUrl.pathname}
                        className="text-white hover:text-blue-300 transition-colors"
                        aria-label="Download image"
                    >
                        <DownloadIcon className="w-5! h-5" />
                    </Link>
                </div>
            </div>
        </HoverInfo>
    );
};

export default PictureInfo;
