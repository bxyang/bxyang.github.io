---
layout: home

hero:
  name: bxyang
  text: 路漫漫其修远兮，吾将上下而求索
  tagline: AI Evaluations · Evidence Centred Design · Post-training
  image:
    src: https://avatars.githubusercontent.com/u/4447765?v=4
    alt: bxyang
  actions:
    - theme: brand
      text: 全部文章
      link: /posts
    - theme: alt
      text: 公司研究
      link: /companies
    - theme: alt
      text: Agent Eval 周报
      link: /agent-eval

features:
  - title: Agent Eval 周报
    details: 工业界关于 Agent 评测的技术博客、访谈和工程方案，按周整理。
    link: /agent-eval
    linkText: 查看每周资料
  - title: 论文精读
    details: 记录论文的阅读、分析与思考，分享对研究问题和方法的理解。
    link: /paper-reading
    linkText: 查看精读分享
  - title: 公司研究
    details: 大模型数据公司的发展、创始人背景，以及论文、基准与产品时间线。
  - title: 公式与代码
    details: Markdown + LaTeX，数学推导和代码块高亮都能正常渲染。
  - title: 全站搜索
    details: 左上角搜索框，本地索引，离线可用。
---

<script setup>
import { data as posts } from './.vitepress/theme/posts.data'
</script>

## Agent Eval 周报

跟踪工业界如何评估大模型 Agent，收集技术博客、访谈与工程方案，按发布周归档，最新在前。

[浏览周报与资料索引 →](/agent-eval)

## 论文精读

记录对论文的深入阅读与分享。

第一篇：[RIFT: A RubrIc Failure Mode Taxonomy and Automated Diagnostics](/paper-reading/rift) · 已更新至第 2 节：研究背景

[浏览论文精读 →](/paper-reading)

## 最新文章

<div class="post-list">
  <a v-for="p in posts.slice(0, 5)" :key="p.url" class="post-item" :href="p.url">
    <div class="post-date">{{ p.date }}</div>
    <div>
      <div class="post-title">{{ p.title }}</div>
      <div class="post-desc">{{ p.description }}</div>
      <div class="post-tags"><span v-for="t in p.tags" :key="t">{{ t }}</span></div>
    </div>
  </a>
</div>

<p v-if="posts.length > 5" style="margin-top:16px"><a href="/posts">查看全部 {{ posts.length }} 篇 →</a></p>
<p v-if="posts.length === 0" style="color:var(--vp-c-text-3)">还没有文章。在 <code>docs/posts/</code> 下新建一个 Markdown 文件即可。</p>
