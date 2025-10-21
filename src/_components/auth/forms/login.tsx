'use client';

import type { FC } from 'react';

import { Lock, User } from 'lucide-react';

import { Button } from '../../shadcn/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../../shadcn/ui/form';
import { Input } from '../../shadcn/ui/input';
import { authFormHooks } from '../hooks';
const LoginForm: FC = () => {
    const form = authFormHooks.useLoginForm();
    const submitHandler = authFormHooks.useLoginSubmit();

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(submitHandler)} className="!mt-4 space-y-3">
                {/* {authEror && (
                    <div
                        className={cn(
                            'p-3 rounded-md',
                            'bg-red-50 border border-red-200',
                            'text-sm text-red-600',
                            'transition-all duration-300',
                        )}
                    >
                        {authEror}
                    </div>
                )} */}

                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="relative">
                                    <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
                                    <Input
                                        {...field}
                                        className="pl-10"
                                        autoComplete="username"
                                        placeholder="请输入用户名或邮箱地址"
                                        disabled={form.formState.isSubmitting}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="relative">
                                    <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
                                    <Input
                                        {...field}
                                        className="pl-10"
                                        type="password"
                                        autoComplete="password"
                                        placeholder="请输入密码"
                                        disabled={form.formState.isSubmitting}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="!mt-5 w-full"
                >
                    {form.formState.isSubmitting ? '登录中...' : '登录'}
                </Button>
            </form>
        </Form>
    );
};
export const AuthLoginForm: FC = () => <LoginForm />;
