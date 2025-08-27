/* eslint-disable react-hooks-extra/no-direct-set-state-in-use-effect */
import type { FC, JSX, MouseEventHandler, RefObject } from 'react';

import { isNil } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * 代码复制按钮
 * @param param0
 */
export const CopyButton: FC<{ wrapperEl: Element | null }> = ({ wrapperEl }) => {
    const [copied, setCopied] = useState(false);
    const handleClick = useCallback<MouseEventHandler<HTMLButtonElement>>(
        (e) => {
            e.preventDefault();
            if (isNil(wrapperEl)) return;
            const contentEl = wrapperEl.querySelector('.code-content') as HTMLElement;
            if (isNil(contentEl)) return;
            navigator.clipboard.writeText(contentEl.textContent || '');
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        },
        [wrapperEl],
    );
    return (
        <button className="code-copy" type="button" onClick={handleClick}>
            {copied ? 'Copied!' : 'Copy'}
        </button>
    );
};

/**
 * 代码框
 * @param ref
 * @param content
 */
export const useCodeWindow = (
    ref: RefObject<HTMLDivElement | null>,
    content: JSX.Element | null,
) => {
    const [wrapperEls, setWrapperEls] = useState<NodeListOf<Element> | undefined>();
    const preventSummaryToggle = useCallback((e: Event) => e.preventDefault(), []);
    useEffect(() => {
        if (!wrapperEls) return;
        wrapperEls.forEach((wrapperEl) => {
            const headerEl = wrapperEl.querySelector('.code-header');
            if (isNil(headerEl)) return;
            headerEl.addEventListener('click', preventSummaryToggle);
            let toolsEl = headerEl.querySelector('div.code-tools') as HTMLElement;
            if (isNil(toolsEl)) {
                toolsEl = document.createElement('div');
                toolsEl.className = 'code-tools';
                headerEl.appendChild(toolsEl);
                const toolsNodes = createRoot(toolsEl);
                toolsNodes.render(<CopyButton wrapperEl={wrapperEl} />);
            }
        });
        return () => {
            wrapperEls.forEach((wrapperEls) => {
                const headerEl = wrapperEls.querySelector('summary');
                if (isNil(headerEl)) return;
                headerEl.removeEventListener('click', preventSummaryToggle);
            });
        };
    }, [wrapperEls]);

    useEffect(() => {
        if (!ref.current || !content) return;
        const wrapperEls = ref.current?.querySelectorAll('.code-window');
        setWrapperEls(wrapperEls);
    }, [content]);
};
