/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
'use client';
import type { MouseEvent } from 'react';

import { Circle, CircleDot, CircleMinus, CircleX, Folders } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useDocStore } from '@/app/@doc/doc/hooks';
export const ToolBar = ({ name }: { name: string }) => {
    const docApp = useDocStore((state) => state.docApp);
    const close = useDocStore((state) => state.close);
    const hide = useDocStore((state) => state.hide);
    const mxmz = useDocStore((state) => state.mxmz);
    const resize = useDocStore((state) => state.resize);
    const router = useRouter();
    const toolClick = () => {
        // TODO: dispatch "front"
    };

    let posP = [0, 0];
    let dimP = [0, 0];
    let posM = [0, 0];
    let wnapp: HTMLDivElement | null = null;
    let op = 0;
    let vec = [0, 0];

    let isDragged = false;

    const toolDrag = (e: MouseEvent<HTMLDivElement>) => {
        console.log('toolDrag');
        e = e || window.event;
        e.preventDefault();
        posM = [e.clientY, e.clientX];
        op = Number(e.currentTarget.dataset.op || 0);
        if (e.currentTarget.dataset.vec) {
            vec = e.currentTarget.dataset.vec.split(',').map(Number);
        }

        document.onmouseup = closeDrag;
        document.onmousemove = eleDrag as any;
    };

    const setPos = (pos0: number, pos1: number) => {
        if (!wnapp) return;
        wnapp.style.top = `${pos0}px`;
        wnapp.style.left = `${pos1}px`;
    };

    const setDim = (dim0: number, dim1: number) => {
        if (!wnapp) return;
        wnapp.style.height = `${dim0}px`;
        wnapp.style.width = `${dim1}px`;
    };

    const eleDrag = (e: MouseEvent<HTMLDivElement>) => {
        e = e || window.event;
        e.preventDefault();

        isDragged = true;

        if (!wnapp) {
            wnapp = document.getElementById(`ExplorerApp`) as HTMLDivElement;

            wnapp.classList.add('notrans');
            wnapp.classList.add('z9900');
            posP = [wnapp.offsetTop, wnapp.offsetLeft];
            dimP = [
                Number.parseFloat(getComputedStyle(wnapp).height.replaceAll('px', '')),
                Number.parseFloat(getComputedStyle(wnapp).width.replaceAll('px', '')),
            ];
        }

        let pos0 = posP[0] + e.clientY - posM[0];
        let pos1 = posP[1] + e.clientX - posM[1];
        let dim0 = dimP[0] + vec[0] * (e.clientY - posM[0]);
        let dim1 = dimP[1] + vec[1] * (e.clientX - posM[1]);

        if (op === 0) setPos(pos0, pos1);
        else {
            dim0 = Math.max(dim0, 320);
            dim1 = Math.max(dim1, 320);
            pos0 = posP[0] + Math.min(vec[0], 0) * (dim0 - dimP[0]);
            pos1 = posP[1] + Math.min(vec[1], 0) * (dim1 - dimP[1]);
            setPos(pos0, pos1);
            setDim(dim0, dim1);
        }
    };

    const closeDrag = () => {
        document.onmouseup = null;
        document.onmousemove = null;

        if (wnapp) {
            wnapp.classList.remove('notrans');
            wnapp.classList.remove('z9900');
        }

        if (isDragged) {
            const dimP = {
                width: getComputedStyle(wnapp!).width,
                height: getComputedStyle(wnapp!).height,
                top: getComputedStyle(wnapp!).top,
                left: getComputedStyle(wnapp!).left,
            };
            resize(dimP);
        }
        isDragged = false;
    };

    const minimize = () => {
        mxmz();
        if (docApp.size === 'full') {
            setPos(0, 0);
            setDim(window.innerHeight, window.innerWidth);
        }
    };

    const toolDoubleClick = (e: MouseEvent<HTMLDivElement>) => {
        console.log('toolDoubleClick');
        minimize();
    };

    return (
        <>
            <div className="toolbar">
                <div
                    className="topInfo flex flex-grow items-center"
                    onClick={toolClick}
                    onMouseDown={toolDrag}
                    data-op="0"
                    onDoubleClick={toolDoubleClick}
                >
                    <Folders size={18} />
                    <div className="title">{name}</div>
                </div>
                <div className="actbtns flex items-center">
                    <div
                        className="actbtn"
                        onClick={() => {
                            hide();
                            router.push('/');
                        }}
                    >
                        <CircleMinus size={18} />
                    </div>
                    <div className="actbtn" onClick={minimize}>
                        {docApp.size === 'full' ? <CircleDot size={18} /> : <Circle size={18} />}
                    </div>
                    <div
                        className="actbtn closeBtn"
                        onClick={() => {
                            close();
                            router.push('/');
                        }}
                    >
                        <CircleX size={18} />
                    </div>
                </div>
            </div>
            <div className="resizecont topone">
                <div className="flex">
                    <div
                        className="conrsz cursor-nw-resize"
                        data-op="1"
                        onMouseDown={toolDrag}
                        data-vec="-1,-1"
                    ></div>
                    <div
                        className="edgrsz cursor-n-resize wdws"
                        data-op="1"
                        onMouseDown={toolDrag}
                        data-vec="-1,0"
                    ></div>
                </div>
            </div>
            <div className="resizecont leftone">
                <div className="h-full">
                    <div
                        className="edgrsz cursor-w-resize hdws"
                        data-op="1"
                        onMouseDown={toolDrag}
                        data-vec="0,-1"
                    ></div>
                </div>
            </div>
            <div className="resizecont rightone">
                <div className="h-full">
                    <div
                        className="edgrsz cursor-w-resize hdws"
                        data-op="1"
                        onMouseDown={toolDrag}
                        data-vec="0,1"
                    ></div>
                </div>
            </div>
            <div className="resizecont bottomone">
                <div className="flex">
                    <div
                        className="conrsz cursor-ne-resize"
                        data-op="1"
                        onMouseDown={toolDrag}
                        data-vec="1,-1"
                    ></div>
                    <div
                        className="edgrsz cursor-n-resize wdws"
                        data-op="1"
                        onMouseDown={toolDrag}
                        data-vec="1,0"
                    ></div>
                    <div
                        className="conrsz cursor-nw-resize"
                        data-op="1"
                        onMouseDown={toolDrag}
                        data-vec="1,1"
                    ></div>
                </div>
            </div>
        </>
    );
};
