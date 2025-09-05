import type { FC } from 'react';

import { isNil } from 'lodash';
import { Calendar, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { MdxRender } from '@/_components/mdx/render';
import { cn } from '@/_components/shadcn/utils';
import { postApi } from '@/api/post';
import { formatTime } from '@/libs/time';

import { PostEditButton } from '../list/actions/edit-button';
import { PostContentSkeleton } from '../skeleton';
import $styles from './style.module.css';

const PostItemPageContent: FC<{ item: string }> = async ({ item }) => {
    const result = await postApi.detail(item);
    if (!result.ok) {
        if (result.status !== 404) throw new Error((await result.json()).message);
        return notFound();
    }
    const post = await result.json();
    return (
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
                    <MdxRender
                        source={post.body}
                        header={
                            <>
                                <header className={$styles.title}>
                                    <h1 className="text-lg lg:text-3xl">{post.title}</h1>
                                    <div className="mt-[0.125rem]">
                                        <PostEditButton item={post} iconBtn />
                                    </div>
                                </header>
                                <div className={$styles.meta}>
                                    <div className={$styles.info}>
                                        <span>
                                            <Calendar className="mr-2" />
                                            <time className="ellips mt-1">
                                                {formatTime(
                                                    !isNil(post.updatedAt)
                                                        ? post.updatedAt
                                                        : post.createdAt,
                                                )}
                                            </time>
                                        </span>
                                    </div>
                                    {post.tags.length > 0 && (
                                        <div className={$styles.tags}>
                                            <span className="mr-2">
                                                <Tag />
                                            </span>
                                            {post.tags.map((tag) => (
                                                <Link key={tag.id} href={`/blog?tag=${tag.text}`}>
                                                    {tag.text}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        }
                    />
                </div>
            </div>
        </div>
    );
};

const PostItemIndex: FC<{ item: string }> = async ({ item }) => {
    return (
        <Suspense fallback={<PostContentSkeleton />}>
            <PostItemPageContent item={item} />
        </Suspense>
    );
};

export default PostItemIndex;
