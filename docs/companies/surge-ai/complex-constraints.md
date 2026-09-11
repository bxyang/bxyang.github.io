---
title: "ComplexConstraints：多约束指令评测"
company: "surge-ai"
date: "2026-06-08"
dateLabel: "2026-06-08"
kind: "基准"
description: "使用专家编写的细项标准检查一个回答同时满足多个要求的能力。"
reviewed: "2026-09-09"
---

[← Surge AI](/companies/surge-ai) · [全部工作](/research)

# ComplexConstraints：多约束指令评测

使用专家编写的细项标准检查一个回答同时满足多个要求的能力。

| 项目 | 信息 |
| --- | --- |
| 时间 | 2026-06-08 |
| 类型 | 基准 |
| 公司参与 | Surge 发布 |

## 工作内容

75 个公开提示共配有 1,559 条评分标准，每题约 10—40 条要求；另有与测试分离的 1,000 个训练提示。研究讨论标准的拆分粒度、对意图的覆盖和评审器校准，使用同类标准作为 RL 奖励。

## 数据与实验

4B 模型经训练后，在保留数据上的平均评分项通过率提高 15.5 个百分点，并在 AdvancedIF、MultiChallenge 上观察到迁移。单项标准通过率与全部标准同时满足的任务通过率分别统计。公开 benchmark 和训练集合的开放情况见论文与数据卡。

## 参考资料

- [论文及提交历史](https://arxiv.org/abs/2606.09118)
- [ComplexConstraints：多约束指令评测：原始资料](https://github.com/surge-ai/complex-constraints)
- [数据集](https://huggingface.co/datasets/surgeai/ComplexConstraints)

资料核对截至 2026 年 9 月 9 日。实验结果对应所引资料的模型版本和评测设置。
