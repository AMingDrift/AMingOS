import fs from 'node:fs';
import path from 'node:path';
import React, { Suspense } from 'react';

import Card3D from '@/_components/3D-card';
import ImageComponent from '@/_components/blog/list/ImageComponent';
import { BlurFade } from '@/_components/magicui/blur-fade';
import { Skeleton } from '@/_components/shadcn/ui/skeleton';

import { listDoc } from '../../actions';
import ItemActionCard from '../components/ItemActionCard';

const PictureContent = async () => {
    const getImages =
        process.env.NEXT_PUBLIC_MOCK_BLOB === 'true'
            ? async () => {
                  try {
                      const imgDir = path.join(process.cwd(), 'public', 'test', 'img');
                      if (!fs.existsSync(imgDir)) {
                          console.warn('Image directory not found:', imgDir);
                          return [];
                      }
                      const files = fs.readdirSync(imgDir);
                      return files.map((file) => ({
                          url: `/test/img/${file}`,
                          pathname: file,
                          size: fs.statSync(path.join(imgDir, file)).size,
                          uploadedAt: `${fs.statSync(path.join(imgDir, file)).mtime.getDate()}`,
                          downloadUrl: `/test/img/${file}`,
                      }));
                  } catch (err) {
                      console.error('Error loading local images:', err);
                      return [];
                  }
              }
            : async () => {
                  const result = await listDoc({ prefix: 'picture/' });
                  return result;
              };
    const images = await getImages();
    images.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

    return (
        // TODO: 设置滚动加载分页，用到vercel blob的cursor
        <div className="mx-10 mt-7 mb-6 columns-2 gap-10 lg:columns-3">
            {images.map((imageInfo, idx) => (
                <BlurFade
                    key={imageInfo.url}
                    delay={0.25 + idx * 0.05}
                    inView
                    className="mb-10 flex break-inside-avoid flex-col"
                >
                    <Card3D>
                        <div className="group relative flex transform flex-col overflow-hidden rounded-xl border-0 border-black/15 transition-all duration-300 ease-out select-none hover:scale-105 hover:shadow-(--modal-shadow) hover:backdrop-blur-md dark:border-white/30">
                            <ImageComponent
                                key={imageInfo.url}
                                src={imageInfo.url}
                                alt={imageInfo.pathname}
                                id={imageInfo.url}
                            />
                            <ItemActionCard blobInfo={imageInfo} docType="picture" />
                        </div>
                    </Card3D>
                </BlurFade>
            ))}
        </div>
    );
};

const PicturePage = () => {
    return (
        <Suspense fallback={<Skeleton className="h-[400px] w-[33%] rounded-lg" />}>
            <PictureContent />
        </Suspense>
    );
};

export default PicturePage;
