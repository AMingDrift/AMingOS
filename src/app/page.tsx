import { FileUser, Folders, NotebookPen } from 'lucide-react';
import React from 'react';

import DesktopIcon from '@/_components/home-icons/desktop-icon';

const Desktop = () => {
    return (
        <div className="flex flex-col flex-wrap h-full justify-start gap-6 max-w-lg">
            <DesktopIcon name="about" icon={<FileUser />} />
            <DesktopIcon name="blog" icon={<NotebookPen />} />
            <DesktopIcon name="doc" icon={<Folders />} />
        </div>
    );
};

export default Desktop;
