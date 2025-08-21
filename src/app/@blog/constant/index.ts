import { Layers, NotebookPen, SquarePlus, TestTubeDiagonal } from 'lucide-react';

export const MenuItems = [
    {
        title: '博客',
        url: '/blog',
        icon: NotebookPen,
        cnt: 2,
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
        cnt: 3,
    },
    {
        title: '测试 mdx',
        url: '/blog/mdx',
        icon: TestTubeDiagonal,
    },
];
