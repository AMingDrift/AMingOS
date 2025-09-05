/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { cva } from 'class-variance-authority';
import React from 'react';

import { Button } from '@/_components/shadcn/ui/button';
import { cn } from '@/_components/shadcn/utils';

import type { TagInputProps, TagInputStyleClassesProps, Tag as TagType } from './tag-input';

export const tagVariants = cva(
    'inline-flex items-center rounded-md border pl-2 text-sm transition-all',
    {
        variants: {
            variant: {
                default:
                    'bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:cursor-not-allowed disabled:opacity-50',
                primary:
                    'border-primary bg-primary text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50',
                destructive:
                    'border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:cursor-not-allowed disabled:opacity-50',
            },
            size: {
                sm: 'h-7 text-xs',
                md: 'h-8 text-sm',
                lg: 'h-9 text-base',
                xl: 'h-10 text-lg',
            },
            shape: {
                default: 'rounded-sm',
                rounded: 'rounded-lg',
                square: 'rounded-none',
                pill: 'rounded-full',
            },
            borderStyle: {
                default: 'border-solid',
                none: 'border-none',
                dashed: 'border-dashed',
                dotted: 'border-dotted',
                double: 'border-double',
            },
            textCase: {
                uppercase: 'uppercase',
                lowercase: 'lowercase',
                capitalize: 'capitalize',
            },
            interaction: {
                clickable: 'cursor-pointer hover:shadow-md',
                nonClickable: 'cursor-default',
            },
            animation: {
                none: '',
                fadeIn: 'animate-fadeIn',
                slideIn: 'animate-slideIn',
                bounce: 'animate-bounce',
            },
            textStyle: {
                normal: 'font-normal',
                bold: 'font-bold',
                italic: 'italic',
                underline: 'underline',
                lineThrough: 'line-through',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'md',
            shape: 'default',
            borderStyle: 'default',
            interaction: 'nonClickable',
            animation: 'fadeIn',
            textStyle: 'normal',
        },
    },
);

export type TagProps = {
    tagObj: TagType;
    variant: TagInputProps['variant'];
    size: TagInputProps['size'];
    shape: TagInputProps['shape'];
    borderStyle: TagInputProps['borderStyle'];
    textCase: TagInputProps['textCase'];
    interaction: TagInputProps['interaction'];
    animation: TagInputProps['animation'];
    textStyle: TagInputProps['textStyle'];
    onRemoveTag: (id: string) => void;
    isActiveTag?: boolean;
    tagClasses?: TagInputStyleClassesProps['tag'];
    disabled?: boolean;
} & Pick<TagInputProps, 'direction' | 'onTagClick' | 'draggable'>;

export const Tag: React.FC<TagProps> = ({
    tagObj,
    direction,
    draggable,
    onTagClick,
    onRemoveTag,
    variant,
    size,
    shape,
    borderStyle,
    textCase,
    interaction,
    animation,
    textStyle,
    isActiveTag,
    tagClasses,
    disabled,
}) => {
    return (
        <span
            key={tagObj.id}
            draggable={draggable}
            className={cn(
                tagVariants({
                    variant,
                    size,
                    shape,
                    borderStyle,
                    textCase,
                    interaction,
                    animation,
                    textStyle,
                }),
                {
                    'justify-between w-full': direction === 'column',
                    'cursor-pointer': draggable,
                    'ring-ring ring-offset-2 ring-2 ring-offset-background': isActiveTag,
                },
                tagClasses?.body,
            )}
            onClick={() => onTagClick?.(tagObj)}
        >
            {tagObj.text}
            <Button
                type="button"
                variant="ghost"
                onClick={(e) => {
                    e.stopPropagation(); // Prevent event from bubbling up to the tag span
                    onRemoveTag(tagObj.id);
                }}
                disabled={disabled}
                className={cn(
                    `py-1 pl-3 pr-1 h-full hover:bg-transparent`,
                    tagClasses?.closeButton,
                )}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-x"
                >
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                </svg>
            </Button>
        </span>
    );
};
