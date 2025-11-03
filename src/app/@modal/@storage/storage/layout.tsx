import { ReactNode } from 'react';
import { listStorage } from '../actions';
import StorageListProvider from './components/StorageListProvider';

export const dynamic = 'force-dynamic';

export default async function StorageLayout({ children }: { children: ReactNode }) {
    const storageList = await listStorage();
    // 通过 props 传递给客户端
    return <StorageListProvider storageList={storageList}>{children}</StorageListProvider>;
}
