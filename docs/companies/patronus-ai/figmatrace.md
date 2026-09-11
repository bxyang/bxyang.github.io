---
title: "FigmaTrace：设计师操作轨迹"
company: "patronus-ai"
date: "2026-08-20"
dateLabel: "2026-08-20"
kind: "数据集与模型"
description: "记录真实 Figma 设计过程，用于训练界面操作和设计能力。"
reviewed: "2026-09-09"
---

[← Patronus AI](/companies/patronus-ai) · [全部工作](/research)

# FigmaTrace：设计师操作轨迹

记录真实 Figma 设计过程，用于训练界面操作和设计能力。

| 项目 | 信息 |
| --- | --- |
| 时间 | 2026-08-20 |
| 类型 | 数据集与模型 |
| 公司参与 | Patronus 发布 |

## 工作内容

数据覆盖十种设计技能，包含无障碍修改、模板调整、原型连线、草图转换和平台适配。研究按设计阶段切分长录制，而不是只按最大上下文长度截断，比较两种整理方式对训练的影响。

## 数据与使用范围

共 3,469 条轨迹、超过 200 小时人类设计工作，其中 2,883 条训练、586 条评测；同时开放数据和训练模型。论文还在非设计界面任务上检验迁移。

## 参考资料

- [FigmaTrace：设计师操作轨迹：原始资料](https://www.patronus.ai/blog/figmatrace-a-comprehensive-training-dataset-for-figma-design-workflows)
- [论文](https://cdn.patronus.ai/FigmaTrace.pdf)
- [数据集](https://huggingface.co/datasets/PatronusAI/figmatrace)

资料核对截至 2026 年 9 月 9 日。实验结果对应所引资料的模型版本和评测设置。
