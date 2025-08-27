/* eslint-disable react/no-unstable-default-props */
/* eslint-disable regexp/no-empty-lookarounds-assertion */

'use client';

import type { FC } from 'react';
import type { HeadingDepth, HeadingParent, TocItem } from 'remark-flexible-toc';

import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '../../shadcn/utils';
import $styles from './toc.module.css';

interface Props {
    toc: TocItem[];
    maxDepth?: HeadingDepth;
    indented?: boolean;
    ordered?: boolean;
    tight?: boolean;
    exclude?: string | string[];
    skipLevels?: HeadingDepth[];
    skipParents?: Exclude<HeadingParent, 'root'>[];
}

const Toc: FC<Props> = ({
    toc,
    maxDepth = 6,
    ordered = false,
    indented = true, // 将默认值改为true
    tight = false,
    exclude,
    skipLevels = [1],
    skipParents = [],
}) => {
    const [activeId, setActiveId] = useState('');
    const tocListRef = useRef<HTMLUListElement>(null);

    // 处理标题可见性检测
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const visibleHeadings = entries
                    .filter((entry) => entry.isIntersecting)
                    .map((entry) => ({
                        id: entry.target.id,
                        top: entry.boundingClientRect.top,
                    }))
                    .sort((a, b) => Math.abs(a.top) - Math.abs(b.top));

                if (visibleHeadings.length > 0) {
                    const nearestHeading = visibleHeadings[0];
                    if (nearestHeading.id !== activeId) {
                        setActiveId(nearestHeading.id);
                        window.history.replaceState(null, '', `#${nearestHeading.id}`);
                    }
                }
            },
            {
                rootMargin: '-80px 0px -80% 0px',
                threshold: [0, 1],
            },
        );

        document
            .querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]')
            .forEach((heading) => observer.observe(heading));

        return () => observer.disconnect();
    }, [activeId]);

    // 处理点击事件
    const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const heading = document.getElementById(id);
        if (heading) {
            setActiveId(id);
            window.history.replaceState(null, '', `#${id}`);
            heading.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    if (!toc) return null;

    // ********* filters **************
    const exludeRegexFilter = exclude
        ? Array.isArray(exclude)
            ? new RegExp(exclude.join('|'), 'i')
            : new RegExp(exclude, 'i')
        : /(?!)/;

    const skipLevelsFilter = (depth: TocItem['depth']): boolean => skipLevels.includes(depth);

    const skipParentsFilter = (parent: TocItem['parent']): boolean =>
        parent !== 'root' && skipParents.includes(parent);

    const maxDepthFilter = (depth: TocItem['depth']): boolean => depth > maxDepth;
    // ********************************

    const filteredToc = toc.filter(
        (heading) =>
            !maxDepthFilter(heading.depth) &&
            !skipLevelsFilter(heading.depth) &&
            !skipParentsFilter(heading.parent) &&
            !exludeRegexFilter.test(heading.value),
    );

    return (
        <div className={$styles['toc-container']}>
            <ul ref={tocListRef} className={cn($styles['toc-list'], 'tw-flex tw-flex-col')}>
                {filteredToc.map((heading) => {
                    const headingId = heading.href.replace(/^#/, '');
                    return (
                        <li
                            key={heading.href}
                            data-active={headingId === activeId}
                            className={cn(
                                'tw-flex tw-items-center',
                                indented && $styles[`h${heading.depth}indent`],
                                tight && $styles.tight,
                            )}
                        >
                            <a href={`#${headingId}`} onClick={(e) => handleClick(e, headingId)}>
                                <div className={`h${heading.depth} tw-ellips`}>
                                    {ordered ? (
                                        <strong>
                                            <span className={$styles.numbering}>
                                                {heading.numbering.slice(1).join('.')}.
                                            </span>
                                        </strong>
                                    ) : null}
                                    <span className={$styles.heading}>{heading.value}</span>
                                </div>
                            </a>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Toc;
