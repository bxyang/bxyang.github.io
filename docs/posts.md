---
title: 全部文章
---

<script setup>
import { data as posts } from './.vitepress/theme/posts.data'

const groups = []
for (const p of posts) {
  const y = p.date.slice(0, 4)
  let g = groups.find((x) => x.year === y)
  if (!g) {
    g = { year: y, items: [] }
    groups.push(g)
  }
  g.items.push(p)
}
</script>

# 全部文章

<div v-for="g in groups" :key="g.year">
  <div class="post-year">{{ g.year }}</div>
  <div class="post-list">
    <a v-for="p in g.items" :key="p.url" class="post-item" :href="p.url">
      <div class="post-date">{{ p.date.slice(5) }}</div>
      <div>
        <div class="post-title">{{ p.title }}</div>
        <div class="post-desc">{{ p.description }}</div>
        <div class="post-tags"><span v-for="t in p.tags" :key="t">{{ t }}</span></div>
      </div>
    </a>
  </div>
</div>

<p v-if="posts.length === 0" style="color:var(--vp-c-text-3)">还没有文章。</p>
