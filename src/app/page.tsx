import { Cloud, FileUser, NotebookPen } from 'lucide-react';
import React from 'react';

import DesktopIcon from '@/_components/home-icons/desktop-icon';

const Desktop = () => {
    return (
        <div className="flex h-full max-w-lg flex-col flex-wrap justify-start gap-6">
            <DesktopIcon name="about" icon={<FileUser />} />
            <DesktopIcon name="blog" icon={<NotebookPen />} />
            <DesktopIcon name="storage" icon={<Cloud />} />
        </div>
    );
};

export default Desktop;
