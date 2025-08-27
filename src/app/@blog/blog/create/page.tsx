import type { FC } from 'react';

import { PostPageForm } from '@/_components/posts/page-form';

import $styles from './style.module.css';

// 添加动态标记，强制使用 SSR
export const dynamic = 'force-dynamic';

const PostCreatePage: FC = async () => {
    return (
        <div className={$styles.item}>
            <PostPageForm />
        </div>
    );
};
export default PostCreatePage;
