import type { Category, Prisma } from '@prisma/client';

import { isNil } from 'lodash';

import { generateLowerString } from '@/libs/utils';

import { prisma } from '../client';
type Item = Pick<Prisma.CategoryCreateInput, 'name'> & { children?: Item[] };
const data: Item[] = [
    { name: '技术文集', children: [{ name: '课程', children: [{ name: 'TS全栈开发' }] }] },
    { name: '创业笔记', children: [{ name: '码农创业记' }] },
    { name: '生活随笔' },
    { name: '探索世界' },
];
const createCategory = async (item: Item, parent?: Category) => {
    let category: Category;
    const { name, children } = item;
    if (isNil(parent)) {
        category = await prisma.category.createRoot({
            data: { name, slug: generateLowerString(name) },
        });
    } else {
        category = await prisma.category.createChild({
            node: parent,
            data: { name, slug: generateLowerString(name) },
        });
    }

    if (!isNil(children)) {
        for (const child of children) {
            await createCategory(child, category);
        }
    }
};
export const createCategoryData = async () => {
    for (const item of data) {
        await createCategory(item);
    }
};
