import type { Prisma } from '@prisma/client';

import { isNil } from 'lodash';
import { readFileSync } from 'node:fs';
import path from 'node:path';

import { getRandomInt } from '@/libs/random';
import { generateLowerString } from '@/libs/utils';

import { prisma } from '../client';
type Item = Pick<Prisma.PostCreateInput, 'title' | 'summary'> & {
    bodyPath: string;
    categoryName: string;
    tagNames?: string[];
    thumb?: string;
    createdAt?: Date | string;
};

const data: Item[] = [
    // {
    //     title: 'Node.js环境搭建及应用初始化',
    //     summary:
    //         '本节课我们开始正式学习TS（Typescript）全栈开发。广义的TS全栈开发包含了许多领域，比如可以使用React Native开发移动APP，小程序也是使用TS开发的，甚至使用成熟的Electron框架还能开发跨平台的桌面软件（新版QQ就是Electron写的）。但我们的课程因为篇幅和精力有限，所以，目前只涉及狭义上的TS全栈开发，即TS web开发（包括react中后台管理系统开发、 Next.js全栈开发和网站前台开发、 Nestjs后端开发等）。不过整个TS的生态都是相通的，学会TS的web开发后，再去学习其他如React Native这些生态，也可以非常快速地掌握。',
    //     bodyPath: path.join(__dirname, '../fixture/ts-fullstack/1.md'),
    //     categoryName: 'TS全栈开发',
    //     tagNames: ['nodejs', 'typescript', 'nextjs', 'hono.js'],
    // },
    // {
    //     title: 'Next.js应用初始化',
    //     summary:
    //         'react本身只是一个渲染层，并不是一个框架。所以一般我们开发react web应用（移动、桌面等除外）有这些比较流行的方案',
    //     bodyPath: path.join(__dirname, '../fixture/ts-fullstack/2.md'),
    //     categoryName: 'TS全栈开发',
    //     tagNames: ['nodejs', 'typescript', 'react', 'next.js'],
    // },
    // {
    //     title: 'React内置Hooks的使用与自定义详解',
    //     summary:
    //         '学习一些react自带的hooks以基本掌握react应用的简单开发。在这节课中，我们通过几个小案例（如黑暗主题切换，语言包选择等）详细深入地了解一下react编码的一个基本规则，为后面课程的前端部分的学习打下坚实的基础',
    //     bodyPath: path.join(__dirname, '../fixture/ts-fullstack/3.md'),
    //     categoryName: 'TS全栈开发',
    //     tagNames: ['nodejs', 'typescript', 'react'],
    // },
    // {
    //     title: 'Next.js中使用Zustand进行状态管理详解',
    //     summary:
    //         '前面我们已经学习了使用`contenxt`、`useReducer`等进行状态管理。但是这种方法略显麻烦，而且对代码感官和应用性能并不友好。所以，这节课，我们尝试使用更简洁好用的zustand进行状态管理。',
    //     bodyPath: path.join(__dirname, '../fixture/ts-fullstack/4.md'),
    //     categoryName: 'TS全栈开发',
    //     tagNames: ['nodejs', 'typescript', 'react', 'zustand'],
    // },
    // {
    //     title: 'Next.js核心概念及应用构建',
    //     summary:
    //         '无论本篇后续的next.js相关章节还是更高级篇章的next.js课程都是基于这节课的应用进行扩展的，所以请务必确保掌握！',
    //     bodyPath: path.join(__dirname, '../fixture/ts-fullstack/5.md'),
    //     categoryName: 'TS全栈开发',
    //     tagNames: ['nodejs', 'typescript', 'react', 'next.js', 'tailwindcss', 'shadcn'],
    // },
    // {
    //     title: 'Server Action+Prsima全栈开发入门',
    //     summary: '学习如何使用 next.js 的 server action 结合 prsima orm 进行全栈开发',
    //     bodyPath: path.join(__dirname, '../fixture/ts-fullstack/6.md'),
    //     categoryName: 'TS全栈开发',
    //     tagNames: ['nodejs', 'typescript', 'react', 'next.js', 'prisma', 'orm'],
    // },
    // {
    //     title: 'Markdown编辑器与自研MDX渲染实现',
    //     summary: '实现使用mdx/markdown渲染文章内容以及markdown编辑器来编辑文章内容',
    //     bodyPath: path.join(__dirname, '../fixture/ts-fullstack/7.md'),
    //     categoryName: 'TS全栈开发',
    //     tagNames: ['nodejs', 'typescript', 'react', 'next.js', 'mdx', 'markdown'],
    // },
    // {
    //     title: '用户体验改进与SEO优化',
    //     summary: '本节课程我们不追究太多新功能，而是对应用进行优化以提升用户体验和SEO等',
    //     bodyPath: path.join(__dirname, '../fixture/ts-fullstack/8.md'),
    //     categoryName: 'TS全栈开发',
    //     tagNames: ['nodejs', 'typescript', 'react', 'next.js', 'seo', 'ssr'],
    // },
    // {
    //     title: 'Next.js+Hono.js实现全栈开发',
    //     summary:
    //         'next.js的server action由于其本身的一些特质，一般只适用于一些迷你型应用或简单demo的后端（比如一个带有少量动态数据的企业官网等）。而绝大多数情况下，我们需要一个比较好的功能完备且健全的后端框架来整合next.js，并公开API，以方面外部应用（如桌面app、移动app等）调用。',
    //     bodyPath: path.join(__dirname, '../fixture/ts-fullstack/9.md'),
    //     categoryName: 'TS全栈开发',
    //     tagNames: ['nodejs', 'typescript', 'react', 'next.js', 'hono.js'],
    // },
    // {
    //     title: 'Hono.js整合OpenAPI(Swagger)+Zod实现接口类型安全与可调试',
    //     summary:
    //         '本节课内容比较简单。为了能清晰的调试和查阅API，我们整合一下swagger（openapi）与Hono.js。这样，我们不仅能快速地在apifox、postman、insomnia等工具中调试api，也可以通过swagger web ui来查看和单点运行api',
    //     bodyPath: path.join(__dirname, '../fixture/ts-fullstack/10.md'),
    //     categoryName: 'TS全栈开发',
    //     tagNames: ['nodejs', 'typescript', 'react', 'next.js', 'hono.js', 'swagger', 'zod'],
    // },
    // {
    //     title: '我的计算机编码起始之路',
    //     summary: '记录07-13年之间，我学习计算机编程和创业的经历',
    //     bodyPath: path.join(__dirname, '../fixture/creative/1.md'),
    //     categoryName: '码农创业记',
    //     tagNames: ['创业', 'delphi', 'php'],
    // },
    // {
    //     title: '兜兜转转的创业史',
    //     summary: '记录13-22年之间，我创业和打工的经历',
    //     bodyPath: path.join(__dirname, '../fixture/creative/2.md'),
    //     categoryName: '码农创业记',
    //     tagNames: ['创业', '外包', '融资'],
    // },
    {
        title: '手把手教你用 React + Zustand 打造 Windows 风格可拖拽，缩放，多窗口 Modal 组件',
        summary: '记录仿Windows风格的可拖拽、缩放、多窗口 Modal 组件的实现',
        bodyPath: path.join(__dirname, '../fixture/wmc/1.md'),
        categoryName: '网页开发',
        tagNames: ['modal', 'typescript', 'react', 'next.js'],
        thumb: 'https://cdn.amingdrift.com/blogs/1-thumb.webp',
        createdAt: '2025-09-16T12:00:00Z', // 可自定义时间
    },
    {
        title: '【MCP系列】介绍一个我自己开发的MCP工具：MCP Shipit',
        summary: '介绍一个我自己开发的MCP工具：MCP Shipit，欢迎来github提issue，start!',
        bodyPath: path.join(__dirname, '../fixture/wmc/2.md'),
        categoryName: 'MCP工具',
        tagNames: ['typescript', 'mcp', 'nodejs'],
        thumb: 'https://cdn.amingdrift.com/blogs/2-thumb.webp',
        createdAt: '2025-10-09T12:00:00Z',
    },
    {
        title: '【MCP系列】用 MCP 扩展 AI 编辑器：从零开发一个自己的MCP服务',
        summary:
            '本文MCP协议，手把手教你构建一个自己的MCP Server，在AI编辑器实现通过自然语言指令调用自己写的工具脚本。',
        bodyPath: path.join(__dirname, '../fixture/wmc/3.md'),
        categoryName: 'MCP工具',
        tagNames: ['typescript', 'mcp', 'ai', 'nodejs'],
        thumb: 'https://cdn.amingdrift.com/blogs/3-thumb.webp',
        createdAt: '2025-10-10T12:00:00Z',
    },
    {
        title: '🧩 AI协助 一周打造「七巧板益智小游戏」：从零高效开发教学工具 💡',
        summary:
            '一个“教学痛点”引发的开发冲动。本文讲述如何利用Copilot在一周内快速开发一个面向小学数学教学的七巧板益智小游戏，涵盖需求分析、技术选型、核心算法实现及部署等全过程。',
        bodyPath: path.join(__dirname, '../fixture/wmc/4.md'),
        categoryName: '网页开发',
        tagNames: ['typescript', 'react', 'next.js', 'ai', 'copilot', 'canvas', 'Konva'],
        thumb: 'https://cdn.amingdrift.com/blogs/4-thumb.webp',
        createdAt: '2025-10-25T12:00:00Z',
    },
    {
        title: '从炫酷粒子星云学 Three.js：深度解析一个 15 万粒子的 GPU 动画系统',
        summary:
            '这周偶然在 CodePen 上刷到一个名为 “Nova” 的 3D 粒子动画，展示一个星云效果，极其酷炫。 今天就带大家一步步拆解这个 15 万个粒子的高性能动画系统',
        bodyPath: path.join(__dirname, '../fixture/wmc/5.md'),
        categoryName: '每日一知',
        tagNames: ['three.js', 'webgl', '3d'],
        thumb: 'https://cdn.amingdrift.com/blogs/5-thumb.webp',
        createdAt: '2025-10-30T12:00:00Z',
    },
    {
        title: '使用 CSS perspective 实现 3D 卡片效果',
        summary:
            '一个简单不复杂，但是能提升网页用户体验的 3D 卡片组件。本文将带你从零开始理解 `perspective` 的原理，并结合 React 生态中的优秀库（如 `react-tilt`），打造一个随鼠标移动而动态倾斜的 3D 卡片组件。',
        bodyPath: path.join(__dirname, '../fixture/wmc/6.md'),
        categoryName: '每日一知',
        tagNames: ['css', '3d', 'perspective'],
        thumb: 'https://cdn.amingdrift.com/blogs/6-thumb.gif',
        createdAt: '2025-11-11T12:00:00Z',
    },
    {
        title: '《天听计划：罗斯陷阱》',
        summary: '为构建 RAG 个人知识库系统而写的小说，简直是为醋包饺子',
        bodyPath: path.join(__dirname, '../fixture/wmc/7-tianting.md'),
        categoryName: '生活随笔',
        tagNames: ['AI', 'RAG', '小说', '个人知识库', '为醋包饺子'],
        thumb: 'https://cdn.amingdrift.com/blogs/7--thumb-tianting.png',
        createdAt: '2025-11-18T12:00:00Z',
    },
    {
        title: '用 RAG 搭建一个 AI 小说问答系统',
        summary: '从零开始手把手教你搭建一个AI RAG个人知识问答系统，新手友好。',
        bodyPath: path.join(__dirname, '../fixture/wmc/8-tianting-rag.md'),
        categoryName: '网页开发',
        tagNames: ['AI', 'RAG', '小说', '个人知识库', 'langchain.js', 'vercel ai sdk'],
        thumb: 'https://cdn.amingdrift.com/blogs/8-tianting-effect.gif',
        createdAt: '2025-11-23T12:00:00Z',
    },
];

export const createPostData = async () => {
    for (const post of data) {
        const { title, summary, bodyPath, categoryName, tagNames, thumb, createdAt } = post;
        const category = await prisma.category.findFirst({
            where: { name: categoryName },
        });
        if (!category) {
            throw new Error(`Category ${categoryName} not found`);
        }
        let tags: Prisma.TagCreateNestedManyWithoutPostsInput | undefined;
        if (!isNil(tagNames)) {
            tags = {
                connectOrCreate: tagNames.map((text) => ({ where: { text }, create: { text } })),
            };
        }
        await prisma.post.create({
            select: { id: true },
            data: {
                thumb: thumb ?? `/uploads/thumb/post-${getRandomInt(1, 15)}.png`,
                title,
                summary,
                body: readFileSync(bodyPath, 'utf8'),
                slug: generateLowerString(title),
                keywords: tagNames?.join(','),
                description: summary,
                category: {
                    connect: {
                        id: category.id,
                    },
                },
                tags,
                ...(createdAt
                    ? { createdAt: new Date(createdAt), updatedAt: new Date(createdAt) }
                    : {}),
            },
        });
    }
};
