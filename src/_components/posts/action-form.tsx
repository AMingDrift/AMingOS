'use client';

import { isNil } from 'lodash';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

import type { PostActionFormProps, PostActionFormRef } from './types';

import { Details } from '../collapsible/details';
import { MdxEditor } from '../mdx/editor';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../shadcn/ui/form';
import { Input } from '../shadcn/ui/input';
import { Textarea } from '../shadcn/ui/textarea';
import { usePostActionForm, usePostFormSubmitHandler } from './hooks';

export const PostActionForm = forwardRef<PostActionFormRef, PostActionFormProps>((props, ref) => {
    const form = usePostActionForm(
        props.type === 'create' ? { type: props.type } : { type: props.type, item: props.item },
    );

    const submitHandler = usePostFormSubmitHandler(
        props.type === 'create' ? { type: 'create' } : { type: 'update', id: props.item.id },
    );

    const [body, setBody] = useState<string | undefined>(
        props.type === 'create' ? '文章内容' : props.item.body,
    );

    useEffect(() => {
        if (!isNil(body)) form.setValue('body', body);
    }, [body]);

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
                            <FormLabel>文章标题</FormLabel>
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
                <Details summary="可选字段">
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
                </Details>
                <FormField
                    control={form.control}
                    name="body"
                    render={({ field: _ }) => (
                        <FormItem className="flex flex-auto flex-col">
                            <FormLabel className="mb-3">文章内容</FormLabel>
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
