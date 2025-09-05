'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { isNil, trim } from 'lodash';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import type { DateToString } from '@/libs/types';
import type { PostItem } from '@/server/post/type';

import { postApi } from '@/api/post';
import { getDefaultFormValues } from '@/libs/form';
import { getPostItemRequestSchema } from '@/server/post/schema';

import type { PostFormData } from './types';

/**
 * slug唯一性验证函数
 * slug创建和编辑文章时，如果slug已经被占用且不是当前文章（编辑文章）的slug时，验证失败
 * 在编辑文章时，如果slug已被占用，但是当前编辑的文章的slug，则不报错
 * @param id
 */
export const isSlugUniqueForFrontend = (id?: string) => async (val?: string | null) => {
    if (isNil(val) || !val.length) return true;
    // const result = await fetchApi(async (c) =>
    //     c.api.posts.byslug[':slug'].$get({ param: { slug: val } }),
    // );
    const result = await postApi.detailBySlug(val);
    if (!result.ok) return false;
    const post = (await result.json()) as any;
    if (isNil(post) || post.id === id) return true;
    return false;
};

/**
 * 生成react-form-hooks表单的状态
 * 目前仅传入默认数据参数到useForm,后续我们会增加一些zod验证等其它参数
 * @param params
 */
export const usePostActionForm = (
    params: { type: 'create' } | { type: 'update'; item: PostItem },
) => {
    // 定义默认数据
    const defaultValues = useMemo(() => {
        const values = getDefaultFormValues<PostItem, PostFormData>(
            ['title', 'body', 'summary', 'slug', 'keywords', 'description'],
            params,
        );
        values.tags = params.type === 'update' && !isNil(params.item.tags) ? params.item.tags : [];
        values.categoryId =
            params.type === 'update' && !isNil(params.item.category) ? params.item.category.id : '';
        return values;
    }, [params.type]);
    return useForm<PostFormData>({
        mode: 'all',
        resolver: zodResolver(
            getPostItemRequestSchema(
                isSlugUniqueForFrontend(params.type === 'update' ? params.item.id : undefined),
            ),
        ),
        defaultValues,
    });
};

/**
 * 生成表单submit(提交)函数用于操作数据的钩子
 * @param params
 */
export const usePostFormSubmitHandler = (
    params: { type: 'create' } | { type: 'update'; id: string },
) => {
    const router = useRouter();

    return useCallback(
        async (data: PostFormData) => {
            let post: DateToString<PostItem> | null;
            for (const key of Object.keys(data) as Array<keyof PostFormData>) {
                const value = data[key];

                if (typeof value === 'string' && !trim(value, '')) {
                    delete data[key];
                }
            }
            try {
                // 更新文章
                if (params.type === 'update') {
                    const res = await postApi.update(params.id, data);
                    if (!res.ok) throw new Error((await res.json()).message);
                    post = await res.json();
                }
                // 创建文章
                else {
                    const res = await postApi.create(data);
                    if (!res.ok) throw new Error((await res.json()).message);
                    post = await res.json();
                }
                // 创建或更新文章后跳转到文章详情页
                // 注意,这里不要用push,防止在详情页后退后返回到创建或编辑页面的弹出框
                if (!isNil(post)) router.replace(`/blog/${post.slug || post.id}`);
            } catch (error) {
                toast.error('遇到服务器错误,请联系管理员处理', {
                    id: 'post-save-error',
                    description: (error as Error).message,
                });
            }
        },
        [{ ...params }],
    );
};
