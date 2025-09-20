import { Eye, Save } from 'lucide-react';
import React from 'react';

import { Button } from '@/_components/shadcn/ui/button';

const BlogCreateSubToolbar = () => {
    return (
        <div className="ml-2 flex items-center space-x-2">
            For test
            <Button variant="ghost" size="sm">
                <Save className="w-4 h-4 mr-1" />
                保存
            </Button>
            <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4 mr-1" />
                预览
            </Button>
        </div>
    );
};

export default BlogCreateSubToolbar;
