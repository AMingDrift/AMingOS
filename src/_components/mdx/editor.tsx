'use client';

import '@uiw/react-md-editor/markdown-editor.css';
import type { FC } from 'react';

import { commands } from '@uiw/react-md-editor';
import { debounce, isNil } from 'lodash';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useIsMobile } from '@/libs/broswer';

import type { MdxEditorProps, MdxHydrateProps } from './types';

import { Spinner } from '../loading/spinner';
import $styles from './editor.module.css';
import { MdxHydrate } from './hydrate';
import { serializeMdx } from './utils';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

export const MdxEditor: FC<MdxEditorProps> = (props) => {
    const { content, setContent, disabled } = props;
    const [serialized, setSerialized] = useState<MdxHydrateProps['serialized']>();
    const { resolvedTheme } = useTheme();
    const containerRef = useRef<HTMLDivElement>(null);
    const [editorHeight, setEditorHeight] = useState<number>();
    const isMobile = useIsMobile();

    const extraCommands = useMemo(() => {
        let data = [commands.codeEdit];
        if (!isMobile) data.push(commands.codeLive);
        data = [...data, commands.codePreview, commands.fullscreen];
        return data;
    }, [isMobile]);

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
            const parentHeight = containerRef.current.clientHeight;
            if (parentHeight) {
                // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
                setEditorHeight(Math.max(parentHeight, 500));
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
        <div ref={containerRef} data-color-mode={resolvedTheme} className={$styles.container}>
            {isNil(serialized) ? (
                <Spinner className="rounded-sm bg-white/80 transition-opacity duration-300 dark:bg-black/50" />
            ) : (
                <>
                    <div className="wmde-markdown-var"> </div>
                    <MDEditor
                        preview={isMobile ? 'edit' : 'live'}
                        extraCommands={extraCommands}
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
                </>
            )}
        </div>
    );
};
