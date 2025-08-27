import type { FC } from 'react';

import type { MdxRenderProps } from './types';

import { MdxHydrate } from './hydrate';
import { serializeMdx } from './utils';

/**
 * 动态mdx渲染组件
 */
export const MdxRender: FC<MdxRenderProps> = async (props) => {
    const { source, options, hydrate } = props;
    const result = await serializeMdx(source, options ?? {});
    return <MdxHydrate {...(hydrate ?? {})} serialized={result} />;
};
