import type { LucideIcon } from 'lucide-react';

import {
    ChartPie,
    Files,
    FileVideo,
    Image,
    NotebookPen,
    Siren,
    SquarePlus,
    TestTube,
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
    storage: '/storage',
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
    ],
    storage: [
        {
            title: 'Dashboard',
            url: '/storage',
            icon: ChartPie,
        },
        {
            title: 'Images',
            url: '/storage/images',
            icon: Image,
        },
        {
            title: 'Videos',
            url: '/storage/videos',
            icon: FileVideo,
        },
        {
            title: 'Documents',
            url: '/storage/documents',
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
        {
            title: 'Test',
            url: '/about/test',
            icon: TestTube,
        },
    ],
};
