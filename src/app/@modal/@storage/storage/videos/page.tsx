import fs from 'node:fs';
import path from 'node:path';
import React, { Suspense } from 'react';

import { BlurFade } from '@/_components/magicui/blur-fade';
import { Skeleton } from '@/_components/shadcn/ui/skeleton';

import { listStorage } from '../../actions';
import ItemActionCard from '../components/ItemActionCard';
import { HomeVideoCard } from './components/video';
import { StorageVideoSkeleton } from '@/_components/blog/skeleton';

const VideoContent = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const getVideos =
        process.env.NEXT_PUBLIC_MOCK_BLOB === 'true'
            ? async () => {
                  try {
                      const videoDir = path.join(process.cwd(), 'public', 'test', 'video');
                      if (!fs.existsSync(videoDir)) {
                          console.warn('video directory not found:', videoDir);
                          return [];
                      }
                      const files = fs.readdirSync(videoDir);

                      // 筛选出视频文件
                      const videoExts = ['.mp4', '.webm'];
                      const videoFiles = files.filter((file) =>
                          videoExts.some((ext) => file.toLowerCase().endsWith(ext)),
                      );

                      return videoFiles.map((file) => {
                          // 获取视频文件名（不含扩展名）
                          const fileNameWithoutExt = path.basename(file, path.extname(file));
                          // 查找对应的缩略图文件
                          const thumbExts = ['.png', '.jpg'];
                          let thumbFile = null;

                          for (const ext of thumbExts) {
                              const possibleThumb = `${fileNameWithoutExt}${ext}`;
                              if (files.includes(possibleThumb)) {
                                  thumbFile = possibleThumb;
                                  break;
                              }
                          }

                          return {
                              url: `/test/video/${file}`,
                              downloadUrl: `/test/video/${file}`,
                              pathname: file,
                              size: fs.statSync(path.join(videoDir, file)).size,
                              uploadedAt: `${fs.statSync(path.join(videoDir, file)).mtime.getDate()}`,
                              thumb: `url(${thumbFile ? `/test/video/${thumbFile}` : ''})`,
                          };
                      });
                  } catch (err) {
                      console.error('Error loading local videos:', err);
                      return [];
                  }
              }
            : async () => {
                  const result = await listStorage({ prefix: 'videos/' });
                  console.log('result:', result);
                  const videoExts = ['.mp4', '.webm'];
                  const videoFiles = result.filter((file) =>
                      videoExts.some((ext) => file.pathname.toLowerCase().endsWith(ext)),
                  );
                  return videoFiles.map((file) => {
                      // 获取视频文件名（不含扩展名）
                      const fileNameWithoutExt = path.basename(
                          file.pathname,
                          path.extname(file.pathname),
                      );
                      // 查找对应的缩略图文件
                      const thumbExts = ['.png', '.jpg'];
                      let thumbFile = null;

                      for (const ext of thumbExts) {
                          const possibleThumb = `${fileNameWithoutExt}${ext}`;
                          console.log('possibleThumb:', possibleThumb);
                          const possibleFileItem = result.find(
                              (file) => path.basename(file.pathname) === possibleThumb,
                          );
                          if (possibleFileItem) {
                              thumbFile = possibleFileItem;
                              console.log('thumbFile:', thumbFile);
                              break;
                          }
                      }

                      return {
                          thumb: `url(${thumbFile?.url || ''})`,
                          ...file,
                      };
                  });
              };
    const videos = await getVideos();
    return (
        <div className="mx-10 mt-7 columns-2 gap-10">
            {videos.map((video, idx) => (
                <BlurFade
                    key={video.url}
                    delay={0.25 + idx * 0.05}
                    inView
                    className="mb-10 flex break-inside-avoid flex-col"
                >
                    <div className="group relative flex aspect-video transform flex-col overflow-hidden rounded-xl p-3 transition-all duration-300 ease-out select-none hover:scale-105 hover:shadow-(--card-shadow) hover:backdrop-blur-md">
                        <HomeVideoCard image={video?.thumb} video={video.url} />
                        <ItemActionCard blobInfo={video} storageType="video" />
                    </div>
                </BlurFade>
            ))}
        </div>
    );
};
const VideoPage = () => {
    return (
        <Suspense fallback={<StorageVideoSkeleton />}>
            <VideoContent />
        </Suspense>
    );
};

export default VideoPage;
