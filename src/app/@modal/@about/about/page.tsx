import { BoxReveal } from '@/_components/magicui/box-reveal';
import { SparklesText } from '@/_components/magicui/sparkles-text';
import { AuroraText } from '@/_components/shadcn/ui/aurora-text';
import { RainbowButton } from '@/_components/shadcn/ui/rainbow-button';
import Link from 'next/link';
const Page = () => {
    return (
        <div className="w-full p-5 text-base">
            <SparklesText sparklesCount={8} className="text-4xl">
                Welcome! 👏
            </SparklesText>
            <div className="flex size-full flex-col items-start justify-center gap-10 pt-8">
                <BoxReveal boxColor={'#5046e6'} duration={0.5}>
                    <section className="flex size-full flex-col items-start justify-center gap-3">
                        <h2 className="mb-2 text-2xl">☕ 关于我</h2>
                        <p className="leading-relaxed">
                            你好！我是阿明Drift👋，一名热爱技术的{' '}
                            <AuroraText>全栈开发工程师</AuroraText>，专注于 TypeScript 生态。
                        </p>
                        <ul className="prose list-disc space-y-2 pl-5">
                            <li>
                                <p className="leading-relaxed">
                                    目前主要技术栈是{' '}
                                    <AuroraText>Next.js + Tailwind CSS + Prisma</AuroraText>，
                                    致力于构建高性能、美观的现代 Web 应用
                                </p>
                            </li>
                            <li>
                                <p className="text-base leading-relaxed">
                                    早期接触过 Java 后端开发、Python 的 Flask 框架和网络爬虫技术。
                                    同时也积累了前端、运维、CICD 等全栈开发经验（全栈打工人😄）
                                </p>
                            </li>
                            <li>
                                <p className="text-base leading-relaxed">
                                    曾在德国老牌企业从事工业互联网项目，主要使用 WebGL 技术栈， 包括
                                    fabric.js、three.js、zrender 和 gojs 等图形库进行数据可视化开发
                                </p>
                            </li>
                            <li>
                                <p className="text-base leading-relaxed">
                                    业余时间也探索过如 Ionic、微信小程序和
                                    Uniapp等移动开发技术，不过并不打算作为主力
                                </p>
                            </li>
                            <li>
                                <p className="text-base leading-relaxed">
                                    正在学习和实践 Vercel AI SDK 相关技术，探索 AI 应用开发
                                </p>
                            </li>
                            <li>
                                <p className="text-base leading-relaxed">
                                    工作之余喜欢运动，包括羽毛球、徒步、骑行和滑雪等
                                </p>
                            </li>
                        </ul>
                    </section>
                </BoxReveal>

                <BoxReveal boxColor={'#5046e6'} duration={0.5}>
                    <section className="flex size-full flex-col items-start justify-center gap-3">
                        <h2 className="mb-2 text-2xl">🪐 关于本站</h2>
                        <p className="text-base leading-relaxed">
                            欢迎来到我的个人数字空间！这里是我在信息洪流中沉淀思考的港湾， 采用{' '}
                            <AuroraText>Vercel + Cloudflare</AuroraText> 进行全球部署。
                        </p>
                        <p className="text-base leading-relaxed">
                            本站主要记录我在编程技术领域的学习心得、实践经验和技术笔记，
                            同时也会分享生活感悟、AIGC 应用探索以及相关的多媒体内容。
                        </p>
                        <p className="text-base leading-relaxed">
                            网站的设计灵感来源于操作系统界面，传统博客的列表式布局已经看了太多了，
                            希望通过模拟桌面系统的交互方式，为访客带来更直观、有趣的浏览体验。
                        </p>
                        <p className="text-base leading-relaxed">
                            本站基于 <AuroraText>React 和 Next.js</AuroraText> 构建核心架构，并结合{' '}
                            <AuroraText>Shadcn UI 和 Magic UI</AuroraText> 组件库，
                            在还原系统界面质感的同时，确保了交互的流畅度与响应式适配。
                        </p>
                        <p className="text-base leading-relaxed">
                            如果网站有 Bug 欢迎反馈给我👋，或者直接在{' '}
                            <RainbowButton size="sm">
                                <Link
                                    className="animate-decoration text-sm"
                                    href="https://github.com/AMingDrift/AMingOS"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    GitHub
                                </Link>
                            </RainbowButton>{' '}
                            上提 issue
                        </p>
                        <p className="text-base leading-relaxed">
                            后续也会增加友链的功能，敬请期待🎈
                        </p>
                    </section>
                </BoxReveal>
            </div>
        </div>
    );
};

export default Page;
