#!/bin/bash

# 获取系统 DNS nameserver 并设置为代理
echo "正在获取系统 DNS nameserver..."

# 从 /etc/resolv.conf 中提取 nameserver
NAMESERVER=$(cat /etc/resolv.conf | grep nameserver | awk '{print $2}' | head -n 1)

if [ -z "$NAMESERVER" ]; then
    echo "未找到有效的 nameserver"
    exit 1
fi

echo "找到 nameserver: $NAMESERVER"

# 设置代理地址 (假设使用 7897 端口，根据您的 .env 示例)
PROXY_URL="http://$NAMESERVER:7897"

echo "设置代理为: $PROXY_URL"

# 更新 .env 文件中的 SHIPIT_PROXY 值
if [ -f ".env" ]; then
    # 检查 .env 文件中是否已存在 SHIPIT_PROXY
    if grep -q "^SHIPIT_PROXY=" .env; then
        # 替换现有的 SHIPIT_PROXY 行
        sed -i "s|^SHIPIT_PROXY=.*|SHIPIT_PROXY=$PROXY_URL|" .env
    else
        # 添加新的 SHIPIT_PROXY 行
        echo "SHIPIT_PROXY=$PROXY_URL" >> .env
    fi
    echo "已更新 .env 文件中的 SHIPIT_PROXY"
else
    # 创建新的 .env 文件
    echo "SHIPIT_PROXY=$PROXY_URL" > .env
    echo "已创建新的 .env 文件并设置 SHIPIT_PROXY"
fi

echo "代理设置完成: $PROXY_URL"