---
title: "INTELLECT-2：分布式强化学习"
company: "prime-intellect"
date: "2025-04-15"
dateLabel: "2025-04-15"
kind: "模型与训练框架"
description: "让分散节点生成推理轨迹，再用异步强化学习更新 320 亿参数模型。"
reviewed: "2026-09-09"
---

[← Prime Intellect](/companies/prime-intellect) · [全部工作](/research)

# INTELLECT-2：分布式强化学习

让分散节点生成推理轨迹，再用异步强化学习更新 320 亿参数模型。

| 项目 | 信息 |
| --- | --- |
| 时间 | 2025-04-15 |
| 类型 | 模型与训练框架 |
| 公司参与 | Prime Intellect 发布并组织训练 |

## 工作内容

以 QwQ-32B 为基础，推理节点收集数学和代码任务的回答与奖励，训练节点运行 GRPO 并广播新权重。TOPLOC 校验推理计算，异步设计允许不同算力节点按各自速度工作。

## 数据与使用范围

4 月 15 日启动训练，5 月 11 日公布模型结果。公开 Prime-RL 框架及模型相关资源；分布式轨迹采集与训练节点的分工需区分。

## 参考资料

- [INTELLECT-2：分布式强化学习：原始资料](https://www.primeintellect.ai/blog/intellect-2)
- [发布记录](https://www.primeintellect.ai/blog)

资料核对截至 2026 年 9 月 9 日。实验结果对应所引资料的模型版本和评测设置。
