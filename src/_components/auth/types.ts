import type { User } from '@/server/user/type';
export type AuthType = User | null | false;
export interface AuthContextType {
    auth: AuthType;
    setAuth: (value: AuthType) => void;
}
