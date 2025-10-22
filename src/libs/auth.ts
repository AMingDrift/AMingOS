import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { openAPI } from 'better-auth/plugins';
const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
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
        baseURL: process.env.NEXT_PUBLIC_BASE_URL,
        plugins: [
            // openapi插件
            openAPI({
                path: '/reference',
                disableDefaultReference: false,
            }),
            nextCookies(),
        ],
    });
export const auth = createServerAuth();
export interface AuthType {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
}
