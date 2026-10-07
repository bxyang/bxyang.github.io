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
  - title: Benchmark 精读
    details: 深入讨论经典 benchmark 的任务、数据与评分设计，理解评测结果的含义。
    link: /benchmark-reading
    linkText: 查看 Benchmark 精读
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

第一篇：[RIFT: A RubrIc Failure Mode Taxonomy and Automated Diagnostics](/paper-reading/rift) · 已更新至第 6 节：诊断、人工复核、修改与验证

[浏览论文精读 →](/paper-reading)

## Benchmark 精读

从具体任务出发，讨论经典 benchmark 如何构造数据、设置评估环境与评分规则，以及分数能够说明什么。

第一篇：[GDPval 精读：真实职业任务的设计、评估与结果解读](/benchmark-reading/gdpval) · 已更新至 3.2：任务专家的招募与背景

[浏览 Benchmark 精读 →](/benchmark-reading)

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
