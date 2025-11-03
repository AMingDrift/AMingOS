import type { LucideIcon } from 'lucide-react';

import {
    ChartPie,
    FileVideo,
    Image,
    Monitor,
    NotebookPen,
    Siren,
    SquarePlus,
    TestTube,
    User,
} from 'lucide-react';

import type { AppType } from '@/_components/store/modalStore/types';

interface IMenuItem {
    title: string;
    url: string;
    icon: LucideIcon;
    adminOnly?: boolean;
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
            adminOnly: true,
        },
    ],
    storage: [
        {
            title: 'Dashboard',
            url: '/storage',
            icon: ChartPie,
        },
        {
            title: '图片',
            url: '/storage/images',
            icon: Image,
        },
        {
            title: '视频',
            url: '/storage/videos',
            icon: FileVideo,
        },
        // {
        //     title: 'Documents',
        //     url: '/storage/documents',
        //     icon: Files,
        // },
    ],
    about: [
        {
            title: '关于我',
            url: '/about',
            icon: User,
        },
        {
            title: '我的项目',
            url: '/about/projects',
            icon: Monitor,
        },
        {
            title: 'Record',
            url: '/about/record',
            icon: Siren,
            adminOnly: true,
        },
        {
            title: 'Test',
            url: '/about/test',
            icon: TestTube,
            adminOnly: true,
        },
    ],
};
