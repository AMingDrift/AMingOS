'use client';
import type { FC, MouseEventHandler } from 'react';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import type { PostItem } from '@/server/post/type';

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
import { Button } from '@/_components/shadcn/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/_components/shadcn/ui/tooltip';
import { cn } from '@/_components/shadcn/utils';

import { deletePost } from '../../form/actions';
import { AdminChecker } from '@/_components/auth';
export const PostDelete: FC<{ item: PostItem; iconBtn?: boolean }> = ({ item, iconBtn }) => {
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
                await deletePost(item.id);
            } catch (error) {
                toast.warning('删除失败', {
                    id: 'post-delete-error',
                    description: (error as Error).message,
                });
            }
            setPedding(false);
            setOpen(false);

            // 1: 从blog list页删除
            // 删除文章后刷新页面
            // router.refresh();

            // 2. 在blog detail页删除
            // 删除文章后返回上一页
            router.replace('/blog');
        },
        [item.id],
    );
    const openDialog: MouseEventHandler<HTMLButtonElement> = useCallback((e) => {
        e.preventDefault();
        changeOpen(true);
    }, []);
    return (
        <AdminChecker>
            <AlertDialog open={open} onOpenChange={changeOpen}>
                <AlertDialogTrigger asChild>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild className="size-9!">
                                <Button
                                    className={cn('text-xs', {
                                        'mr-3': !iconBtn,
                                        'btn-icon-transparent': iconBtn,
                                    })}
                                    variant="secondary"
                                    size={iconBtn ? 'icon' : 'sm'}
                                    onClick={openDialog}
                                >
                                    {iconBtn ? (
                                        <span className="xicon text-2xl text-red-400">
                                            <Trash2 />
                                        </span>
                                    ) : (
                                        <Trash2 />
                                    )}
                                    {!iconBtn && ' 删除'}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>删除文章</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </AlertDialogTrigger>
                <AlertDialogContent onEscapeKeyDown={(event) => event.preventDefault()}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>是否确认删除该文章？</AlertDialogTitle>
                        <AlertDialogDescription>
                            当前不支持软删除，删除文章后将无法恢复
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
        </AdminChecker>
    );
};
