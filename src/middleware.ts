import type { NextRequest } from 'next/server';

import { isNil } from 'lodash';
import { NextResponse } from 'next/server';

import { authConfig } from '@/config/auth';

import { auth } from './libs/auth';
import { findAccoundByUserId } from './server/user/service';

export const config = {
    runtime: 'nodejs',
    matcher: [
        '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|bmp|tiff|woff|woff2|ttf|eot|otf|css|scss|sass|less|js|mjs|pdf|doc|docx|txt|md|zip|rar|7z|tar|gz|mp3|mp4|avi|mov|wav|flac)$|sitemap\\.xml|robots\\.txt|manifest\\.json|sw\\.js|workbox-.*\\.js).*)',
    ],
};

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    // 需要认证的页面路由
    const protectedRoutes = authConfig.protectedPages;
    if (protectedRoutes.some((route) => pathname.startsWith(route))) {
        return authPageProtectedHandler(request);
    }
    // 默认处理
    return NextResponse.next();
}
// 认证路由处理函数
const authPageProtectedHandler = async (request: NextRequest) => {
    try {
        const session = await auth.api.getSession({
            headers: request.headers,
        });

        let isAdmin = false;
        if (session?.user.id) {
            const account = await findAccoundByUserId(session.user.id);
            if (account) {
                isAdmin = account.accountId === process.env.ADMIN_GITHUB_ID;
            }
        }
        if (isNil(session) || !isAdmin) {
            return NextResponse.redirect('/');
        }
        // 用户已认证，继续处理请求
        return NextResponse.next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        // 发生错误时也重定向到登录页面，同样添加回调参数
        const homeUrl = new URL('/', request.url);
        return NextResponse.redirect(homeUrl);
    }
};
