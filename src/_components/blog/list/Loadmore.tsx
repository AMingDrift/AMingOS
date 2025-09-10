'use client';

import { useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import type { PostItem } from '@/server/post/type';

import { getBlogResult } from './actions/blog-actions';
import { PostList } from './items';

const Loadmore = (props: { limit: number; tag?: string }) => {
    const { ref, inView } = useInView();
    const { limit, tag } = props;
    const [bloglistItems, setBloglistItems] = useState<PostItem[][]>([]);
    const page = useRef(2);
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        if (inView) {
            setIsLoading(true);
            getBlogResult(page.current, limit, tag).then(({ items }) => {
                console.log(items);
                setIsLoading(false);
                if (items.length > 0) {
                    setBloglistItems((prev) => [...prev, items]);
                    page.current++;
                }
            });
        }
    }, [inView]);

    useEffect(() => {
        setBloglistItems([]);
        page.current = 2;
    }, [searchParams.get('tag')]);

    return (
        <>
            {bloglistItems.map((bloglistItem) => (
                <PostList key={bloglistItem[0].id} items={bloglistItem} activeTag={tag} />
            ))}
            <div ref={ref}>
                <div className="opacity-0">loadPlaceHolder</div>
                {isLoading && (
                    <div className="load-container">
                        <div className="spin-container container-1">
                            <div className="dot dot-1"></div>
                            <div className="dot dot-2"></div>
                            <div className="dot dot-3"></div>
                            <div className="dot dot-4"></div>
                        </div>
                        <div className="spin-container container-2">
                            <div className="dot dot-1"></div>
                            <div className="dot dot-2"></div>
                            <div className="dot dot-3"></div>
                            <div className="dot dot-4"></div>
                        </div>
                        <div className="spin-container container-3">
                            <div className="dot dot-1"></div>
                            <div className="dot dot-2"></div>
                            <div className="dot dot-3"></div>
                            <div className="dot dot-4"></div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Loadmore;
