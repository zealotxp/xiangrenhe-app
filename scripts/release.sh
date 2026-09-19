#!/usr/bin/env bash
# 湘仁禾私域会员 APP 原型 - 一键发布脚本
#
# 用法：
#   bash scripts/release.sh "feat(scope): 本次改动说明"
#
# 流程：
#   1. 运行 check_proto.py 静态校验（标签配平 + 断链检查），不通过则中止
#   2. 校验 VERSION 与 CHANGELOG.md 是否已更新
#   3. git add -A && commit
#   4. 若 VERSION 对应的 vX.Y.Z 标签不存在则打标签
#   5. push --follow-tags
#
# 令牌：优先使用环境变量 GH_TOKEN，否则读取仓库根目录的 .gh_token（该文件已 gitignore）

set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

MSG="$1"
if [ -z "$MSG" ]; then
  echo "用法: bash scripts/release.sh \"feat(scope): 本次改动说明\""
  exit 1
fi

# --- 令牌 ---
if [ -z "$GH_TOKEN" ] && [ -f .gh_token ]; then
  GH_TOKEN="$(tr -d '\r\n' < .gh_token)"
  export GH_TOKEN
fi
if [ -z "$GH_TOKEN" ]; then
  echo "错误: 未找到 GH_TOKEN 环境变量，也没有 .gh_token 文件"
  exit 1
fi

# --- 定位 python ---
PY=""
for c in python python3 py; do
  if command -v "$c" > /dev/null 2>&1; then PY="$c"; break; fi
done
if [ -z "$PY" ]; then
  PY="C:/Users/zealo/.workbuddy/binaries/python/versions/3.13.12/python.exe"
fi

# --- 1. 静态校验 ---
echo "[1/5] 静态校验..."
"$PY" check_proto.py

# --- 2. 版本号与更新记录一致性 ---
VER="$(tr -d '\r\n' < VERSION)"
echo "[2/5] 当前版本: $VER"
if [ -z "$VER" ]; then
  echo "错误: VERSION 文件为空"
  exit 1
fi
if ! grep -q "## \[$VER\]" CHANGELOG.md; then
  echo "错误: CHANGELOG.md 中没有 ## [$VER] 条目，请先补更新记录"
  exit 1
fi

# --- 3. 提交 ---
echo "[3/5] 提交..."
git add -A
if git diff --cached --quiet; then
  echo "没有文件变更，跳过 commit"
else
  git commit -m "$MSG"
fi

# --- 4. 打标签 ---
echo "[4/5] 标签..."
TAG="v$VER"
if git rev-parse "$TAG" > /dev/null 2>&1; then
  echo "标签 $TAG 已存在，跳过（若需新标签请先改 VERSION 并在 CHANGELOG 补条目）"
else
  git tag -a "$TAG" -m "$TAG"
  echo "已创建标签 $TAG"
fi

# --- 5. 推送 ---
echo "[5/5] 推送..."
git push --follow-tags

echo "完成。仓库: https://github.com/zealotxp/xiangrenhe-app"
