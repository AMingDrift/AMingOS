import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { MenuItemType } from '@/libs/types';

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/_components/shadcn/ui/sidebar';

export function AppSidebar({ items }: { items: MenuItemType[] }) {
    const pathname = usePathname();
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items &&
                                items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link
                                                prefetch={true}
                                                href={item.url}
                                                className={
                                                    pathname === item.url
                                                        ? 'bg-primary/10 text-primary'
                                                        : ''
                                                }
                                            >
                                                <item.icon
                                                    className={
                                                        pathname === item.url ? 'text-primary' : ''
                                                    }
                                                />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                        {/* <SidebarMenuBadge>{item.cnt}</SidebarMenuBadge> */}
                                    </SidebarMenuItem>
                                ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
