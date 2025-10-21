import { z } from 'zod';

// 用户登录请求 schema
export const loginRequestSchema = z.object({
    username: z.string().min(1, '请输入用户名或邮箱'),
    password: z.string().min(6, '密码至少6位'),
});

// const auth: {
//     id: string;
//     createdAt: Date;
//     updatedAt: Date;
//     email: string;
//     emailVerified: boolean;
//     name: string;
//     image?: string | null | undefined;
// } | null

// G-用户信息 schema
export const githubUserSchema = z.object({
    id: z.string(),
    createdAt: z.date().meta({ description: '用户创建时间' }),
    updatedAt: z.date().meta({ description: '用户更新时间' }),
    email: z.string(),
    emailVerified: z.boolean(),
    name: z.string(),
    image: z.string().nullable(),
});

// 用户信息 schema
export const userSchema = z.object({
    id: z.string(),
    username: z.string(),
    displayUsername: z.string().nullable(),
    email: z.string(),
    image: z.string().nullable(),
    emailVerified: z.boolean(),
    createdAt: z.string().meta({ description: '用户创建时间' }),
    updatedAt: z.string().meta({ description: '用户更新时间' }),
});

// 会话信息 schema
export const sessionSchema = z.object({
    id: z.string(),
    userId: z.string(),
    expiresAt: z.string().meta({ description: 'session过期时间' }),
    token: z.string(),
    ipAddress: z.string().nullable(),
    userAgent: z.string().nullable(),
});

// 认证响应 schema
export const authResponseSchema = z.object({
    user: userSchema.nullable(),
    session: sessionSchema.nullable(),
});

// 登出响应 schema
export const authSignoutResponseSchema = z.object({
    message: z.string(),
});

// 用户详情请求参数 schema
export const userDetailRequestParamsSchema = z.object({
    id: z.string().min(1, 'ID不能为空'),
});

// // 用户注册请求 schema
// export const registerRequestSchema = z.object({
//     username: z.string().min(2, '用户名至少2位'),
//     email: z.email('请输入有效的邮箱地址'),
//     password: z.string().min(6, '密码至少6位'),
//     displayUsername: z.string().optional(),
// });

// // 用户列表 schema
// export const userListSchema = z.array(userSchema);

// // 检查用户名可用性请求 schema
// export const checkUsernameRequestSchema = z.object({
//     username: z.string().min(2, '用户名至少2位'),
// });

// // 检查用户名可用性响应 schema
// export const checkUsernameResponseSchema = z.object({
//     available: z.boolean(),
//     message: z.string(),
// });

// // 更新用户信息请求 schema
// export const updateUserRequestSchema = z.object({
//     username: z.string().min(2, '用户名至少2位').optional(),
//     displayUsername: z.string().optional(),
// });
