import type { FC } from 'react';

import Link from 'next/link';

export const ErrorNotFound: FC = () => (
    <div className="page-item">
        <div className="page-container page-blank">
            <h2>Not Found</h2>
            <span className="lg:mx-3 lg:inline hidden">|</span>
            <p>
                404错误意味着这个页面已经不存在了,您可以
                <b>
                    <Link className="animate-decoration" href="/">
                        返回首页
                    </Link>
                </b>
            </p>
        </div>
    </div>
);
