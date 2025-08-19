import z from 'zod';

/**
 * 对象存储查询请求数据结构
 */
export const docRequestQuerySchema = z.object({
    prefix: z.string().optional().meta({
        description: '用于筛选 blob 对象的路径名，可包含文件夹名，例如`video/xqtd.mp4`，`picture`',
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
