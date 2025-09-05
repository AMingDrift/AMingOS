import z from 'zod';

/**
 * 文章详情查询请求数据结构
 */
export const tagItemRequestParamsSchema = z.object({
    item: z.string().meta({ description: '标签ID' }),
});

/**
 * 标签查询响应数据结构
 */
export const tagSchema = z
    .object({
        id: z.string(),
        text: z.string(),
    })
    .meta({ id: 'Tag', description: '标签详情数据' });

/**
 * 标签列表查询响应数据结构
 */
export const tagListSchema = z.array(tagSchema).meta({ id: 'Tags', description: '标签列表数据' });
