// src/libs/random.ts
/**
 * 获取小于N的随机整数
 * @param count
 */
export const getRandomMin = (count: number) => Math.floor(Math.random() * count);

/**
 * 获取一定范围内的随机整数
 * @param min
 * @param max
 */
export const getRandomInt = (min: number, max: number) =>
    Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + min;

/**
 * 生成只包含字母的固定长度的字符串
 * @param length
 */
export const getRandomCharString = (length: number) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

/**
 * 从列表中获取一个随机项
 * @param list
 */
export const getRandItemData = <T>(list: T[]) => {
    return list[getRandomMin(list.length)];
};

/**
 * 从列表中获取多个随机项组成一个新列表
 * @param list
 */
export const getRandListData = <T>(list: T[]) => {
    const result: T[] = [];
    for (let i = 0; i < getRandomMin(list.length); i++) {
        const random = getRandItemData<T>(list);
        const canPush = !result.find((item) => {
            if ('id' in (random as Record<string, any>)) {
                const check = random as Record<string, any>;
                const current = item as Record<string, any>;
                return current.id === check.id;
            }
            return item === random;
        });
        if (canPush) result.push(random);
    }
    return result;
};
