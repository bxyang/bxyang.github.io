---
layout: home

hero:
  name: 杨宝兴
  text: 读书笔记与技术整理
  tagline: 大规模机器学习 · 推荐与定价 · 分布式系统
  image:
    src: https://avatars.githubusercontent.com/u/4447765?v=4
    alt: 杨宝兴
  actions:
    - theme: brand
      text: 全部文章
      link: /posts
    - theme: alt
      text: 关于我
      link: /about

features:
  - title: 笔记为主
    details: 论文阅读、技术整理、踩坑记录。写给自己看，也欢迎别人看。
  - title: 支持公式
    details: Markdown + LaTeX，数学推导和代码高亮都能正常渲染。
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
