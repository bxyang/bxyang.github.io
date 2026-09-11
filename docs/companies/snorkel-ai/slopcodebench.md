---
title: "SlopCodeBench：持续扩展中的代码质量"
company: "snorkel-ai"
date: "2026-03-25"
dateLabel: "2026-03-25"
kind: "资助基准"
description: "让 agent 多次扩展自己写出的程序，测量正确性和代码结构的变化。"
reviewed: "2026-09-10"
---

[← Snorkel AI](/companies/snorkel-ai) · [全部工作](/research)

# SlopCodeBench：持续扩展中的代码质量

让 agent 多次扩展自己写出的程序，测量正确性和代码结构的变化。

| 项目 | 信息 |
| --- | --- |
| 时间 | 2026-03-25 |
| 类型 | 资助基准 |
| 公司参与 | UW–Madison 团队主导；Snorkel Open Benchmarks Grants 支持 |

## 工作内容

每个问题从空目录和初始规格开始，后续检查点逐步追加要求。代码保留，但前面的对话不保留，agent 需要重新理解已有实现并作出设计决策。 [资料](https://arxiv.org/abs/2603.24755)

## 数据与评测

论文版本包含 36 个问题、196 个检查点，评测 15 个 coding agent。除任务通过率外，还衡量复杂度集中形成的结构退化和冗余代码，并对照 473 个开源 Python 仓库。 [资料](https://arxiv.org/abs/2603.24755)

## 结果与公开范围

论文报告大多数轨迹随扩展出现结构退化或冗余增加。网站分别展示严格通过、单点通过和核心行为通过等指标；当前网站结果可能与论文初始运行不同。 [资料](https://arxiv.org/abs/2603.24755)

## 参考资料

- [SlopCodeBench：持续扩展中的代码质量：论文或发布说明](https://arxiv.org/abs/2603.24755)
- [项目与资助说明](https://snorkel.ai/leaderboard/slopcode-bench/)

资料核对截至 2026 年 9 月 10 日。实验结果对应所引资料的模型版本和评测设置。
