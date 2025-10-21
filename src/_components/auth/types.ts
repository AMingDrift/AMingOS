export type AdminType = boolean;
export interface AuthContextType {
    admin: boolean;
    setAdmin: (value: boolean) => void;
}
