import type { PropsWithChildren } from 'react';
/**
 * 页面弹出框的参数类型
 */
export type PageModalProps = PropsWithChildren<{
    /**
     * 弹出框标题
     */
    title: string;
    /**
     * 匹配的路由（只有当当前路由包含在此选项内时，才有可能显示弹出框）
     */
    match: string[];
    /**
     * 自定义的DialogContent样式类
     */
    className?: string;
}>;
