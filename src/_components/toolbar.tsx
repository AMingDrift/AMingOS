'use client';
import type { MouseEvent } from 'react';

import clsx from 'clsx';

/* eslint-disable */
import styles from './toolbar.module.css';
export const ToolBar = (props) => {
    const toolClick = () => {
        // dispatch({
        //   type: props.app,
        //   payload: "front",
        // });
    };

    let posP = [0, 0];
    let dimP = [0, 0];
    let posM = [0, 0];
    let wnapp:HTMLDivElement | null = null;
    let op = 0;
    let vec = [0, 0];

    const toolDrag = (e:MouseEvent<HTMLDivElement>) => {
        e = e || window.event;
        e.preventDefault();
        posM = [e.clientY, e.clientX];
        op = Number(e.currentTarget.dataset.op || 0);

        if (op === 0) {
            wnapp = e.currentTarget.parentElement?.parentElement as HTMLDivElement;
        } else {
            vec = e.currentTarget.dataset.vec!.split(',').map(Number);
            wnapp = e.currentTarget.parentElement?.parentElement?.parentElement as HTMLDivElement;
        }

        if (wnapp) {
            wnapp.classList.add('notrans');
            wnapp.classList.add('z9900');
            posP = [wnapp.offsetTop, wnapp.offsetLeft];
            dimP = [
                Number.parseFloat(getComputedStyle(wnapp).height.replaceAll('px', '')),
                Number.parseFloat(getComputedStyle(wnapp).width.replaceAll('px', '')),
            ];
        }

        document.onmouseup = closeDrag;
        document.onmousemove = eleDrag as any;

    };

    const setPos = (pos0:number, pos1:number) => {
        if (!wnapp) return;
        wnapp.style.top = `${pos0}px`;
        wnapp.style.left = `${pos1}px`;
    };

    const setDim = (dim0:number, dim1:number) => {
        if (!wnapp) return;
        wnapp.style.height = `${dim0}px`;
        wnapp.style.width = `${dim1}px`;
    };

    const eleDrag = (e:MouseEvent<HTMLDivElement>) => {
        e = e || window.event;
        e.preventDefault();

        let pos0 = posP[0] + e.clientY - posM[0];
        let pos1 = posP[1] + e.clientX - posM[1];
        let dim0 = dimP[0] + vec[0] * (e.clientY - posM[0]);
        let dim1 = dimP[1] + vec[1] * (e.clientX - posM[1]);

        if (op == 0) setPos(pos0, pos1);
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

        // const action = {
        //     type: props.app,
        //     payload: 'resize',
        //     dim: {
        //         width: getComputedStyle(wnapp).width,
        //         height: getComputedStyle(wnapp).height,
        //         top: getComputedStyle(wnapp).top,
        //         left: getComputedStyle(wnapp).left,
        //     },
        // };

        // dispatch(action);
    };

    return (
        <>
            <div className={styles.toolbar}
                data-float={props.float != null}
                data-noinvert={props.noinvert != null}
                style={{
                    background: props.bg,
                }}
            >
                <div
                    className={clsx(styles.topInfo, 'flex flex-grow items-center')}
                    data-float={props.float != null}
                    onClick={toolClick}
                    onMouseDown={toolDrag}
                    data-op="0"
                >
                    {/* <Icon src={props.icon} width={14} /> */}
                    <div className={clsx(styles.appFullName, 'text-xss')} data-white={props.invert != null}>
                        {props.name}
                    </div>
                </div>
                <div className={clsx(styles.actbtns, 'flex items-center')}>
                    {/* <Icon
                        invert={props.invert}
                        click={props.app}
                        payload="mnmz"
                        pr
                        src="minimize"
                        ui
                        width={12}
                    /> */}
                    <div className="snapbox h-full">
                        {/* <Icon
                            invert={props.invert}
                            click={props.app}
                            ui
                            pr
                            width={12}
                            payload="mxmz"
                            src={props.size == 'full' ? 'maximize' : 'maxmin'}
                        /> */}
                    </div>
                    {/* <Icon
                        className="closeBtn"
                        invert={props.invert}
                        click={props.app}
                        payload="close"
                        pr
                        src="close"
                        ui
                        width={14}
                    /> */}
                </div>
            </div>
            <div className={clsx(styles.resizecont, styles.topone)}>
                <div className="flex">
                    <div
                        className={clsx(styles.conrsz, 'cursor-nw-resize')}
                        data-op="1"
                        onMouseDown={toolDrag}
                        data-vec="-1,-1"
                    ></div>
                    <div
                    className={clsx(styles.edgrsz, 'cursor-n-resize',styles.wdws)}
                        data-op="1"
                        onMouseDown={toolDrag}
                        data-vec="-1,0"
                    ></div>
                </div>
            </div>
            <div className={clsx(styles.resizecont, styles.leftone)}>
                <div className="h-full">
                    <div
                     className={clsx(styles.edgrsz, 'cursor-w-resize',styles.hdws)}
                        data-op="1"
                        onMouseDown={toolDrag}
                        data-vec="0,-1"
                    ></div>
                </div>
            </div>
            <div className={clsx(styles.resizecont, styles.rightone)}>
                <div className="h-full">
                    <div
                    className={clsx(styles.edgrsz, 'cursor-w-resize',styles.hdws)}
                        data-op="1"
                        onMouseDown={toolDrag}
                        data-vec="0,1"
                    ></div>
                </div>
            </div>
            <div className={clsx(styles.resizecont, styles.bottomone)}>
                <div className="flex">
                    <div
                    className={clsx(styles.conrsz, 'cursor-ne-resize')}
                        data-op="1"
                        onMouseDown={toolDrag}
                        data-vec="1,-1"
                    ></div>
                    <div
                    className={clsx(styles.edgrsz, 'cursor-n-resize',styles.wdws)}
                        data-op="1"
                        onMouseDown={toolDrag}
                        data-vec="1,0"
                    ></div>
                    <div
                    className={clsx(styles.conrsz, 'cursor-nw-resize')}
                        data-op="1"
                        onMouseDown={toolDrag}
                        data-vec="1,1"
                    ></div>
                </div>
            </div>
        </>
    );
};
