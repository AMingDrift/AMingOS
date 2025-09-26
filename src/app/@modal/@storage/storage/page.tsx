import { classifyFileType } from '@/libs/utils';

import { listStorage } from '../actions';
import { mockStorageList } from './mock';

const Page = async () => {
    const getAllBlobs =
        process.env.NEXT_PUBLIC_MOCK_BLOB === 'true'
            ? async () => {
                  return mockStorageList;
              }
            : async () => {
                  const result = await listStorage();
                  return result;
              };
    const result = await getAllBlobs();
    const getUsageSummary = () => {
        const fileItem = {
            title: 'Documents',
            size: 0,
            latestDate: '',
            icon: '/assets/icons/file-document-light.svg',
            url: '/storage/documents',
        };
        const imageItem = {
            title: 'Images',
            size: 0,
            latestDate: '',
            icon: '/assets/icons/file-document-light.svg',
            url: '/storage/images',
        };
        const videoItem = {
            title: 'Video',
            size: 0,
            latestDate: '',
            icon: '/assets/icons/file-document-light.svg',
            url: '/storage/videos',
        };
        // 根据result中pathname后缀进行分类汇总
        result.forEach((item) => {
            switch (classifyFileType(item.pathname)) {
                case 'video':
                    videoItem.size += item.size;
                    if (
                        !videoItem.latestDate ||
                        new Date(item.uploadedAt) > new Date(videoItem.latestDate)
                    ) {
                        videoItem.latestDate = item.uploadedAt;
                    }
                    break;
                case 'image':
                    imageItem.size += item.size;
                    if (
                        !imageItem.latestDate ||
                        new Date(item.uploadedAt) > new Date(imageItem.latestDate)
                    ) {
                        imageItem.latestDate = item.uploadedAt;
                    }
                    break;
                case 'document':
                    fileItem.size += item.size;
                    if (
                        !fileItem.latestDate ||
                        new Date(item.uploadedAt) > new Date(fileItem.latestDate)
                    ) {
                        fileItem.latestDate = item.uploadedAt;
                    }
                    break;
                default:
                    break;
            }
        });
        return [fileItem, imageItem, videoItem];
    };
    const usageSummary = getUsageSummary();

    console.log('usageSummary:', usageSummary);
    return <div>doc dashboard placeholder</div>;
};

export default Page;
