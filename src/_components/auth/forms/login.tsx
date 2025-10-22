'use client';

import { useState, type FC } from 'react';

import { Button } from '../../shadcn/ui/button';
import { authApi, authClient } from '@/api/auth';
import { checkIsAdmin } from '../actions';
const LoginForm: FC = () => {
    const [username, setUsername] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    const checkAdmin = async () => {
        const res = await checkIsAdmin();
        setIsAdmin(res);
    };
    const getSession = async () => {
        const res = await authApi.getSession();
        setUsername(res.data?.user.name || '');
    };

    getSession();
    checkAdmin();

    return (
        <>
            {username && (
                <div className="text-center text-3xl">
                    Hello {username} {isAdmin ? '老总' : '客人'}
                </div>
            )}
            {!username && (
                <Button
                    onClick={async () => {
                        await authApi.signInGithub({ callbackURL: '/auth/login' });
                        await getSession();
                        await checkAdmin();
                    }}
                    variant="outline"
                    className="w-full"
                    type="button"
                >
                    Sign in with GitHub
                </Button>
            )}
            {username && (
                <Button
                    onClick={async () => {
                        await authClient.signOut();
                        await getSession();
                        await checkAdmin();
                    }}
                    variant="outline"
                    className="w-full"
                    type="button"
                >
                    Sign out
                </Button>
            )}
        </>
    );
};
export const AuthLoginForm: FC = () => <LoginForm />;
