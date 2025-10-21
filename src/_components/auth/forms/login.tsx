'use client';

import type { FC } from 'react';

import { Button } from '../../shadcn/ui/button';
import { authApi } from '@/api/auth';
import { checkIsAdmin } from '../actions';
const LoginForm: FC = () => {
    checkIsAdmin().then((res) => {
        console.log('Is admin?,', res);
    });

    authApi.getSession().then((res) => {
        console.log('Github name', res.data?.user.name);
    });

    return (
        <Button
            onClick={async () => {
                await authApi.signInGithub();
            }}
            variant="outline"
            className="w-full"
            type="button"
        >
            Sign in with GitHub
        </Button>
    );
};
export const AuthLoginForm: FC = () => <LoginForm />;
