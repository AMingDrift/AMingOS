import type { BaseSyntheticEvent } from 'react';

/**
 * 文章操作表单组件创建文章操作的参数
 */
export interface PostCreateFormProps {
    type: 'create';
}

// TODO: PostUpdateFormProps

/**
 * 文章创建/编辑表单的参数类型
 */
export type PostActionFormProps = PostCreateFormProps & {
    /**
     * 在文章正在创建时执行一些动画
     * @param value
     */
    setPedding?: (value: boolean) => void;
};

/**
 * 文章保存表单的Ref,配合useImperativeHandle可以在表单外部页面调用表单提交函数
 */
export interface PostActionFormRef {
    save?: (e?: BaseSyntheticEvent) => Promise<void>;
}
