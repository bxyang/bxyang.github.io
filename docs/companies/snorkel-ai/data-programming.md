---
title: "Data Programming：用规则创建训练标签"
company: "snorkel-ai"
date: "2016-05-25"
dateLabel: "2016-05-25"
kind: "创办前论文"
description: "把领域知识写成标注函数，组合成可供模型训练的标签。"
reviewed: "2026-09-10"
---

[← Snorkel AI](/companies/snorkel-ai) · [全部工作](/research)

# Data Programming：用规则创建训练标签

把领域知识写成标注函数，组合成可供模型训练的标签。

| 项目 | 信息 |
| --- | --- |
| 时间 | 2016-05-25 |
| 类型 | 创办前论文 |
| 公司参与 | Ratner、Ré 等在 Stanford 的研究；早于 Snorkel AI 成立 |

## 工作内容

用户编写多个标注函数，每个函数可以为部分样本提供一个有噪声的标签。系统用生成模型表示这些来源及其相互关系，估计标签质量，再生成去噪后的训练信号。 [资料](https://arxiv.org/abs/1605.07723)

## 数据与评测

论文分析在若干条件下恢复生成模型参数的可能性，并将训练损失改为能够处理标签噪声的形式。实验使用逻辑回归和 LSTM，包含 TAC-KBP Slot Filling 信息抽取任务。 [资料](https://arxiv.org/abs/1605.07723)

## 结果与公开范围

实验展示用规则制作训练数据的可行性，构成后续 Snorkel 系统的技术来源。该论文发表于公司 2019 年成立之前，按创始团队早期研究收录。 [资料](https://arxiv.org/abs/1605.07723)

## 参考资料

- [Data Programming：用规则创建训练标签：论文或发布说明](https://arxiv.org/abs/1605.07723)
- [Snorkel 研究目录](https://snorkel.ai/research/)

资料核对截至 2026 年 9 月 10 日。实验结果对应所引资料的模型版本和评测设置。
