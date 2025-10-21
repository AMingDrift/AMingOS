
import { authApi } from '@/api/auth';

export const checkIsAdmin = async () => {
    const result = await authApi.isAdmin();
    if (!result.ok) throw new Error((await result.json()).message);
    return await result.json();
};
