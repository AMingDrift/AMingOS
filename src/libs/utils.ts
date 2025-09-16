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
    const cleanString = from.replace(/[\s,，、()（）"':;!?[\]{}]+/g, ' ').trim();

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
