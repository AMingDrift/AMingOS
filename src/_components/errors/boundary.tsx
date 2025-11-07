'use client';

import { MouseEventHandler, useCallback, type FC } from 'react';

import Link from 'next/link';

export interface ErrorBoundaryProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export const ErrorBoundary: FC<ErrorBoundaryProps> = ({ error, reset }) => {
    const handleResetAndRedirect = useCallback<MouseEventHandler<HTMLAnchorElement>>(
        (e) => {
            e.preventDefault();
            reset();
            // 使用 location.assign 而不是 router.replace 以确保完全重新加载页面
            window.location.assign('/');
        },
        [reset],
    );

    return (
        <div className="z-(--z-index-error-boundary) w-full max-w-md overflow-hidden rounded-2xl border bg-white shadow-xl dark:bg-gray-900">
            <div className="bg-red-500 p-4">
                <div className="flex justify-center">
                    <svg
                        className="h-16 w-16 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>
            </div>

            <div className="p-6 text-center">
                <h2 className="mb-2 text-2xl font-bold text-gray-800 dark:text-white">
                    糟糕! 服务器出错了...
                </h2>

                <div className="mb-6 rounded-lg bg-red-50 dark:bg-red-900/20">
                    <p className="scrollbar-custom flex max-h-25 min-h-10 items-center justify-center overflow-auto text-sm break-words text-red-600 dark:text-red-300">
                        {error.message}
                    </p>
                </div>

                <p className="mb-6 text-gray-600 dark:text-gray-300">
                    别担心，这可能只是暂时的问题。
                </p>

                <div className="flex flex-col justify-center gap-3 sm:flex-row">
                    <button
                        onClick={reset}
                        className="transform rounded-lg bg-red-500 px-5 py-2 font-medium text-white transition duration-300 ease-in-out hover:scale-105 focus:ring-2 focus:ring-red-300 focus:outline-none dark:focus:ring-red-700"
                    >
                        重新加载页面
                    </button>

                    <Link
                        replace
                        href="/"
                        onClick={handleResetAndRedirect}
                        className="rounded-lg bg-gray-200 px-5 py-2 text-center font-medium text-gray-800 transition duration-300 ease-in-out hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                    >
                        返回首页
                    </Link>
                </div>

                <p className="mt-6 text-xs text-gray-500 dark:text-gray-400">
                    如果问题持续存在，请联系管理员处理，十分感谢！
                </p>
            </div>
        </div>
    );
};
