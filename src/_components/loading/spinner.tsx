import type { CSSProperties, FC } from 'react';

import { cn } from '@/_components/shadcn/utils';

import classes from './spinner.module.css';

export const Spinner: FC<{ className?: string; style?: CSSProperties; icon?: boolean }> = (
    props,
) => {
    const { className, style, icon = true } = props;
    const defaultClassName = cn(['h-full', 'w-full', 'flex', 'items-center', 'justify-center']);
    const wrapperClasses = className ? `${defaultClassName} ${className}` : defaultClassName;
    return (
        <div className={wrapperClasses} style={style ?? {}}>
            {icon && <div className={classes.container} />}
        </div>
    );
};
