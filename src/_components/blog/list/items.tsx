import type { FC } from 'react';

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

export const PostList: FC<{ items: PostItem[]; activeTag?: string }> = ({ items, activeTag }) => (
    <div className="columns-2 gap-10 lg:columns-3 my-5 mx-10">
        {(items as PostItem[]).map((item, idx) => (
            <BlurFade
                key={item.id}
                delay={0.25 + idx * 0.05}
                inView
                className="flex flex-col mb-10 break-inside-avoid"
            >
                <Card3D>
                    <Link href={`/blog/${item.slug || item.id}`}>
                        <div className="flex flex-col cursor-pointer border-0 rounded-xl p-3 transition-all duration-150 border-black/15 dark:border-white/30 hover:backdrop-blur-md hover:shadow-[var(--modal-shadow)]">
                            <ImageComponent
                                key={item.id}
                                src={item.thumb}
                                alt={item.title}
                                id={item.id}
                            />
                            <div className="footer flex flex-col gap-2">
                                <div className="font-bold text-lg mt-0.5">{item.title}</div>
                                {item.tags.length > 0 && (
                                    <div className={cn($styles.tags, 'flex relative z-[2] gap-2')}>
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
        ))}
    </div>
);
