---
title: Patronus AI
category: RL 环境
founded: '2023'
site: https://patronus.ai
order: 4
summary: '企业自动化评测与安全平台起家，用 FinanceBench 打出名气，现在做压力测试 agent 的「数字世界」。'
---

[← 返回公司索引](/companies)

# Patronus AI

> 企业自动化评测与安全平台起家，用 FinanceBench 打出名气，现在做压力测试 agent 的「数字世界」。

## 基本盘

| | |
|---|---|
| **成立** | 2023，两位前 Meta 研究员创办 |
| **融资** | 2026.6 Series B $50M（Greenfield Partners 领投），累计 $70M；据报道一年内营收增长约 15 倍 |
| **定位** | 企业 LLM 评测与幻觉检测；现扩展到「数字世界」环境：复刻真实网站与内部系统来压力测试 agent |
| **官网** | <https://patronus.ai> |

## 发表的工作

### FinanceBench: A New Benchmark for Financial Question Answering

10,231 道关于上市公司的开卷金融问答，附答案与证据串，来源包括 SEC 10-K/10-Q/8-K、财报、电话会纪要。测试 16 种模型配置（GPT-4-Turbo、Llama 2、Claude 2，分别配向量库与长上下文），人工复核 150 题的 2400 个回答。核心结论：GPT-4-Turbo 配检索系统有 81% 答错或拒答；长上下文能改善但延迟不可接受。开源 150 题样本。

- [arXiv:2311.11944](https://arxiv.org/abs/2311.11944)
- [HuggingFace](https://huggingface.co/datasets/PatronusAI/financebench)
- [GitHub](https://github.com/patronus-ai/financebench)

::: tip 备注
作者列表里有 Bertie Vidgen——他现在是 Mercor APEX 系列的主通讯作者。从 FinanceBench（企业 RAG 评测）到 APEX（专家经济价值），可以看到一条清晰的评测方法论脉络。
:::

## 讨论与总结

_还没写。我们一篇一篇聊，聊完把结论填到这里。_

## 可以先想的问题

- 「81% 答错或拒答」这个数字里，有多少是检索的问题、多少是模型的问题？这种归因方式站得住吗？
- 长上下文「能改善但不实用」——这个权衡今天还成立吗？
- 从「评测平台」到「数字世界环境」，中间的逻辑是什么？
