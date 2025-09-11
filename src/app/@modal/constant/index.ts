import type { LucideIcon } from 'lucide-react';

import {
    Files,
    FileVideo,
    Image,
    Layers,
    Music4,
    NotebookPen,
    Siren,
    SquarePlus,
    User,
} from 'lucide-react';

import type { AppType } from '@/_components/modal/types';

interface IMenuItem {
    title: string;
    url: string;
    icon: LucideIcon;
}

export const DefaultMenuUrl: Record<AppType, string> = {
    blog: '/blog',
    doc: '/doc',
    about: '/about',
};

export const MenuItems: Record<AppType, IMenuItem[]> = {
    blog: [
        {
            title: '博客',
            url: '/blog',
            icon: NotebookPen,
        },
        {
            title: '发布',
            url: '/blog/create',
            icon: SquarePlus,
        },
        {
            title: '合集',
            url: '/blog/collection',
            icon: Layers,
        },
    ],
    doc: [
        {
            title: 'Music',
            url: '/doc/music',
            icon: Music4,
        },
        {
            title: 'Videos',
            url: '/doc/video',
            icon: FileVideo,
        },
        {
            title: 'Pictures',
            url: '/doc/picture',
            icon: Image,
        },
        {
            title: 'Files',
            url: '/doc/file',
            icon: Files,
        },
    ],
    about: [
        {
            title: 'Me',
            url: '/about',
            icon: User,
        },
        {
            title: 'Record',
            url: '/about/record',
            icon: Siren,
        },
    ],
};
