---
title: "Agentic Rubrics：结合代码库上下文的补丁评审"
company: "scale-ai"
date: "2026-01-07"
dateLabel: "2026-01-07"
kind: "论文"
description: "让专家 agent 阅读代码库并生成针对任务的评分清单。"
reviewed: "2026-09-10"
---

[← Scale AI](/companies/scale-ai) · [全部工作](/research)

# Agentic Rubrics：结合代码库上下文的补丁评审

让专家 agent 阅读代码库并生成针对任务的评分清单。

| 项目 | 信息 |
| --- | --- |
| 时间 | 2026-01-07 |
| 类型 | 论文 |
| 公司参与 | Scale 研究人员发表或参与共同研究 |

## 工作内容

方法先用 agent 收集代码上下文，生成可以解释的细项标准，再据此检查候选补丁。评分过程不要求执行测试，目标是减少环境准备开销并支持候选方案选择。 [资料](https://arxiv.org/abs/2601.04171)

## 数据与评测

在 SWE-bench Verified 上，研究用该评分器从并行生成的补丁中选择结果。Qwen3-Coder-30B-A3B 与 Qwen3-32B 分别达到 54.2% 和 40.6%，比所比较的最佳基线至少高 3.5 个百分点。 [资料](https://arxiv.org/abs/2601.04171)

## 结果与公开范围

消融表明主动收集上下文有助于形成清晰、适合该代码库的标准。论文首发为 1 月 7 日，Scale 目录标为 1 月 6 日；本页采用 arXiv 首发时间。 [资料](https://arxiv.org/abs/2601.04171)

## 参考资料

- [Agentic Rubrics：结合代码库上下文的补丁评审：论文或发布说明](https://arxiv.org/abs/2601.04171)
- [Scale Labs 研究目录](https://labs.scale.com/papers)

资料核对截至 2026 年 9 月 10 日。实验结果对应所引资料的模型版本和评测设置。
