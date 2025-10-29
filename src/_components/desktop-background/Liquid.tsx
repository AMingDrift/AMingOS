'use client';

import LiquidBackground from 'threejs-components/build/backgrounds/liquid1.min.js';
import React, { useEffect, useRef } from 'react';

const Liquid = () => {
    const mountRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (mountRef.current) {
            const app = LiquidBackground(mountRef.current);

            app.loadImage('/xl.png');
            app.liquidPlane.material.metalness = 0.2;
            app.liquidPlane.material.roughness = 0.8;
            app.liquidPlane.uniforms.displacementScale.value = 5;
            app.setRain(false);
        }
    }, []);

    return <canvas ref={mountRef}>Liquid</canvas>;
};

export default Liquid;
