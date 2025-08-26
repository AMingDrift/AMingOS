/**
 * 格式化时间输出
 * @param date
 */
export const formatChineseTime = (date: Date) =>
    `${date.getFullYear()}年${String(date.getMonth() + 1).padStart(2, '0')}月${String(date.getDate()).padStart(2, '0')}日${String(date.getHours()).padStart(2, '0')}时${String(date.getMinutes()).padStart(2, '0')}分`;
