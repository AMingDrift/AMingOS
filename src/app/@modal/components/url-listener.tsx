'use client';

import { isNil } from 'lodash';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useMount } from 'react-use';
import { useShallow } from 'zustand/shallow';

import type { AppType } from '@/_components/modal/types';

import { useModalStore } from '@/_components/modal/hooks';

import { MenuItems } from '../constant';

const UrlListener = () => {
    const router = useRouter();
    const { list, full, setActivePath, windowStack } = useModalStore(
        useShallow((state) => ({
            list: state.modalApp.list,
            windowStack: state.modalApp.windowStack,
            full: state.actions.full,
            hide: state.actions.hide,
            setActivePath: state.actions.setActivePath,
        })),
    );
    const searchParams = useSearchParams();
    const pathname = usePathname();
    useMount(() => {
        // console.log('当前路径:', pathname);

        const params = new URLSearchParams(searchParams);
        const activePath = pathname + (params.toString() ? `?${params.toString()}` : '');
        const iconNameList = Object.keys(MenuItems) as AppType[];
        const openAppName = iconNameList.find((item) => activePath.startsWith(`/${item}`));
        if (!isNil(openAppName)) {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    full(openAppName);
                });
            });
        }
    });

    useEffect(() => {
        // console.log('windowStack', windowStack);
        const frontApp = windowStack.at(-1);
        if (frontApp) {
            const app = list[frontApp.id];
            router.push(app.activePath);
        } else {
            router.push('/');
        }
    }, [windowStack]);

    useEffect(() => {
        // 根据pathname找到list中对应的app
        const app = Object.values(list).find((item) => pathname.startsWith(`/${item.id}`));
        if (app) {
            const params = new URLSearchParams(searchParams);
            setActivePath(app.id, pathname + (params.toString() ? `?${params.toString()}` : ''));
        }
    }, [pathname, searchParams]);
    return null;
};

export default UrlListener;
