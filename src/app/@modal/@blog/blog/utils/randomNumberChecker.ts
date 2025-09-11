export function generateRandomNumber(): number {
    return Math.floor(Math.random() * 1000); // 生成0-999的随机整数
}

export function isEven(num: number): boolean {
    return num % 2 === 0;
}

export function checkRandomNumberParity(): { number: number; isEven: boolean } {
    const number = generateRandomNumber();
    return {
        number,
        isEven: isEven(number),
    };
}
