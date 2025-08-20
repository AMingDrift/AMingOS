import { Files, FileVideo, Image, Music4 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/_components/shadcn/ui/sidebar';

// Menu items.
const items = [
    {
        title: 'Music',
        url: '/doc/music',
        icon: Music4,
        cnt: 2,
    },
    {
        title: 'Videos',
        url: '/doc/video',
        icon: FileVideo,
        cnt: 15,
    },
    {
        title: 'Pictures',
        url: '/doc/picture',
        icon: Image,
        cnt: 3,
    },
    {
        title: 'Files',
        url: '/doc/file',
        icon: Files,
        cnt: 0,
    },
];

export function AppSidebar() {
    const pathname = usePathname();
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link
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
