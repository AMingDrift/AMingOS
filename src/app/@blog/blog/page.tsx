import type { FC } from 'react';

import { isNil } from 'lodash';
import Link from 'next/link';
import { Suspense } from 'react';

import type { IPaginateQueryProps } from '@/_components/paginate/types';
import type { PostItem } from '@/server/post/type';

import { BlogIndexSkeleton } from '@/_components/blog/skeleton';
import { BlurFade } from '@/_components/magicui/blur-fade';
import { postApi } from '@/api/post';
import { formatTime } from '@/libs/time';

import ImageComponent from './components/ImageComponent';

const PageContent: FC<{ searchParams: Promise<IPaginateQueryProps> }> = async ({
    searchParams,
}) => {
    const { page: currentPage, limit = 20 } = await searchParams;
    // 当没有传入当前页或当前页小于1时，设置为第1页
    const result = await postApi.paginate({
        page: currentPage,
        limit,
    });
    if (!result.ok) throw new Error((await result.json()).message);
    const { items, meta } = await result.json();

    return (
        <div className="columns-2 gap-2 lg:columns-3 mt-2">
            {(items as PostItem[]).map((item, idx) => (
                <BlurFade
                    key={item.id}
                    delay={0.25 + idx * 0.05}
                    inView
                    className="flex flex-col mb-6 break-inside-avoid"
                >
                    <Link href={`/blog/${item.slug || item.id}`}>
                        <div className="flex flex-col cursor-pointer border-2 border-transparent rounded-xl p-4 transition-all duration-300 hover:border-white/30 hover:backdrop-blur-md hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                            <ImageComponent
                                key={item.id}
                                src={item.thumb}
                                alt={item.title}
                                id={item.id}
                            />
                            <div className="footer">
                                <div className="font-bold">{item.title}</div>
                                <time className="mt-2 w-full ellips text-right">
                                    {!isNil(item.updatedAt)
                                        ? formatTime(item.updatedAt.toString())
                                        : formatTime(item.createdAt.toString())}
                                </time>
                            </div>
                        </div>
                    </Link>
                </BlurFade>
            ))}
        </div>
    );
};

const Page: FC<{ searchParams: Promise<IPaginateQueryProps> }> = async ({ searchParams }) => {
    return (
        <Suspense fallback={<BlogIndexSkeleton />}>
            <PageContent searchParams={searchParams} />
        </Suspense>
    );
};

export default Page;
