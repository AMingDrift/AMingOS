import { FileUser, Folders, NotebookPen } from 'lucide-react';
import React from 'react';

import DesktopIcon from '@/_components/home-icons/desktop-icon';

const Desktop = () => {
    return (
        <div className="flex flex-col flex-wrap h-full justify-start gap-6 max-w-lg">
            <DesktopIcon name="doc" icon={<Folders />} />
            <DesktopIcon name="blog" icon={<NotebookPen />} />
            <DesktopIcon name="about" icon={<FileUser />} />
        </div>
    );
};

export default Desktop;
