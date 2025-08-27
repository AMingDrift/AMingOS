// src/app/_components/mdx/options/serialize.ts
import type { MDXRemoteProps } from 'next-mdx-remote-client/rsc';

import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypePrism from 'rehype-prism-plus';
import rehypeSlug from 'rehype-slug';
import remarkDirective from 'remark-directive';
import remarkFlexibleToc from 'remark-flexible-toc';
import remarkGfm from 'remark-gfm';

import { rehypeCodeWindow } from '../plugins/rehype-code-window';
import remarkAdmonitions from '../plugins/remark-admonitions';
/**
 * 默认mdx配置
 */
export const defaultMdxSerializeOptions: Omit<MDXRemoteProps, 'source'> = {
    options: {
        parseFrontmatter: true,
        vfileDataIntoScope: 'toc',
        mdxOptions: {
            remarkPlugins: [remarkDirective, remarkAdmonitions, remarkGfm, remarkFlexibleToc],
            rehypePlugins: [
                [rehypeExternalLinks, { target: '_blank' }],
                rehypeSlug,
                [rehypeAutolinkHeadings, { behavior: 'append' }],
                [rehypePrism, { showLineNumbers: true, ignoreMissing: true }],
                rehypeCodeWindow,
            ],
        },
    },
};
