import { Files, FileVideo, Image, Music4, Newspaper } from 'lucide-react';
import Link from 'next/link';

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/_components/shadcn/ui/sidebar';

// Menu items.
const items = [
    {
        title: 'Music',
        url: '/document/music',
        icon: Music4,
        cnt: 2,
    },
    {
        title: 'Videos',
        url: '#',
        icon: FileVideo,
        cnt: 15,
    },
    {
        title: 'Pictures',
        url: '/document/picture',
        icon: Image,
        cnt: 3,
    },
    {
        title: 'Files',
        url: '#',
        icon: Files,
        cnt: 0,
    },
    {
        title: 'Blogs',
        url: '#',
        icon: Newspaper,
        cnt: 90,
    },
];

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Files</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                    <SidebarMenuBadge>{item.cnt}</SidebarMenuBadge>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
