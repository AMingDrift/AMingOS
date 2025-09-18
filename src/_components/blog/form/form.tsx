/* eslint-disable react-hooks-extra/prefer-use-state-lazy-initialization */
'use client';

import type { ChangeEventHandler, MouseEventHandler } from 'react';

import { isNil, trim } from 'lodash';
import Link from 'next/link';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { useDeepCompareEffect } from 'react-use';
import { toast } from 'sonner';

import type { CategoryItem } from '@/server/category/type';
import type { TagItem } from '@/server/tag/type';

import { categoryApi } from '@/api/category';
import { tagApi } from '@/api/tag';
import { generateLowerString } from '@/libs/utils';

import type { PostActionFormProps, PostActionFormRef } from './types';

import { Details } from '../../collapsible/details';
import { MdxEditor } from '../../mdx/editor';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../../shadcn/ui/form';
import { Input } from '../../shadcn/ui/input';
import { Textarea } from '../../shadcn/ui/textarea';
import { CategorySelect } from './category-select';
import { usePostActionForm, usePostFormSubmitHandler } from './hooks';
import { TagInput } from './tag';
export const PostActionForm = forwardRef<PostActionFormRef, PostActionFormProps>((props, ref) => {
    /**
     * 表单处理
     */
    const form = usePostActionForm(
        props.type === 'create' ? { type: props.type } : { type: props.type, item: props.item },
    );

    const submitHandler = usePostFormSubmitHandler(
        props.type === 'create' ? { type: 'create' } : { type: 'update', id: props.item.id },
    );

    useEffect(() => {
        if (!isNil(props.setPedding)) props.setPedding(form.formState.isSubmitting);
    }, [form.formState.isSubmitting]);

    useImperativeHandle(
        ref,
        () => ({
            save: form.handleSubmit(submitHandler),
        }),
        [props.type],
    );

    /**
     * 文章内容
     */
    const [body, setBody] = useState<string | undefined>(
        props.type === 'create' ? '' : props.item.body,
    );

    useEffect(() => {
        if (!isNil(body)) form.setValue('body', body);
    }, [body]);

    /**
     * 文章slug
     */
    const [slug, setSlug] = useState(props.type === 'create' ? '' : props.item.slug || '');

    const changeSlug: ChangeEventHandler<HTMLInputElement> = useCallback(
        (e) => setSlug(e.target.value),
        [],
    );

    const generateTitleSlug: MouseEventHandler<HTMLAnchorElement> = useCallback(
        (e) => {
            e.preventDefault();
            if (!form.formState.isSubmitting) {
                const title = trim(form.getValues('title'), '');
                if (title) setSlug(generateLowerString(title));
            }
        },
        [form.formState.isSubmitting],
    );

    useEffect(() => {
        form.setValue('slug', slug);
    }, [slug]);

    /**
     * 文章分类
     */
    const [allCategories, setAllCategories] = useState<CategoryItem[]>([]);
    const [categoryId, setCategoryId] = useState<string>(
        props.type === 'create' || isNil(props.item.category) ? '' : props.item.category.id,
    );
    useEffect(() => {
        form.setValue('categoryId', categoryId);
    }, [categoryId]);
    useEffect(() => {
        (async () => {
            const result = await categoryApi.list();
            if (!result.ok) {
                toast.warning('读取分类列表失败,请刷新', {
                    id: 'category-list-error',
                    description: (await result.json()).message,
                });
            } else {
                const data = await result.json();
                setAllCategories(data);
            }
        })();
    }, []);

    /**
     * 文章标签
     */
    const [allTags, setAllTags] = useState<TagItem[]>([]);
    const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);
    const [tags, setTags] = useState<TagItem[]>(props.type === 'create' ? [] : props.item.tags);

    useEffect(() => {
        (async () => {
            const result = await tagApi.list();
            if (!result.ok) {
                toast.warning('读取标签列表失败,请刷新', {
                    id: 'tag-list-error',
                    description: (await result.json()).message,
                });
            } else {
                const data = await result.json();
                setAllTags(data);
            }
        })();
    }, []);

    useDeepCompareEffect(() => {
        form.setValue('tags', tags);
    }, [tags]);

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(submitHandler)}
                className="flex flex-auto flex-col space-y-8"
            >
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>文章标题 (*)</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="请输入标题"
                                    disabled={form.formState.isSubmitting}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="mt-2 border-b border-dashed pb-1">
                    <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                            <FormItem className="">
                                <FormLabel>唯一URL</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        value={slug}
                                        onChange={changeSlug}
                                        placeholder="请输入唯一URL"
                                        disabled={form.formState.isSubmitting}
                                    />
                                </FormControl>
                                <FormDescription>
                                    如果留空,则文章访问地址是id
                                    <Link
                                        className="ml-5 mr-1 text-black dark:text-white"
                                        href="#"
                                        onClick={generateTitleSlug}
                                        aria-disabled={form.formState.isSubmitting}
                                    >
                                        [点此]
                                    </Link>
                                    自动生成slug(根据标题使用&apos;-&apos;连接字符拼接而成,中文字自动转换为拼音)
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                        <FormItem className="mt-2 border-b border-dashed pb-1">
                            <div className="w-full flex-col space-y-2">
                                <FormLabel className="block">分类选择</FormLabel>
                                <FormControl className="block pt-1">
                                    <CategorySelect
                                        {...field}
                                        value={categoryId}
                                        setValue={setCategoryId}
                                        categories={allCategories}
                                    />
                                </FormControl>
                            </div>
                            <FormDescription>
                                选择一个分类后,在读取该分类的父分类(如果有)时,列表中也会包含此文章
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem className="mt-2 border-b border-dashed pb-1">
                            <FormLabel>标签</FormLabel>
                            <FormControl>
                                <TagInput
                                    {...field}
                                    placeholder="输入标签"
                                    tags={tags}
                                    setTags={(newTags) => setTags(newTags)}
                                    className="w-full"
                                    activeTagIndex={activeTagIndex}
                                    setActiveTagIndex={setActiveTagIndex}
                                    autocompleteOptions={allTags}
                                />
                            </FormControl>
                            <FormDescription>
                                每个标签之间请用英文逗号(,)分割,
                                如果单独不设置SEO关键字则会根据标签生成关键字用于SEO
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="summary"
                    render={({ field }) => (
                        <FormItem className="mt-2 border-b border-dashed pb-1">
                            <FormLabel>摘要简述</FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    placeholder="请输入文章摘要"
                                    disabled={form.formState.isSubmitting}
                                />
                            </FormControl>
                            <FormDescription>摘要会显示在文章列表页</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Details summary="SEO相关字段" defaultOpen={false}>
                    <FormField
                        control={form.control}
                        name="keywords"
                        render={({ field }) => (
                            <FormItem className="mt-2 border-b border-dashed pb-1">
                                <FormLabel>关键字</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="请输入关键字,用逗号分割(关键字是可选的)"
                                        disabled={form.formState.isSubmitting}
                                    />
                                </FormControl>
                                <FormDescription>
                                    关键字不会显示,仅在SEO时发挥作用.每个关键字之间请用英文逗号(,)分割
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="mt-2 border-b border-dashed pb-1">
                                <FormLabel>文章描述</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder="请输入文章描述"
                                        disabled={form.formState.isSubmitting}
                                    />
                                </FormControl>
                                <FormDescription>
                                    文章描述不会显示,仅在SEO时发挥作用
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </Details>
                <FormField
                    control={form.control}
                    name="body"
                    render={({ field: _ }) => (
                        <FormItem className="flex flex-auto flex-col">
                            <FormLabel className="mb-3">文章内容 (*)</FormLabel>
                            <FormControl>
                                <div className="flex flex-auto">
                                    <MdxEditor
                                        content={body}
                                        setContent={setBody}
                                        disabled={form.formState.isSubmitting}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
});
