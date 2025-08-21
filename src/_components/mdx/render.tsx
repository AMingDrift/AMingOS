import type { MDXRemoteProps } from 'next-mdx-remote/rsc';
import type { FC } from 'react';

import { MDXRemote } from 'next-mdx-remote/rsc';

import { deepMerge } from '@/libs/utils';

import { defaultMdxSerializeOptions } from './default-options';

/**
 * 动态mdx渲染组件
 */
export const MdxRender: FC<MDXRemoteProps> = async (props) => {
    return (
        <MDXRemote {...(deepMerge(defaultMdxSerializeOptions, props, 'merge') as MDXRemoteProps)} />
    );
};
