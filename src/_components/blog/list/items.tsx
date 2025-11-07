'use client';

import type { FC } from 'react';
import { useRef } from 'react';
import Link from 'next/link';

import type { CategoryItem } from '@/server/category/type';
import type { PostItem } from '@/server/post/type';

import Card3D from '@/_components/3D-card';
import ImageComponent from '@/_components/blog/list/ImageComponent';
import { BlurFade } from '@/_components/magicui/blur-fade';
import { cn } from '@/_components/shadcn/utils';

import type { IPaginateQueryProps } from '../../paginate/types';

import { TagLink } from '../form/tag';
import $styles from './style.module.css';

export interface PostListProps extends IPaginateQueryProps {
    tag?: string;
    category?: CategoryItem;
}

export const PostList: FC<{ items: PostItem[]; activeTag?: string }> = ({ items, activeTag }) => {
    const ref = useRef<HTMLDivElement>(null);
    return (
    <div ref={ref} className="mx-10 mt-7 columns-1 gap-7 md:columns-2 2xl:columns-3">
        {(items as PostItem[]).map((item, idx) => (
            <div key={item.id} className="relative">
                <BlurFade
                    key={item.id}
                    delay={0.25 + idx * 0.05}
                    inView
                    className="mb-7 flex break-inside-avoid flex-col"
                >
                    <Card3D>
                        <Link
                            replace
                            href={`/blog/posts/${item.slug || item.id}`}
                            onClick={() => {
                                if (typeof window !== 'undefined') {
                                    const scrollArea = ref.current?.closest(
                                        '#blog-layout',
                                    );
                                    sessionStorage.setItem('blogListScroll', String(scrollArea?.scrollTop));
                                    console.log(scrollArea?.scrollTop);
                                }
                            }}
                        >
                            <div className="flex transform flex-col rounded-xl p-3 transition-all duration-300 ease-out select-none hover:scale-105 hover:shadow-(--card-shadow) hover:backdrop-blur-md">
                                <ImageComponent
                                    key={item.id}
                                    src={item.thumb}
                                    alt={item.title}
                                    id={item.id}
                                />
                                <div className="footer flex flex-col gap-2">
                                    <div className="mt-0.5 text-lg font-bold">{item.title}</div>
                                    {item.tags.length > 0 && (
                                        <div
                                            className={cn(
                                                $styles.tags,
                                                'relative flex flex-wrap gap-2',
                                            )}
                                        >
                                            {item.tags.map((tagItem) => (
                                                <TagLink
                                                    key={tagItem.id}
                                                    tag={tagItem}
                                                    variant={
                                                        activeTag === tagItem.text
                                                            ? 'default'
                                                            : 'outline'
                                                    }
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Link>
                    </Card3D>
                </BlurFade>
            </div>
        ))}
    </div>
)};
