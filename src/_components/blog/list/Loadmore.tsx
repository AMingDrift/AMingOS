'use client';

import { useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import type { PostItem } from '@/server/post/type';

import { postApi } from '@/api/post';

import { PostList } from './items';
import { Spinner } from '@/_components/shadcn/ui/spinner';
import { cn } from '@/_components/shadcn/utils';

const Loadmore = (props: { limit: number; tag?: string; category?: string }) => {
    const { ref, inView } = useInView();
    const { limit, tag, category } = props;
    const [bloglistItems, setBloglistItems] = useState<PostItem[][]>([]);
    const page = useRef(2);
    const loadingRef = useRef(false);

    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (inView && !loadingRef.current) {
            loadingRef.current = true;
            setIsLoading(true);

            // 确保在任何情况下都能重置loading状态
            const loadMoreItems = async () => {
                try {
                    const res = await postApi.paginate({
                        page: page.current,
                        limit,
                        tag,
                        category,
                    });
                    if (!res.ok) throw new Error((await res.json()).message);
                    const result = await res.json();

                    // 检查结果是否有效
                    if (result && Array.isArray(result.items)) {
                        if (result.items.length > 0) {
                            setBloglistItems((prev) => [...prev, result.items]);
                            page.current++;
                        } else {
                            console.log('No more items to load');
                        }
                    } else {
                        console.warn('Invalid API response structure');
                    }
                } catch (error) {
                    console.error('Failed to load more items:', error);
                } finally {
                    // 确保无论成功失败都重置loading状态
                    loadingRef.current = false;
                    setIsLoading(false);
                    console.log('Loading completed');
                }
            };

            loadMoreItems();
        }
    }, [inView, limit, tag, category]);

    // 当标签或分类变化时重置状态
    useEffect(() => {
        setBloglistItems([]);
        page.current = 2;
        loadingRef.current = false;
        setIsLoading(false);
    }, [searchParams.get('tag'), category]);

    return (
        <>
            {bloglistItems.map((bloglistItem) => (
                <PostList key={bloglistItem[0].id} items={bloglistItem} activeTag={tag} />
            ))}
            <div ref={ref} className="flex flex-col items-center justify-center">
                {<Spinner className={cn('size-16 text-sky-500', isLoading ? '' : 'opacity-0')} />}
            </div>
        </>
    );
};

export default Loadmore;
