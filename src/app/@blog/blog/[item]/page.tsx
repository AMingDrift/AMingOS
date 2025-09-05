import type { Metadata, ResolvingMetadata } from 'next';
import type { FC } from 'react';

import { isNil } from 'lodash';
import { Calendar } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { PostEditButton } from '@/_components/blog/list/actions/edit-button';
import { PostContentSkeleton } from '@/_components/blog/skeleton';
import { MdxRender } from '@/_components/mdx/render';
import { cn } from '@/_components/shadcn/utils';
import { postApi } from '@/api/post';
import { queryPostItem } from '@/app/actions/post';
import { formatTime } from '@/libs/time';

import $styles from './page.module.css';

export const generateMetadata = async (
    { params }: { params: Promise<{ item: string }> },
    parent: ResolvingMetadata,
): Promise<Metadata> => {
    const { item } = await params;
    const post = await queryPostItem(item);

    if (isNil(post)) return {};

    return {
        title: `${post.title} - ${(await parent).title?.absolute}`,
        keywords: post.keywords,
        description: post.description,
    };
};

const PostItemPageContent: FC<{ params: Promise<{ item: string }> }> = async ({ params }) => {
    const { item } = await params;
    const result = await postApi.detail(item);
    if (!result.ok) {
        if (result.status !== 404) throw new Error((await result.json()).message);
        return notFound();
    }
    const post = await result.json();
    return (
        <>
            <div className="page-item">
                <div className={cn('page-container', $styles.item)}>
                    <div className={$styles.thumb}>
                        <Image
                            src={post.thumb}
                            alt={post.title}
                            fill
                            priority
                            sizes="100%"
                            unoptimized
                        />
                    </div>
                    <div className={$styles.content}>
                        <header className={$styles.title}>
                            <h1 className="text-lg lg:text-3xl">{post.title}</h1>
                            <div className="ml-2">
                                <PostEditButton item={post} iconBtn />
                            </div>
                        </header>
                        <div className={$styles.meta}>
                            <span>
                                <Calendar />
                            </span>
                            <time className="ellips">
                                {!isNil(post.updatedAt)
                                    ? formatTime(post.updatedAt.toString())
                                    : formatTime(post.createdAt.toString())}
                            </time>
                        </div>
                        <div className={$styles.body}>
                            <MdxRender source={post.body} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const PostItemPage: FC<{ params: Promise<{ item: string }> }> = async ({ params }) => {
    return (
        <Suspense fallback={<PostContentSkeleton />}>
            <PostItemPageContent params={params} />
        </Suspense>
    );
};

export default PostItemPage;
