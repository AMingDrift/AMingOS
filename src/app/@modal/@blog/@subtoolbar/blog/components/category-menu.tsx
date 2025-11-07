'use client';

import { Box, Check, ChevronDown } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import type { CategoryItem } from '@/server/category/type';

import { Button } from '@/_components/shadcn/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/_components/shadcn/ui/dropdown-menu';

export const CategoryMenu = ({ categories }: { categories: CategoryItem[] }) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedCategoryPath, setSelectedCategoryPath] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    // 路由跳转后高亮选中的分类
    useEffect(() => {
        // 递归查找匹配当前路径的分类
        const findMatchingCategory = (
            categories: CategoryItem[],
            parentPath: string[] = [],
        ): { name: string; path: string[] } | null => {
            for (const category of categories) {
                const currentPath = [...parentPath, `/${category.slug || category.id}`];
                if (currentPath.join('') === pathname) {
                    return { name: category.name, path: currentPath };
                }
                if (category.children && category.children.length > 0) {
                    const result = findMatchingCategory(category.children, currentPath);
                    if (result) {
                        return result;
                    }
                }
            }
            return null;
        };

        // 如果没有找到匹配的分类，检查是否是博客首页
        const matchingCategory = findMatchingCategory(categories, ['/blog']);
        if (matchingCategory) {
            setSelectedCategory(matchingCategory.name);
        } else if (pathname === '/blog') {
            setSelectedCategory('全部');
        }
    }, [pathname, categories]);

    useEffect(() => {
        router.replace(selectedCategoryPath.join('/'));
    }, [selectedCategoryPath]);

    // 处理onBlur事件，当焦点离开菜单容器时关闭菜单
    const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
        // 使用setTimeout确保点击菜单内部元素时不会立即关闭菜单
        setTimeout(() => {
            const popperWrapper = event.relatedTarget?.closest(
                '[data-radix-popper-content-wrapper]',
            );
            if (!popperWrapper) {
                setIsOpen(false);
            }
        }, 0);
    };

    // 递归渲染分类树，传递父级分类信息
    const renderCategoryItems = (categories: CategoryItem[], parentCategories: string[] = []) => {
        return categories.map((category) => {
            // 构建当前分类的完整路径
            const currentPath = [...parentCategories, `/${category.slug || category.id}`];

            if (category.children && category.children.length > 0) {
                return (
                    <DropdownMenuSub key={category.id}>
                        <DropdownMenuSubTrigger className="flex cursor-pointer items-center">
                            {/* 分类名称部分 */}
                            <span
                                className="flex flex-1 cursor-pointer items-center"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedCategory(category.name);
                                    setSelectedCategoryPath(currentPath);
                                    setIsOpen(false);
                                }}
                            >
                                {category.name}
                                {selectedCategory === category.name && (
                                    <Check className="mr-2 h-4 w-4" />
                                )}
                            </span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuGroup>
                                    {renderCategoryItems(category.children, currentPath)}
                                </DropdownMenuGroup>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                );
            } else {
                return (
                    <DropdownMenuItem
                        key={category.id}
                        onClick={() => {
                            setSelectedCategory(category.name);
                            setSelectedCategoryPath(currentPath);
                            setIsOpen(false);
                        }}
                        className="flex items-center"
                    >
                        <span>{category.name}</span>
                        {selectedCategory === category.name && <Check className="mr-2 h-4 w-4" />}
                    </DropdownMenuItem>
                );
            }
        });
    };

    return (
        <div className="ml-2 flex flex-1 items-center space-x-2">
            <div className="flex items-center text-sm font-medium">
                <Box size={18} />
                分类
            </div>
            <div
                onBlur={handleBlur}
                className="outline-none" // 移除焦点轮廓
            >
                <DropdownMenu defaultOpen={false} open={isOpen}>
                    <DropdownMenuTrigger asChild onClick={() => setIsOpen(!isOpen)}>
                        <Button variant="outline" className="w-[180px] justify-between">
                            {selectedCategory || '选择分类'}
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[180px]">
                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                onClick={() => {
                                    setSelectedCategory('全部');
                                    setSelectedCategoryPath(['/blog']);
                                    setIsOpen(false);
                                }}
                                className="flex items-center"
                            >
                                <span>全部</span>
                                {selectedCategory === '全部' && <Check className="mr-2 h-4 w-4" />}
                            </DropdownMenuItem>
                            {/* 初始调用时不传递父级分类 */}
                            {renderCategoryItems(categories, ['/blog'])}
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            {/* 可以在这里显示当前选中的完整分类路径，包括父级分类 */}
            {/* {selectedCategoryPath.length > 0 && (
                <div className="ml-2 text-xs text-gray-500">
                    路径: {selectedCategoryPath.join('')}
                </div>
            )} */}
        </div>
    );
};
