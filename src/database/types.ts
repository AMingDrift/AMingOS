import type { Prisma } from '@prisma/client';

type NonSkipNull<T> = T extends typeof Prisma.skip | null ? never : T;

interface _DeepFormItemArray<T> extends Array<DBFormData<NonSkipNull<T>>> {}

type _DeepFormItemObject<T> = {
    [P in keyof T]-?: DBFormData<NonSkipNull<T[P]>>;
};

/**
 * 构建没有skip的深层类型(你也可以直接关掉strictUndefinedChecks, 详情查看https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/null-and-undefined)
 */
export type DBFormData<T> = T extends (...args: any[]) => any
    ? T
    : T extends any[]
      ? _DeepFormItemArray<T[number]>
      : T extends object
        ? _DeepFormItemObject<T>
        : T;
