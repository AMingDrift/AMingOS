import { BoxReveal } from '@/_components/magicui/box-reveal';
import { SparklesText } from '@/_components/magicui/sparkles-text';

const Page = () => {
    return (
        <div className="w-[80%] p-5">
            <SparklesText>阿明 Drift 的「桌面级」个人创作空间站</SparklesText>
            <div className="size-full items-center justify-center overflow-hidden pt-8">
                <BoxReveal boxColor={'#5046e6'} duration={0.5}>
                    <h2 className="mt-[.5rem] text-xl">
                        当传统博客遇上系统交互，一个能
                        <span className="bg-gradient-to-r from-[#9333ea] to-[#ec4899] bg-clip-text text-transparent">
                            「玩」
                        </span>
                        起来的个人数字空间，就此诞生。
                    </h2>
                </BoxReveal>

                <BoxReveal boxColor={'#5046e6'} duration={0.5}>
                    <div className="mt-6 text-[1.1rem]">
                        <p>
                            厌倦了千篇一律的列表式博客，我以
                            <span className="bg-gradient-to-r from-[#9333ea] to-[#ec4899] bg-clip-text font-semibold text-transparent">
                                操作系统界面
                            </span>
                            为灵感，打造了这个「桌面式站点」。它不像普通网页，而是把页面变成熟悉的「电脑桌面」页面设计还原了系统桌面的直观操作感
                            ——
                            通过仿系统图标、弹窗式功能模块、层级化布局，让访客像使用熟悉的电脑系统一样，轻松探索站点内的所有内容，打破传统博客的线性浏览局限。
                        </p>
                    </div>
                </BoxReveal>
                <BoxReveal boxColor={'#5046e6'} duration={0.5}>
                    <div className="mt-6 text-[1.1rem]">
                        <p>
                            技术实现上，站点基于
                            <span className="bg-gradient-to-r from-[#9333ea] to-[#ec4899] bg-clip-text font-semibold text-transparent">
                                {' '}
                                React{' '}
                            </span>{' '}
                            与
                            <span className="bg-gradient-to-r from-[#9333ea] to-[#ec4899] bg-clip-text font-semibold text-transparent">
                                {' '}
                                Next.js{' '}
                            </span>
                            构建核心架构，确保页面加载的高效性与 SEO 友好性；视觉层采用
                            <span className="bg-gradient-to-r from-[#9333ea] to-[#ec4899] bg-clip-text font-semibold text-transparent">
                                {' '}
                                Tailwind CSS{' '}
                            </span>
                            实现精准的样式控制，配合
                            <span className="bg-gradient-to-r from-[#9333ea] to-[#ec4899] bg-clip-text font-semibold text-transparent">
                                {' '}
                                Shadcn UI{' '}
                            </span>{' '}
                            与
                            <span className="bg-gradient-to-r from-[#9333ea] to-[#ec4899] bg-clip-text font-semibold text-transparent">
                                {' '}
                                Magic UI{' '}
                            </span>
                            两大组件库，在还原系统界面质感的同时，兼顾了交互的流畅度与响应式适配。这套技术栈不仅让「仿系统桌面」的设计理念得以完美落地，也为后续功能扩展预留了灵活的技术空间。
                        </p>
                    </div>
                </BoxReveal>

                <BoxReveal boxColor={'#5046e6'} duration={0.5}>
                    <div className="mt-6 text-[1.1rem]">
                        <p>
                            这里是我的「数字后花园」：
                            <span className="bg-gradient-to-r from-[#9333ea] to-[#ec4899] bg-clip-text font-semibold text-transparent">
                                「博客专栏」
                            </span>
                            记技术思考与生活随笔，
                            <span className="bg-gradient-to-r from-[#9333ea] to-[#ec4899] bg-clip-text font-semibold text-transparent">
                                「资源库」
                            </span>
                            存视频图片素材，
                            <span className="bg-gradient-to-r from-[#9333ea] to-[#ec4899] bg-clip-text font-semibold text-transparent">
                                「项目展厅」
                            </span>
                            放作品链接与开发故事。
                        </p>
                    </div>
                </BoxReveal>

                <BoxReveal boxColor={'#5046e6'} duration={0.5}>
                    <div className="mt-6 text-[1.1rem]">
                        <p>
                            站点已开源，若这套「桌面式」设计给你启发，欢迎去我 GitHub 仓库点亮
                            <span className="bg-gradient-to-r from-[#9333ea] to-[#ec4899] bg-clip-text font-semibold text-transparent">
                                {' '}
                                Star{' '}
                            </span>
                            ，每份支持都是迭代优化的动力！
                        </p>
                    </div>
                </BoxReveal>
            </div>
        </div>
    );
};

export default Page;
