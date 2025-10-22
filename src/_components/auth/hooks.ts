'use client';
import { use, useCallback, useMemo } from 'react';

import { AuthContext } from './constants';

export const useAdmin = () => {
    const { admin } = use(AuthContext);
    return useMemo(() => admin, [admin]);
};

export const useSetAdmin = () => {
    const { setAdmin } = use(AuthContext);
    return useCallback((admin: boolean) => setAdmin(admin), []);
};
