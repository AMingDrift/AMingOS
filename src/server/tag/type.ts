import type { z } from 'zod';

import type { tagItemRequestParamsSchema, tagListSchema, tagSchema } from './schema';
/**
 * 标签查询请求参数类型
 */
export type TagItemRequestParams = z.infer<typeof tagItemRequestParamsSchema>;
/**
 * 标签查询响应数据类型
 */
export type TagItem = z.infer<typeof tagSchema>;
/**
 * 标签列表查询响应数据类型
 */
export type TagList = z.infer<typeof tagListSchema>;
