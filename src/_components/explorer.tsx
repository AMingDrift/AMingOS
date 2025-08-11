import React from 'react';

import { ToolBar } from './toolbar';
const Explorer = () => {
    return (
        <div className="msfiles floatTab dpShad" id={`ExplorerApp`} data-size="mini">
            <ToolBar app="EXPLORER" icon="explorer" name="File Explorer" size="full" />
            <div className="windowScreen flex flex-col"></div>
        </div>
    );
};

export default Explorer;
