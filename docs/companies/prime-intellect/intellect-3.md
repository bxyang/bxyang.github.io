---
title: "INTELLECT-3：大规模 MoE 后训练"
company: "prime-intellect"
date: "2025-11-26"
dateLabel: "2025-11-26"
kind: "模型与论文"
description: "以混合专家模型开展大规模强化学习，并公开模型及训练资源。"
reviewed: "2026-09-09"
---

[← Prime Intellect](/companies/prime-intellect) · [全部工作](/research)

# INTELLECT-3：大规模 MoE 后训练

以混合专家模型开展大规模强化学习，并公开模型及训练资源。

| 项目 | 信息 |
| --- | --- |
| 时间 | 2025-11-26 |
| 类型 | 模型与论文 |
| 公司参与 | Prime Intellect 发布 |

## 工作内容

基于 GLM-4.5-Air 进行后训练，模型约 1,060 亿总参数、120 亿激活参数。与早期互联网分布式实验不同，这次主要训练使用 512 张 H200 的集群，研究大规模 agent 和推理训练。

## 数据与使用范围

模型于 11 月公布，技术报告于 12 月提交。模型权重、训练框架和环境资源的开放范围分别以发布说明为准，不把 MoE 总参数当成每次推理全部激活的参数。

## 参考资料

- [INTELLECT-3：大规模 MoE 后训练：原始资料](https://arxiv.org/abs/2512.16144)
- [公司发布记录](https://www.primeintellect.ai/blog)

资料核对截至 2026 年 9 月 9 日。实验结果对应所引资料的模型版本和评测设置。
