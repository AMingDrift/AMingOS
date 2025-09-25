'use client';

import type { MouseEventHandler } from 'react';

import { DownloadIcon, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
import { cn } from '@/_components/shadcn/utils';

import type { listDoc } from '../../actions';

import { deleteDoc } from '../../actions';

const docTypeInfo = {
    video: {
        label: '视频',
    },
    picture: {
        label: '图片',
    },
};

const ItemActionCard = ({
    blobInfo,
    docType,
}: {
    blobInfo: Awaited<ReturnType<typeof listDoc>>[0];
    docType: keyof typeof docTypeInfo;
}) => {
    const router = useRouter();
    const pathname = usePathname();
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
                await deleteDoc(blobInfo.url, pathname);
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
        [blobInfo.url],
    );
    const openDialog: MouseEventHandler<SVGSVGElement> = useCallback((e) => {
        e.preventDefault();
        changeOpen(true);
    }, []);
    return (
        <div
            className={cn(
                'absolute right-0 bottom-0 left-0 h-20 translate-y-full bg-black/20 p-3 opacity-0 transition-all duration-300 ease-out dark:bg-black/50',
                'group-hover:translate-y-0 group-hover:opacity-100',
            )}
        >
            <div className="flex h-full w-full items-center justify-between">
                <div className="truncate text-xs text-white">
                    Size: {(blobInfo.size / 1024).toFixed(2)} KB
                </div>
                <div className="flex gap-4">
                    <AlertDialog open={open} onOpenChange={changeOpen}>
                        <AlertDialogTrigger asChild>
                            <Trash2
                                className="h-5 w-5! cursor-pointer text-red-400 transition-colors hover:text-red-500"
                                onClick={openDialog}
                            />
                        </AlertDialogTrigger>
                        <AlertDialogContent onEscapeKeyDown={(event) => event.preventDefault()}>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    是否确认删除该{docTypeInfo[docType].label}？
                                </AlertDialogTitle>
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
                        href={blobInfo.downloadUrl}
                        download={blobInfo.pathname}
                        className="text-white transition-colors hover:text-blue-300"
                        aria-label={`Download ${docType}`}
                    >
                        <DownloadIcon className="h-5 w-5!" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ItemActionCard;
