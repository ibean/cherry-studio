#!/bin/bash

# 遇到错误立即停止执行
set -e

echo "🔍 1/4 正在安装/检查依赖..."
# 解决 "Couldn't find the node_modules state file" 错误
yarn install

echo "🏗️ 2/4 正在构建 macOS (ARM64) 版本..."
# 使用 build:mac:arm64 只构建 M1/M2 版本，比 build:mac 快
yarn build:mac:arm64

echo "🛡️ 3/4 正在处理权限和签名..."
# 清除隔离属性（关键步骤：防止打开时提示“应用已损坏”）
# xattr -cr "dist/mac-arm64/Cherry Studio.app"

# 进行 Ad-hoc 本地签名
codesign -s - --deep --force "dist/mac-arm64/Cherry Studio.app"

echo "✅ 4/4 构建成功！"
echo "📂 应用位置: dist/mac-arm64/Cherry Studio.app"
echo "👉 现在你可以直接双击打开，或者将其拖入应用程序文件夹。"
