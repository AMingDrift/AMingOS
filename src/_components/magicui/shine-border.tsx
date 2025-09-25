'use client';

import type { FC } from 'react';

import { cn } from '../shadcn/utils';

type TColorProp = string | string[];

interface ShineBorderProps {
    always?: boolean;
    borderRadius?: string;
    borderWidth?: number;
    duration?: number;
    color?: TColorProp;
    className?: string;
    children?: React.ReactNode;
    padding?: string;
}

/**
 * @name Shine Border
 * @description It is an animated background border effect component with easy to use and configurable props.
 * @param borderRadius defines the radius of the border.
 * @param borderWidth defines the width of the border.
 * @param duration defines the animation duration to be applied on the shining border
 * @param color a string or string array to define border color.
 * @param className defines the class name to be applied to the component
 * @param children contains react node elements.
 */
export const ShineBorder: FC<ShineBorderProps> = ({
    borderRadius = '0.25rem',
    borderWidth = 1,
    duration = 14,
    color = '#000000',
    always = false,
    className,
    children,
    padding = '0.75rem',
}) => {
    return (
        <div
            style={
                {
                    '--border-radius': borderRadius,
                } as React.CSSProperties
            }
            className={cn(
                'relative w-fit place-items-center rounded-[var(--border-radius)] bg-card/40',
                !always && '[&_>div:first-child]:hidden [&:hover_>div:first-child]:block',
                className,
            )}
        >
            <div
                style={
                    {
                        '--border-width': `${borderWidth}px`,
                        '--border-radius': borderRadius,
                        '--duration': `${duration}s`,
                        '--mask-linear-gradient': `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
                        '--background-radial-gradient': `radial-gradient(transparent,transparent, ${Array.isArray(color) ? color.join(',') : color},transparent,transparent)`,
                    } as React.CSSProperties
                }
                className={cn(
                    'before:bg-shine-size pointer-events-none before:absolute before:inset-0 before:border-border',
                    'before:size-full before:rounded-[var(--border-radius)]',
                    'before:p-[var(--border-width)] before:will-change-[background-position]',
                    'before:content-[""] before:[-webkit-mask-composite:xor]!',
                    'before:[background-image:var(--background-radial-gradient)] before:[background-size:300%_300%]',
                    'before:[mask-composite:exclude]! before:[mask:var(--mask-linear-gradient)]',
                    'motion-safe:before:animate-shine',
                )}
            ></div>
            <div
                style={{ '--padding': padding } as React.CSSProperties}
                className={`flex h-full w-full items-start p-[var(--padding)]`}
            >
                {children}
            </div>
        </div>
    );
};
