---
title: "Agentica：面向财务工具使用的小模型训练"
company: "snorkel-ai"
date: "2026-02-18"
dateLabel: "2026-02-18"
kind: "合作研究与模型"
description: "使用简单查询训练工具使用，再在复杂财务分析任务上检验迁移。"
reviewed: "2026-09-10"
---

[← Snorkel AI](/companies/snorkel-ai) · [全部工作](/research)

# Agentica：面向财务工具使用的小模型训练

使用简单查询训练工具使用，再在复杂财务分析任务上检验迁移。

| 项目 | 信息 |
| --- | --- |
| 时间 | 2026-02-18 |
| 类型 | 合作研究与模型 |
| 公司参与 | Snorkel 提供环境和评测；UC Berkeley rLLM 团队制作查询并训练模型 |

## 工作内容

团队用 rLLM 对 Qwen3-4B-Instruct-2507 进行强化学习，主要训练单表查询。训练强调先检查表结构、正确调用工具、校验结果以及失败后重试。 [资料](https://snorkel.ai/blog/how-tool-discipline-let-a-4b-model-outsmart-a-235b-giant-on-financial-tasks/)

## 数据与评测

Snorkel 提供 agent 环境，以及专家制作的 Finance 和 Finance Reasoning 评测。内部消融中，单表训练的 Pass@1 为 66.3%，混合单表和多表训练为 61.6%，先单表后多表的课程训练为 64.8%。 [资料](https://snorkel.ai/blog/how-tool-discipline-let-a-4b-model-outsmart-a-235b-giant-on-financial-tasks/)

## 结果与公开范围

研究报告训练后的 4B 模型在指定财务评测中超过 Qwen3-235B-A22B；这一比较限于该环境和任务。训练使用 8 张 H100，发布说明提供 rLLM 开源项目入口。 [资料](https://snorkel.ai/blog/how-tool-discipline-let-a-4b-model-outsmart-a-235b-giant-on-financial-tasks/)

## 参考资料

- [Agentica：面向财务工具使用的小模型训练：论文或发布说明](https://snorkel.ai/blog/how-tool-discipline-let-a-4b-model-outsmart-a-235b-giant-on-financial-tasks/)
- [Snorkel 研究目录](https://snorkel.ai/research/)

资料核对截至 2026 年 9 月 10 日。实验结果对应所引资料的模型版本和评测设置。
