import type { FC } from 'react';

import { PostPageForm } from '@/_components/posts/page-form';
import { cn } from '@/_components/shadcn/utils';

import $styles from './style.module.css';

// 添加动态标记，强制使用 SSR
export const dynamic = 'force-dynamic';

const PostCreatePage: FC = async () => {
    return (
        <div className={cn($styles.item, 'h-full')}>
            <PostPageForm />
        </div>
    );
};
export default PostCreatePage;
