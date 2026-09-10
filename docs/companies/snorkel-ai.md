---
title: Snorkel AI
category: 平台与工具
founded: '2019'
site: https://snorkel.ai
order: 3
summary: '斯坦福系，程序化标注（弱监督）的学术源头，正在从「用代码生成标签」转向专家数据服务。'
---

[← 返回公司索引](/companies)

# Snorkel AI

> 斯坦福系，程序化标注（弱监督）的学术源头，正在从「用代码生成标签」转向专家数据服务。

## 基本盘

| | |
|---|---|
| **成立** | 2019，源自 Stanford 的 Snorkel / data programming 研究 |
| **最新估值** | $1.3B（2025.5 Series D $100M） |
| **定位** | 用标注函数（labeling function）弱监督批量生成标签，减少人工；现扩展到 expert data-as-a-service |
| **研究产出** | 官网 research 区持续更新，2022 年一次性上线 18 篇（弱监督扩展到排序/图/流形、基础模型与弱监督融合、PWS 综述、AutoWS-Bench-101 等） |
| **官网** | <https://snorkel.ai> |

## 发表的工作

### Snorkel: Rapid Training Data Creation with Weak Supervision

VLDB 2018（PVLDB 11(3):269–282）。核心：用户不手工标注，而是写表达任意启发式的标注函数（准确度与相关性可未知），Snorkel 在无 ground truth 的情况下对这些输出去噪——这是 data programming 范式的第一个端到端实现。用户研究中，领域专家建模速度快 2.8 倍、预测性能平均提升 45.5%。

- [arXiv:1711.10160](https://arxiv.org/abs/1711.10160)
- [DOI](https://doi.org/10.14778/3157794.3157797)

### 弱监督方向的后续工作（部分）

A Survey on Programmatic Weak Supervision（PWS 综述）；Lifting Weak Supervision to Structured Prediction（把弱监督从分类扩展到排序、图、流形，并给出同类泛化保证）；AutoWS-Bench-101（用 100 个标签的自动化弱监督基准）；Generative Modeling Helps Weak Supervision（弱监督与生成模型互相增强）；Nemo（交互式数据编程）。

- [Snorkel Research](https://snorkel.ai/research/)

::: tip 备注
data programming 的源头文献值得精读：它提出的「用带噪声的多个弱信号去噪出标签」这个思路，和后训练里用多个 judge 打分取共识，在结构上非常相似。
:::

## 讨论与总结

_还没写。我们一篇一篇聊，聊完把结论填到这里。_

## 可以先想的问题

- 弱监督的去噪模型（在无 ground truth 下估计标注函数的准确度与相关性）能否直接迁移到 LLM-as-judge 的校准上？
- AutoWS-Bench-101 这类「自动弱监督基准」的结论，对今天的合成数据实践还有指导力吗？
- 一家以程序化标注（省人力）起家的公司，为什么转向专家人力服务？
