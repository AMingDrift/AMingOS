import React from 'react';

import { CategoryWidget } from '../components/category-widget';

// TODO: 在/blog/create关闭modal，再打开/blog会残留/blog/create的内容再刷新成/blog
const BlogSubToolbar = () => {
    return <CategoryWidget />;
};

export default BlogSubToolbar;
