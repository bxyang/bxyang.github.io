---
title: Prime Intellect
category: RL 环境
founded: '2023'
site: https://primeintellect.ai
order: 1
summary: '开源「自主训练栈」：算力 + RL 环境 + 评测 + 部署，主张企业自己训模型而不依赖前沿实验室。'
---

[← 返回公司研究](/companies)

# Prime Intellect

> 开源「自主训练栈」：算力 + RL 环境 + 评测 + 部署，主张企业自己训模型而不依赖前沿实验室。

## 基本盘

| | |
|---|---|
| **成立** | 2023，SF，CEO Vincent Weisser |
| **融资** | 2026.7 Series A $130M @ $1B（Radical Ventures 领投，NVIDIA Ventures / Intel Capital / Dell Technologies Capital / Iconiq 参投） |
| **营收信号** | $100M+ annualized，6000+ 客户，团队约 32 人 |
| **产品** | Compute Exchange（GPU 市场）+ PRIME-RL 框架 + Verifiers 库 + Environments Hub（2500+ 社区环境）+ Sandboxes + 托管评测 + 推理 |
| **官网** | <https://primeintellect.ai> |

## 发表的工作

### INTELLECT-1 Technical Report

100 亿参数，1 万亿 token，用最多 14 个并发节点跨 3 大洲、30 个独立算力提供方动态加入退出训练，维持 83–96% 算力利用率、36.2–41.4% MFU。框架 PRIME 的关键创新：ElasticDeviceMesh（跨互联网的容错通信 + 节点内通信）、live checkpoint recovery、混合 DiLoCo-FSDP2，配合自研 int8 all-reduce，通信带宽比传统数据并行降低 400 倍。

- [arXiv:2412.01152](https://arxiv.org/abs/2412.01152)

### INTELLECT-2

320 亿参数推理模型，从 QwQ-32B 出发，在无许可的分布式算力 swarm 上做异步 RL。Apache 2.0，权重、代码、训练日志全开源。公司自己强调主要贡献是方法论（证明 RL 可以在分布式基础设施上做），而不是能力上的跃升。

- [Blog](https://www.primeintellect.ai/blog/intellect-2)

### INTELLECT-3

1060 亿参数 MoE（每次前向激活约 120 亿），从 GLM-4.5-Air-Base 出发 SFT + 大规模 RL。这次是在 512 张 H200 的单一集群上做的，分布式贡献主要来自众包的 RL 环境。报告 MATH-500 98.1%、AIME 2024 90.8%、GPQA Diamond 74.4%、LiveCodeBench v6 69.3%。

- [Blog](https://www.primeintellect.ai/blog/intellect-3)

### Verifiers / Environments Hub

把任意任务变成 RL 环境的开源库与社区 Hub（2500+ 环境），一条 CLI 循环：init → develop → eval → push。这是它和老牌标注公司正面相接的地方。

- [primeintellect.ai](https://www.primeintellect.ai)

::: tip 备注
Ramp 用它训了一个 350 亿参数模型，在表格搜索上超过 Claude Opus，速度快 27%、成本更低——这是「不为等更好的前沿模型，自己训一个特定工作流的模型」这个论点的主打案例。
:::

## 讨论与总结

_还没写。我们一篇一篇聊，聊完把结论填到这里。_

## 可以先想的问题

- 400 倍通信压缩（DiLoCo + int8 all-reduce）具体是怎么做到的？对 RL 后训练的算力组织意味着什么？
- 「企业自己训模型」这个叙事，在什么条件下真的成立？Ramp 的案例可复制到什么程度？
- 把评测（Environments Hub）和训练绑在同一个栈里——这是评测作为产品的终点形态吗？
