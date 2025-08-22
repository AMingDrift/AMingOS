import type { FC } from 'react';

import { isNil } from 'lodash';

import type { IPaginateQueryProps } from '@/_components/paginate/types';

import { BlurFade } from '@/_components/magicui/blur-fade';
import { queryPostPaginate } from '@/app/actions/post';

import ImageComponent from './components/ImageComponent';
import dbjson from './db.json';

const Page: FC<{ searchParams: Promise<IPaginateQueryProps> }> = async ({ searchParams }) => {
    const { page: currentPage, limit = 22 } = await searchParams;
    // 当没有传入当前页或当前页小于1时，设置为第1页
    const page = isNil(currentPage) || Number(currentPage) < 1 ? 1 : Number(currentPage);
    const items =
        process.env.NODE_ENV === 'development'
            ? (await queryPostPaginate({ page: Number(page), limit })).items
            : dbjson;
    console.log(items);
    return (
        <div className="columns-2 gap-2 lg:columns-3 mt-2">
            {items.map((item, idx) => (
                <BlurFade
                    key={item.id}
                    delay={0.25 + idx * 0.05}
                    inView
                    className="flex flex-col mb-6 break-inside-avoid"
                >
                    <div className="flex flex-col cursor-pointer border-2 border-transparent rounded-xl p-4 transition-all duration-300 hover:border-white/30 hover:backdrop-blur-md hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                        <ImageComponent
                            key={item.id}
                            src={item.thumb}
                            alt={item.title}
                            id={item.id}
                        />
                        <div className="footer">
                            <div>{item.title}</div>
                        </div>
                    </div>
                </BlurFade>
            ))}
        </div>
    );
};

export default Page;
