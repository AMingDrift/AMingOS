import { cookies } from 'next/headers';

/**
 * 获取当前请求上下文中的 cookie header，返回形如 { cookie: 'k=v; k2=v2' } 或 undefined
 */
export const getCookieHeader = async (): Promise<Record<string, string> | undefined> => {
    const ck = await cookies();
    const str = ck.toString();
    return str ? { cookie: str } : undefined;
};
