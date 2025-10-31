#!/bin/bash


BIN_NEON_PATH=$(dirname $(readlink -f $0))
# 读取 .env 文件（仅加载 POSTGRES_URL，避免执行任意代码）
if [ -f .env ]; then
  # 使用 grep + sed 安全提取变量（避免 source 带来的风险）
  export POSTGRES_URL=$(grep -E '^POSTGRES_URL=' .env | cut -d '=' -f2-)
  
  # 去除可能的引号（支持 "xxx" 或 'xxx' 或 xxx）
  POSTGRES_URL=$(echo "$POSTGRES_URL" | sed -e 's/^["'\'']//' -e 's/["'\'']$//')
  
  if [ -z "$POSTGRES_URL" ]; then
    echo "❌ 错误: .env 文件中未找到 POSTGRES_URL"
    exit 1
  fi
else
  echo "❌ 错误: 未找到 .env 文件"
  exit 1
fi

# 执行导入
echo "📤 正在导入数据到 Neon..."
psql "$POSTGRES_URL" -f $BIN_NEON_PATH/neon_backup_clean.sql

if [ $? -eq 0 ]; then
  echo "✅ 数据导入成功！"
else
  echo "❌ 数据导入失败，请检查连接和 SQL 文件。"
  exit 1
fi