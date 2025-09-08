import { visit } from 'unist-util-visit';

/**
 * 清理链接中不正确的 div 标签
 */
export const rehypeCleanLinks = () => {
    return (tree: any) => {
        visit(tree, 'element', (node) => {
            // 检查是否为链接元素
            if (node.tagName === 'a') {
                // 递归清理链接内部的不正确嵌套
                cleanNestedElements(node);
            }
        });
    };
};

/**
 * 递归清理元素中不正确的嵌套结构
 */
const cleanNestedElements = (node: any) => {
    if (!node.children) return;

    // 收集所有不是 div 的子元素
    const cleanChildren: any[] = [];

    for (const child of node.children) {
        if (child.type === 'element' && child.tagName === 'div') {
            // 如果是 div，把它的子元素提升到当前层级
            if (child.children) {
                cleanChildren.push(...child.children);
            }
        } else {
            // 如果不是 div，保留它但继续递归清理其内部
            if (child.children) {
                cleanNestedElements(child);
            }
            cleanChildren.push(child);
        }
    }

    // 替换原来的子元素
    node.children = cleanChildren;
};
