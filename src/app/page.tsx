import React from 'react';

import DesktopIcon from '@/_components/desktop-icon';

const Desktop = () => {
    return (
        <div className="flex flex-col flex-wrap h-full justify-start gap-6 max-w-lg">
            <DesktopIcon name="doc" />
            <DesktopIcon name="blog" />
        </div>
    );
};

export default Desktop;
