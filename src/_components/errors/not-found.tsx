'use client';

import { MouseEventHandler, useCallback, type FC } from 'react';

import Link from 'next/link';

export const ErrorNotFound: FC = () => {
    const handleResetAndRedirect = useCallback<MouseEventHandler<HTMLAnchorElement>>((e) => {
        e.preventDefault();
        // 使用 location.assign 而不是 router.push 以确保完全重新加载页面
        window.location.assign('/');
    }, []);

    return (
        <div className="z-(--z-index-error-boundary) w-full max-w-md overflow-hidden rounded-2xl border shadow-xl backdrop-blur-md">
            <div className="bg-yellow-500 p-4">
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
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>
            </div>

            <div className="p-6 text-center">
                <h2 className="mb-2 text-2xl font-bold text-gray-800 dark:text-white">
                    页面未找到!
                </h2>

                <div className="mb-6 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                    <p className="scrollbar-custom flex max-h-25 min-h-10 items-center justify-center overflow-auto text-sm break-words text-orange-600 dark:text-orange-300">
                        404 错误意味着您访问的页面不存在或已被移除
                    </p>
                </div>

                <p className="mb-6 text-gray-600 dark:text-gray-300">
                    别担心，这可能只是地址输入有误。
                </p>

                <div className="flex flex-col justify-center gap-3 sm:flex-row">
                    <Link
                        href="/"
                        onClick={handleResetAndRedirect}
                        className="transform rounded-lg bg-yellow-500 px-5 py-2 text-center font-medium text-white transition duration-300 ease-in-out hover:scale-105 focus:ring-2 focus:ring-orange-300 focus:outline-none dark:focus:ring-orange-700"
                    >
                        <span>返回首页</span>
                    </Link>
                </div>

                <p className="mt-6 text-xs text-gray-500 dark:text-gray-400">
                    如果您认为这是系统错误，请联系管理员处理，十分感谢！
                </p>
            </div>
        </div>
    );
};
