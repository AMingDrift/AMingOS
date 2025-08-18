// 推荐：极简 404 页面，避免预渲染错误
export default function NotFound() {
    return (
        <div className="p-8">
            <h1>404 - 页面不存在</h1>
            <p>您访问的页面可能已被删除或从未存在</p>
        </div>
    );
}
