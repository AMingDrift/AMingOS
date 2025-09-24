import type { FC, PropsWithChildren } from 'react';

import { ShineBorder } from '@/_components/magicui/shine-border';
import { Card } from '@/_components/shadcn/ui/card';
import { cn } from '@/_components/shadcn/utils';

export const ShineCard: FC<
    PropsWithChildren<{ always?: boolean; className?: string; borderRadius?: string }>
> = ({ children, className, always, borderRadius = '0.25rem' }) => {
    return (
        <Card
            className={cn(
                'bg-card/40 backdrop-blur-sm py-0 border-0',
                `rounded-[${borderRadius}]!`,
                className,
            )}
        >
            <ShineBorder
                className="h-full w-full"
                color={['#A07CFE', '#FE8FB5', '#FFBE7B']}
                always={always}
                borderRadius={borderRadius}
            >
                {children}
            </ShineBorder>
        </Card>
    );
};
