'use server';

import fs, { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path, { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { v4 } from 'uuid';

import { getRandomInt } from '@/libs/random';

import type { IPost } from './types';

import { faker } from './utils';

// 获取当前文件的目录
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * 初始数据，生成22篇文章
 */
const posts: IPost[] = [...Array.from({ length: 60 }).keys()].map(() => ({
    // 生成uuid
    id: v4(),
    // 随机封面图
    thumb: `/uploads/thumb/post-${getRandomInt(1, 15)}.png`,
    // 生成1到3个段落的标题
    title: faker.lorem.paragraph({ min: 1, max: 3 }),
    // 生成3-6个段落的内容并把每个段落用换行符换行
    body: faker.lorem.paragraphs(getRandomInt(3, 6), '\n'),
    // 有49%的机率会生成一段摘要
    summary: Math.random() < 0.5 ? faker.lorem.text() : undefined,
}));

/**
 * 检测数据库文件，如果不存在则创建并把初始数据写入
 */
const checkDbFile = async () => {
    const dbPath = resolve(__dirname, '../../public/db.json');
    if (!existsSync(dbPath)) {
        const json = JSON.stringify(posts);
        writeFileSync(dbPath, json);
    }
};

/**
 * 读取数据库文件中的文章数据
 */
export const readDbFile = async (): Promise<IPost[]> => {
    // 先检测一下数据库文件，不存在则创建并写入初始数据
    await checkDbFile();
    const dbPath =
        process.env.NODE_ENV === 'production'
            ? resolve(__dirname, '../../db.json')
            : resolve(__dirname, '../../public/db.json');
    const data = readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
};

/**
 * 重写数据库文件
 * @param data
 */
export const resetDbFile = async (data: IPost[]) => {
    // 先检测一下数据库文件，不存在则创建并写入初始数据
    await checkDbFile();
    const dbPath = resolve(__dirname, '../../public/db.json');
    const json = JSON.stringify(data);
    fs.writeFileSync(dbPath, json);
};
