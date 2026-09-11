---
title: "Rubrics as Rewards：细项标准作为 RL 奖励"
company: "scale-ai"
date: "2025-07-23"
dateLabel: "2025-07-23"
kind: "论文"
description: "将多项自然语言评分标准转化为奖励，用于不易自动验证的专业任务。"
reviewed: "2026-09-10"
---

[← Scale AI](/companies/scale-ai) · [全部工作](/research)

# Rubrics as Rewards：细项标准作为 RL 奖励

将多项自然语言评分标准转化为奖励，用于不易自动验证的专业任务。

| 项目 | 信息 |
| --- | --- |
| 时间 | 2025-07-23 |
| 类型 | 论文 |
| 公司参与 | Scale 研究团队发布 |

## 工作内容

方法针对每个任务设置评分细项，评审模型检查回答后，再将结果汇总为强化学习奖励。论文比较不同汇总策略，并以医疗和科学任务检验这种结构化反馈与直接打总分的差别。 [资料](https://arxiv.org/abs/2507.17746)

## 数据与使用范围

实验涉及 HealthBench 和 GPQA-Diamond。文中最高相对提升依赖具体任务与基线；评分标准本身也可能有误，因此不能把 rubric 奖励视为天然可靠的客观答案。 [资料](https://arxiv.org/abs/2507.17746)

## 参考资料

- [Rubrics as Rewards：细项标准作为 RL 奖励：原始资料](https://arxiv.org/abs/2507.17746)

资料核对截至 2026 年 9 月 10 日。实验结果对应所引资料的模型版本和评测设置。
