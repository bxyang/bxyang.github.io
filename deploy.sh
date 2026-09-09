#!/usr/bin/env bash
# 一键部署 bxyang.github.io
# 用法：bash deploy.sh   （或先 chmod +x deploy.sh 然后 ./deploy.sh）
set -euo pipefail

# 走 SSH，需先在 GitHub 配置好本机公钥（https 方式见 README）
REPO="git@github.com:bxyang/bxyang.github.io.git"
BRANCH="master"
WORKSPACE="/Users/ridgway/WorkBuddy/personal_site"
TMP="$(mktemp -d)"
SITE="$TMP/site"

echo ">> 克隆远程仓库（浅克隆，分支: $BRANCH）…"
git clone --depth 1 --branch "$BRANCH" "$REPO" "$SITE"

echo ">> 同步本地文件到临时仓库…"
# --delete 让仓库里多出来的、workspace 里没有的文件被删除
# 排除 .git 与 deploy.sh 本身
rsync -a --delete \
  --exclude='.git' \
  --exclude='.DS_Store' \
  --exclude='.workbuddy' \
  --exclude='node_modules' \
  --exclude='.npm-cache' \
  --exclude='docs/.vitepress/dist' \
  --exclude='docs/.vitepress/cache' \
  "$WORKSPACE/" "$SITE/"

cd "$SITE"

echo ">> 变更文件："
git status --short

if [ -z "$(git status --short)" ]; then
  echo ">> 没有改动，无需提交。"
  exit 0
fi

read -rp ">> 确认推送到 $BRANCH？[y/N] " ans
case "$ans" in
  y|Y|yes|YES) ;;
  *) echo ">> 已取消。"; exit 1 ;;
esac

git add -A
git -c user.name="bxyang" -c user.email="yangbaoxing@gmail.com" \
    commit -m "更新个人主页 $(date +%Y-%m-%d)"

echo ">> 推送到 $BRANCH…"
git push origin "$BRANCH"

echo ">> 完成。等待 1-3 分钟后访问 https://bxyang.github.io"