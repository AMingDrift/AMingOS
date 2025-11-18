import type { FC, PropsWithChildren } from 'react';

import { ShineBorder } from '@/_components/magicui/shine-border';
import { Card } from '@/_components/shadcn/ui/card';
import { cn } from '@/_components/shadcn/utils';

interface StackCardProps {
    className?: string;
    padding?: string;
    shine?: { open?: boolean; always?: boolean };
}
export const StackCard: FC<PropsWithChildren<StackCardProps>> = ({
    children,
    shine,
    padding = '0.75rem',
}) => {
    return (
        <Card className={cn('absolute inset-0 p-0', 'bg-card/40 backdrop-blur-sm', 'rounded-sm!')}>
            {shine ? (
                <ShineBorder
                    className="relative h-full w-full rounded-sm"
                    color={['#A07CFE', '#FE8FB5', '#FFBE7B']}
                    always={shine.always}
                    borderRadius="0.56rem"
                    padding={padding}
                >
                    {children}
                </ShineBorder>
            ) : (
                children
            )}
        </Card>
    );
};
