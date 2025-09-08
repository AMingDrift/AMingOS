import type { MDXRemoteProps } from 'next-mdx-remote-client/rsc';

import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypePrism from 'rehype-prism-plus';
import rehypeSlug from 'rehype-slug';
import remarkDirective from 'remark-directive';
import remarkFlexibleToc from 'remark-flexible-toc';
import remarkGfm from 'remark-gfm';

import { rehypeCleanLinks } from '../plugins/rehype-clean-links';
import { rehypeCodeWindow } from '../plugins/rehype-code-window';
import remarkAdmonitions from '../plugins/remark-admonitions';

/**
 * 默认mdx配置
 */
export const defaultMdxSerializeOptions: Omit<MDXRemoteProps, 'source'> = {
    options: {
        disableImports: true,
        parseFrontmatter: true,
        vfileDataIntoScope: 'toc',
        mdxOptions: {
            remarkPlugins: [remarkDirective, remarkAdmonitions, remarkGfm, remarkFlexibleToc],
            rehypePlugins: [
                [
                    rehypeExternalLinks,
                    {
                        target: '_blank',
                        rel: ['nofollow'],
                        content: null, // 不添加任何内容到链接里
                    },
                ],
                rehypeSlug,
                [
                    rehypeAutolinkHeadings,
                    { behavior: 'append', properties: { className: ['anchor'] } },
                ],
                [rehypePrism, { showLineNumbers: true, ignoreMissing: true }],
                rehypeCodeWindow,
                rehypeCleanLinks, // 添加我们的清理插件作为最后处理步骤
            ],
        },
    },
};
