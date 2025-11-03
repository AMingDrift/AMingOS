'use client';

import type { FC } from 'react';

import type { ErrorBoundaryProps } from '../_components/errors/boundary';

import { ErrorBoundary } from '../_components/errors/boundary';
import $styles from './layout.module.css';
const AppError: FC<ErrorBoundaryProps> = (props) => (
    <div className={$styles.error}>
        <ErrorBoundary {...props} />
    </div>
);

export default AppError;
