import type { LucideProps } from 'lucide-react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';

/**
 * 应用配置
 */
export interface AppConfig {
    baseUrl: string;
}

export type DateToString<T> = {
    [K in keyof T]: T[K] extends Date
        ? string
        : T[K] extends Date | null
          ? string | null
          : T[K] extends Date | undefined
            ? string | undefined
            : T[K] extends Date | null | undefined
              ? string | null | undefined
              : T[K] extends object
                ? DateToString<T[K]>
                : T[K];
};

export interface MenuItemType {
    title: string;
    url: string;
    icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
    cnt?: number;
}
