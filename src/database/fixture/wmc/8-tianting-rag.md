---
# 用 RAG 搭建一个 AI 小说问答系统
---

这两年 AI 应用特别火，包括 RAG（Retrieval-Augmented Generation，检索增强生成）这个概念，几乎成了私有知识库问答系统的标配。上周我也手痒，想自己搭一个 demo 玩玩。

但问题来了：现在主流的大模型，对《红楼梦》《三体》甚至《凡人修仙传》都熟的不能再熟了。如果拿这些作品做测试，实在是不能一眼看出效果——模型可能压根没查你的知识库，靠大模型的训练语料库就答出来了。

于是我想了个办法：**我自己写一篇大模型绝对没见过的小说**。

## 一篇“刘慈欣风格”的原创短篇

我用 AI 辅助（豆包和通义），几天写了一篇仿大刘的科幻短篇，叫《天听计划》。

> 故事设定在一个监听外星信号的时代，主角丁仪发现所谓的“罗斯文明”发来的信息，其实精准复刻了人类历史上几起极其冷门的航天事故细节……由此引出一个细思极恐的猜测：这不是来自外星的问候，而是一场精心设计的“陷阱”。

这篇小说目前只存在于我的 GitHub 仓库里（[tianting.md](https://github.com/AMingDrift/tianting-rag/blob/main/doc/tianting.md)），大模型肯定不认识。正好拿来当“纯净”的私有知识源。

## 按照惯例，先上效果

![tianting-rag-demo](https://cdn.amingdrift.com/blogs/8-tianting-effect.gif)

## 技术栈选择：LangChain.js + Vercel AI SDK

这次我想试试两个当前最热门的 JS 生态工具：

- [**LangChain.js**](https://docs.langchain.com/oss/javascript/langchain/overview)：用来处理后端的数据预处理和查询逻辑，比如分块（langchain 的 RecursiveCharacterTextSplitter）、调用 HuggingFace 做 embedding、连接数据库等。
- [**Vercel AI SDK**](https://ai-sdk.dev/docs/getting-started/nextjs-app-router)：搭配 Next.js 做前端聊天界面，天然支持流式响应、useChat hook，开发体验非常丝滑。

### 数据存储：Supabase + pgvector

我选了 [Supabase](https://supabase.com/) 作为数据库，因为它免费、开箱即用，还内置了 `pgvector` 扩展——这是 PostgreSQL 里做向量相似度检索的利器。部署时选了新加坡节点（也可选日韩节点），延迟低，对国内访问也友好。

### API 服务：HuggingFace + Groq

目前这两个 API 我使用下来都是免费的，只不过有 qps 限制

- **Embedding**：调用 HuggingFace Inference API 的 [`BAAI/bge-m3`](https://huggingface.co/BAAI/bge-m3) 模型。
- **大模型推理**：用 [`Groq`](https://console.groq.com/home) 调用通义千问 Qwen3-32B，速度极快。

`HuggingFace Inference`和`Groq`这两个 API 对个人开发者极其友好，省心又省钱。

#### HuggingFace Inference API Usage

我自己调用`BAAI/bge-m3`模型 300 多次，没有一分钱；相比 Deepseek 调用了 40 多次就要收我$0.03（虽然算在免费额度里）

![hf-usage.png](https://cdn.amingdrift.com/blogs/8-hf-usage.png)

#### Groq API Rate limit

Groq 包含了 Qwen3-32B 模型，也有 openai 的 gpt，只是限制 rate limit，个人项目足够用了

![groq-rate-limit.png](https://cdn.amingdrift.com/blogs/8-groq-rate-limit.png)

> **缺点**：
>
> 要科学上网配置代理，解决调用 HuggingFace Fetch API 时的网络问题以及 groq 地域限制问题
>
> 我自己是 wsl2 环境，Clash 设置把局域网连接打开，把 ip 粘到 `.env`就可以了，用 `undici` 库来配置代理。
>
> ```typescript
> export async function setProxy() {
>   if (typeof process !== "undefined" && process.versions?.node) {
>     console.log("---------------setProxy---------------");
>     const PROXY_URL = process.env.PROXY_URL || "";
>     if (PROXY_URL) {
>       // 动态引入 undici，避免在非 Node.js 环境(Next.js)下引入
>       const { ProxyAgent, setGlobalDispatcher } = await import("undici");
>       const proxyAgent = new ProxyAgent({
>         uri: PROXY_URL,
>         keepAliveTimeout: 10000,
>         keepAliveMaxTimeout: 10000,
>         connect: {
>           rejectUnauthorized: false, // 开发环境
>         },
>       });
>       setGlobalDispatcher(proxyAgent);
>     }
>   }
> }
> ```
>
> 线上环境我用的 vercel+cloudflare 部署就不需要代理了

> 其他 API
>
> 我也试了阿里云的 API，在`scripts/query.ts`中作为脚本测试 RAG 的回答，不过它的 免费额度 API 只能用 3 个月，不支持长期白嫖。

### 项目结构简览

```

tianting-rag/
├── scripts/
│ ├── chunking.ts # 小说分块 + 生成 embedding + 存入 Supabase
│ └── query.ts # 命令行测试问答
├── app/
│ ├── page.tsx # 聊天界面（用 Vercel AI SDK）
│ └── api/chat/route.ts # RAG 核心逻辑
└── doc/tianting.md # 我的原创小说原文

```

本地跑起来也很简单，可直接参考我的[README](https://github.com/AMingDrift/tianting-rag/blob/main/README.md)：

```bash
pnpm install
cp .env.example .env  # 填入 HF 和 Groq 的 API Key
pnpm chunking         # 预处理数据
pnpm dev              # 启动 Web 界面
```

## 构建 RAG 步骤

简单说，RAG 分四步走：

1. **分块（Chunking）**：把长文本切成小段，每段保留上下文语义。

    ```typescript
    // scripts/chunk.ts
    import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
    ...
    interface ChunkWithMeta {
         chunk: string;
         meta: {
             chapter: string;
             startInChapter: number; // 在章节内的起始位置
             globalStart: number; // 在全文中的起始位置
         };
     }

    async function chunkText(
         text: string,
         chunkSize = CHUNK_SIZE,
         overlap = CHUNK_OVERLAP
    ): Promise<ChunkWithMeta[]> {
         // 1. 提取章节边界
         const chapterRegex = /^##\s+第[零一二三四五六七八九十百千\d]+章\s+(.+)$/gm;
         let match;
         const chapters: { title: string; start: number; end: number }[] = [];

         while ((match = chapterRegex.exec(text)) !== null) {
             chapters.push({ title: match[1], start: match.index, end: 0 });
         }

         // 设置每个章节的结束位置
         for (let i = 0; i < chapters.length; i++) {
             chapters[i].end = i < chapters.length - 1 ? chapters[i + 1].start : text.length;
         }

         // 如果没有章节，则视为一个整体章节
         if (chapters.length === 0) {
             chapters.push({ title: "Untitled", start: 0, end: text.length });
         }

         console.log("[INFO] 检测到章节：", chapters);

         // 2. 初始化 splitter（支持中日泰等语言）
         const splitter = new RecursiveCharacterTextSplitter({
             chunkSize,
             chunkOverlap: overlap,
             separators: [
                 "\r\n",
                 "\n\n", // 段落
                 "\n", // 行
                 "。",
                 "．",
                 ".", // 中文/全角/英文句号
                 "？",
                 "！",
                 "?",
                 "!",
                 "；",
                 ";",
                 "，",
                 ",",
                 "、",
                 " ", // 空格
             ],
         keepSeparator: false, // 分隔符不保留在 chunk 中
      });

      const allChunks: ChunkWithMeta[] = [];

      // 3. 对每个章节单独切分
      for (const chapter of chapters) {
        const chapterText = text.slice(chapter.start, chapter.end).trim();
        if (!chapterText) continue;

        console.log(`[INFO] 正在处理章节：${chapterText.slice(0, 30)}...`);

        // 使用 splitter 切分该章节
        const docs = await splitter.createDocuments([chapterText]);

        // 记录该章节在原文中的起始偏移，用于计算 globalStart
        const chapterGlobalStart = chapter.start;

        docs.forEach((doc, idx) => {
          // 估算该 chunk 在章节内的起始位置（近似，因 splitter 可能 trim）
          // 更精确的做法需自定义 lengthFunction 或解析 offset，但通常 meta 足够
          const startInChapter = idx === 0 ? 0 : undefined; // 精确位置较复杂，可省略或估算

          allChunks.push({
             chunk: doc.pageContent,
             meta: {
                 chapter: chapter.title,
                 globalStart: chapterGlobalStart, // 可用于定位原文
                 // 若需更精确位置，可结合源文本匹配，但通常非必需
                 startInChapter: startInChapter || 0,
             },
          });
        });
      }

      console.log("[INFO] 检测到 chunk：", allChunks);

      return allChunks;
    }
    ```

2. **嵌入（Embedding）**：用`bge-m3`模型（免费开源，支持中文长文本）把每段文字转成高维向量。

    ```typescript
    // lib/utils.ts

    import { type FeatureExtractionOutput, InferenceClient, } from "@huggingface/inference";
    ...

    export async function getEmbedding(
        text: string,
        apiKey: string,
        model: string
    ): Promise<FeatureExtractionOutput> {
        const client = new InferenceClient(apiKey);
        return await client.featureExtraction({
            model: model,
            inputs: text,
            provider: "auto",
        });
    }
    ```

    ```typescript
    // scripts/chunk.ts

    // 使用 service role key 创建客户端（高权限）
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    for (let i = 0; i < chunks.length; i++) {
      const { chunk, meta } = chunks[i];
      console.log(`[${i + 1}/${chunks.length}] 正在生成 embedding...`);

      const embeddingRaw = await getEmbedding(
        chunk,
        HF_API_KEY,
        EMBEDDING_MODEL
      );
      let embedding: number[] = [];
      if (typeof embeddingRaw === "number") {
        embedding = [embeddingRaw];
      } else if (Array.isArray(embeddingRaw)) {
        embedding = Array.isArray(embeddingRaw[0])
          ? (embeddingRaw[0] as number[])
          : (embeddingRaw as number[]);
      }

      // 👇 直接用 Supabase SDK 插入
      const { error } = await supabase.from("chunks").insert({
        chunk,
        meta,
        embedding, // Supabase 自动转为 vector
      });

      if (error) {
        console.error("插入失败:", error);
        throw error;
      }

      console.log({
        meta,
        chunk: chunk.slice(0, 40) + "...",
        embedding: embedding.slice(0, 5),
      });

      await sleep(3000); // 避免 API 限流
    }
    ```

3. **检索 + 生成**：用户提问时，先将问题也转成向量，在向量库里找最相似的几个文本块，再把这些“证据”加到`prompt`中统一塞给大模型，请它基于这些内容生成答案。

    ```typescript
    // app/api/chat/route.ts
    import { MultiRateLimiter, setProxy } from "@/lib/utils";
    import {
      streamText,
      UIMessage,
      convertToModelMessages,
      APICallError,
    } from "ai";
    import { createClient } from "@/lib/supabase/server";
    import { getEmbedding } from "@/lib/utils";
    import { groq } from "@ai-sdk/groq";
    ...

    export async function POST(req: Request) {
      // 获取客户端IP地址
      const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("x-real-ip") ||
        req.headers.get("cf-connecting-ip") ||
        "unknown";

      // 检查是否超出速率限制
      if (!rateLimiter.isAllowed(ip)) {
        return new Response(
          JSON.stringify({
            error: "Too Many Requests",
            message: "请求过于频繁，请稍后再试",
          }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "Retry-After": "60",
            },
          }
        );
      }

      const { messages }: { messages: UIMessage[] } = await req.json();

      await setProxy();
      const HF_API_KEY = process.env.HF_API_KEY || "";
      // 取用户最新一条消息作为 query
      const userMsg = messages.filter((m) => m.role === "user").pop();
      // 拼接 parts 里的 text
      const queryText =
        userMsg?.parts?.map((p) => (p.type === "text" ? p.text : "")).join("") ||
        "";
      if (!queryText) {
        return new Response("No user query", { status: 400 });
      }

      try {
        const supabase = await createClient();

        const embeddingRaw = await getEmbedding(
          queryText,
          HF_API_KEY,
          EMBEDDING_MODEL
        );
        // getEmbedding 可能返回 number | number[] | number[][]，需转为 number[]
        let queryEmbedding: number[] = [];
        if (typeof embeddingRaw === "number") {
          queryEmbedding = [embeddingRaw];
        } else if (Array.isArray(embeddingRaw)) {
          if (embeddingRaw.length > 0 && Array.isArray(embeddingRaw[0])) {
            // number[][]
            queryEmbedding = embeddingRaw[0] as number[];
          } else {
            // number[]
            queryEmbedding = embeddingRaw as number[];
          }
        }

        const { data, error } = await supabase
          .rpc("match_chunks", {
            query_embedding: queryEmbedding,
            match_count: TOP_K,
          })
          .select("chunk, meta, cosine_distance");

        if (error) {
          console.error("Supabase 向量搜索失败:", error);
          throw new Error("检索失败");
        }

        // 确保 data 是数组格式，以便可以使用 map 方法
        const dataArray = Array.isArray(data) ? data : [data];
        const context = dataArray
          .map((row: { chunk: string }) => row.chunk)
          .join("\n\n");

        // 3. 调用大模型（保持不变）
        const systemPrompt = `你是《天听计划：罗斯陷阱》小说问答助手...`;
        const ragMessages: Omit<UIMessage, "id">[] = [
          { role: "system", parts: [{ type: "text", text: systemPrompt }] },
          {
            role: "user",
            parts: [
              {
                type: "text",
                text: `已检索片段：\n${context}\n\n用户问题：${queryText}`,
              },
            ],
          },
        ];

        const resultStream = streamText({
          model: groq("qwen/qwen3-32b"),
          messages: convertToModelMessages(ragMessages),
        });

        return resultStream.toUIMessageStreamResponse();
      } catch (error) {
        // 1. 捕获并判断 AI 调用相关错误（如 403、401、500 等）
        if (error instanceof APICallError) {
          console.error("AI API 调用错误：", error); // 日志记录错误详情

          // 解析错误信息（从 error 对象中提取关键信息）
          const errorDetails = {
            status: error.statusCode || 500,
            message: error.responseBody
              ? JSON.parse(error.responseBody).error?.message || "API 调用失败"
              : "未知的 API 错误",
            reason:
              error.statusCode === 403
                ? "可能是 API 密钥无效、权限不足或模型访问受限"
                : error.statusCode === 401
                ? "API 密钥未提供或无效"
                : error.statusCode === 429
                ? "API 调用频率超限"
                : "服务端异常",
          };

          // 2. 向前端返回 SSE 格式的错误响应（适配前端 useChat 钩子）
          const errorStream = new ReadableStream({
            async start(controller) {
              // SSE 格式：data: {JSON}\n\n（前端可解析为错误消息）
              const errorMessage = JSON.stringify({
                type: "error",
                ...errorDetails,
              });
              controller.enqueue(
                new TextEncoder().encode(`data: ${errorMessage}\n\n`)
              );
              controller.close(); // 关闭流
            },
          });

          return new Response(errorStream, {
            status: errorDetails.status,
            headers: {
              "Content-Type": "text/event-stream",
              "Cache-Control": "no-cache",
            },
          });
        }

        // 3. 捕获其他普通错误（如参数解析失败、工具函数错误）
        console.error("通用错误：", error);
        const commonError = {
          type: "error",
          status: 400,
          message: "请求处理失败",
          reason: error instanceof Error ? error.message : "未知错误",
        };

        // 返回 SSE 格式错误（或 JSON 格式，根据前端需求选择）
        const errorStream = new ReadableStream({
          start(controller) {
            controller.enqueue(
              new TextEncoder().encode(
                `data: ${JSON.stringify(commonError)}\n\n`
              )
            );
            controller.close();
          },
        });

        return new Response(errorStream, {
          status: 400,
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
          },
        });
      }
    }
    ```

    这样既能利用大模型的语言能力，又能确保回答基于你自己的数据，而不是它的“幻觉”。

4. **前端流式输出**：最后用 useChat 钩子，将大模型返回的流式数据流化，并展示给用户。

    ```typescript
    "use client";

    import { useChat } from "@ai-sdk/react";
    import { useState, useRef, useEffect } from "react";
    import { QUERY_LIST } from "@/lib/constant";
    import { Button } from "@/components/ui/button";
    import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuTrigger,
    } from "@/components/ui/dropdown-menu";
    import ReactMarkdown from "react-markdown";
    import "github-markdown-css/github-markdown-light.css";
    import "./markdown-compact.css";
    import { toast } from "sonner";
    import { RainbowButton } from "@/components/ui/rainbow-button";
    import Link from "next/link";

    export default function Chat() {
      const [input, setInput] = useState("");
      const [messagesHeight, setMessagesHeight] = useState("auto");
      const formRef = useRef<HTMLFormElement>(null);
      const messagesEndRef = useRef<HTMLDivElement>(null);
      const { messages, sendMessage } = useChat({
        onError: (err) => {
          console.error("前端捕获错误：", err);
          // 显示错误提示（如弹窗、Toast）
          toast.error(`请求失败：${err.message || "未知错误"}`);
        },
      });

      useEffect(() => {
        const calculateHeights = () => {
          if (formRef.current) {
            const formHeight = formRef.current.offsetHeight;
            // 优先使用 window.visualViewport.height，兼容性处理
            const screenHeight =
              window.visualViewport?.height || window.innerHeight;
            const headerHeight = 20; // pt-5 = 1.25rem = 20px
            const availableHeight = screenHeight - formHeight - headerHeight;
            setMessagesHeight(`${availableHeight}px`);
          }
        };

        // 初始计算
        calculateHeights();

        // 窗口大小改变时重新计算
        window.addEventListener("resize", calculateHeights);

        // 观察表单尺寸变化
        const resizeObserver = new ResizeObserver(calculateHeights);
        if (formRef.current) {
          resizeObserver.observe(formRef.current);
        }

        return () => {
          window.removeEventListener("resize", calculateHeights);
          resizeObserver.disconnect();
        };
      }, []);

      useEffect(() => {
        // 消息变化时滚动到底部
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, [messages]);

      return (
        <div className="flex flex-col min-h-screen w-full items-center backdrop-blur-md">
          <div className="flex flex-col w-full flex-1 items-center pt-5  ">
            <div
              className=" scrollbar-custom size-full flex flex-col items-center overflow-auto  scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700"
              style={{ height: messagesHeight }}
            >
              <div className="flex flex-col gap-4  w-full max-w-4xl px-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`w-full flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`whitespace-pre-wrap p-4 rounded-2xl max-w-[80%] break-words shadow-md mb-2 ${
                        message.role === "user"
                          ? "bg-blue-100/70 text-blue-900"
                          : "bg-zinc-100/70 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                      }`}
                    >
                      {message.parts.map((part, i) => {
                        switch (part.type) {
                          case "text": {
                            // 屏蔽 <think>...</think> 标签及内容
                            const cleanText = part.text.replace(
                              /<think>[\s\S]*?<\/think>/g,
                              ""
                            );
                            return message.role === "user" ? (
                              <div key={`${message.id}-${i}`}>{cleanText}</div>
                            ) : (
                              <div
                                className="markdown-body bg-transparent!"
                                key={`${message.id}-${i}`}
                              >
                                <ReactMarkdown>{cleanText}</ReactMarkdown>
                              </div>
                            );
                          }
                          default:
                            return null;
                        }
                      })}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>
          <form
            ref={formRef}
            className="w-full max-w-4xl w-4xl flex flex-col items-center gap-1 fixed bottom-0 left-1/2 -translate-x-1/2 rounded-md bg-white/80 dark:bg-zinc-9550/80 pb-6 pt-2 px-4 border-t border-zinc-200 dark:border-zinc-800"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage({ text: input });
              setInput("");
            }}
          >
            <div className="flex items-center gap-1 w-full mb-1 justify-between">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="cursor-pointer" type="button">
                    常见问题
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-60 overflow-y-auto max-w-[90dvw]">
                  {QUERY_LIST.map((q, idx) => (
                    <DropdownMenuItem
                      key={idx}
                      className="cursor-pointer py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 whitespace-normal break-words"
                      onClick={() => {
                        sendMessage({ text: q });
                        setInput("");
                      }}
                    >
                      {q}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <RainbowButton size="sm">
                <Link
                  className="animate-decoration text-sm"
                  href="https://www.amingdrift.com/blog/posts/tian-ting-ji-hua-luo-si-xian-jing"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  原文链接
                </Link>
              </RainbowButton>
            </div>
            <input
              className="w-full p-3 border border-zinc-300 dark:border-zinc-800 rounded-xl shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={input}
              placeholder="请问一些关于《天听计划》的问题..."
              onChange={(e) => setInput(e.currentTarget.value)}
            />
          </form>
        </div>
      );
    }
    ```

## 写在最后

这个项目虽然小，但完整走通了从“创作私有内容”到“构建智能问答系统”的闭环。它不仅是 RAG 的实践 demo，也是我对“个人知识管理”未来的一种想象：**每个人都可以拥有一个只理解你、只回答你关心问题的 AI 助手**。

如果你也对 RAG 感兴趣，也可以来我仓库转转，作为新手入门的参考

> [https://github.com/AMingDrift/tianting-rag](https://github.com/AMingDrift/tianting-rag)

### 关于小说本身

说实话，自己给这篇小说打分大概是 65 - 70 分，设定太多，文学性描写过少，导致可读性不太高，老婆也是看不下去了 🤣。

### 关于写小说的体验

这次写小说即使是配合了 AI，我也感觉没有很轻松，尤其是做设定时，AI 有时的逻辑并不严谨。而且经常写到一半我要改设定，但改了前面，后面的内容发展就要大改；后面为了文学性改点内容，前面的铺垫和背景就也要大改。

写之前：我一定要写一个逻辑清晰，人物丰满，有深度的科幻小说！

写一半：啥玩意，我是谁，我在哪，我为啥在写小说？

写了三天也是感觉有点心累了。估计以后再也不碰了，说实话，比写代码累。。。写一个科幻小说就得想一堆设定，还得兼顾逻辑性和文学性，但是写代码就不一样，大部分都是可重用，并且有时能用就行，大多情况下别人并不在意你代码是否优雅。

这次姑且算是有趣的尝试。
