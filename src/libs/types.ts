import type dayjs from 'dayjs';
import type { LucideIcon } from 'lucide-react';
/**
 * 应用配置
 */
export interface AppConfig {
    /**
     * 基础url
     */
    baseUrl: string;
    /**
     * API路径
     */
    apiPath: string;

    /**
     * 时区,默认Asia/Shanghai
     */
    timezone?: string;
    /**
     * 语言,默认zh-cn
     */
    locale?: string;
}

export type DateToString<T> = {
    [K in keyof T]: T[K] extends Date ? string : T[K];
};
/**
 * getTime函数获取时间的选项参数
 */
export interface TimeOptions {
    /**
     * 时间
     */
    date?: dayjs.ConfigType;
    /**
     * 输出格式
     */
    format?: dayjs.OptionType;
    /**
     * 语言
     */
    locale?: string;
    /**
     * 是否严格模式
     */
    strict?: boolean;
    /**
     * 时区
     */
    timezone?: string;
}

export interface MenuItemType {
    title: string;
    url: string;
    icon: LucideIcon;
    cnt?: number;
}
