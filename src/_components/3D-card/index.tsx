// components/3DCard.tsx
'use client'; // 客户端组件标记（Next.js 必需）
import Image from 'next/image';
import { useRef, useState } from 'react';

interface Card3DProps {
    imageSrc: string; // 图片地址
    imageAlt: string; // 图片描述
    cardWidth?: number; // 卡片宽度（默认 300px）
    cardHeight?: number; // 卡片高度（默认 400px）
    tiltIntensity?: number; // 倾斜强度（默认 10，值越大倾斜越明显）
}

export default function Card3D({
    imageSrc,
    imageAlt,
    cardWidth = 300,
    cardHeight = 400,
    tiltIntensity = 10,
}: Card3DProps) {
    // 存储鼠标在卡片内的相对位置（x: -1 到 1，y: -1 到 1）
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const cardRef = useRef<HTMLDivElement>(null);

    // 监听鼠标在卡片上的移动，计算相对位置
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        // 获取卡片的 DOM 信息（位置、尺寸）
        const { left, top, width, height } = cardRef.current.getBoundingClientRect();

        // 计算鼠标在卡片内的相对坐标（原点在卡片中心）
        const x = ((e.clientX - left) / width - 0.5) * 2; // 左=-1，右=1
        const y = ((e.clientY - top) / height - 0.5) * 2; // 上=-1，下=1

        // 限制数值范围（避免边缘过度倾斜）
        setMousePosition({
            x: Math.max(-1, Math.min(1, x)),
            y: Math.max(-1, Math.min(1, y)),
        });
    };

    // 鼠标离开卡片时，重置倾斜状态
    const handleMouseLeave = () => {
        setMousePosition({ x: 0, y: 0 });
    };

    return (
        <div
            className="flex justify-center items-center min-h-[500px] bg-gray-100 p-8"
            // 父容器开启 3D 空间（必需，否则子元素 3D 变换无效）
            style={{ perspective: '2000px' }}
        >
            {/* 3D 卡片容器 */}
            <div
                ref={cardRef}
                className="relative overflow-hidden rounded-xl shadow-2xl transition-all duration-300 ease-out"
                // 核心 3D 变换：根据鼠标位置动态调整旋转角度
                style={{
                    width: `${cardWidth}px`,
                    height: `${cardHeight}px`,
                    willChange: 'transform', // 告诉浏览器提前优化变换性能
                    transform: `
            perspective(1000px) 
            rotateX(${-mousePosition.y * tiltIntensity}deg)  // 垂直方向倾斜（鼠标上下移动）
            rotateY(${mousePosition.x * tiltIntensity}deg)   // 水平方向倾斜（鼠标左右移动）
            scale3d(1, 1, 1)
          `,
                    // 添加轻微的悬浮缩放效果，增强 3D 层次感
                    boxShadow: `
            0 ${Math.abs(mousePosition.y) * 20 + 10}px ${Math.abs(mousePosition.x) * 30 + 20}px 
            rgba(0, 0, 0, 0.2),
            inset 0 0 50px rgba(255, 255, 255, 0.1)
          `,
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                {/* 卡片图片（添加 3D 深度感） */}
                <div
                    className="absolute inset-0"
                    // 图片反向轻微倾斜，模拟“卡片内部内容”与边框的层次感
                    style={{
                        transform: `
              translateZ(20px)  // 图片向前突出 20px，增强立体感
              rotateX(${-mousePosition.y * tiltIntensity * 0.5}deg)
              rotateY(${mousePosition.x * tiltIntensity * 0.5}deg)
            `,
                        transition: 'transform 0.2s ease-out',
                    }}
                >
                    <Image
                        src={imageSrc}
                        alt={imageAlt}
                        fill // 填充父容器
                        style={{ objectFit: 'cover' }} // 保持图片比例并覆盖卡片
                    />
                </div>

                {/* 可选：添加卡片底部渐变遮罩，用于放置文字 */}
                <div
                    className="absolute bottom-0 left-0 right-0 p-6 text-white"
                    style={{
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                        transform: 'translateZ(20px)', // 与图片同层，避免遮挡
                    }}
                >
                    <h3 className="text-xl font-bold">3D 互动卡片</h3>
                    <p className="text-sm opacity-80 mt-1">鼠标移动探索 3D 效果</p>
                </div>
            </div>
        </div>
    );
}
