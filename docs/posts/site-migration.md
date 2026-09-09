---
title: 站点改版：从 Jekyll 到 VitePress
date: '2026-09-09'
tags: [折腾, 工具]
description: 把个人站点从 Jekyll 迁到 VitePress 的过程记录，以及一个让 Pages 构建静默失败五年的编码坑。
---

# 站点改版：从 Jekyll 到 VitePress

原来这个站是 Jekyll 的，2016 年搭的，后来就没怎么动过。这次一并换成 VitePress。

## 一个坑：GBK 编码

一直以为站点是正常的，直到这次改版发现推上去的内容**根本没生效**。查下来是：

- GitHub Pages 的构建任务 `pages build and deployment` 里，**Build with Jekyll** 步骤失败
- 但 Pages 不会报错给你看，它会**继续服务上一次成功的构建**
- 我这个站的 `last-modified` 停在 **2020 年 7 月**，也就是四年多没成功构建过

根因是仓库里有两个 `.md` 文件是 GBK 编码的。Jekyll 遇到非 UTF-8 字节会直接抛
`invalid byte sequence in UTF-8` 并中断整个构建。

排查方法很简单：

```bash
# 1. 看线上页面到底是哪年构建的
curl -I https://你的站点 | grep -i last-modified

# 2. 看构建任务是不是失败
#    https://github.com/用户名/仓库/actions
```

教训：**仓库里所有 `.md` 都必须是 UTF-8**，而且 Pages 构建失败是静默的，只能自己查。

## 为什么换 VitePress

| | Jekyll | VitePress |
|---|---|---|
| 本地预览 | 要装 Ruby | `npm run docs:dev` |
| 构建 | GitHub 托管，不可控 | 本地/Actions，看得见 |
| 搜索 | 要装插件 | 内置本地搜索 |
| 公式 | 手写 MathJax 配置 | `markdown: { math: true }` |

最关键的是第二行：构建过程在自己手里，失败了能立刻看到日志，不用猜。

## 新的写作流程

在 `docs/posts/` 下新建一个 `.md`，写上 front matter：

```yaml
---
title: 文章标题
date: '2026-09-09'
tags: [标签1, 标签2]
description: 一句话摘要，会显示在文章列表里
---
```

然后 `git push`，GitHub Actions 自动构建发布。首页、文章列表、标签页都是自动生成的，
不需要手动维护索引。

## 顺手记一个公式测试

Simpson 悖论的标准形式，这是因果推断里最经典的例子：

$$
\frac{a}{b} < \frac{c}{d},\quad \frac{a'}{b'} < \frac{c'}{d'},\quad \frac{a+a'}{b+b'} > \frac{c+c'}{d+d'}
$$

分组看都是正相关的，合并之后却反转了。
