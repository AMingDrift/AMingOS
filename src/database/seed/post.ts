import { faker } from '@/libs/db/utils';
// src/database/seed/post.ts
import { getRandomInt } from '@/libs/random';

import { prisma } from '../client';

export const createPostData = async () => {
    // 为避免重复添加数据，在重新运行数据填充时，清空已有文章数据
    await prisma.post.$truncate();
    for (let index = 0; index < 22; index++) {
        await prisma.post.create({
            select: { id: true },
            data: {
                // 随机封面图
                thumb: `/uploads/thumb/post-${getRandomInt(1, 15)}.png`,
                // 生成1到3个段落的标题
                title: faker.lorem.paragraph({ min: 1, max: 3 }),
                // 生成3-6个段落的内容并把每个段落用换行符换行
                body: faker.lorem.paragraphs(getRandomInt(3, 6), '\n'),
                // 有49%的机率会生成一段摘要
                summary: Math.random() < 0.5 ? faker.lorem.text() : null,
            },
        });
    }
};
