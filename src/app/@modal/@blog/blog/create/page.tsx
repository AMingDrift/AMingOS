import type { Metadata, ResolvingMetadata } from 'next';
import type { FC } from 'react';

import { PostPageForm } from '@/_components/blog/form';
import { cn } from '@/_components/shadcn/utils';

import $styles from './style.module.css';

// 添加动态标记，强制使用 SSR
export const dynamic = 'force-dynamic';

export const generateMetadata = async (_: any, parent: ResolvingMetadata): Promise<Metadata> => {
    return {
        title: `创建文章 - ${(await parent).title?.absolute}`,
        description: '文章创建页面',
    };
};

const PostCreatePage: FC = async () => {
    return (
        <div className={cn($styles.item, 'h-full')}>
            <PostPageForm />
        </div>
    );
};
export default PostCreatePage;
