---
title: 标签
---

<script setup>
import { data as posts } from './.vitepress/theme/posts.data'

const tags = [...new Set(posts.flatMap((p) => p.tags))].sort()
</script>

# 标签

<div class="tag-cloud">
  <a v-for="t in tags" :key="t" :href="'#' + t">{{ t }}</a>
</div>

<div v-for="t in tags" :key="t">
  <h2 :id="t" style="margin-top:32px">{{ t }}</h2>
  <div class="post-list">
    <a v-for="p in posts.filter((x) => x.tags.includes(t))" :key="p.url" class="post-item" :href="p.url">
      <div class="post-date">{{ p.date }}</div>
      <div>
        <div class="post-title">{{ p.title }}</div>
        <div class="post-desc">{{ p.description }}</div>
      </div>
    </a>
  </div>
</div>
