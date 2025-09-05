'use server';

import type { Category } from '@prisma/client';

import { isNil } from 'lodash';

import db from '@/libs/db/client';

import type { CategoryItem } from './type';

/**
 * 构建树形结构
 * @param items 所有分类项目
 * @returns 树形结构的根节点数组
 */

function buildTree(data: CategoryItem[]): CategoryItem[] {
    if (data.length === 0) return [];
    // 按路径长度排序确保父节点先被处理
    const sortedNodes = [...data].sort((a, b) => a.path.length - b.path.length) as CategoryItem[];

    const map: { [path: string]: CategoryItem } = {};
    const roots: CategoryItem[] = [];

    for (const node of sortedNodes) {
        // 创建带 children 的新节点对象
        const currentNode: CategoryItem = {
            ...node,
        };

        const path = currentNode.path;
        map[path] = currentNode;

        if (currentNode.depth === data[0].depth) {
            roots.push(currentNode);
        } else {
            // 计算父路径（移除最后 4 位）
            const parentPath = path.slice(0, -4);
            const parentNode = map[parentPath];

            if (parentNode) {
                parentNode.children = parentNode.children ?? [];
                parentNode.children.push(currentNode);
            }
        }
    }
    // 按原始路径顺序排序根节点
    return roots.sort((a, b) => a.path.localeCompare(b.path));
}

/**
 * 递归获取扁平化树
 * @param items
 */
const getFlatTree = (items: CategoryItem[]): CategoryItem[] => {
    return items.reduce<CategoryItem[]>((o, n) => {
        if (!isNil(n.children)) {
            return [...o, n, ...getFlatTree(n.children)];
        }
        return [...o, n];
    }, []);
};

/**
 * 查询分类树信息
 * @param parentId
 */
const queryCategoryDescendants = async (parent?: string): Promise<CategoryItem[]> => {
    const categories = await db.category.findMany({
        where: parent ? { depth: 1 } : { OR: [{ id: parent }, { slug: parent }] },
    });
    return (
        await Promise.all(
            categories.map(async (category) => {
                const children = await db.category.findDescendants({
                    where: { id: category.id },
                });
                return [category, ...(isNil(children) ? [] : children)];
            }),
        )
    ).reduce((o, n) => [...o, ...n], []);
};

/**
 * 查询分类树信息
 * @param parentId
 */
export const queryCategoryTree = async (parent?: string): Promise<CategoryItem[]> => {
    const categories = await queryCategoryDescendants(parent);
    return buildTree(categories);
};

/**
 * 查询结合列表(扁平树)信息
 * @param parentId
 */
export const queryCategoryList = async (parent?: string) => {
    const tree = await queryCategoryTree(parent);
    return getFlatTree(tree);
};

/**
 * 获取分类面包屑
 * @param latest
 */
export const queryCategoryBreadcrumb = async (latest: string): Promise<Category[]> => {
    const category = await db.category.findFirst({
        where: { OR: [{ id: latest }, { slug: latest }] },
    });
    if (isNil(category)) {
        return [];
    }
    const ancestors = await db.category.findAncestors({
        where: { id: category.id },
    });
    return [...(ancestors || []), category];
};
