'use client';

import type { FC } from 'react';

import { FileIcon, FolderIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useRef } from 'react';

import type { CategoryItem, CategoryTree } from '@/server/category/type';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/_components/shadcn/ui/accordion';
import { cn } from '@/_components/shadcn/utils';

import $styles from './tree.module.css';

interface CategoryItemProps {
    category: CategoryItem;
    actives: string[];
    parentPath: string;
}

const Item: FC<CategoryItemProps> = ({ category, actives, parentPath }) => {
    const hasChildren = category.children && category.children.length > 0;
    const isActive =
        actives.includes(category.id) &&
        !(category.children ?? []).some((c) => actives.includes(c.id));
    const itemRef = useRef<HTMLDivElement>(null);
    const currentPath = useMemo(
        () => `${parentPath}/${category.slug || category.id}`,
        [parentPath, category.slug, category.id],
    );

    // 滚动到视图
    useEffect(() => {
        if (isActive && itemRef.current) {
            itemRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [isActive]);

    if (hasChildren) {
        return (
            <AccordionItem value={category.id} className="border-none" data-active={isActive}>
                <div ref={itemRef} className={cn($styles.folderItem, isActive && $styles.active)}>
                    <div
                        className={$styles.folderLink}
                        style={{ paddingLeft: `${0.5 * (category.depth - 1)}rem` }}
                    >
                        <FolderIcon className="mr-2 h-4 w-4" />
                        <AccordionTrigger
                            className="flex flex-1 py-0 font-medium hover:no-underline"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Link
                                className="animate-decoration-sm mr-2 ellips animate-decoration"
                                href={currentPath}
                            >
                                {category.name}
                            </Link>
                        </AccordionTrigger>
                    </div>
                </div>
                <AccordionContent className="pb-0!">
                    <div className={$styles.children}>
                        {category.children?.map((child) => (
                            <Item
                                key={child.id}
                                category={child}
                                actives={actives}
                                parentPath={currentPath}
                            />
                        ))}
                    </div>
                </AccordionContent>
            </AccordionItem>
        );
    }

    return (
        <div ref={itemRef} className={cn($styles.item, isActive && $styles.active)}>
            <div
                className={$styles.itemLink}
                style={{ paddingLeft: `${0.5 * (category.depth - 1)}rem` }}
            >
                <FileIcon className="mr-2 h-4 w-4" />
                {/* <span className="font-medium">{category.name}</span> */}
                <Link
                    key={category.id}
                    href={currentPath}
                    className="animate-decoration-sm ellips animate-decoration"
                >
                    {category.name}
                </Link>
            </div>
        </div>
    );
};

export const CategoryTreeComponent: FC<{ categories: CategoryTree; actives: string[] }> = ({
    categories,
    actives,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    return (
        <div ref={containerRef} className={cn($styles.container)}>
            <Accordion type="multiple" className={$styles.accordion} defaultValue={actives}>
                {categories.map((category) => (
                    <Item
                        key={category.id}
                        category={category}
                        actives={actives}
                        parentPath="/blog"
                    />
                ))}
            </Accordion>
        </div>
    );
};
