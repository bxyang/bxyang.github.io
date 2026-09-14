<script setup lang="ts">
import { computed, ref } from 'vue'
import { data as works } from './works.data'
import { data as companies } from './companies.data'

const props = defineProps<{ company?: string }>()
const selected = ref('')
const query = ref('')
const companySlug = (url: string) => url.split('/').pop()?.replace(/\.html$/, '')
const companyName = (slug: string) => companies.find(c => companySlug(c.url) === slug)?.title || slug
const items = computed(() => works.filter(w => {
  const company = props.company || selected.value
  return (!company || w.company === company) &&
    `${w.title} ${w.description} ${w.kind} ${companyName(w.company)}`.toLowerCase().includes(query.value.trim().toLowerCase())
}))
</script>

<template>
  <div v-if="!company" class="work-filters">
    <label>公司
      <select v-model="selected">
        <option value="">全部公司</option>
        <option v-for="c in companies" :key="c.url" :value="companySlug(c.url)">{{ c.title }}</option>
      </select>
    </label>
    <label>关键词<input v-model="query" type="search" placeholder="名称、领域或工作类型" /></label>
  </div>
  <p class="work-count">共 {{ items.length }} 项，按公开时间从新到旧排列。未确认日期的工作列在末尾。</p>
  <ol class="work-timeline">
    <li v-for="work in items" :key="work.url">
      <div class="work-meta">{{ work.dateLabel }} · {{ work.kind }}<template v-if="!company"> · {{ companyName(work.company) }}</template></div>
      <a :href="work.url">{{ work.title }}</a>
      <p>{{ work.description }}</p>
    </li>
  </ol>
  <p v-if="!items.length">没有匹配的工作，请调整筛选条件。</p>
</template>
