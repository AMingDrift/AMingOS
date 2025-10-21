import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { openAPI, username } from 'better-auth/plugins';
const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
const NextCookiesPlugin = nextCookies();
export const createServerAuth = () =>
    betterAuth({
        socialProviders: {
            github: {
                clientId: process.env.GITHUB_CLIENT_ID as string,
                clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
            },
        },
        database: prismaAdapter(prisma, {
            provider: 'postgresql',
        }),
        emailAndPassword: {
            enabled: true,
        },
        basePath: '/api/auth',
        plugins: [
            // 用户名登录插件
            username(),
            // openapi插件
            openAPI({
                path: '/reference',
                disableDefaultReference: false,
            }),
        ],
    });
export const auth = createServerAuth();
// nextjs的cookie仿问插件
auth.options.plugins.push(NextCookiesPlugin as any);
export interface AuthType {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
}
