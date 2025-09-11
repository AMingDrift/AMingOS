'use client';

import React, { useEffect } from 'react';

const CustomCursor = () => {
    useEffect(() => {
        const cursor = document.getElementById('custom-cursor');

        const moveCursor = (e) => {
            if (cursor) {
                cursor.style.left = `${e.clientX}px`;
                cursor.style.top = `${e.clientY}px`;
            }
        };

        document.addEventListener('mousemove', moveCursor);

        return () => {
            document.removeEventListener('mousemove', moveCursor);
        };
    }, []);

    return (
        <div
            id="custom-cursor"
            className="fixed pointer-events-none z-50 gradient-ring"
            style={{ width: '24px', height: '24px', zIndex: 10000 }}
        />
    );
};

const FilePage = () => {
    return (
        <div className="relative inline-flex">
            <CustomCursor />
        </div>
    );
};

export default FilePage;
