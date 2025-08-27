// src/app/_components/mdx/types.ts
import type { HydrateProps, SerializeResult } from 'next-mdx-remote-client';
import type { MDXRemoteProps } from 'next-mdx-remote-client/rsc';
import type { Compatible } from 'vfile';

/**
 * mdx序列化配置
 */
export type MdxSerializeOptions = Omit<MDXRemoteProps, 'source'>;

/**
 * mdx水合配置
 */
export type MdxHydrateOptions = Omit<HydrateProps, 'compiledSource'>;

/**
 * mdx水合组件props
 */
export interface MdxHydrateProps extends MdxHydrateOptions {
    serialized: SerializeResult;
}

/**
 * mdx渲染器组件props
 */
/**
 * mdx渲染器组件props
 */
export interface MdxRenderProps {
    source: Compatible;
    options?: MdxSerializeOptions;
    hydrate?: MdxHydrateOptions;
}
