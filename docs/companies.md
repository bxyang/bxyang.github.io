---
title: 公司研究
description: 训练数据与评测赛道上的公司与他们发表的工作——索引、论文链接与讨论
---

<script setup>
import { data as companies } from './.vitepress/theme/companies.data'

const GROUP_DESC = {
  '专家数据': '不再是「雇人打标签」，而是招募博士、医生、律师做评测、偏好排序、红队。跟 Evaluations 方向直接对口的一层。',
  '平台与工具': '卖软件和工作流，跟上一层的「交结果」是两种生意。',
  'RL 环境': '2026 年才起来的新战场。公开文本基本榨干，收益来自在真实任务上做强化学习——需要可交互的模拟世界，不是静态样本。'
}
const GROUP_ORDER = ['专家数据', '平台与工具', 'RL 环境', '其他']

const groups = []
for (const name of GROUP_ORDER) {
  const items = companies.filter((c) => c.category === name)
  if (items.length) groups.push({ name, items, desc: GROUP_DESC[name] || '' })
}
</script>

# 公司研究

一批专门给前沿实验室供训练数据和评测的公司。2025 年 6 月 Meta 用 143 亿美元拿了 Scale AI 49% 股份并把 Alexandr Wang 挖走，OpenAI / Google / xAI 几周内集体撤单——**中立性突然变成这个行业最重要的产品属性**。钱从 Scale 流向了下面这批公司。

::: warning 数字口径
页面上所有营收、估值都来自媒体报道或第三方估算（Sacra、Contrary、Inc. 等），**不是审计数字**。Surge AI 从不对外披露。另外 gross run-rate 和 net 差很多：Handshake 报 $1.1B gross，扣掉付给外包专家的钱只剩约 $450M。
:::

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
      <div class="company-card-more">查看发表的工作 →</div>
    </a>
  </div>
</div>

## 怎么读这些页面

每个公司页的结构是一样的：

1. **基本盘** — 成立时间、融资/估值、营收信号、商业模式
2. **发表的工作** — 论文、基准、技术报告的链接（arXiv / HuggingFace / GitHub / 官网博客）
3. **讨论与总结** — 我们一篇篇聊完之后的结论，现在还空着
4. **可以先想的问题** — 读之前值得带着的疑问

## 一条贯穿的线索

这三层不是平行的，它们在往同一个地方收敛：

```
标注数据  →  专家评测  →  RL 环境  →  （?）
```

标注生意的底层正在被合成数据吃掉，所以第一层的公司在往第三层挤（Surge、Mercor 都在做 RL 环境）；而第三层需要人来定义「什么算做好了」，又把评测能力拉回中心。这跟 **Evidence Centred Design** 是同一个问题：你怎么证明模型在这件事上真的行。
