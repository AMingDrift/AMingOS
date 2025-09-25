'use client';

import type { FC } from 'react';

import { Check, ChevronsUpDown } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

import type { CategoryList } from '@/server/category/type';

import { Button } from '@/_components/shadcn/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/_components/shadcn/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/_components/shadcn/ui/popover';
import { cn } from '@/_components/shadcn/utils';
interface CategorySelectProps {
    categories: CategoryList;
    setValue: (value: string) => void;
    value: string;
}

export const CategorySelect: FC<CategorySelectProps> = (props) => {
    const { categories, value, setValue } = props;
    const [open, setOpen] = useState(false);
    const triggerContainerRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const popoverContentRef = useRef<HTMLDivElement | null>(null);

    const [popoverWidth, setPopoverWidth] = useState<number>(0);
    const handleOpenChange = useCallback((open: boolean) => {
        if (open && triggerContainerRef.current) {
            const { width } = triggerContainerRef.current.getBoundingClientRect();
            setPopoverWidth(width);
        }
        setOpen(open);
    }, []);

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <div
                className="relative flex items-center rounded-md border bg-transparent"
                ref={triggerContainerRef}
            >
                <PopoverTrigger asChild ref={triggerRef}>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="mr-0 flex h-full w-full justify-between border-0 bg-transparent shadow-none ring-0 hover:bg-transparent! focus-visible:ring-0!"
                    >
                        {value ? categories.find((item) => item.id === value)?.name : '选择分类...'}
                        <ChevronsUpDown className="opacity-50" />
                    </Button>
                </PopoverTrigger>
            </div>
            <PopoverContent
                ref={popoverContentRef}
                side="bottom"
                align="start"
                forceMount
                className={cn(`relative p-0`)}
                style={{
                    width: `${popoverWidth}px`,
                    minWidth: `${popoverWidth}px`,
                    zIndex: 39,
                }}
            >
                <Command>
                    <CommandInput placeholder="选择分类..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>无分类可选</CommandEmpty>
                        <CommandGroup>
                            <CommandItem
                                key="null"
                                value=""
                                onSelect={(currentValue) => {
                                    setValue(currentValue === value ? '' : currentValue);
                                    setOpen(false);
                                }}
                            >
                                不选择
                                <Check
                                    className={cn(
                                        'ml-auto',
                                        value === '' ? 'opacity-100' : 'opacity-0',
                                    )}
                                />
                            </CommandItem>
                            {categories.map((item) => (
                                <CommandItem
                                    key={item.id}
                                    value={item.id}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? '' : currentValue);
                                        setOpen(false);
                                    }}
                                >
                                    {`${'- '.repeat(item.depth - 1)}${item.name}`}
                                    <Check
                                        className={cn(
                                            'ml-auto',
                                            value === item.id ? 'opacity-100' : 'opacity-0',
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
