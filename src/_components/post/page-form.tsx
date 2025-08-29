// src/app/_components/post/page-form.tsx
'use client';

import type { Post } from '@prisma/client';
import type { FC, MouseEventHandler } from 'react';

import { isNil } from 'lodash';
import { Save } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

import type { PostActionFormRef } from './types';

import { Button } from '../shadcn/ui/button';
import { PostActionForm } from './action-form';

/**
 * 对action-form的封装，直接用于文章创建和编辑页面
 * 通过判断post是否为null来决定是创建还是编辑
 * @param props
 */
export const PostPageForm: FC<{ post?: Post }> = ({ post }) => {
    const ref = useRef<PostActionFormRef | null>(null);
    const [pedding, setPedding] = useState(false);
    const changePadding = useCallback((value: boolean) => {
        setPedding(value);
    }, []);
    const savePost = useCallback<MouseEventHandler<HTMLButtonElement>>(async (e) => {
        e.preventDefault();
        ref.current?.save && (await ref.current?.save());
    }, []);
    return (
        <>
            <div className="flex justify-between">
                <Button className="ml-auto" onClick={savePost} disabled={pedding}>
                    {pedding ? '保存中...' : '保存'}
                    <Save />
                </Button>
            </div>
            {!isNil(post) ? (
                <PostActionForm ref={ref} type="update" setPedding={changePadding} item={post} />
            ) : (
                <PostActionForm ref={ref} type="create" setPedding={changePadding} />
            )}
        </>
    );
};
