import { isNil } from 'lodash';

/**
 * 表单默认值获取函数
 * @param fields
 * @param params
 */
export const getDefaultFormValues = <T extends Record<string, any>, R extends Record<string, any>>(
    fields: Array<keyof T>,
    params: { type: 'create' } | { type: 'update'; item: T },
) => {
    const item = {} as T;
    if (params.type === 'update') {
        for (const field of fields) {
            if (field in params.item) item[field] = params.item[field];
        }
    }

    const data = fields.reduce(
        (acc, field) => {
            acc[field] = params.type === 'update' && !isNil(acc[field]) ? acc[field] : '';
            return acc;
        },
        item as Record<keyof T, any>,
    ) as R;
    return data;
};
