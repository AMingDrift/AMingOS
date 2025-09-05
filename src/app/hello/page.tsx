import Link from 'next/link';
import React, { Suspense } from 'react';

import { BlogIndex } from '@/_components/blog/list';

const Content = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return <BlogIndex />;
};

const Page = async () => {
    return (
        <Suspense fallback={<div>loading...</div>}>
            <div className="relative">
                <Content />
                <Link href="/" className="absolute top-0 left-0">
                    返回首页
                </Link>
            </div>
        </Suspense>
    );
};

export default Page;
