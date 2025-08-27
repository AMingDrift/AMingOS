// src/app/_components/mdx/options/serialize.ts
import type { MDXRemoteProps } from 'next-mdx-remote-client/rsc';

import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrism from 'rehype-prism-plus';
import rehypeSlug from 'rehype-slug';

import { rehypeCodeWindow } from '../plugins/rehype-code-window';
/**
 * 默认mdx配置
 */
export const defaultMdxSerializeOptions: Omit<MDXRemoteProps, 'source'> = {
    options: {
        mdxOptions: {
            rehypePlugins: [
                rehypeSlug,
                [rehypeAutolinkHeadings, { behavior: 'append' }],
                [rehypePrism, { showLineNumbers: true, ignoreMissing: true }],
                rehypeCodeWindow,
            ],
        },
    },
};
