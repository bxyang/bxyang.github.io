---
title: "SWiM：语言模型工作记忆评测"
company: "snorkel-ai"
date: "2024-07-04"
dateLabel: "2024-07-04"
kind: "论文与基准"
description: "测试模型能否在长上下文中完成需要实际使用信息的任务。"
reviewed: "2026-09-10"
---

[← Snorkel AI](/companies/snorkel-ai) · [全部工作](/research)

# SWiM：语言模型工作记忆评测

测试模型能否在长上下文中完成需要实际使用信息的任务。

| 项目 | 信息 |
| --- | --- |
| 时间 | 2024-07-04 |
| 类型 | 论文与基准 |
| 公司参与 | Snorkel 研究团队发布 |

## 工作内容

SWiM 将上下文窗口评测从简单寻找某条信息，扩展到需要综合材料的工作记忆任务。研究还考察推理时的结果修正，通过多个候选答案的选择提高文档问答表现。 [资料](https://arxiv.org/abs/2407.03651)

## 数据与使用范围

论文提供 long-context-eval 代码。模型支持输入多少 token 与能否可靠利用其中信息是不同指标；实验中的提升依赖具体文档任务。 [资料](https://arxiv.org/abs/2407.03651)

## 参考资料

- [SWiM：语言模型工作记忆评测：原始资料](https://arxiv.org/abs/2407.03651)
- [代码](https://github.com/snorkel-ai/long-context-eval)

资料核对截至 2026 年 9 月 10 日。实验结果对应所引资料的模型版本和评测设置。
