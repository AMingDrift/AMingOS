import type { AppConfig } from '@/libs/types';

export const appConfig: AppConfig = {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001',
    apiPath: process.env.NEXT_PUBLIC_API_PATH || '/api',
    locale: 'zh-cn',
    timezone: 'Asia/Shanghai',
};
