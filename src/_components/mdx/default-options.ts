import type { MDXRemoteProps } from 'next-mdx-remote/rsc';

import rehypePrism from 'rehype-prism-plus';

/**
 * 默认mdx配置
 */
export const defaultMdxSerializeOptions: Omit<MDXRemoteProps, 'source'> = {
    options: {
        mdxOptions: {
            rehypePlugins: [[rehypePrism, { showLineNumbers: true, ignoreMissing: true }]],
        },
    },
};
