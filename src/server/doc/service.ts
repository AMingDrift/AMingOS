'use server';

import type { GetObjectsResult } from 'qiniu/StorageResponseInterface';

import qiniu from 'qiniu';

// 七牛云配置 - 请替换为你的实际密钥和空间信息
const ACCESS_KEY = process.env.ACCESS_KEY!;
const SECRET_KEY = process.env.SECRET_KEY!;
const DOMAIN = process.env.DOMAIN!;

console.log('00000000000');
console.log(DOMAIN);
// 初始化鉴权对象
const mac = new qiniu.auth.digest.Mac(ACCESS_KEY, SECRET_KEY);
const config = new qiniu.conf.Config();
const bucketManager = new qiniu.rs.BucketManager(mac, config);

const srcBucket = 'amingos';

const mimeTypeList = {
    image: ['image/png', 'image/jpeg'],
    file: ['application/pdf'],
    audio: ['audio/mpeg'],
    video: ['video/mp4'],
};

/**
 * 查询kodo指定类型文件列表
 * @param options
 */
export const queryKodoByType = async (options: {
    type: keyof typeof mimeTypeList;
}): Promise<qiniu.httpc.ResponseWrapper<GetObjectsResult>['data']['items']> => {
    const data = await bucketManager.listPrefix(srcBucket, {});
    data.data.items = data.data.items.filter((item) =>
        mimeTypeList[options.type].includes(item.mimeType),
    );
    return data.data.items;
};

export const getPrivateDownloadUrl = async ({
    filename,
    expires = 3600,
}: {
    filename: string;
    expires?: number;
}): Promise<string> => {
    const deadline = Number.parseInt(`${Date.now() / 1000 + expires}`);
    const privateDownloadUrl = bucketManager.privateDownloadUrl(
        DOMAIN,
        encodeURIComponent(filename),
        deadline,
    );
    return privateDownloadUrl;
};
