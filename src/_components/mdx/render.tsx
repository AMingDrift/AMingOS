import type { FC } from 'react';

import type { MdxRnderProps } from './types';

import { MdxHydrate } from './hydrate';
import { serializeMdx } from './utils';

/**
 * 动态mdx渲染组件
 * @param props
 */
export const MdxRender: FC<MdxRnderProps> = async (props) => {
    const { source, options, hydrate, header } = props;
    const result = await serializeMdx(source, options ?? {});
    return <MdxHydrate {...(hydrate ?? {})} serialized={result} header={header} />;
};
