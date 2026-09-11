---
title: "HarnessOpt-Bench：agent 框架优化"
company: "scale-ai"
date: "2026-08-06"
dateLabel: "2026-08-06"
kind: "基准"
description: "评测模型能否根据反馈改进另一个 agent 的提示、工具和控制流程。"
reviewed: "2026-09-10"
---

[← Scale AI](/companies/scale-ai) · [全部工作](/research)

# HarnessOpt-Bench：agent 框架优化

评测模型能否根据反馈改进另一个 agent 的提示、工具和控制流程。

| 项目 | 信息 |
| --- | --- |
| 时间 | 2026-08-06 |
| 类型 | 基准 |
| 公司参与 | Scale 发布 |

## 工作内容

优化器得到初始框架、评分反馈和固定评测预算，修改代码后提交候选版本。最终成绩使用搜索过程中不可访问的测试集，按相对初始版本的收益评分；执行环境记录预算和候选版本。 [资料](https://arxiv.org/abs/2608.06301)

## 数据与使用范围

论文比较 5 个优化模型、4 个下游任务和 111 次正式运行。评测对象包括模型和其使用的编码框架，研究将两者的作用分开比较。 [资料](https://arxiv.org/abs/2608.06301)

## 参考资料

- [HarnessOpt-Bench：agent 框架优化：原始资料](https://arxiv.org/abs/2608.06301)

资料核对截至 2026 年 9 月 10 日。实验结果对应所引资料的模型版本和评测设置。
