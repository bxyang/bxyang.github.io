# bxyang 的个人站点

> 路漫漫其修远兮，吾将上下而求索

VitePress + GitHub Pages。源文件是 `docs/` 下的 Markdown，push 到 `master` 后由 GitHub Actions 自动构建发布。

## 目录结构

```
docs/
  .vitepress/
    config.mts          站点配置（导航、搜索、中文文案）
    theme/
      index.ts          主题入口
      style.css         自定义样式（文章列表、标签、字体）
      posts.data.ts     文章数据加载器（自动汇总 posts/*.md）
  index.md              首页：hero + 最新文章
  posts.md              全部文章（按年份分组）
  tags.md               标签聚合页
  about.md              关于
  posts/*.md            文章，一篇一个文件
  public/archive/       2018–2019 旧笔记，原样保留可下载
.github/workflows/
  deploy.yml            Actions 构建与部署
```

## 本地预览

```bash
npm install          # 首次
npm run docs:dev     # 开发模式，热更新 http://localhost:5173
npm run docs:build   # 构建到 docs/.vitepress/dist
npm run docs:preview # 预览构建结果 http://localhost:4173
```

沙箱环境里 npm/node 被文件代理拦截，需要绕开：

```bash
env -u NODE_OPTIONS npm run docs:build
```

## 写一篇新文章

在 `docs/posts/` 下新建 `.md`，文件名用英文短横线，例如 `posts/rl-notes.md`：

```markdown
---
title: 文章标题
date: '2026-09-09'
tags: [标签1, 标签2]
description: 一句话摘要，会显示在文章列表里
---

正文。支持 LaTeX 公式、代码块高亮。
```

然后 `git push` 即可。首页、文章列表、标签页都是自动生成的，不用手改索引。

`date` 建议加引号，否则 YAML 会解析成日期对象。

## 发布

**必须**在 GitHub 网页上把构建源设成 Actions，否则站点会出错：
仓库 **Settings → Pages → Source → GitHub Actions**（不是 "Deploy from a branch"）。

如果 Source 还是「从分支部署」，GitHub 会额外跑一个叫 `pages build and deployment` 的
Jekyll 构建，和本仓库的 Actions 工作流**抢着发布同一个站点**——两个都会成功，谁最后跑完
谁生效，站点内容会来回跳，而且 Jekyll 那一版会把 `README.md` 当首页渲染，`/posts`、
`/tags`、`/about` 全是 404。

判定方法：看线上页面源码里的 `<meta name="generator">`。是 `VitePress` 就对了，
是 `Jekyll` 说明构建源没改对。

设置改好后，每次 push 到 `master`，Actions 自动构建并发布到 https://bxyang.github.io 。

注意：本仓库的 `.md` 必须是 UTF-8 编码。历史上有两个 GBK 编码的简历文件导致 Jekyll
构建静默失败过（Pages 会继续服务上一次成功的构建，不报错），排查时看响应头
`last-modified` 和 Actions 运行记录。

## 注意

`bxy_jc.jpeg` 是私人照片，不在站点中引用。
