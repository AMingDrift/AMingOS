import type { FC } from 'react';

import { isNil } from 'lodash';
import { Tag } from 'lucide-react';

import { tagApi } from '@/api/tag';

import { SidebarWidget } from '../widget';
import { TagListComponent } from './list';

export const TagListWidget: FC<{ actived?: string }> = async ({ actived }) => {
    const result = await tagApi.list();
    if (!result.ok) throw new Error((await result.json()).message);
    const tags = await result.json();
    let activeId;
    if (!isNil(actived)) {
        const activeItem = tags.find(
            (tag) => decodeURIComponent(tag.text) === decodeURIComponent(actived),
        );
        activeId = activeItem?.id;
    }
    return (
        <SidebarWidget
            title={
                <>
                    <Tag />
                    <span>标签</span>
                </>
            }
        >
            <TagListComponent items={tags} actived={activeId}></TagListComponent>
        </SidebarWidget>
    );
};
