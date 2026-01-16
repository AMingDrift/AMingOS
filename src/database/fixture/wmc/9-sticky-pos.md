---
# 电商都在用的 Sticky Sidebar，原来是这样实现的！

> 一个直观又富有表现力的交互动画效果——粘性定位（position: sticky）的可视化解读。本文将通过一张原创示意图，结合类比，深入浅出地揭示 sticky 定位在滚动过程中的行为逻辑，并帮助你在实际开发中更好运用这一强大的 CSS 特性。
---

> 在电商、内容类网站中，“粘性侧边栏” 是非常常见的交互设计 —— 滚动页面时，侧边栏（如商品规格、筛选条件）始终保持可视，能显著提升用户体验。但实现过程中，我们常会遇到布局冲突、动态内容导致 sticky 失效等问题。本文将从基础原理到进阶适配，拆解一个 “智能粘性侧边栏” 的实现思路。

最近在浏览海外电商平台时，注意到一个高频出现的交互细节：**产品详情页的侧边栏会“粘性固定”**。无论左侧是图片轮播区，还是右侧是商品信息/购买按钮区，只要其中一侧内容较短，它就会在用户滚动页面时自动“吸顶”，始终保持在可视区域内。

![9-sticky_effect1.gif](https://cdn.amingdrift.com/blogs/9-sticky_effect1.gif)

还有一些官网介绍页也有这种效果

![9-sticky_effect2.gif](https://cdn.amingdrift.com/blogs/9-sticky_effect2.gif)

这种 **Sticky Sidebar（粘性侧边栏）** 效果极大提升了用户体验——用户无需反复滚动回顶部就能看到关键信息或操作按钮。

作为前端，必须学习借鉴一下。今天就一起深入理解下 `position: sticky` 的工作原理，并手写一个响应式 Sticky Sidebar 的 HTML Demo。

## 一、`position: sticky` 基础：粘住，但不 “越界”

`position: sticky` 是 CSS 中非常实用的定位属性，它兼具`relative`和`fixed`的特性：

- 当用户滚动页面、该元素尚未到达指定的粘附阈值（如 `top: 20px`）时，它表现为 `relative` 定位，随文档流正常布局；
- 一旦滚动使其达到阈值（元素顶部距离视口顶部为 20px），它就会“粘住”在视口的指定位置（顶部20px处），表现得像 `fixed` 定位；
- 但这种“固定”仅在其**父容器的边界内有效**——当父容器完全滚出视口后，该元素也会随之离开，不再固定。

> ✅ **总结一句话**： `sticky` 元素在滚动到阈值前表现如 `relative`，之后表现如 `fixed`，但**始终被限制在父容器内**。

核心粘性样式定义如下：

```css
.sticky-sidebar_sticky {
    position: sticky;
    top: 20px; /* 滚动到距离视口顶部20px时触发粘性 */
    z-index: 10;
}
```

> ⚠️ 注意：`sticky` 定位必须配合至少一个 `top`、`right`、`bottom` 或 `left` 值才能生效。

## 二、`Sticky` 拟人化比喻：方形的女孩与视口顶端的男孩

光看定义太抽象。我自己强行想了个类比来加深记忆：

![9-css-sticky-explainer-diagram.png](https://cdn.amingdrift.com/blogs/9-css-sticky-explainer-diagram.png)

想象有一个 **被拍扁成方形的女孩**，她只能在家（父容器）里，从小被父母“金屋藏娇”——**她永远不能离开这个房间**（即不能脱离父元素的边界）。

在女孩家上空，视口顶部（`top: 0`）挂着一个 **被拧成一条线的男孩**，处在浏览器视口的上边缘。女孩头朝向男孩。

1. 当页面刚开始**向下滚动**时（视口向下移动），男孩逐渐靠近女孩。
2. **一旦女孩的头碰到男孩所在的位置（`top: 0`）**，**男孩立马“粘住”了她**，带着她在房间内继续“移动”——此时女孩表现为 `fixed` 定位，粘在视口顶部。

3. 男孩带着女孩继续在家里“移动”，但注意！**她依然不能走出房间**。如果男孩飘出女孩家（父容器滚动出视口），她也停留在房间内，男孩女孩暂时分离了。

4. 当页面**向上回滚**时，男孩接触到女孩头部时，男孩又会“粘住”她，直到把她带回她最初的那个位置——也就是她在房间里的原始坐标。这时她又变回 `relative` 定位。

## 三、实战：手写一个 Sticky Sidebar Demo

我参考主流实现方式，写了一个简洁的 HTML 示例。（可以复制保存到本地看效果）以下是完整代码：

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Sticky Sidebar with Bottom Alignment</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: #f9f9f9;
                padding: 40px 20px;
                line-height: 1.6;
                color: #333;
            }

            .sticky-sidebar {
                display: block;
                width: 100%;
            }

            .sticky-sidebar__container {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 40px;
                align-items: flex-start; /* 👈 关键！避免子项被 stretch */
                max-width: 1200px;
                margin: 0 auto;
                padding: 40px 20px;
                background: white;
                border-radius: 16px;
                box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
            }

            /* 加深 .sticky-sidebar__content 的阴影 */
            .sticky-sidebar__content {
                background-color: #ffffff;
                padding: 24px;
                border-radius: 12px;
                /* 增加阴影的垂直偏移、模糊半径、扩散半径和颜色，使边缘更明显 */
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
            }

            /* 👇 核心：sticky 行为 */
            .sticky-sidebar__sticky {
                position: sticky;
                top: 20px;
                z-index: 10;
            }

            .image-placeholder {
                width: 150px;
                height: 150px;
                background-color: #e0e0e0;
                color: #000000;
                border-radius: 6px;
                display: flex;
                justify-content: center;
                align-items: center;
                font-family: Arial, sans-serif;
                font-size: 14px;
                text-align: center;
                padding: 10px;
            }

            @media screen and (max-width: 989px) {
                .sticky-sidebar__container {
                    grid-template-columns: 1fr;
                    gap: 24px;
                }

                .sticky-sidebar__sticky {
                    position: static !important;
                }
            }

            /* 推荐商品区域 */
            .recommended-products {
                max-width: 1200px;
                margin: 80px auto 0;
                padding: 0 20px;
            }

            .recommended-products h2 {
                text-align: center;
                margin-bottom: 32px;
                font-size: 28px;
                color: #111;
            }

            .product-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 24px;
            }

            .product-card {
                background: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
                transition: transform 0.2s;
            }

            .product-card:hover {
                transform: translateY(-4px);
            }

            .product-card img {
                width: 100%;
                height: 200px;
                object-fit: cover;
                background: #eee;
            }

            .product-card .info {
                padding: 16px;
            }

            .product-card .info h3 {
                font-size: 18px;
                margin-bottom: 8px;
            }

            .product-card .info .price {
                color: #e53935;
                font-weight: bold;
            }

            /* 滚动提示 */
            .scroll-hint {
                text-align: center;
                margin-top: 40px;
                color: #888;
                font-style: italic;
            }
        </style>
    </head>

    <body>
        <!-- 主 Sticky 区域 -->
        <sticky-sidebar class="sticky-sidebar" data-sticky-offset="20">
            <div class="sticky-sidebar__container">
                <!-- 左侧：短内容 -->
                <div class="sticky-sidebar__left" data-sidebar-side="left">
                    <div class="sticky-sidebar__content">
                        <h2>🏃‍♂️ Product Media</h2>
                        <p>This is the product image/video gallery area.</p>
                        <div
                            style="
                background: #eee;
                height: 300px;
                margin-top: 16px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
              "
                        >
                            [Product Image]
                        </div>
                        <p style="margin-top: 16px; font-size: 14px; color: #666">
                            (Short content — will stick while scrolling)
                        </p>

                        <!-- 动态内容：可展开的图片库 -->
                        <details
                            style="
                margin-top: 20px;
                padding: 12px;
                background: #f0f0f0;
                border-radius: 8px;
                cursor: pointer;
              "
                        >
                            <summary style="font-weight: bold; user-select: none">
                                🖼️ More Images (Click to expand)
                            </summary>
                            <div
                                style="
                  margin-top: 12px;
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 8px;
                "
                            >
                                <div class="image-placeholder">[image 1]</div>
                                <div class="image-placeholder">[image 2]</div>
                                <div class="image-placeholder">[image 3]</div>
                                <div class="image-placeholder">[image 4]</div>
                            </div>
                        </details>
                    </div>
                </div>

                <!-- 右侧：超长内容 -->
                <div class="sticky-sidebar__right" data-sidebar-side="right">
                    <div class="sticky-sidebar__content">
                        <h2>🛒 Variants & Add to Cart</h2>
                        <p>Select your size, color, and add to cart below.</p>

                        <div style="margin: 20px 0">
                            <label><strong>Size:</strong></label>
                            <select
                                style="
                  width: 100%;
                  padding: 10px;
                  margin-top: 6px;
                  border: 1px solid #ddd;
                  border-radius: 6px;
                "
                            >
                                <option>US 7</option>
                                <option>US 8</option>
                                <option>US 9</option>
                                <option>US 10</option>
                                <option>US 11</option>
                                <option>US 12</option>
                            </select>
                        </div>

                        <button
                            style="
                background: #1a73e8;
                color: white;
                border: none;
                padding: 14px 24px;
                font-size: 18px;
                border-radius: 8px;
                width: 100%;
                margin: 20px 0;
              "
                        >
                            Add to Cart
                        </button>

                        <hr style="margin: 30px 0; border: 0; border-top: 1px solid #eee" />

                        <h3>📝 Product Description</h3>
                        <p>
                            This premium running shoe features lightweight mesh, responsive foam,
                            and durable outsole.
                        </p>

                        <!-- 动态内容：可展开的详细介绍 -->
                        <details
                            style="
                margin-top: 30px;
                padding: 16px;
                background: #f9f9f9;
                border-radius: 8px;
                cursor: pointer;
              "
                        >
                            <summary style="font-weight: bold; font-size: 16px; user-select: none">
                                📖 Detailed Features & Benefits
                            </summary>
                            <div style="margin-top: 16px; line-height: 1.8; color: #555">
                                <h4 style="margin-top: 16px; margin-bottom: 8px; color: #333">
                                    Advanced Cushioning Technology
                                </h4>
                                <p>
                                    Our premium running shoes feature cutting-edge cushioning
                                    technology that provides exceptional comfort and support. The
                                    multi-layer foam construction absorbs impact while maintaining
                                    responsiveness, allowing you to run longer with less fatigue.
                                </p>

                                <h4 style="margin-top: 16px; margin-bottom: 8px; color: #333">
                                    Breathable Mesh Upper
                                </h4>
                                <p>
                                    The engineered mesh upper ensures maximum breathability, keeping
                                    your feet cool and dry during intense workouts. The strategic
                                    ventilation zones allow air to flow freely, preventing moisture
                                    buildup and odor formation even during extended running
                                    sessions.
                                </p>

                                <h4 style="margin-top: 16px; margin-bottom: 8px; color: #333">
                                    Durable Outsole
                                </h4>
                                <p>
                                    The reinforced rubber outsole is designed to withstand rigorous
                                    use on various terrains. With our proprietary grip pattern,
                                    you'll experience superior traction on both wet and dry
                                    surfaces, ensuring safety and confidence with every stride.
                                </p>

                                <h4 style="margin-top: 16px; margin-bottom: 8px; color: #333">
                                    Lightweight Design
                                </h4>
                                <p>
                                    Weighing just 7.2 ounces per shoe, our design minimizes energy
                                    expenditure while maintaining structural integrity. The
                                    lightweight construction allows for faster acceleration and
                                    smoother transitions, making it ideal for both casual joggers
                                    and competitive runners.
                                </p>

                                <h4 style="margin-top: 16px; margin-bottom: 8px; color: #333">
                                    Sustainability
                                </h4>
                                <p>
                                    We're committed to environmental responsibility. Our shoes are
                                    crafted using 30% recycled materials, reducing waste without
                                    compromising performance. The eco-friendly manufacturing process
                                    minimizes water usage and carbon emissions, making this a
                                    responsible choice for conscious consumers.
                                </p>

                                <h4 style="margin-top: 16px; margin-bottom: 8px; color: #333">
                                    Fit & Comfort
                                </h4>
                                <p>
                                    Designed with an ergonomic fit, these shoes conform to your
                                    foot's natural shape. The padded collar and tongue provide
                                    additional comfort, while the secure lacing system ensures a
                                    snug fit that reduces slippage and blisters during extended
                                    wear.
                                </p>

                                <h4 style="margin-top: 16px; margin-bottom: 8px; color: #333">
                                    Performance Metrics
                                </h4>
                                <p>Testing by professional athletes has shown:</p>
                                <ul style="margin-left: 20px; margin-top: 8px">
                                    <li>15% improvement in running efficiency</li>
                                    <li>25% reduction in impact-related fatigue</li>
                                    <li>40% increase in comfort rating vs. competitors</li>
                                    <li>99% durability over 300+ miles of running</li>
                                </ul>

                                <h4 style="margin-top: 16px; margin-bottom: 8px; color: #333">
                                    Care Instructions
                                </h4>
                                <p>
                                    To maintain optimal performance, hand wash with mild soap and
                                    cool water. Air dry naturally away from direct heat sources.
                                    Regular cleaning helps preserve the breathable mesh and extends
                                    the lifespan of your shoes.
                                </p>
                            </div>
                        </details>

                        <!-- 另一个可展开的动态内容 -->
                        <details
                            style="
                margin-top: 20px;
                padding: 16px;
                background: #f9f9f9;
                border-radius: 8px;
                cursor: pointer;
              "
                        >
                            <summary style="font-weight: bold; font-size: 16px; user-select: none">
                                ⭐ Customer Reviews
                            </summary>
                            <div style="margin-top: 16px">
                                <div
                                    style="
                    margin-bottom: 16px;
                    padding: 12px;
                    background: white;
                    border-left: 4px solid #ffc107;
                    border-radius: 4px;
                  "
                                >
                                    <p style="font-weight: bold; margin-bottom: 4px">
                                        John D. ⭐⭐⭐⭐⭐
                                    </p>
                                    <p>
                                        "Best shoes I've ever owned! The comfort is incredible, and
                                        they last forever. Highly recommend for anyone serious about
                                        running."
                                    </p>
                                </div>
                                <div
                                    style="
                    margin-bottom: 16px;
                    padding: 12px;
                    background: white;
                    border-left: 4px solid #ffc107;
                    border-radius: 4px;
                  "
                                >
                                    <p style="font-weight: bold; margin-bottom: 4px">
                                        Sarah M. ⭐⭐⭐⭐⭐
                                    </p>
                                    <p>
                                        "I've tried many brands, but these are my favorite. The
                                        support and cushioning are perfect. My feet feel amazing
                                        after long runs."
                                    </p>
                                </div>
                                <div
                                    style="
                    margin-bottom: 16px;
                    padding: 12px;
                    background: white;
                    border-left: 4px solid #ffc107;
                    border-radius: 4px;
                  "
                                >
                                    <p style="font-weight: bold; margin-bottom: 4px">
                                        Mike T. ⭐⭐⭐⭐
                                    </p>
                                    <p>
                                        "Great shoes! True to size, very comfortable. Only minor
                                        issue with sizing guide, but overall fantastic product."
                                    </p>
                                </div>
                                <div
                                    style="
                    margin-bottom: 16px;
                    padding: 12px;
                    background: white;
                    border-left: 4px solid #ffc107;
                    border-radius: 4px;
                  "
                                >
                                    <p style="font-weight: bold; margin-bottom: 4px">
                                        Emma L. ⭐⭐⭐⭐⭐
                                    </p>
                                    <p>
                                        "Perfect fit, amazing comfort level. These shoes transformed
                                        my running experience. Will definitely buy again!"
                                    </p>
                                </div>
                            </div>
                        </details>
                    </div>
                </div>
            </div>
        </sticky-sidebar>

        <!-- 👇 新增：推荐商品区域（让页面更长，并展示 sticky 自然结束） -->
        <div class="recommended-products">
            <h2>You May Also Like</h2>
            <div class="product-grid">
                <div class="product-card">
                    <img
                        src="https://via.placeholder.com/300x200/e0e0e0/000000?text=Trail+Shoe"
                        alt="Trail Shoe"
                    />
                    <div class="info">
                        <h3>Trail Running Shoe</h3>
                        <div class="price">$119.99</div>
                    </div>
                </div>
                <div class="product-card">
                    <img
                        src="https://via.placeholder.com/300x200/e0e0e0/000000?text=Gym+Shoe"
                        alt="Gym Shoe"
                    />
                    <div class="info">
                        <h3>Gym Training Shoe</h3>
                        <div class="price">$99.99</div>
                    </div>
                </div>
                <div class="product-card">
                    <img
                        src="https://via.placeholder.com/300x200/e0e0e0/000000?text=Running+Socks"
                        alt="Socks"
                    />
                    <div class="info">
                        <h3>Performance Socks (3-Pack)</h3>
                        <div class="price">$19.99</div>
                    </div>
                </div>
                <div class="product-card">
                    <img
                        src="https://via.placeholder.com/300x200/e0e0e0/000000?text=Water+Bottle"
                        alt="Bottle"
                    />
                    <div class="info">
                        <h3>Insulated Water Bottle</h3>
                        <div class="price">$29.99</div>
                    </div>
                </div>
                <div class="product-card">
                    <img
                        src="https://via.placeholder.com/300x200/e0e0e0/000000?text=Trail+Shoe"
                        alt="Trail Shoe"
                    />
                    <div class="info">
                        <h3>Trail Running Shoe</h3>
                        <div class="price">$119.99</div>
                    </div>
                </div>
                <div class="product-card">
                    <img
                        src="https://via.placeholder.com/300x200/e0e0e0/000000?text=Gym+Shoe"
                        alt="Gym Shoe"
                    />
                    <div class="info">
                        <h3>Gym Training Shoe</h3>
                        <div class="price">$99.99</div>
                    </div>
                </div>
                <div class="product-card">
                    <img
                        src="https://via.placeholder.com/300x200/e0e0e0/000000?text=Running+Socks"
                        alt="Socks"
                    />
                    <div class="info">
                        <h3>Performance Socks (3-Pack)</h3>
                        <div class="price">$19.99</div>
                    </div>
                </div>
                <div class="product-card">
                    <img
                        src="https://via.placeholder.com/300x200/e0e0e0/000000?text=Water+Bottle"
                        alt="Bottle"
                    />
                    <div class="info">
                        <h3>Insulated Water Bottle</h3>
                        <div class="price">$29.99</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="scroll-hint">
            ✅ 尝试以下操作来观察 ResizeObserver 的实时效果：<br />
            1️⃣ 展开左侧 "More Images" → 左侧变高<br />
            2️⃣ 展开右侧 "Detailed Features & Benefits" → 右侧变高<br />
            3️⃣ 观察 sticky 策略是否动态调整（哪一侧保持固定）<br />
            4️⃣ 滚动到底部，观察 sticky 在容器结束时自然结束（不会穿透父容器）
        </div>

        <script>
            (function () {
                class StickySidebar extends HTMLElement {
                    constructor() {
                        super();
                        this.leftSide = null;
                        this.rightSide = null;
                        this.stickyOffset = 20;
                        this.resizeObserver = null;
                        this.isDesktop = window.innerWidth > 989;
                    }

                    connectedCallback() {
                        this.leftSide = this.querySelector('[data-sidebar-side="left"]');
                        this.rightSide = this.querySelector('[data-sidebar-side="right"]');
                        this.stickyOffset = parseInt(this.dataset.stickyOffset) || 20;

                        this.setupStickyBehavior();
                        this.setupResizeObserver();

                        window.addEventListener('resize', () => {
                            const wasDesktop = this.isDesktop;
                            this.isDesktop = window.innerWidth > 989;
                            if (wasDesktop !== this.isDesktop) {
                                this.setupStickyBehavior();
                            }
                        });
                    }

                    setupResizeObserver() {
                        if (!window.ResizeObserver) return;

                        this.resizeObserver = new ResizeObserver(() => {
                            if (this.isDesktop) {
                                setTimeout(() => this.setupStickyBehavior(), 50);
                            }
                        });

                        this.resizeObserver.observe(this.leftSide);
                        this.resizeObserver.observe(this.rightSide);
                    }

                    setupStickyBehavior() {
                        if (!this.isDesktop) {
                            this.leftSide.classList.remove('sticky-sidebar__sticky');
                            this.rightSide.classList.remove('sticky-sidebar__sticky');
                            return;
                        }

                        const leftHeight = this.leftSide.offsetHeight;
                        const rightHeight = this.rightSide.offsetHeight;

                        this.leftSide.classList.remove('sticky-sidebar__sticky');
                        this.rightSide.classList.remove('sticky-sidebar__sticky');

                        if (leftHeight < rightHeight) {
                            this.leftSide.classList.add('sticky-sidebar__sticky');
                            this.leftSide.style.top = this.stickyOffset + 'px';
                        } else if (rightHeight < leftHeight) {
                            this.rightSide.classList.add('sticky-sidebar__sticky');
                            this.rightSide.style.top = this.stickyOffset + 'px';
                        }
                    }
                }

                customElements.define('sticky-sidebar', StickySidebar);
            })();
        </script>
    </body>
</html>
```

### 1. 两列布局：Grid 实现 + flex/grid 布局的关键坑点

示例中采用 `CSS Grid` 实现两列布局，核心容器样式：

```css
.sticky-sidebar_container {
    display: grid;
    grid-template-columns: 1fr 1fr; /*两列等分 */
    gap: 40px;
    align-items: flex-start; /* 重中之重 */
    max-width: 1200px;
    margin: 0 auto;
}
```

确保主内容区和侧边栏水平并排，且有合理间距。

#### 为什么必须加 align-items: flex-start？

如果省略align-items: flex-start，会发生两个问题：

1. 子元素被强制拉伸，即使内容本身很短，也会和另一列（长内容列）等高；
2. sticky元素的 “父容器高度” 被撑满，粘性效果失去意义（元素本身已经占满父容器，已经没有在父容器的滚动空间了，滚动时不会触发 fixed）。

#### 补充：如果用 Flex 实现两列布局，同样需要注意

```css
/*Flex布局示例 */
.flex-container {
    display: flex;
    gap: 40px;
    align-items: flex-start; /* 必须加，否则sticky失效 */
}
.flex-container .col {
    flex: 1;
}
```

### 2. 进阶：ResizeObserver 监测动态高度，让sticky“智能切换”

示例中侧边栏包含可展开的`details`组件（如“更多图片”“详细特性”），展开/收起时列的高度会动态变化。如果仅靠初始高度判断哪一列加sticky，交互体验会割裂——因此需要`ResizeObserver`监测高度变化，动态调整粘性元素。

#### ResizeObserver 是什么？

`ResizeObserver`是浏览器原生API，用于监测元素的尺寸（宽/高）变化，触发回调函数。相比传统的`window.resize`（仅监测窗口变化），它能精准感知**元素自身的尺寸变化**，是处理动态内容的利器。

#### 示例中的实现逻辑

1. **初始化监测**：连接DOM后，监听左右两列的尺寸变化

```javascript
setupResizeObserver() {
  if (!window.ResizeObserver) return;

  this.resizeObserver = new ResizeObserver(() => {
    if (this.isDesktop) {
      // 延迟执行，确保DOM尺寸已更新
      setTimeout(() => this.setupStickyBehavior(), 50);
    }
  });

  // 监听左右两列的尺寸变化
  this.resizeObserver.observe(this.leftSide);
  this.resizeObserver.observe(this.rightSide);
}
```

1. **动态调整粘性规则**：对比两列高度，仅给“较短的列”添加sticky类

```javascript
setupStickyBehavior() {
  if (!this.isDesktop) {
    // 移动端取消sticky，回归静态布局
    this.leftSide.classList.remove("sticky-sidebar__sticky");
    this.rightSide.classList.remove("sticky-sidebar__sticky");
    return;
  }

  // 获取当前两列的实际高度
  const leftHeight = this.leftSide.offsetHeight;
  const rightHeight = this.rightSide.offsetHeight;

  // 先清空所有sticky类
  this.leftSide.classList.remove("sticky-sidebar__sticky");
  this.rightSide.classList.remove("sticky-sidebar__sticky");

  // 智能判断：短的一列添加sticky
  if (leftHeight < rightHeight) {
    this.leftSide.classList.add("sticky-sidebar__sticky");
    this.leftSide.style.top = this.stickyOffset + "px";
  } else if (rightHeight < leftHeight) {
    this.rightSide.classList.add("sticky-sidebar__sticky");
    this.rightSide.style.top = this.stickyOffset + "px";
  }
}
```

1. **响应式兼容**：窗口尺寸变化时，同步更新布局逻辑

```javascript
window.addEventListener('resize', () => {
    const wasDesktop = this.isDesktop;
    this.isDesktop = window.innerWidth > 989;
    // 仅当从桌面端/移动端切换时，重新设置sticky
    if (wasDesktop !== this.isDesktop) {
        this.setupStickyBehavior();
    }
});
```

### 3. 细节优化，完善交互体验

1. **移动端降级**：屏幕宽度<989px时，强制取消sticky（`position: static !important`），避免小屏上的布局错乱；
2. **z-index 层级**：给sticky元素加`z-index: 10`，防止被其他内容遮挡；

### 4. `<sticky-sidebar>` Web Component 元素

`<sticky-sidebar>`是一个基于 [`Web Component`](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_components) 技术实现的自定义元素。Web Component 是浏览器原生支持的标准组件技术，相比 React、Vue 等框架组件具有跨框架兼容的优势，可以在不同技术栈之间直接复用。

其中，`connectedCallback` 方法相当于 React 中的 `useEffect` 钩子（组件挂载时执行）。

你可以根据具体的业务需求进一步扩展功能（例如自定义 sticky 触发阈值、适配多列布局等）。

## 总结

实现一个“健壮的粘性侧边栏”，需要兼顾三层：

1. **基础层**：掌握`position: sticky`的特性和边界；
2. **布局层**：Grid/Flex布局中，务必设置`align-items: flex-start`，避免子元素拉伸导致sticky失效；
3. **动态层**：用`ResizeObserver`监测元素高度变化，让sticky策略随内容动态调整。

这套思路不仅适用于电商商品页，也可迁移到博客侧边栏、后台管理系统等场景。核心是理解“sticky的生效条件”和“布局对定位的影响”，再结合原生API解决动态内容的适配问题。

`position: sticky` 是一个优雅而强大的 CSS 特性，它用极简的代码解决了复杂的滚动交互问题。理解其“相对+固定+受限”的三重特性，是用好它的关键。

## 注意事项 & 性能建议

1. **父容器需有滚动上下文**  
   `position: sticky` 是否可见，取决于父容器是否有足够内容使其在滚动中“经过”视口。如果整个页面不可滚动，或父容器内无其他内容，sticky 行为将无法被触发——并非失效，而是缺乏滚动场景。

2. **警惕 `overflow` 限制 sticky 范围**  
   避免在 sticky 元素与 body 之间意外插入 overflow: hidden/scroll/auto 的祖先元素，否则 sticky 的粘附范围会被限制在该容器内，可能不符合预期。

3. **移动端兼容性良好**  
   现代浏览器（包括 iOS Safari 和 Android Chrome）均完整支持 `position: sticky`，可安全用于生产环境。

4. **避免过度使用**  
   虽然 `sticky` 性能开销较小，但大量或嵌套使用可能引发布局抖动，尤其在低端设备上。保持简洁，只在必要处使用。

---

> 📚 **参考资料**
>
> - [Bilibili 视频：position: sticky和fixed的区别](https://www.bilibili.com/video/BV1JT41187NV)
> - [MDN - position: sticky](https://developer.mozilla.org/zh-CN/docs/Web/CSS/position#sticky)
> - [MDN - Web Component](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_components)

> 学习优秀作品，是提升技术的最佳路径。本文作为自己的学习笔记，也希望这篇解析对你有所帮助
