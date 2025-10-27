import Image from 'next/image';
import Link from 'next/link';

import { Separator } from '@/_components/shadcn/ui/separator';
import { classifyFileType, convertFileSize } from '@/libs/utils';

import { listStorage } from '../actions';
import { Chart } from './components/Chart';
import FormattedDateTime from './components/FormattedDateTime';
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
        const imageItem = {
            title: 'Images',
            size: 0,
            latestDate: '',
            icon: '/assets/file-image-light.svg',
            url: '/storage/images',
        };
        const videoItem = {
            title: 'Video',
            size: 0,
            latestDate: '',
            icon: '/assets/file-video-light.svg',
            url: '/storage/videos',
        };
        // const fileItem = {
        //     title: 'Documents',
        //     size: 0,
        //     latestDate: '',
        //     icon: '/assets/file-document-light.svg',
        //     url: '/storage/documents',
        // };
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
                default:
                    break;
            }
        });
        return [imageItem, videoItem];
    };
    const usageSummary = getUsageSummary();
    const totalUsed = usageSummary.reduce((acc, item) => acc + item.size, 0);

    console.log('usageSummary:', usageSummary);
    return (
        <div className="dashboard-container">
            <section>
                <Chart used={totalUsed} />

                {/* Uploaded file type summaries */}
                <ul className="dashboard-summary-list">
                    {usageSummary.map((summary) => (
                        <Link
                            href={summary.url}
                            key={summary.title}
                            className="dashboard-summary-card hover:shadow-(--card-shadow) hover:backdrop-blur-md"
                        >
                            <div className="space-y-4">
                                <div className="flex justify-between gap-3">
                                    <Image
                                        src={summary.icon}
                                        width={100}
                                        height={100}
                                        alt="uploaded image"
                                        className="summary-type-icon"
                                    />
                                    <h4 className="summary-type-size">
                                        {convertFileSize(summary.size) || 0}
                                    </h4>
                                </div>

                                <h5 className="summary-type-title">{summary.title}</h5>
                                <Separator className="bg-light-400" />
                                <FormattedDateTime
                                    date={summary.latestDate}
                                    className="text-center"
                                />
                            </div>
                        </Link>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default Page;
