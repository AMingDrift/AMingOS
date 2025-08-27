// src/app/_components/mdx/editor.tsx
'use client';

import '@uiw/react-md-editor/markdown-editor.css';
import type { FC } from 'react';

import { debounce, isNil } from 'lodash';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { MdxEditorProps, MdxHydrateProps } from './types';

import $styles from './editor.module.css';
import { MdxHydrate } from './hydrate';
import { serializeMdx } from './utils';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

export const MdxEditor: FC<MdxEditorProps> = (props) => {
    const { content, setContent, disabled } = props;
    const [serialized, setSerialized] = useState<MdxHydrateProps['serialized']>();
    const { theme } = useTheme();
    const containerRef = useRef<HTMLDivElement>(null);
    const [editorHeight, setEditorHeight] = useState<number>();

    // 防抖效果，减少序列化次数
    const debouncedSerialize = useCallback(
        debounce(async (text: string) => {
            const serialized = await serializeMdx(text);
            setSerialized(serialized);
        }, 300),
        [],
    );

    useEffect(() => {
        if (!isNil(content)) debouncedSerialize(content);
        return () => {
            debouncedSerialize.cancel();
        };
    }, [content]);

    const updateHeight = useCallback(() => {
        if (containerRef.current) {
            const scrollAreaEle = containerRef.current?.closest(
                '[data-slot="scroll-area-viewport"]',
            ) as HTMLElement | null;
            if (!scrollAreaEle) return;
            const targetTop = containerRef.current.offsetTop; // 目标元素高度（含边框和内边距）
            const ancestorTop = scrollAreaEle.offsetTop; // 祖先元素高度
            const delta = targetTop - ancestorTop;
            const scrollAreaHeight = scrollAreaEle.clientHeight;
            if (scrollAreaHeight) {
                setEditorHeight(scrollAreaHeight - delta - 35);
            }
        }
    }, [containerRef.current]);

    useEffect(() => {
        if (!isNil(serialized) && isNil(editorHeight)) updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => {
            window.removeEventListener('resize', updateHeight);
        };
    }, [serialized]);

    return (
        serialized && (
            <div ref={containerRef} data-color-mode={theme} className={$styles.container}>
                <div className="wmde-markdown-var"> </div>
                <MDEditor
                    value={content}
                    onChange={setContent}
                    height={editorHeight}
                    minHeight={editorHeight}
                    textareaProps={{ disabled }}
                    visibleDragbar
                    components={{
                        preview: () => <MdxHydrate serialized={serialized} toc={false} />,
                    }}
                />
            </div>
        )
    );
};
