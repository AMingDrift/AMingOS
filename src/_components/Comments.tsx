'use client';
import Giscus from '@giscus/react';
import { useTheme } from 'next-themes';
export default function Comments() {
    const { resolvedTheme } = useTheme();
    return (
        <Giscus
            id="comments"
            repo="AMingDrift/AMingOS"
            repoId="R_kgDOPafwdg"
            category="Announcements"
            categoryId="DIC_kwDOPafwds4Cw2sK"
            strict="0"
            mapping="pathname"
            reactionsEnabled="1"
            emitMetadata="0"
            inputPosition="bottom"
            theme={resolvedTheme}
            lang="zh-CN"
            loading="lazy"
        />
    );
}
