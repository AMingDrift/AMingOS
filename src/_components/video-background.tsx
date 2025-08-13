import React from 'react';

const videoBackground = () => {
    return (
        <div className="absolute inset-0 z-[-1] overflow-hidden w-full h-full min-h-full">
            <video className="object-cover w-full h-full" autoPlay loop muted>
                <source src="/xqtd.mp4" type="video/mp4" />
            </video>
        </div>
    );
};

export default videoBackground;
