import React from 'react';

import { cn } from '@/_components/shadcn/utils';
import { formatTime } from '@/libs/time';

const FormattedDateTime = ({ date, className }: { date: string; className?: string }) => {
    return (
        <p className={cn('body-1 text-light-200', className)}>{date ? formatTime(date) : '—'}</p>
    );
};

export default FormattedDateTime;
