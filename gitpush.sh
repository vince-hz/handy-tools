#!/bin/bash

# 一键 git add && git commit && git push 脚本
# 使用方法: ./gitpush.sh "提交信息"

# 设置颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查是否有提交信息
if [ -z "$1" ]; then
    echo -e "${YELLOW}请提供提交信息${NC}"
    echo "使用方法: ./gitpush.sh \"你的提交信息\""
    echo "示例: ./gitpush.sh \"修复页面移位问题\""
    exit 1
fi

COMMIT_MSG="$1"

echo -e "${GREEN}开始 Git 提交流程...${NC}"

# 检查是否在 git 仓库中
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}错误: 当前目录不是 Git 仓库${NC}"
    exit 1
fi

# 检查当前分支状态
echo -e "${YELLOW}检查当前状态...${NC}"
git status

# 添加所有更改
echo -e "${YELLOW}添加所有文件...${NC}"
git add .

# 检查是否有要提交的更改
if git diff --cached --quiet; then
    echo -e "${YELLOW}没有需要提交的更改${NC}"
    exit 0
fi

# 显示将要提交的更改
echo -e "${YELLOW}将要提交的更改:${NC}"
git diff --cached --stat

# 确认提交
echo -e "${YELLOW}提交信息: $COMMIT_MSG${NC}"
read -p "确认提交? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}取消提交${NC}"
    exit 1
fi

# 提交更改
echo -e "${YELLOW}提交更改...${NC}"
git commit -m "$COMMIT_MSG"

if [ $? -ne 0 ]; then
    echo -e "${RED}提交失败${NC}"
    exit 1
fi

# 推送到远程仓库
echo -e "${YELLOW}推送到远程仓库...${NC}"
git push

if [ $? -ne 0 ]; then
    echo -e "${RED}推送失败${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 成功完成 add, commit, push!${NC}"