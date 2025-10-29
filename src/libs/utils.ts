import deepmerge from 'deepmerge';
import { lowerCase, trim } from 'lodash';
import { pinyin } from 'pinyin-pro';

/**
 * 深度合并对象
 * @param x 初始值
 * @param y 新值
 * @param arrayMode 对于数组采取的策略,`replace`为直接替换,`merge`为合并数组
 */
export const deepMerge = <T1, T2>(
    x: Partial<T1>,
    y: Partial<T2>,
    arrayMode: 'replace' | 'merge' = 'merge',
) => {
    const options: deepmerge.Options = {};
    if (arrayMode === 'replace') {
        options.arrayMerge = (_d, s, _o) => s;
    } else if (arrayMode === 'merge') {
        options.arrayMerge = (_d, s, _o) => Array.from(new Set([..._d, ...s]));
    }
    return deepmerge(x, y, options) as T2 extends T1 ? T1 : T1 & T2;
};

/**
 * 把一个字符串的所有字符均转化为小写
 * 并使用"-"替换空格连接所有单词
 * 如果是汉字,则先转换为拼音后再进行以上操作
 * @param from
 */
export function generateLowerString(from: string): string {
    // 先移除特殊字符：逗号、引号、冒号等
    const cleanString = from.replace(/[\s,，、()【】：「」（）"':;!?[\]{}]+/g, ' ').trim();

    // 使用pinyin-pro重构拼音转换逻辑
    const slug = pinyin(cleanString, {
        toneType: 'none', // 对应原style: 0（无声调）
        type: 'array', // 返回数组格式
        nonZh: 'consecutive', // 将非中文字符作为一个整体处理
    }).join('-'); // 直接连接数组元素

    return lowerCase(slug)
        .split(' ')
        .map((v) => trim(v, ' '))
        .join('-');
}

/**
 * 转换文件大小为更易读的格式
 * @param sizeInBytes 文件大小，单位为字节
 * @param digits 保留的小数位数，默认保留1位
 */
export const convertFileSize = (sizeInBytes: number, digits?: number) => {
    if (sizeInBytes < 1024) {
        return `${sizeInBytes} Bytes`; // Less than 1 KB, show in Bytes
    } else if (sizeInBytes < 1024 * 1024) {
        const sizeInKB = sizeInBytes / 1024;
        return `${sizeInKB.toFixed(digits || 1)} KB`; // Less than 1 MB, show in KB
    } else if (sizeInBytes < 1024 * 1024 * 1024) {
        const sizeInMB = sizeInBytes / (1024 * 1024);
        return `${sizeInMB.toFixed(digits || 1)} MB`; // Less than 1 GB, show in MB
    } else {
        const sizeInGB = sizeInBytes / (1024 * 1024 * 1024);
        return `${sizeInGB.toFixed(digits || 1)} GB`; // 1 GB or more, show in GB
    }
};

/**
 * 根据文件路径的扩展名对文件进行分类
 * @param pathname 文件路径字符串
 * @returns 文件类型字符串 ('image' | 'video' | 'document' | 'unknown')
 */
export function classifyFileType(pathname: string): 'image' | 'video' | 'document' | 'unknown' {
    const extension = pathname.split('.').pop()?.toLowerCase();

    if (!extension) {
        return 'unknown';
    }

    const imageTypes = ['png', 'jpg', 'jpeg', 'webp'];
    const videoTypes = ['mp4', 'webm'];
    const documentTypes = ['pdf', 'doc', 'docx', 'excel'];

    if (imageTypes.includes(extension)) {
        return 'image';
    }

    if (videoTypes.includes(extension)) {
        return 'video';
    }

    if (documentTypes.includes(extension)) {
        return 'document';
    }

    return 'unknown';
}

/**
 * 获取CSS变量的值
 * @param variableName CSS变量名（例如：--height-dock-menu）
 * @param element 可选的元素，默认为document.documentElement
 * @returns CSS变量的值，如果未找到则返回空字符串
 */
export function getCSSVariable(variableName: string, element?: HTMLElement): string {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
        // 如果在服务器端渲染环境中，返回空字符串
        return '';
    }

    const targetElement = element || document.documentElement;
    return getComputedStyle(targetElement).getPropertyValue(variableName).trim();
}

export const calculatePercentage = (sizeInBytes: number, totalGB: number = 1) => {
    const totalSizeInBytes = totalGB * 1024 * 1024 * 1024; // 2GB in bytes
    const percentage = (sizeInBytes / totalSizeInBytes) * 100;
    return Number(percentage.toFixed(2));
};
