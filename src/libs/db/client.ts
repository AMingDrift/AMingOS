/* eslint-disable vars-on-top */

import type { Category, Prisma } from '@prisma/client';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { isNil } from 'lodash';
import { withBark } from 'prisma-extension-bark';
import paginateExt from 'prisma-paginate';

export interface flatCategoryTreeArgs {
    where: Prisma.CategoryWhereInput;
    select?: Prisma.CategorySelect;
}

const prismaClientSingleton = () => {
    const connectionString = `${process.env.POSTGRES_PRISMA_URL}`;
    const adapter = new PrismaPg({
        connectionString,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    });
    const client = new PrismaClient({ adapter, log: ['error'] })
        .$extends(paginateExt)
        .$extends(withBark({ modelNames: ['category'] }));
    return client.$extends({
        model: {
            category: {
                async getAncestorsWithCurrent({
                    where,
                    select,
                }: flatCategoryTreeArgs): Promise<Category[]> {
                    const current = await client.category.findFirst({
                        where,
                        select,
                    });
                    if (isNil(current)) return [];
                    const ancestors = await client.category.findAncestors({
                        where: { id: current.id },
                    });
                    return [...(ancestors || []), current];
                },

                async getDescendantsWithCurrent({
                    where,
                    select,
                }: flatCategoryTreeArgs): Promise<Category[]> {
                    const current = await client.category.findFirst({
                        where,
                        select,
                    });
                    if (isNil(current)) return [];
                    const descendants = await client.category.findDescendants({
                        where: { id: current.id },
                    });
                    return [current, ...(descendants || [])];
                },
            },
        },
    });
};

declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const db = !isNil(globalThis.prismaGlobal) ? globalThis.prismaGlobal : prismaClientSingleton();

export default db;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = db;
