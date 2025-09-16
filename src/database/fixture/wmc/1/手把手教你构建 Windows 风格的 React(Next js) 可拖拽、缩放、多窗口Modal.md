> 还在为每个弹窗写重复的拖拽、缩放、Z轴代码而烦恼吗？还在复制粘贴 onMouseDown、useRef、setZIndex 吗？一个 Zustand Store + 4 个组件帮你解决所有窗口管理痛点

## 背景与痛点

最近在开发仿Windows系统界面的个人博客主页，涉及到封装**多窗口（Modal/Dialog）交互**。查阅网上资料，终于找到一个哥们写的仿win11界面([blueedgetechno/win11React: Windows 11 in React 💻🌈⚡](https://github.com/blueedgetechno/win11React))。

接下来我们部分“借鉴”一下：

- **窗口的打开、关闭、最小化、最大化。**
- **窗口的自由拖拽移动。**
- **窗口的各个方向拉伸缩放。**
- **复杂的 Z 轴层级管理（哪个窗口在最前面）。**
- **窗口状态的持久化（记住上次的位置和大小）。**
- **窗口间的互斥与堆叠。**

这些逻辑如果分散在各个业务组件中，不仅**代码冗余、难以维护**，而且极易出现**Z 轴错乱、拖拽卡顿、状态不同步**等 Bug。每次新增一个需要弹窗的功能，都要复制粘贴一大坨 `useState`, `useRef`, `onMouseDown`, `onMouseMove` 逻辑，开发体验极差。

为了解决这个烦恼，我专门封装了一套基于 **React + Zustand** 的窗口管理方案。现在只需要几行配置，就能轻松创建一个功能完整的 Windows 风格窗口，省时又高效，减少了大量重复劳动！

---

## 先看效果

![effect.gif](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/def2efcd530e486eb4cc79c90b901fe7~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6Zi_5piORHJpZnQ=:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzY2NzYyNjUyMjA4MzQ0OCJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1758615132&x-orig-sign=HPHqF4d8Pedwt8NaBl4TsHef39E%3D)

## 创建一个可拖拽窗口（完整代码在结尾处）

```tsx
// src/app/test/page.tsx
'use client';

import type { ReactNode } from 'react';

import { useShallow } from 'zustand/shallow';

import type { AppType } from '@/_components/modal/types';

// 1. 引入核心 Hook 和组件
import Modal from '@/_components/modal';
import { useModalStore } from '@/_components/modal/hooks';
import { Button } from '@/_components/shadcn/ui/button';

// 2. 在你的业务组件中，定义窗口配置
const ModalWrapper = ({ children, modalName }: { children: ReactNode; modalName: AppType }) => {
    const { list } = useModalStore(
        useShallow((state) => ({
            list: state.modalApp.list,
        })),
    );
    return (
        <Modal app={list[modalName]} name={modalName}>
            {children}
        </Modal>
    );
};

// 3. 你的业务内容组件 (MyCustomContent)
const MyCustomContent = () => {
    return (
        <div className="p-4">
            <h2>这里是你Modal中的核心内容区</h2>
            <p>这个窗口可以被拖动、缩放、最小化、关闭！</p>
        </div>
    );
};

const MyCustomContent2 = () => {
    return (
        <div className="p-4">
            <h2>这里是你Modal2中的核心内容区</h2>
            <p>这个窗口可以被拖动、缩放、最小化、关闭！</p>
        </div>
    );
};

// 4. 业务组件中使用 toggleWindow 方法
const Page = () => {
    const { toggleWindow } = useModalStore(
        useShallow((state) => ({
            toggleWindow: state.actions.toggleWindow,
        })),
    );
    return (
        <div>
            <div className="flex gap-3">
                <Button onClick={() => toggleWindow('test')}>打开Test窗口</Button>
                <Button onClick={() => toggleWindow('test2')}>打开Test2窗口</Button>
            </div>
            <ModalWrapper modalName="test">
                <MyCustomContent />
            </ModalWrapper>
            <ModalWrapper modalName="test2">
                <MyCustomContent2 />
            </ModalWrapper>
        </div>
    );
};

export default Page;
```

你只需要关心传入 `modalName` 和自己的`component`，拖拽、缩放、Z轴管理、状态同步等复杂逻辑全部由底层封装好的 `useModalStore`, `Modal`自动处理。

---

## 解决方案

我设计了 **“状态 + 组件” 分层架构**：

```plain
    应用层 (Your App)
      └── 调用 toggleWindow('test') 打开窗口
            │
            ▼
    ModalWrapper (布局层)
      ├── 渲染活动窗口 <Modal />
      └── 也可以放置自己的布局，如侧边栏菜单等
            │
            ▼
    Modal (窗口容器层)
      ├── 接收窗口唯一标识 (name)
      ├── 从 useModalStore 获取该窗口的所有状态 (size, dim, z)
      ├── 应用样式 (位置、尺寸、z-index)
      └── 渲染窗口内容 + <ToolBar />
            │
            ▼
    ToolBar (交互控制层)
      ├── 管理标题栏拖拽移动
      ├── 管理各个方向的拉伸缩放
      ├── 处理最小化、最大化/还原、关闭按钮点击
      └── 将最终位置/尺寸同步回 useModalStore
            │
            ▼
    useModalStore (状态管理层)
      ├── 管理所有窗口的状态 (list: { name, title, size, dim, hidden, max, z ... })
      ├── 管理窗口堆栈 (windowStack: string[]) 决定哪个窗口在前
      ├── 提供核心操作: open, close, hide, mxmz, resize, focus
      └── 使用 Zustand 更新状态
```

---

## 核心实现

> 因为笔者自己的网站涉及modal框页面与url地址栏联动，所以会有activePath, setActivePath等操作，Toolbar等组件中有router.push(’…’)，并且`ModalWrapper`中布局用了shadcn的Sidebar菜单栏也涉及url变化，碰到直接忽略删除即可。

完整代码在文章结尾处

### 1. 状态大脑：`useModalStore` (Zustand + Immer)

```tsx
// src/_components/modal/hooks.ts
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { ModalOptions, ModalState } from './types';

export const useModalStore = create<ModalState>()(
  immer((set) => ({
    // (状态定义: modalApp, windowStack)
  modalApp: {
        list: {
            test: {
                id: 'test',
                title: 'Test',
                size: 'full',
                hide: true,
                max: true,
                z: 1,
                activePath: ''
            },
            test2: {
              ...
            },
        },
        hz: 2,
        windowStack: [],
    },
    actions: {
      // 切换窗口
      toggleWindow: () => {
       set((state) => {
          ...
        });
      },
      // 打开窗口
      open: (name, options) => {
        set((state) => {
          ...
        });
      },
      // 关闭窗口
      close: (name) => {
        set((state) => {
          ...
        });
      },
      // 最小化 (隐藏)
      hide: (name) => {
        ...
      },
      // 最大化/还原切换
      mxmz: (name) => {
        ...
      },
   ... home, full, resize, front等方法
  }))
);
```

- **Immer:** 让我们可以用 `mutate` 风格的代码 (`app.size = 'full'`) 来更新状态，Zustand 会自动处理不可变性，代码更简洁。
- **`windowStack`:** 数组顺序决定多个窗口层级，最后一个元素在最顶层。`front` action 通过调整堆栈顺序实现点击置顶

### 2. 交互核心：`ToolBar`

> 这部分是赋予窗口“生命”的关键，负责所有用户交互。

```tsx
// src/_components/modal/toolbar.tsx
'use client';
import type { MouseEvent, RefObject } from 'react';
import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/shallow';
import { Circle, CircleDot, CircleMinus, CircleX, Folders } from 'lucide-react';

import { useModalStore } from './hooks';

export const ToolBar = ({
    name,
    app,
    parentRef,
}: {
    name: string; // 窗口唯一标识
    app: ModalOptions['modalApp']['list'][string]; // 窗口配置
    parentRef: RefObject<HTMLDivElement | null>; // 指向 Modal 容器的 ref
}) => {
    const { modalApp, close, hide, mxmz, resize } = useModalStore(
        useShallow((state) => ({
            modalApp: state.modalApp,
            close: state.actions.close,
            hide: state.actions.hide,
            mxmz: state.actions.mxmz,
            resize: state.actions.resize,
        })),
    );
    const router = useRouter();

    // ... (省略所有拖拽、缩放逻辑: toolDrag, eleDrag, closeDrag, setPos, setDim, minimize)

    return (
        <>
            {/* 标题栏 - 负责拖动和双击最大化 */}
            <div className="toolbar">
                <div
                    className="topInfo flex flex-grow items-center"
                    onMouseDown={toolDrag} // 绑定拖拽
                    data-op="0" // data-op=0 表示移动
                    onDoubleClick={minimize} // 双击切换最大化
                >
                    <Folders size={18} />
                    <div className="title">{app.title}</div>
                </div>
                {/* 操作按钮 */}
                <div className="actbtns flex items-center">
                    <div
                        className="actbtn"
                        onClick={() => {
                            hide(name);
                            router.push('/');
                        }}
                    >
                        <CircleMinus size={18} /> {/* 最小化 */}
                    </div>
                    <div className="actbtn" onClick={minimize}>
                        {modalApp.list[name].size === 'full' ? (
                            <CircleDot size={18} /> // 还原
                        ) : (
                            <Circle size={18} /> // 最大化
                        )}
                    </div>
                    <div
                        className="actbtn closeBtn"
                        onClick={() => {
                            close(name);
                            router.push('/');
                        }}
                    >
                        <CircleX size={18} /> {/* 关闭 */}
                    </div>
                </div>
            </div>

            {/* 8个拉伸区域 - 负责缩放 */}
            {/* 顶部 (左上, 上, 右上) */}
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
                    <div
                        className="conrsz cursor-ne-resize"
                        data-op="1"
                        onMouseDown={toolDrag}
                        data-vec="-1,1"
                    ></div>
                </div>
            </div>
            {/* 左侧 */}
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
            {/* 右侧 */}
            <div className="resizecont rightone">
                <div className="h-full">
                    <div
                        className="edgrsz cursor-e-resize hdws"
                        data-op="1"
                        onMouseDown={toolDrag}
                        data-vec="0,1"
                    ></div>
                </div>
            </div>
            {/* 底部 (左下, 下, 右下) */}
            <div className="resizecont bottomone">
                <div className="flex">
                    <div
                        className="conrsz cursor-sw-resize"
                        data-op="1"
                        onMouseDown={toolDrag}
                        data-vec="1,-1"
                    ></div>
                    <div
                        className="edgrsz cursor-s-resize wdws"
                        data-op="1"
                        onMouseDown={toolDrag}
                        data-vec="1,0"
                    ></div>
                    <div
                        className="conrsz cursor-se-resize"
                        data-op="1"
                        onMouseDown={toolDrag}
                        data-vec="1,1"
                    ></div>
                </div>
            </div>
        </>
    );
};
```

- **`data-op` & `data-vec`:** 这是 `ToolBar` 的核心设计。`data-op="0"` 表示移动操作，`data-op="1"` 表示缩放，`data-vec` 是一个二维向量 (如 `"1,1"`)，指代各个方向的向量，精确控制鼠标移动时高度和宽度如何变化，以及窗口位置如何联动调整。
- **全局事件监听：** `toolDrag` 中绑定 `document.onmousemove` 和 `document.onmouseup`，确保即使鼠标移出窗口区域，拖拽也能继续和正确结束。
- **状态同步：** `closeDrag` 中，如果发生了拖拽 (`isDragged`)，则调用 `resize` 将最终的 `width`, `height`, `top`, `left` 同步回 Zustand Store。

### 3. 窗口容器：`Modal`

```tsx
// src/_components/modal/index.tsx
import type { FC, PropsWithChildren } from 'react';

import { useRef } from 'react';
import { useShallow } from 'zustand/shallow';

import type { AppType, ModalOptions } from '@/_components/modal/types';

import { ToolBar } from '../toolbar';
import { useModalStore } from './hooks';
const Modal: FC<
    PropsWithChildren & {
        app: ModalOptions['modalApp']['list'][AppType];
        name: AppType;
    }
> = ({ children, app, name }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const { front } = useModalStore(
        useShallow((state) => ({
            front: state.actions.front,
        })),
    );
    return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
            className="msfiles floatTab dpShad"
            ref={modalRef}
            data-size={app.size}
            data-max={app.max}
            data-hide={app.hide}
            style={{
                ...(app.size === 'cstm' ? app.dim : null),
                zIndex: app.z,
            }}
            onMouseDown={(e) => {
                e.stopPropagation();
                front(name);
            }}
        >
            <ToolBar name={name} app={app} parentRef={modalRef} />
            <div className="windowScreen flex flex-col">{children}</div>
        </div>
    );
};

export default Modal;
```

### 4. 布局容器：`ModalWrapper`

```tsx
// src/app/@modal/components/modal-wrapper.tsx
'use client';

import type { ReactNode } from 'react';

import React from 'react';
import { useShallow } from 'zustand/shallow';

import type { AppType } from '@/_components/modal/types';

import { AppSidebar } from '@/_components/app-sidebar';
import Modal from '@/_components/modal';
import { useModalStore } from '@/_components/modal/hooks';
import { ScrollArea, ScrollBar } from '@/_components/shadcn/ui/scroll-area';
import { SidebarProvider, SidebarTrigger } from '@/_components/shadcn/ui/sidebar';

import { MenuItems } from '../constant';

const ModalWrapper = ({ children, routerName }: { children: ReactNode; routerName: AppType }) => {
    const { list } = useModalStore(
        useShallow((state) => ({
            list: state.modalApp.list,
        })),
    );
    return (
        <Modal app={list[routerName]} name={routerName}>
            <SidebarProvider defaultOpen={true}>
                <AppSidebar items={MenuItems[routerName]} />
                <main className="flex flex-col w-full overflow-x-auto">
                    <SidebarTrigger />
                    <ScrollArea className="h-[calc(100%-28px)] w-full rounded-md p-2">
                        {children}
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </main>
            </SidebarProvider>
        </Modal>
    );
};

export default ModalWrapper;
```

---

## 完整使用示例

下面是一个完整的、可运行的示例，展示如何在 React(Next.js) 应用中使用这套方案。

### 1. 页面组件以及业务组件 (`src/app/test/page.tsx`)

```tsx
'use client';

import type { ReactNode } from 'react';

import { useShallow } from 'zustand/shallow';

import type { AppType } from '@/_components/modal/types';

// 1. 引入核心 Hook 和组件
import Modal from '@/_components/modal';
import { useModalStore } from '@/_components/modal/hooks';
import { Button } from '@/_components/shadcn/ui/button';

// 2. 在你的业务组件中，定义窗口配置
const ModalWrapper = ({ children, modalName }: { children: ReactNode; modalName: AppType }) => {
    const { list } = useModalStore(
        useShallow((state) => ({
            list: state.modalApp.list,
        })),
    );
    return (
        <Modal app={list[modalName]} name={modalName}>
            {children}
        </Modal>
    );
};

// 3. 你的业务内容组件 (MyCustomContent)
const MyCustomContent = () => {
    return (
        <div className="p-4">
            <h2>这里是你Modal中的核心内容区</h2>
            <p>这个窗口可以被拖动、缩放、最小化、关闭！</p>
        </div>
    );
};

const MyCustomContent2 = () => {
    return (
        <div className="p-4">
            <h2>这里是你Modal2中的核心内容区</h2>
            <p>这个窗口可以被拖动、缩放、最小化、关闭！</p>
        </div>
    );
};

// 4. 业务组件中使用 toggleWindow 方法
const Page = () => {
    const { toggleWindow } = useModalStore(
        useShallow((state) => ({
            toggleWindow: state.actions.toggleWindow,
        })),
    );
    return (
        <div>
            <div className="flex gap-3">
                <Button onClick={() => toggleWindow('test')}>打开Test窗口</Button>
                <Button onClick={() => toggleWindow('test2')}>打开Test2窗口</Button>
            </div>
            <ModalWrapper modalName="test">
                <MyCustomContent />
            </ModalWrapper>
            <ModalWrapper modalName="test2">
                <MyCustomContent2 />
            </ModalWrapper>
        </div>
    );
};

export default Page;
```

### 2. 核心modal组件 (`src/_components/modal/`)

```tsx
// src/_components/modal/hooks.ts
'use client';

import { nextTick } from 'node:process';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { DefaultMenuUrl } from '@/app/@modal/constant'; // 因为自己网站涉及modal与url联动，所以带有DefaultMenuUrl，可以自行删除；activePath，setActivePath同理

import type { AppType, ModalActions, ModalOptions } from './types';

/**
 * 创建modal store
 * hide: true, max: true | null     => 关闭
 * hide: false, max: true           => 打开
 * hide: false, max: false          => 最小化
 */
export const createModalStore = () =>
    create<ModalOptions & { actions: ModalActions }>()(
        immer(
            devtools(
                (set) => ({
                    modalApp: {
                        list: {
                            test: {
                                id: 'test',
                                title: 'Test',
                                size: 'full',
                                hide: true,
                                max: true,
                                z: 1,
                                activePath: '',
                            },
                            test2: {
                                id: 'test2',
                                title: 'Test2',
                                size: 'full',
                                hide: true,
                                max: true,
                                z: 1,
                                activePath: '',
                            },
                        },
                        hz: 2,
                        windowStack: [],
                    },
                    actions: {
                        toggleWindow: (appName: AppType) => {
                            set((state) => {
                                const app = state.modalApp.list[appName];
                                const windowStack = state.modalApp.windowStack;
                                const { full, front, hide } = state.actions;
                                const existApp = windowStack.find((win) => win.id === app.id);
                                if (!existApp) {
                                    // 没有不在显示状态（不包括最小化），推入栈 => open
                                    // 设置DefaultMenuUrl
                                    if (app.hide) {
                                        // close 状态
                                        app.activePath = DefaultMenuUrl[appName];
                                    }
                                    nextTick(() => {
                                        full(appName);
                                    });
                                } else {
                                    const frontApp = windowStack.at(-1)!;
                                    if (existApp.id !== frontApp.id) {
                                        // 不是在栈顶，取出放入栈顶 => front
                                        nextTick(() => {
                                            front(appName);
                                        });
                                    } else {
                                        // 是在栈顶，最小化 => hide
                                        nextTick(() => {
                                            hide(appName);
                                        });
                                    }
                                }
                            });
                        },
                        home: () => {
                            const store = useModalStore.getState();
                            const appIds = store.modalApp.windowStack.map((app) => app.id);

                            set((state) => {
                                state.modalApp.windowStack = [];
                            });

                            // 在set外部调用hide，避免代理对象撤销问题
                            appIds.forEach((appId) => {
                                nextTick(() => {
                                    useModalStore.getState().actions.hide(appId);
                                });
                            });
                        },
                        full: (appName: AppType) =>
                            set((state) => {
                                const app = state.modalApp.list[appName];
                                app.size = 'full';
                                app.hide = false;
                                app.max = true;
                                state.modalApp.hz++;
                                app.z = state.modalApp.hz;

                                const windowStack = state.modalApp.windowStack;
                                windowStack.push(app);
                            }),
                        hide: (appName: AppType) =>
                            set((state) => {
                                const app = state.modalApp.list[appName];
                                app.size = 'full';
                                app.hide = false;
                                app.max = false;

                                const windowStack = state.modalApp.windowStack;
                                const index = windowStack.findIndex((win) => win.id === app.id);
                                windowStack.splice(index, 1);
                            }),
                        mxmz: (appName: AppType) =>
                            set((state) => {
                                const app = state.modalApp.list[appName];
                                const size = (['mini', 'full'] as const)[
                                    app.size !== 'full' ? 1 : 0
                                ];
                                app.size = size;
                                app.hide = false;
                                app.max = true;
                                state.modalApp.hz++;
                                app.z = state.modalApp.hz;
                            }),
                        close: (appName: AppType) =>
                            set((state) => {
                                const app = state.modalApp.list[appName];
                                app.hide = true;
                                app.max = null;
                                app.activePath = '';
                                app.z = -1;
                                state.modalApp.hz--;

                                const windowStack = state.modalApp.windowStack;
                                const index = windowStack.findIndex((win) => win.id === app.id);
                                windowStack.splice(index, 1);
                            }),
                        resize: (appName: AppType, dimP) =>
                            set((state) => {
                                const app = state.modalApp.list[appName];
                                app.size = 'cstm';
                                app.hide = false;
                                app.max = true;
                                app.dim = dimP;
                                if (app.z !== state.modalApp.hz) state.modalApp.hz++;
                                app.z = state.modalApp.hz;
                            }),
                        front: (appName: AppType) =>
                            set((state) => {
                                const app = state.modalApp.list[appName];
                                if (app.z !== state.modalApp.hz) {
                                    state.modalApp.hz++;
                                    app.z = state.modalApp.hz;
                                }

                                const windowStack = state.modalApp.windowStack;
                                const index = windowStack.findIndex((win) => win.id === app.id);
                                if (index !== windowStack.length - 1) {
                                    windowStack.splice(index, 1);
                                    windowStack.push(app);
                                }
                            }),
                        setActivePath: (appName: AppType, path: string) =>
                            set((state) => {
                                const app = state.modalApp.list[appName];
                                app.activePath = path;
                            }),
                    },
                }),
                { name: 'modalStore' },
            ),
        ),
    );

export const useModalStore = createModalStore();

export type ModalAppStore = ReturnType<typeof createModalStore>;
```

```tsx
// src/_components/modal/types.ts
export type AppType = 'test' | 'test2';

export interface AppItem {
    id: AppType;
    title: string;
    size: 'full' | 'mini' | 'cstm';
    hide: boolean;
    max: boolean | null;
    z: number;
    activePath: string;
    dim?: {
        width: string;
        height: string;
        top: string;
        left: string;
    };
}

export interface ModalOptions {
    modalApp: {
        list: {
            [appName in AppType]: AppItem;
        };
        hz: number;
        windowStack: AppItem[];
    };
}

export interface ModalActions {
    toggleWindow: (appName: AppType) => void;
    home: () => void;
    full: (appName: AppType) => void;
    hide: (appName: AppType) => void;
    mxmz: (appName: AppType) => void;
    close: (appName: AppType) => void;
    resize: (appName: AppType, dimP: AppItem['dim']) => void;
    front: (appName: AppType) => void;
    setActivePath: (appName: AppType, path: string) => void;
}
```

```tsx
// src/_components/modal/index.tsx
import type { FC, PropsWithChildren } from 'react';

import { useRef } from 'react';
import { useShallow } from 'zustand/shallow';

import type { AppType, ModalOptions } from '@/_components/modal/types';

import { ToolBar } from './toolbar';
import { useModalStore } from './hooks';
const Modal: FC<
    PropsWithChildren & {
        app: ModalOptions['modalApp']['list'][AppType];
        name: AppType;
    }
> = ({ children, app, name }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const { front } = useModalStore(
        useShallow((state) => ({
            front: state.actions.front,
        })),
    );
    return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
            className="msfiles floatTab dpShad"
            ref={modalRef}
            data-size={app.size}
            data-max={app.max}
            data-hide={app.hide}
            style={{
                ...(app.size === 'cstm' ? app.dim : null),
                zIndex: app.z,
            }}
            onMouseDown={(e) => {
                e.stopPropagation();
                front(name);
            }}
        >
            <ToolBar name={name} app={app} parentRef={modalRef} />
            <div className="windowScreen flex flex-col">{children}</div>
        </div>
    );
};

export default Modal;
```

```tsx
// src/_components/modal/toolbar.tsx
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
'use client';
import type { MouseEvent, RefObject } from 'react';

import { Circle, CircleDot, CircleMinus, CircleX, Folders } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/shallow';

import { useModalStore } from '@/_components/modal/hooks';

import type { AppType, ModalOptions } from './types';

export const ToolBar = ({
    name,
    app,
    parentRef,
}: {
    name: AppType;
    app: ModalOptions['modalApp']['list'][AppType];
    parentRef: RefObject<HTMLDivElement | null>;
}) => {
    const { modalApp, close, hide, mxmz, resize } = useModalStore(
        useShallow((state) => ({
            modalApp: state.modalApp,
            close: state.actions.close,
            hide: state.actions.hide,
            mxmz: state.actions.mxmz,
            resize: state.actions.resize,
        })),
    );
    const router = useRouter();

    let posP = [0, 0];
    let dimP = [0, 0];
    let posM = [0, 0];
    let wnapp: HTMLDivElement | null = null;
    let op = 0;
    let vec = [0, 0];

    let isDragged = false;

    const toolDrag = (e: MouseEvent<HTMLDivElement>) => {
        // console.log('toolDrag');
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
            wnapp = parentRef.current as HTMLDivElement;

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
            resize(name, dimP);
        }
        isDragged = false;
    };

    const minimize = () => {
        mxmz(name);
        if (modalApp.list[name].size === 'full') {
            setPos(0, 0);
            setDim(window.innerHeight, window.innerWidth);
        }
    };

    return (
        <>
            <div className="toolbar">
                <div
                    className="topInfo flex flex-grow items-center"
                    onMouseDown={toolDrag}
                    data-op="0"
                    onDoubleClick={minimize}
                >
                    <Folders size={18} />
                    <div className="title">{app.title}</div>
                </div>
                <div className="actbtns flex items-center">
                    <div
                        className="actbtn"
                        onClick={() => {
                            hide(name);
                            router.push('/');
                        }}
                    >
                        <CircleMinus size={18} />
                    </div>
                    <div className="actbtn" onClick={minimize}>
                        {modalApp.list[name].size === 'full' ? (
                            <CircleDot size={18} />
                        ) : (
                            <Circle size={18} />
                        )}
                    </div>
                    <div
                        className="actbtn closeBtn"
                        onClick={() => {
                            close(name);
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
```

### 3. 样式 (Tailwind CSS)(`src/app/styles/tailwind/component/`)

直接扒源码的样式，简单用Tailwind套个壳。（嫌麻烦就不用@apply改写了）

```css
/* src/app/styles/tailwind/component/index.css */
@import './modal.css';
@import './toolbar.css';
```

```css
/* src/app/styles/tailwind/component/toolbar.css */
@layer components {
    .toolbar {
        position: relative;
        display: flex;
        flex-shrink: 0;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 28px;
        border-radius: 6px 6px 0 0;

        &[data-float='false'] {
            z-index: 10;
        }

        &[data-back='light'] {
            background: #fefefe;
        }

        &[data-back='dark'] {
            background: #181818;
        }
    }

    .topInfo {
        height: 100%;

        &[data-float='true'] {
            opacity: 0;
        }

        .uicon {
            margin: 0 10px 0 6px;
        }
    }

    .actbtns {
        height: 100%;

        .actbtn {
            @apply h-full flex items-center justify-center px-1 hover:bg-[#88888833] cursor-pointer transition-all;

            &.closeBtn {
                @apply hover:bg-[#ff0000cc];
                border-radius: 0 6px 0 0;
            }
        }
    }

    .closeBtn {
        border-radius: 0 6px 0 0;
    }

    .snapbox {
        position: relative;

        &[data-hv='true'] {
            background: rgb(136 136 136 / 20%);
        }
    }

    .resizecont {
        position: absolute;
        z-index: 12;
    }

    .topone {
        top: -8px;
        left: 0;
        z-index: 22;
        width: calc(100% - 48px * 3);
    }

    .leftone {
        left: -8px;
        height: 100%;
    }

    .rightone {
        right: -8px;
        bottom: 0;
        height: calc(100% - 28px);
    }

    .bottomone {
        bottom: -8px;
        left: 0;
        width: 100%;
    }

    .conrsz {
        width: 8px;
        height: 8px;
    }

    .edgrsz {
        min-width: 8px;
        min-height: 8px;
    }

    .wdws {
        width: 100%;
    }

    .hdws {
        height: 100%;
    }

    .noscroll {
        &::-webkit-scrollbar {
            display: none;
        }
    }

    body[data-theme='dark'] .toolbar[data-noinvert='false'] {
        .snapcont {
            background: #222;

            .snapper {
                background: #4e4e4e;
                border: solid 1px #777;

                &:hover {
                    background: var(--clrPrm);
                    border: solid 1px var(--clrPrm);
                }
            }
        }

        .appFullName {
            color: #fefefe;
        }

        .actbtns {
            .uicon img {
                filter: invert(1);
            }
        }
    }
}
```

```css
/* src/app/styles/tailwind/component/modal.css */
@layer components {
    .msfiles {
        --bg1: #fff;
        --bg2: #f5f5f5;
        --dsb-col: #aaa;
        --gray1: #bbb;
        --gray2: #ddd;
        --hover-bg: rgb(0 178 255 / 16%);
        --focus-bg: rgb(0 183 255 / 25%);
        --fakeMica: #202020 radial-gradient(#1a1f35 25%, #202020 100%) no-repeat fixed;
        color: var(--modal-txt-color);
        background: var(--modal-bg-color);

        @apply backdrop-blur-md;
    }

    .floatTab {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        width: 100%;

        /* TODO: theme(spacing.16) 换成动态获得dock menu高度 */
        @apply h-[calc(100vh-theme(spacing.16))];
        border-radius: 6px;
        transform-origin: center;
        transition: all cubic-bezier(0.85, 0.14, 0.14, 0.85) 250ms;

        &[data-size='cstm'] {
            filter: none;
        }

        &[data-hide='true'] {
            top: 0;
            left: 0;
            pointer-events: none;
            opacity: 0;
            transform: scale(0.8);
        }

        &[data-max='false'] {
            top: calc(100% + 10px);
            pointer-events: none;
            opacity: 0;
            transform: scale(0.6);
            transform-origin: bottom;
        }

        &[data-size='mini'] {
            top: 10%;
            left: 20%;
            width: 60%;
            height: 80%;
        }
    }

    .dpShad {
        box-shadow: 0 0 6px rgb(0 0 0 / 25%);
    }

    .windowScreen {
        flex-grow: 1;
        width: 100%;
        overflow: hidden;
        border-radius: 0 0 6px 6px;
    }

    .notrans {
        transition: none !important;
    }
}
```

---

## 总结

这套基于 **React + Zustand** 的窗口管理方案：

- **开发效率高：** 封装一个窗口功能组件，减少重复代码。
- **状态管理完善：** Zustand + Immer 精确管理窗口状态和 Z 轴堆栈，避免状态错乱。
- **交互体验流畅：** `ToolBar` 提供了媲美原生应用的拖拽和缩放体验，`data-vec` 设计精妙。
- **易于扩展：** 架构分层清晰，可以轻松添加新功能，如窗口动画、边界吸附、多屏适配、本地存储持久化等。
- **代码可维护性强：** 逻辑集中，职责分离，团队协作更顺畅。

## 参考链接

- [Win11 in React](https://github.com/blueedgetechno/win11React)

**如果觉得对您有帮助，欢迎点赞 👍 收藏 ⭐ 关注 🔔 支持一下！**
