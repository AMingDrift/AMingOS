'use client';

import type { FC } from 'react';

import type { ErrorBoundaryProps } from '../_components/errors/boundary';

import { ErrorBoundary } from '../_components/errors/boundary';

const AppError: FC<ErrorBoundaryProps> = (props) => (
    <div className="flex h-screen w-screen items-center justify-center">
        <ErrorBoundary {...props} />
    </div>
);

export default AppError;
