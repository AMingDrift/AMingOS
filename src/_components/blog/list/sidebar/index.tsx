import type { FC } from 'react';

import type { CategoryItem } from '@/server/category/type';

import { CategoryTreeWidget } from './category-tree';
import $styles from './style.module.css';
import { TagListWidget } from './tag-list';
export const Sidebar: FC<{ activedCategories: false | CategoryItem[]; activedTag?: string }> = ({
    activedCategories,
    activedTag,
}) => {
    return (
        <div className={$styles.sidebar}>
            <div className="space-y-4">
                <CategoryTreeWidget actives={activedCategories} />
                <TagListWidget actived={activedTag} />
            </div>
        </div>
    );
};
