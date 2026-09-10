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

features:
  - title: 论文笔记
    details: 读一篇记一篇，重点是能回头用的推导和结论，不是摘要。
  - title: 公司研究
    details: 训练数据 / 评测这个赛道的公司与他们发表的工作，逐篇梳理并附讨论。
  - title: 公式与代码
    details: Markdown + LaTeX，数学推导和代码块高亮都能正常渲染。
  - title: 全站搜索
    details: 左上角搜索框，本地索引，离线可用。
---

<script setup>
import { data as posts } from './.vitepress/theme/posts.data'
</script>

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
