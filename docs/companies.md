---
title: 公司研究
description: 大模型数据公司的发展、创始人、论文、基准与产品时间线
---

<script setup>
import { data as companies } from './.vitepress/theme/companies.data'

const GROUP_DESC = {
  '专家数据': '组织专业人才制作训练数据、评审模型输出，并设计行业任务。',
  '平台与工具': '提供数据管理、标注、质量分析、训练与评测软件。',
  'RL 环境': '构建可交互的任务环境、验证器和训练基础设施，也包括长期 agent 评测。'
}
const GROUP_ORDER = ['专家数据', '平台与工具', 'RL 环境', '其他']

const groups = []
for (const name of GROUP_ORDER) {
  const items = companies.filter((c) => c.category === name)
  if (items.length) groups.push({ name, items, desc: GROUP_DESC[name] || '' })
}
</script>

# 公司研究

这里整理 16 家在美国开展业务、与大模型训练数据及评测相关的公司。公司页介绍创始人、发展过程和现有业务；时间线连接每项论文、基准、模型、工具或产品的独立说明。

[浏览全部工作与时间线](/research)

分类用于导航，同一家公司可能同时经营多类业务。部分公司起源于美国以外，部分由招聘或传统数据平台转入大模型业务；具体经历在公司页说明。

<div v-for="g in groups" :key="g.name" class="company-group">
  <h2 class="company-group-title">{{ g.name }} <span class="company-group-count">{{ g.items.length }}</span></h2>
  <p class="company-group-desc">{{ g.desc }}</p>
  <div class="company-grid">
    <a v-for="c in g.items" :key="c.url" class="company-card" :href="c.url">
      <div class="company-card-head">
        <span class="company-card-name">{{ c.title }}</span>
        <span v-if="c.founded" class="company-card-year">{{ c.founded }}</span>
      </div>
      <div class="company-card-summary">{{ c.summary }}</div>
      <div class="company-card-more">公司介绍与工作时间线 →</div>
    </a>
  </div>
</div>

## 资料范围

优先采用论文原文、官方产品文档、项目仓库和创始人访谈。工作页注明公司参与方式，并区分公开样本、完整评测集与商业数据。创始人在公司成立前的研究单独标注；无法确认的发布日期保留为空。

资料核对截至 2026 年 9 月 9 日。时间线收录已核实的公开工作，非公开客户项目及无法确认归属的成果不计入；完整性与尚待核实的目录见[收录说明](/research#收录说明)。
