import type { CSSProperties, FC } from 'react';

import { cn } from '@/_components/shadcn/utils';

import classes from './spinner.module.css';

export const Spinner: FC<{ className?: string; style?: CSSProperties }> = ({
    className,
    style,
}) => {
    const defaultClassName = cn(['h-full', 'w-full', 'flex', 'items-center', 'justify-center']);
    const wrapperClasses = className ? `${defaultClassName} ${className}` : defaultClassName;
    return (
        <div className={wrapperClasses} style={style ?? {}}>
            <div className={classes.container} />;
        </div>
    );
};
