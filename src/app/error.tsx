'use client';

import type { FC } from 'react';

import $styles from '@/app/layout.module.css';

import type { ErrorBoundaryProps } from '../_components/errors/boundary';

import { ErrorBoundary } from '../_components/errors/boundary';
const AppError: FC<ErrorBoundaryProps> = (props) => (
    <div className={$styles.layout}>
        <ErrorBoundary {...props} />
    </div>
);
export default AppError;
