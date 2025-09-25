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
    <div className="mx-10 mt-7 mb-6 columns-2 gap-10 lg:columns-3">
        {(items as PostItem[]).map((item, idx) => (
            <div key={item.id} className="relative">
                <BlurFade
                    key={item.id}
                    delay={0.25 + idx * 0.05}
                    inView
                    className="mb-10 flex break-inside-avoid flex-col"
                >
                    <Card3D>
                        <Link href={`/blog/posts/${item.slug || item.id}`}>
                            <div className="flex transform flex-col rounded-xl border-0 border-black/15 p-3 transition-all duration-300 ease-out select-none hover:scale-105 hover:shadow-(--modal-shadow) hover:backdrop-blur-md dark:border-white/30">
                                <ImageComponent
                                    key={item.id}
                                    src={item.thumb}
                                    alt={item.title}
                                    id={item.id}
                                />
                                <div className="footer flex flex-col gap-2">
                                    <div className="mt-0.5 text-lg font-bold">{item.title}</div>
                                    {item.tags.length > 0 && (
                                        <div className={cn($styles.tags, 'relative flex gap-2')}>
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

                {/* <Pointer>
                    <div className="text-2xl select-none">👆</div>
                </Pointer> */}
            </div>
        ))}
    </div>
);
