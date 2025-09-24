import fs from 'node:fs';
import path from 'node:path';
import React, { Suspense } from 'react';

import { BlurFade } from '@/_components/magicui/blur-fade';
import { Skeleton } from '@/_components/shadcn/ui/skeleton';

import { listDoc } from '../../actions';
import ItemActionCard from '../components/ItemActionCard';
import { HomeVideoCard } from './components/video';

const VideoContent = async () => {
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
                  const result = await listDoc({ prefix: 'video/' });
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
        // TODO: 设置滚动加载分页，用到vercel blob的cursor
        <div className="columns-2 gap-10 mt-7 mb-6 mx-10">
            {videos.map((video, idx) => (
                <BlurFade
                    key={video.url}
                    delay={0.25 + idx * 0.05}
                    inView
                    className="flex flex-col mb-10 break-inside-avoid"
                >
                    <div className="relative group aspect-video overflow-hidden flex flex-col select-none border-0 rounded-xl transition-all duration-300 ease-out border-black/15 dark:border-white/30 hover:backdrop-blur-md hover:shadow-[var(--modal-shadow)] hover:scale-105 transform">
                        <HomeVideoCard image={video?.thumb} video={video.url} />
                        <ItemActionCard blobInfo={video} docType="video" />
                    </div>
                </BlurFade>
            ))}
        </div>
    );
};
const VideoPage = () => {
    return (
        <Suspense fallback={<Skeleton className="h-[400px] w-[33%] rounded-lg" />}>
            <VideoContent />
        </Suspense>
    );
};

export default VideoPage;
