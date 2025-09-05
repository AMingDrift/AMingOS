'use client';
import type { FC, JSX, PropsWithChildren } from 'react';

import { useMemo, useState } from 'react';
import { useMount } from 'react-use';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/_components/shadcn/ui/accordion';
import { cn } from '@/_components/shadcn/utils';
import { useIsMobile, useIsTablet } from '@/libs/broswer';

import $styles from './widget.module.css';
export const SidebarWidget: FC<PropsWithChildren<{ title?: JSX.Element }>> = ({
    title,
    children,
}) => {
    const mobile = useIsMobile();
    const tablet = useIsTablet();
    const [mounted, setMounted] = useState(false);
    useMount(() => {
        setMounted(true);
    });
    // 在平板设备和移动设备的屏下均设为移动设备状态
    const isMobile = useMemo(() => mobile || tablet, [mobile, tablet]);
    if (!mounted) return null;
    return isMobile ? (
        <Accordion type="single" collapsible className={$styles.mobileWidget}>
            <AccordionItem className={$styles.mobileItem} value="item-1">
                {title && (
                    <AccordionTrigger>
                        <div className={$styles.title}>{title}</div>
                    </AccordionTrigger>
                )}
                <AccordionContent>
                    <div className={cn($styles.content, 'transparent-scrollbar')}>{children}</div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    ) : (
        <div className={cn($styles.widget, 'page-block')}>
            {title && <div className={$styles.title}>{title}</div>}
            <div className={cn($styles.content, 'transparent-scrollbar')}>{children}</div>
        </div>
    );
};
