import React from 'react';

import DesktopBlogIcon from '@/_components/desktop-icon/desktop-blog-icon';
import DesktopDocIcon from '@/_components/desktop-icon/desktop-doc-icon';

const Desktop = () => {
    return (
        <div className="flex flex-col flex-wrap h-full justify-start gap-6 max-w-lg">
            <DesktopDocIcon />
            <DesktopBlogIcon />
        </div>
    );
};

export default Desktop;
