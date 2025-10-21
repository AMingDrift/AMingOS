'use client';
import type { DeepNonNullable } from 'utility-types';

import { zodResolver } from '@hookform/resolvers/zod';
import { isNil } from 'lodash';
import { useRouter } from 'next/navigation';
import { use, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import type { GithubUser, LoginRequest, User } from '@/server/user/type';

import { authApi } from '@/api/auth';
import { loginRequestSchema } from '@/server/user/schema';

import { AuthContext } from './constants';

export const useAdmin = () => {
    const { admin } = use(AuthContext);
    return useMemo(() => admin, [admin]);
};

export const useSetAdmin = () => {
    const { setAdmin } = use(AuthContext);
    return useCallback((admin: boolean) => setAdmin(admin), []);
};
