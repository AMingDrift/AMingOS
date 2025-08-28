import type { FC } from 'react';

import { isNil } from 'lodash';
import { notFound } from 'next/navigation';

import { PostPageForm } from '@/_components/posts/page-form';
import { cn } from '@/_components/shadcn/utils';
import { queryPostItemById } from '@/app/actions/post';

import $styles from '../../create/style.module.css';
import { ResolvingMetadata, Metadata } from 'next';

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
    if (isNil(item)) return notFound();
    const post = await queryPostItemById(item);
    if (isNil(post)) return notFound();
    return (
        <div className="page-item h-full">
            <div className={cn($styles.item, 'page-container')}>
                <PostPageForm post={post} />
            </div>
        </div>
    );
};
export default PostEditPage;
