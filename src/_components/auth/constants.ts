import { createContext } from 'react';

import type { AuthContextType, AuthType } from './types';

export const AuthContext = createContext<AuthContextType>({
    auth: false,
    setAuth: (_value: AuthType) => {},
});
