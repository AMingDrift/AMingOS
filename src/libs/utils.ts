import deepmerge from 'deepmerge';
import { lowerCase, trim } from 'lodash';
import pinyin from 'pinyin';

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
export const generateLowerString = (from: string) => {
    const slug = pinyin(from, {
        style: 0,
        segment: false,
    })
        .map((words) => words[0])
        .join('-');
    return lowerCase(slug)
        .split(' ')
        .map((v) => trim(v, ' '))
        .join('-');
};
