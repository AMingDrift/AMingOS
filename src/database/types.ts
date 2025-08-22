// src/database/types.ts
/**
 * 分页原数据
 */
export interface PaginateMeta {
    /**
     * 当前页项目数量
     */
    itemCount: number;
    /**
     * 项目总数量
     */
    totalItems?: number;
    /**
     * 每页显示数量
     */
    perPage: number;
    /**
     * 总页数
     */
    totalPages?: number;
    /**
     * 当前页数
     */
    currentPage: number;
}

/**
 * 分页选项
 */
export interface PaginateOptions {
    /**
     * 当前页数
     */
    page?: number;
    /**
     * 每页显示数量
     */
    limit?: number;
}

/**
 * 分页返回数据
 */
export interface PaginateReturn<E extends Record<string, any>> {
    meta: PaginateMeta;
    items: E[];
}
export interface IPost {
    /**
     * 文章ID
     */
    id: string;
    /**
     * 文章标题
     */
    title: string;
    /**
     * 文章内容
     */
    body: string;
    /**
     * 文章封面图
     */
    thumb: string;
    /**
     * 文章摘要
     */
    summary?: string;
}
