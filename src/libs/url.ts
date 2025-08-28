import { isNil } from 'lodash';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

export const useUrlQuery = () => {
    const searchParams = useSearchParams();
    return useMemo(() => {
        const query = new URLSearchParams(searchParams.toString()).toString();
        return isNil(query) || query.length < 1 ? '' : `?${query}`;
    }, [searchParams]);
};
