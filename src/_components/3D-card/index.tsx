'use client';
import React from 'react';
import { Tilt } from 'react-tilt';

const Card3D = ({ children }: { children: React.ReactNode }) => {
    const defaultOptions = {
        reverse: false, // reverse the tilt direction
        max: 20, // max tilt rotation (degrees)
        perspective: 3000, // Transform perspective, the lower the more extreme the tilt gets.
        scale: 1, // 2 = 200%, 1.5 = 150%, etc..
        speed: 2000, // Speed of the enter/exit transition
        transition: true, // Set a transition on enter/exit.
        axis: null, // What axis should be disabled. Can be X or Y.
        reset: true, // If the tilt effect has to be reset on exit.
        easing: 'cubic-bezier(.03,.98,.52,.99)', // Easing on enter/exit.
    };

    return (
        <Tilt className="will-change-transform" options={defaultOptions}>
            {children}
        </Tilt>
    );
};

export default Card3D;
