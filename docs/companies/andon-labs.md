---
title: Andon Labs
category: RL 环境
founded: '2024'
site: https://andonlabs.com
order: 6
summary: '把 agent 真的放进现实世界跑生意：自动贩卖机、咖啡馆、电台、无人机——用真实后果测长程一致性。'
---

[← 返回公司研究](/companies)

# Andon Labs

> 把 agent 真的放进现实世界跑生意：自动贩卖机、咖啡馆、电台、无人机——用真实后果测长程一致性。

## 基本盘

| | |
|---|---|
| **成立** | Andon Labs，创始人 Axel Backlund、Lukas Petersson |
| **主张** | human-in-the-loop 的安全是幻觉；要为「自治组织」做准备，因此一边做基准一边做真实部署 |
| **做法** | 每个基准都配一个真实世界的对应实验：Vending-Bench ↔ 在 Anthropic 办公室放自动贩卖机；Andon FM ↔ 让四个模型各开一家电台；Andon Market ↔ 在旧金山签三年租约开咖啡馆、在斯德哥尔摩再开一家 |
| **官网** | <https://andonlabs.com> |

## 发表的工作

### Vending-Bench: A Benchmark for Long-Term Coherence of Autonomous Agents

让 agent 经营一台模拟自动售货机：订货、库存、定价、日常费用。每个子任务都极简单，但拉长到 2000 万+ token 的 horizon 上就会崩。关键发现：失败与上下文窗口填满没有相关性——不是记忆问题，是长程一致性问题。失败模式极具观赏性：Claude 3.5 Sonnet 误读送货延迟后去查 CEO 联系方式、给 FBI 发「网络金融犯罪」邮件、最后宣布这门生意「形而上学上不可能」；o3-mini 忘了怎么正确调用工具，用 1300 条消息把工具名当纯文本打出来。此外把「资本获取」当作 dual-use 能力来测。

- [arXiv:2502.15840](https://arxiv.org/abs/2502.15840)
- [Eval 页](https://andonlabs.com/evals/vending-bench)
- [multiagent-inspect](https://github.com/AndonLabs/multiagent-inspect)

### Vending-Bench 2 / Arena

模拟一年的贩卖机生意，加入对抗性供应商、谈判、客户投诉；Arena 模式让模型互相竞争。

- [Andon Labs](https://andonlabs.com)

### Butter-Bench（2025.10）

测 LLM 控制机器人做家务递送任务（传递黄油）。SOTA 模型最好 40%，人类 95%。

- [Andon Labs](https://andonlabs.com)

### Blueprint-Bench（2025.10）

把公寓照片转成准确的 2D 平面图，测空间智能。多数模型表现等于或低于随机基线，人类显著优出。

- [Andon Labs](https://andonlabs.com)

### Drone-Bench（2026.7）

测模型为低成本无人机写监控代码的能力。

- [Andon Labs](https://andonlabs.com)

### Andon FM（2026.5）

让四个 AI 各开一家电台，同样起始提示：建立人设并实现盈利。五个月后分化程度超出预期。

- [Andon Labs](https://andonlabs.com)

::: tip 备注
这家的方法论最特别：每个基准都有真实世界的对应部署，用真实后果（租约、库存、客户）来验证模拟环境的结论是否成立。
:::

## 讨论与总结

_还没写。我们一篇一篇聊，聊完把结论填到这里。_

## 可以先想的问题

- 「失败与上下文填满无关」这个发现，如果成立，对长上下文研究方向意味着什么？
- 用真实世界部署来校验模拟环境——这是 RL 环境这个品类的正确验证方式吗？
- 把「资本获取」作为 dual-use 能力来评测，这个 framing 值得单独讨论。
