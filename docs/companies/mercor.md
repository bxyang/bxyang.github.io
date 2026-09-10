---
title: Mercor
category: 专家数据
founded: '2023'
site: https://mercor.com
order: 2
summary: '专家撮合市场起家，现在是这批公司里发表基准最多的一家（APEX 系列），正在从「卖专家工时」转向「卖评测」。'
---

[← 返回公司索引](/companies)

# Mercor

> 专家撮合市场起家，现在是这批公司里发表基准最多的一家（APEX 系列），正在从「卖专家工时」转向「卖评测」。

## 基本盘

| | |
|---|---|
| **成立** | 2023，最初是 AI 招聘平台；2025 年 Scale/Meta 交易后转向专家数据 |
| **最新估值** | $10B（2025.10 Series C $350M，Felicis 领投）；2026.7 传新一轮 $500M @ $20B |
| **营收信号** | 2026 年中 gross annualized 约 $2B（gross 与 net 差别大，注意口径） |
| **专家网络** | 3 万+ 持证专家（医生、律师、博士），付给专家均价约 $85/小时，部分专家到 $200 |
| **商业模式** | 抽成约 35%（接近 BPO 公司中位数）；专家是合同工不是员工，固定成本极低 |
| **延伸** | 已扩展到 RL 环境（编程、医疗、法律） |
| **官网** | <https://mercor.com> |

## 发表的工作

### APEX-v1.0 / v1-extended — AI Productivity Index

投行分析师、管理咨询、大所律师、全科医生四类知识工作，由有顶级履历的专家出题并写 rubric。v1-extended 把每类 held-out 从 50 题扩到 100 题（共 400），并更新了评分方法。GPT-5（Thinking=High）67.0% 居首。开源每类 25 条非榜单样例（共 100）+ eval harness。作者阵容很有意思：除 Mercor 团队外还有 Cass Sunstein、Eric Topol。

- [arXiv:2509.25721](https://arxiv.org/abs/2509.25721)
- [Leaderboard](https://mercor.com/apex)

### APEX-SWE — 软件工程生产力指数

两类任务：Integration（跨云服务、业务系统、IaC 搭端到端系统）和 Observability（用日志/仪表盘等遥测信号排查生产故障），各 100 题。论点很直接：IDC 数据显示开发者只有 16% 时间在写应用代码，而 SWE-bench Verified 只测单仓库修 bug 且已饱和（前沿模型 ~80% Pass@1，OpenAI 称已被污染）。评了 11 个前沿模型，Claude Opus 4.6 以 40.5% Pass@1 居首，Opus 4.5 38.7% 次之。核心发现：表现主要由**认知纪律（epistemic discipline）**驱动——能否区分假设与已验证事实，并配合行动前的系统验证。开源 eval harness 与 50 题 dev set。

- [arXiv:2601.08806](https://arxiv.org/abs/2601.08806)
- [HuggingFace](https://huggingface.co/datasets/mercor/APEX-SWE)
- [GitHub](https://github.com/Mercor-Intelligence/apex-swe)

### APEX-Accounting — 会计

与 Ramp 合作。160 题，分布在 10 个「world」，每个 world 含一套会计系统 + 表格 + PDF。由会计/记账专家出题、作答并写 rubric。9 个前沿模型中 Claude-Fable-5 (Max) 以 56.4% Mean Criteria@3 居首（次位 Muse-Spark-1.1 (xHigh) 52.6%）；**Pass^8（8 次全过）最高只有 2.6%，Pass@8 最高 21.5%**。最值得注意的是一个 Simpson 悖论：把 token 预算从 1 提到 50，整体分数上升；但在预算受限的 harness 内，模型花 token 越多的题目分数反而越低。closed benchmark，跑榜需申请。

- [arXiv:2607.27189](https://arxiv.org/abs/2607.27189)
- [HuggingFace dev set](https://huggingface.co/datasets/mercor/apex-accounting)

::: tip 备注
关键人物：Bertie Vidgen 是这一系列的主通讯作者，他同时也是 Patronus AI 的 FinanceBench（arXiv:2311.11944）作者之一——从「企业评测平台」到「专家数据市场做基准」这条路径本身就是一条线索。
:::

## 讨论与总结

_还没写。我们一篇一篇聊，聊完把结论填到这里。_

## 可以先想的问题

- APEX 的 rubric + LM judge 方法论：rubric 由出题专家写，judge 却是通用模型——这个环节的可信度边界在哪？
- APEX-Accounting 里那个 Simpson 悖论说明了什么？是 harness 设计的伪影，还是模型能力的真实特征？
- 「经济价值」被操作化为「专家愿花 1–8 小时做的任务」——这个代理变量够好吗？
- 一家卖专家工时的公司为什么要大力做公开基准？是在卖评测，还是在为标准定价？
