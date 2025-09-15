import { visit } from 'unist-util-visit';

const _ADMONITION_TYPES = ['note', 'tip', 'info', 'warning', 'danger'] as const;
export type AdmonitionType = (typeof _ADMONITION_TYPES)[number];

// 添加类型映射
const TYPE_MAPPING: Record<string, AdmonitionType> = {
    note: 'note',
    tip: 'tip',
    info: 'info',
    warning: 'warning',
    danger: 'danger',
} as const;

const remarkAdmonitions = () => {
    return (tree: any, file: any) => {
        visit(tree, (node) => {
            if (
                node.type === 'containerDirective' ||
                node.type === 'leafDirective' ||
                node.type === 'textDirective'
            ) {
                const inputType = node.name as string;
                // 使用映射转换类型
                const type = TYPE_MAPPING[inputType];

                if (!type) {
                    return;
                }

                if (node.type === 'textDirective') {
                    file.fail(
                        `Unexpected ':${type}' text directive. Use ':::${type}' instead`,
                        node,
                    );
                    return;
                }

                const data = node.data || (node.data = {});
                const attributes = node.attributes || {};

                // 只有明确设置了 title 属性时才使用标题
                // 不再自动从内容中提取标题
                const title = attributes.title;

                // 使用大写的组件名
                data.hName = 'Admonition';
                data.hProperties = {
                    type, // 使用映射后的类型
                    title,
                    ...attributes,
                };
            }
        });
    };
};

export default remarkAdmonitions;
