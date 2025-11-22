'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import React from 'react';
import { cn } from '../shadcn/utils';

const NovaBackground: React.FC = () => {
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
        if (!mountRef.current || typeof window === 'undefined') return;

        // 初始化 Three.js 场景
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            1,
            1000,
        );

        const renderer = new THREE.WebGLRenderer({
            canvas: mountRef.current,
        });

        scene.background = new THREE.Color(0x160016);

        // iphone 16 pro max 430*936 --> cameraZ: 50
        const aspectRatio = window.innerWidth / window.innerHeight;
        const cameraZ = aspectRatio < 1 ? -37 * aspectRatio + 67 : 30; // 竖屏时增加相机距离
        camera.position.set(0, 4, cameraZ);

        renderer.setSize(window.innerWidth, window.innerHeight);

        const resizeHandler = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', resizeHandler);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.enablePan = false;

        let gu = { time: { value: 0 } };
        let sizes: number[] = [];
        let shift: number[] = [];
        let pushShift = () => {
            shift.push(
                Math.random() * Math.PI,
                Math.random() * Math.PI * 2,
                (Math.random() * 0.9 + 0.1) * Math.PI * 0.1,
                Math.random() * 0.9 + 0.1,
            );
        };

        let pts = new Array(50000).fill(null).map(() => {
            sizes.push(Math.random() * 1.5 + 0.5);
            pushShift();
            return new THREE.Vector3().randomDirection().multiplyScalar(Math.random() * 0.5 + 9.5);
        });

        for (let i = 0; i < 25000; i++) {
            let r = 10,
                R = 40;
            let rand = Math.pow(Math.random(), 1.5);
            let radius = Math.sqrt(R * R * rand + (1 - rand) * r * r);
            pts.push(
                new THREE.Vector3().setFromCylindricalCoords(
                    radius,
                    Math.random() * 2 * Math.PI,
                    (Math.random() - 0.5) * 2,
                ),
            );
            sizes.push(Math.random() * 1.5 + 0.5);
            pushShift();
        }

        let g = new THREE.BufferGeometry().setFromPoints(pts);
        g.setAttribute('sizes', new THREE.Float32BufferAttribute(sizes, 1));
        g.setAttribute('shift', new THREE.Float32BufferAttribute(shift, 4));

        let m = new THREE.PointsMaterial({
            size: 0.125,
            transparent: true,
            depthTest: false,
            blending: THREE.AdditiveBlending,
        });

        m.onBeforeCompile = (shader) => {
            shader.uniforms.time = gu.time;
            shader.vertexShader = `
      uniform float time;
      attribute float sizes;
      attribute vec4 shift;
      varying vec3 vColor;
      ${shader.vertexShader}
    `
                .replace(`gl_PointSize = size;`, `gl_PointSize = size * sizes;`)
                .replace(
                    `#include <color_vertex>`,
                    `#include <color_vertex>
        float d = length(abs(position) / vec3(40., 10., 40));
        d = clamp(d, 0., 1.);
        vColor = mix(vec3(227., 155., 0.), vec3(100., 50., 255.), 
          d
        ) / 255.;
      `,
                )
                .replace(
                    `#include <begin_vertex>`,
                    `#include <begin_vertex>
        float t = time;
        float moveT = mod(shift.x + shift.z * t, PI2);
        float moveS = mod(shift.y + shift.z * t, PI2);
        transformed += vec3(cos(moveS) * sin(moveT), cos(moveT), sin(moveS) * sin(moveT)) * shift.w;
      `,
                );

            shader.fragmentShader = `
      varying vec3 vColor;
      ${shader.fragmentShader}
    `
                .replace(
                    `#include <clipping_planes_fragment>`,
                    `#include <clipping_planes_fragment>
        float d = length(gl_PointCoord.xy - 0.5);
      `,
                )
                .replace(
                    `vec4 diffuseColor = vec4( diffuse, opacity );`,
                    `vec4 diffuseColor = vec4( vColor, smoothstep(0.5, 0.1, d) );`,
                );
        };

        let p = new THREE.Points(g, m);
        p.rotation.order = 'ZYX';
        p.rotation.z = 0.2;
        scene.add(p);

        const clock = new THREE.Clock();

        renderer.setAnimationLoop(() => {
            controls.update();
            const t = clock.getElapsedTime() * 0.5;
            gu.time.value = t * Math.PI;
            p.rotation.y = t * 0.05;
            renderer.render(scene, camera);
        });

        setIsLoaded(true);

        return () => {
            window.removeEventListener('resize', resizeHandler);
            renderer.dispose(); // 清理资源
        };
    }, []);

    return (
        <div className="fixed size-full">
            <div
                className={cn('transition-opacity duration-600', {
                    'opacity-0': !isLoaded,
                    'opacity-100': isLoaded,
                    hidden: hide,
                    block: !hide,
                })}
            >
                <canvas ref={mountRef} />
            </div>
        </div>
    );
};

export default NovaBackground;
