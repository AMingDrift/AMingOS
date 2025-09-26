import z from 'zod';

/**
 * 对象存储查询请求数据结构
 */
export const docRequestQuerySchema = z.object({
    limit: z.number().int().nonnegative().optional().meta({
        description: '指定要返回的最大 blob 对象数的数字。默认为 1000',
    }),
    prefix: z.string().optional().meta({
        description: '用于筛选 blob 对象的路径名，可包含文件夹名，例如`video/xqtd.mp4`，`images/`',
    }),
    cursor: z.string().optional().meta({
        description: '用于分页的游标字符串，用于获取下一页的结果',
    }),
    mode: z.enum(['expanded', 'folded']).optional().meta({
        description:
            'A string specifying the response format. Can either be expanded (default) or folded. In folded mode all blobs that are located inside a folder will be folded into a single folder string entry',
    }),
});

// 为外部类型 ListBlobResultBlob 创建 Zod schema
export const listBlobResultBlobSchema = z.object({
    url: z.url(),
    pathname: z.string(),
    size: z.number().int().nonnegative(),
    contentType: z.string(),
    etag: z.string(),
    lastModified: z.iso.datetime(),
});

export const listBlobResultSchema = z.array(listBlobResultBlobSchema);

/**
 * 通过URL删除对象存储数据的请求数据结构
 */
export const docDeleteByUrlRequestParamsSchema = z.object({
    url: z.string().meta({ description: '对象存储URL' }),
});
