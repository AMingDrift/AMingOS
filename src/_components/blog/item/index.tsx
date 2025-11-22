import type { FC } from 'react';

import { isNil } from 'lodash';
import { Calendar, Tag } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { MdxRender } from '@/_components/mdx/render';
import { cn } from '@/_components/shadcn/utils';
import { postApi } from '@/api/post';
import { formatTime } from '@/libs/time';

import { TagLink } from '../form/tag';
import { PostDelete } from '../list/actions/delete';
import { PostEditButton } from '../list/actions/edit-button';
import { PostContentSkeleton } from '../skeleton';
import $styles from './style.module.css';
import Comments from '@/_components/Comments';

const PostItemPageContent: FC<{ item: string }> = async ({ item }) => {
    const result = await postApi.detail(item);
    if (!result.ok) {
        if (result.status !== 404) throw new Error((await result.json()).message);
        return notFound();
    }
    const post = await result.json();
    return (
        <div className={$styles.content}>
            <MdxRender
                source={post.body}
                header={
                    <>
                        <header className={$styles.title}>
                            <h1 className="text-lg lg:text-3xl">{post.title}</h1>
                            <div className="mt-[0.125rem] ml-2 flex">
                                <PostEditButton item={post} iconBtn />
                                <PostDelete item={post} iconBtn />
                            </div>
                        </header>
                        <div className={$styles.meta}>
                            <div className={$styles.info}>
                                <span>
                                    <Calendar size={18} className="mr-2" />
                                    <time className="mt-1 ellips">
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
                                        <Tag size={18} />
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                        {post.tags.map((tag) => (
                                            <Link key={tag.id} href={`/blog?tag=${tag.text}`}>
                                                <TagLink tag={tag} key={tag.id}></TagLink>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                }
            />

            <div className="mt-10">
                <Comments />
            </div>
        </div>
    );
};

const PostItemIndex: FC<{ item: string }> = async ({ item }) => {
    return (
        <div className="page-item h-full">
            <div className={cn('page-container', $styles.item)}>
                <Suspense fallback={<PostContentSkeleton />}>
                    <PostItemPageContent item={item} />
                </Suspense>
            </div>
        </div>
    );
};

export default PostItemIndex;
