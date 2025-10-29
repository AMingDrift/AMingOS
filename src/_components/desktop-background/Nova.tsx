'use client';

import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const NovaBackground = () => {
    const { resolvedTheme } = useTheme();
    const mountRef = useRef<HTMLDivElement>(null);
    const scene = new THREE.Scene();
    useEffect(() => {
        if (typeof window === 'undefined') {
            // 如果在服务器端渲染环境中，直接返回
            return;
        }

        const camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            1,
            1000,
        );
        const renderer = new THREE.WebGLRenderer();

        if (!mountRef.current) return;

        const updateBackground = () => {
            scene.background = new THREE.Color(resolvedTheme === 'dark' ? 0x160016 : 0xdfdfdf);
        };

        updateBackground();

        camera.position.set(0, 4, 21);

        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);

        const resizeHandler = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', resizeHandler);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.enablePan = false;

        let gu = {
            time: { value: 0 },
        };

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
        for (let i = 0; i < 100000; i++) {
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
        vColor = mix(
          ${resolvedTheme === 'dark' ? 'vec3(227., 155., 0.)' : 'vec3(0., 100., 200.)'},
          ${resolvedTheme === 'dark' ? 'vec3(100., 50., 255.)' : 'vec3(255., 200., 100.)'},
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

        let clock = new THREE.Clock();

        renderer.setAnimationLoop(() => {
            controls.update();
            let t = clock.getElapsedTime() * 0.5;
            gu.time.value = t * Math.PI;
            p.rotation.y = t * 0.05;
            renderer.render(scene, camera);
        });

        return () => {
            window.removeEventListener('resize', resizeHandler);
            mountRef.current?.removeChild(renderer.domElement);
        };
    }, [resolvedTheme]);

    return (
        <div
            ref={mountRef}
            className="absolute inset-0 z-(--z-index-desktop-bg) size-full h-full min-h-full w-full overflow-hidden"
        />
    );
};

export default NovaBackground;
