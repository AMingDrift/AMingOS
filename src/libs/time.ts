import type { Dayjs } from 'dayjs';

import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import 'dayjs/locale/en';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/zh-tw';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import duration from 'dayjs/plugin/duration';
import localeData from 'dayjs/plugin/localeData';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { isNil } from 'lodash';

import { appConfig } from '@/config/app';

import type { TimeOptions } from './types';

dayjs.extend(localeData);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);
dayjs.extend(dayOfYear);
dayjs.extend(duration);
// dayjs.locale('zh-cn', {
//     formats: {
//         LLL: 'YYYY年MM月DD日 HH时mm分', // 24小时制
//     },
// });

/**
 * 获取全局dayjs对象
 */
export const getDayjs = () => dayjs;

/**
 * 根据传入的参数获取dayjs时间对象
 * @param options
 */
export const getTime = (options?: string | Pick<TimeOptions, 'date' | 'format' | 'strict'>) => {
    const params = typeof options === 'string' ? { date: options } : options;
    const { date, format, strict } = params ?? {};
    // 每次创建一个新的时间对象
    // 如果没有传入local或timezone则使用应用配置
    return dayjs(date, format, strict).clone();
};

/**
 * 获取当前时区和当前语言的时间
 * @param time
 * @param timezone
 */
export const localTime = (time: Dayjs, options?: Pick<TimeOptions, 'locale' | 'timezone'>) => {
    const locale = options?.locale ?? appConfig.locale;
    const obj = time.tz(options?.timezone ?? appConfig.timezone);
    return !isNil(locale) ? obj.locale(locale) : obj;
};

/**
 * 格式化时间输出
 * @param date
 */
export const formatTime = (date?: string) => localTime(getTime(date)).format('LLL');
