'use client';
import type { Option } from 'artplayer';
import type { FC } from 'react';

import Artplayer from 'artplayer';
import clsx from 'clsx';
import { isNil } from 'lodash';
import React, { useEffect, useRef } from 'react';

import $styles from './player.module.css';

export const Player: FC<{
    option: Omit<Option, 'container'>;
    getInstance?: any;
    className?: string;
}> = ({ option, getInstance, className, ...rest }) => {
    const artRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        let art: Artplayer;
        if (!isNil(artRef.current)) {
            art = new Artplayer({
                fullscreen: true,
                playsInline: true,
                fastForward: true,
                airplay: true,
                autoplay: false,
                autoSize: true,
                // isLive: true,
                // loop: true,
                // autoPlayback: true,
                // muted: true,
                ...option,
                container: artRef.current!,
            });
            art.on('ready', () => {
                art.autoSize();
                art.autoHeight();
            });
            art.on('resize', () => {
                art.autoSize();
                art.autoHeight();
            });
            art.on('video:ended', () => {
                art.currentTime = 0;
                if (!isNil(option.poster)) art.poster = option.poster;
                const posterEl = artRef.current?.getElementsByClassName(
                    'art-poster',
                ) as HTMLCollectionOf<HTMLElement>;
                if (posterEl && posterEl.length > 0) posterEl[0].style.display = 'block';
            });
            if (getInstance && typeof getInstance === 'function') {
                getInstance(art);
            }
        }
        return () => {
            if (art && art.destroy) {
                art.destroy(false);
            }
        };
    }, [artRef.current, option.poster]);
    return (
        <div
            className={clsx($styles.container, className, 'max-h-[85vh]')}
            ref={artRef}
            {...rest}
        />
    );
};
