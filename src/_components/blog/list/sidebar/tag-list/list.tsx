import type { FC } from 'react';

import type { TagItem } from '@/server/tag/type';

import { cn } from '@/_components/shadcn/utils';

import { TagLink } from '../../../form/tag';
import $styles from './list.module.css';
export const TagListComponent: FC<{ items: TagItem[]; actived?: string }> = ({
    items,
    actived,
}) => {
    return (
        <div className={$styles.container}>
            {items.map((tagItem) => (
                <TagLink
                    key={tagItem.id}
                    tag={tagItem}
                    className={cn({
                        [$styles.tagActived]: actived === tagItem.id,
                    })}
                />
            ))}
        </div>
    );
};
