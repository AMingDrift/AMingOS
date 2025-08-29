import type { FC } from 'react';

import { ErrorNotFound } from '@/_components/errors/not-found';

import $styles from './layout.module.css';

const AppNotFound: FC = () => (
    <div className={$styles.layout}>
        <ErrorNotFound />
    </div>
);

export default AppNotFound;
