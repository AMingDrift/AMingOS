import { createContext } from 'react';

import type { AuthContextType } from './types';

export const AuthContext = createContext<AuthContextType>({
    admin: false,
    setAdmin: (_value: boolean) => {},
});
