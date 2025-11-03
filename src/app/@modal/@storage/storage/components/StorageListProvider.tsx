'use client';

import { useStorageStore } from '@/_components/store/storageStore';
import { ReactNode, useEffect } from 'react';

export default function StorageListProvider({
    storageList,
    children,
}: {
    storageList: any[];
    children: ReactNode;
}) {
    const setList = useStorageStore((s) => s.setList);
    useEffect(() => {
        setList(storageList);
    }, [storageList, setList]);
    return <>{children}</>;
}
