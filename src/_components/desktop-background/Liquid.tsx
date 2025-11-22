'use client';

import LiquidBackground from 'threejs-components/build/backgrounds/liquid1.min.js';
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../shadcn/utils';

const Liquid: React.FC = () => {
    const [hide, setHide] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (isLoaded) {
            // 渐隐动画触发
            setTimeout(() => setHide(false), 600); // 动画结束后移除
        }
    }, [isLoaded]);

    const mountRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (mountRef.current) {
            const app = LiquidBackground(mountRef.current);

            app.loadImage('/xl.png');
            app.liquidPlane.material.metalness = 0.2;
            app.liquidPlane.material.roughness = 0.8;
            app.liquidPlane.uniforms.displacementScale.value = 5;
            app.setRain(false);
            // threejs 初始化完成，通知父组件
            setTimeout(() => setIsLoaded(true), 100);
        }
    }, []);

    return (
        <div className="fixed size-full">
            <div
                className={cn('fixed size-full', 'transition-opacity duration-600', {
                    'opacity-0': !isLoaded,
                    'opacity-100': isLoaded,
                    hidden: hide,
                    block: !hide,
                })}
            >
                <canvas ref={mountRef}>Liquid</canvas>
            </div>
        </div>
    );
};

export default Liquid;
