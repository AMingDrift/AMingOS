/* eslint-disable react-dom/no-missing-button-type */
'use client';

import { Check, Cloud, Copy, FileUser, HomeIcon, MailIcon, NotebookPen } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { useShallow } from 'zustand/shallow';

import { Dock, DockIcon } from '@/_components/magicui/dock';
import { useModalStore } from '@/_components/store/modalStore';
import { buttonVariants } from '@/_components/shadcn/ui/button';
import { Separator } from '@/_components/shadcn/ui/separator';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/_components/shadcn/ui/tooltip';
import { cn } from '@/_components/shadcn/utils';

import { AnimatedThemeToggler } from '../../magicui/animated-theme-toggler';
import DockMenuIcon from './doc-icon';
import { toast } from 'sonner';

export type IconProps = React.HTMLAttributes<SVGElement>;

const Icons = {
    email: (props: IconProps) => <MailIcon {...props} />,
    github: (props: IconProps) => (
        <svg viewBox="0 0 438.549 438.549" {...props}>
            <path
                fill="currentColor"
                d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z"
            ></path>
        </svg>
    ),
    juejin: (props: IconProps) => (
        <svg viewBox="0 0 1212 1024" {...props}>
            <path
                fill="currentColor"
                d="M698.29709823 161.95344498L597.85455501 82.75836245l-104.9189194 82.75165526-5.4575013 4.38439708 110.3764207 87.99453639 110.74434276-87.99453639-10.30179954-7.94096981z m380.6453521 307.15305187l-481.36383602 379.5722479-481.05723562-379.35762774L45.45122758 526.41025479l552.12738673 435.34300046 552.43398714-435.58828146-71.07015112-57.05847694z m-481.36383602 30.78275641l-261.96003953-206.52654705-71.03949028 57.05847694 332.96887012 262.57324259 333.30613134-262.81852359-71.03949141-57.05847694-262.23598024 206.77182805z"
            ></path>
        </svg>
    ),
};

// 定义基础的社交媒体项类型
interface BaseSocialItem {
    name: string;
    url: string;
    icon: (props: IconProps) => React.ReactNode;
}

// 定义Email社交媒体项类型，其中address是必需的
type EmailSocialItem = BaseSocialItem & {
    address: string;
};

type SocialKey = 'GitHub' | 'Juejin' | 'Email';
// 定义社交媒体映射类型，使用条件类型确保email项必须包含address
type SocialData = {
    [K in SocialKey]: K extends 'Email' ? EmailSocialItem : BaseSocialItem;
};

// 修改DATA的类型定义
const DATA: {
    contact: {
        social: SocialData;
    };
} = {
    contact: {
        social: {
            GitHub: {
                name: 'GitHub',
                url: 'https://github.com/AMingDrift',
                icon: Icons.github,
            },
            Juejin: {
                name: '掘金',
                url: 'https://juejin.cn/user/3667626522083448',
                icon: Icons.juejin,
            },
            Email: {
                name: 'Email',
                url: 'mailto:amingdrift@163.com',
                icon: Icons.email,
                address: 'amingdrift@163.com',
            },
        },
    },
};

export function DockMenu({ className }: { className?: string }) {
    const { home } = useModalStore(
        useShallow((state) => ({
            home: state.actions.home,
        })),
    );
    const [copiedEmail, setCopiedEmail] = useState(false);
    const [emailOpen, setEmailOpen] = useState(false);
    const emailRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const handleDocClick = (e: MouseEvent) => {
            // 如果点击发生在弹窗外，关闭弹窗
            if (emailRef.current && !emailRef.current.contains(e.target as Node)) {
                setEmailOpen(false);
            }
        };
        document.addEventListener('click', handleDocClick);
        return () => document.removeEventListener('click', handleDocClick);
    }, []);
    const handleCopyEmail = (email: string) => {
        if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(email).then(() => {
                setCopiedEmail(true);
                setTimeout(() => setCopiedEmail(false), 2000);
            });
        } else {
            toast.warning('当前浏览器不支持复制功能，请手动复制。');
        }
    };
    return (
        <div className={cn('flex flex-col items-center justify-center', className)}>
            <TooltipProvider>
                <Dock direction="middle" className="h-(--height-dock-menu)">
                    <DockIcon key="Home">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    replace
                                    href="#"
                                    aria-label="Home"
                                    className={cn(
                                        buttonVariants({ variant: 'ghost', size: 'icon' }),
                                        'origin-center transition-all duration-200 ease-in-out',
                                        'size-11 hover:bg-[linear-gradient(120deg,_rgba(161,196,253,0.2)_0%,_rgba(194,233,251,0.2)_100%)] hover:shadow-lg hover:backdrop-blur-md',
                                    )}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        home();
                                    }}
                                >
                                    <HomeIcon className="size-4" />
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent className="z-(--z-index-dock-menu)">
                                <p>主页</p>
                            </TooltipContent>
                        </Tooltip>
                    </DockIcon>
                    <DockMenuIcon name="about" icon={<FileUser className="size-4" />} />
                    <DockMenuIcon name="blog" icon={<NotebookPen className="size-4" />} />
                    <DockMenuIcon name="storage" icon={<Cloud className="size-4" />} />
                    <Separator orientation="vertical" className="h-full" />
                    {Object.entries(DATA.contact.social).map(([name, social]) => (
                        <DockIcon key={name}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    {name !== 'Email' ? (
                                        <Link
                                            replace
                                            href={social.url}
                                            target="_blank"
                                            aria-label={social.name}
                                            className={cn(
                                                buttonVariants({ variant: 'ghost', size: 'icon' }),
                                                'origin-center transition-all duration-200 ease-in-out',
                                                'size-11 hover:bg-[linear-gradient(120deg,_rgba(161,196,253,0.2)_0%,_rgba(194,233,251,0.2)_100%)] hover:shadow-lg hover:backdrop-blur-md',
                                            )}
                                        >
                                            <social.icon className="size-4" />
                                        </Link>
                                    ) : (
                                        <div
                                            // 点击切换（支持移动端）并保留 group hover 的桌面样式
                                            ref={emailRef}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEmailOpen((v) => !v);
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    setEmailOpen((v) => !v);
                                                }
                                            }}
                                            role="button"
                                            tabIndex={0}
                                            aria-haspopup="dialog"
                                            aria-expanded={emailOpen}
                                            className={cn(
                                                buttonVariants({
                                                    variant: 'ghost',
                                                    size: 'icon',
                                                }),
                                                'group relative origin-center transition-all duration-200 ease-in-out',
                                                'size-11 hover:bg-[linear-gradient(120deg,_rgba(161,196,253,0.2)_0%,_rgba(194,233,251,0.2)_100%)] hover:shadow-lg hover:backdrop-blur-md',
                                            )}
                                        >
                                            <social.icon className="size-4" />

                                            <div
                                                // 点击区域内阻止向外传播，桌面仍支持 hover（group-hover）
                                                onClick={(e) => e.stopPropagation()}
                                                className={cn(
                                                    'absolute bottom-full left-1/2 mb-2.5 flex w-48 -translate-x-1/2 cursor-default flex-col gap-1 overflow-hidden rounded-md bg-(--modal-bg-color) bg-white/70 pt-1.5 shadow-(--modal-shadow) backdrop-blur-3xl transition-all duration-200 dark:bg-black/70',
                                                    // 当 emailOpen 为 true 时强制显示（移动端点击）
                                                    emailOpen
                                                        ? 'visible opacity-100'
                                                        : 'invisible opacity-0',
                                                    // 保持原有的 group-hover 行为用于桌面 hover
                                                    'group-hover:visible group-hover:opacity-100',
                                                )}
                                            >
                                                <div className="px-3 text-sm font-medium text-gray-800 dark:text-gray-200">
                                                    联系我
                                                </div>
                                                <div className="truncate px-3 text-xs text-gray-500 dark:text-gray-400">
                                                    {(social as EmailSocialItem).address}
                                                </div>
                                                <div className="flex border-t border-gray-100 dark:border-gray-700">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            // 跳转到 mailto
                                                            window.location.href = social.url;
                                                        }}
                                                        className="flex-1 px-3 py-2 text-center text-xs transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                                                    >
                                                        发送邮件
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleCopyEmail(
                                                                (social as EmailSocialItem).address,
                                                            );
                                                        }}
                                                        className="flex-1 px-3 py-2 text-center text-xs transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                                                    >
                                                        {copiedEmail ? (
                                                            <span className="flex items-center justify-center gap-1">
                                                                <Check size={12} className="w-4!" />
                                                                已复制
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center justify-center gap-1">
                                                                <Copy size={12} className="w-4!" />
                                                                复制邮箱
                                                            </span>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </TooltipTrigger>
                                {name !== 'Email' && (
                                    <TooltipContent className="z-(--z-index-dock-menu)">
                                        <p>{social.name}</p>
                                    </TooltipContent>
                                )}
                            </Tooltip>
                        </DockIcon>
                    ))}
                    <Separator orientation="vertical" className="h-full py-2" />
                    <DockIcon>
                        <AnimatedThemeToggler
                            className={cn(
                                buttonVariants({ variant: 'ghost', size: 'icon' }),
                                'origin-center transition-all duration-200 ease-in-out',
                                'size-11 hover:bg-[linear-gradient(120deg,_rgba(161,196,253,0.2)_0%,_rgba(194,233,251,0.2)_100%)] hover:shadow-lg hover:backdrop-blur-md',
                            )}
                        />
                    </DockIcon>
                </Dock>
            </TooltipProvider>
        </div>
    );
}
