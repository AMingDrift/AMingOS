import type { Metadata, ResolvingMetadata } from 'next';
import type { FC } from 'react';

import { notFound } from 'next/navigation';

import { PostPageForm } from '@/_components/blog/form';
import { cn } from '@/_components/shadcn/utils';
import { postApi } from '@/api/post';

import $styles from '../../create/style.module.css';

// 添加动态标记，强制使用 SSR
export const dynamic = 'force-dynamic';

export const generateMetadata = async (_: any, parent: ResolvingMetadata): Promise<Metadata> => {
    return {
        title: `编辑文章 - ${(await parent).title?.absolute}`,
        description: '文章编辑页面',
    };
};

const PostEditPage: FC<{ params: Promise<{ item: string }> }> = async ({ params }) => {
    const { item } = await params;
    const result = await postApi.detail(item);
    if (!result.ok) {
        if (result.status !== 404) throw new Error((await result.json()).message);
        return notFound();
    }
    const post = await result.json();
    return (
        <div className={cn($styles.item, 'h-full')}>
            <PostPageForm post={post} />
        </div>
    );
};
export default PostEditPage;
