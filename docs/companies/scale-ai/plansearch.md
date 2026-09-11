---
title: "PlanSearch：先搜索计划再生成代码"
company: "scale-ai"
date: "2024-09-05"
dateLabel: "2024-09-05"
kind: "论文与开源工具"
description: "通过不同自然语言解题计划增加候选代码的多样性。"
reviewed: "2026-09-10"
---

[← Scale AI](/companies/scale-ai) · [全部工作](/research)

# PlanSearch：先搜索计划再生成代码

通过不同自然语言解题计划增加候选代码的多样性。

| 项目 | 信息 |
| --- | --- |
| 时间 | 2024-09-05 |
| 类型 | 论文与开源工具 |
| 公司参与 | Scale 研究者与合作团队发布 |

## 工作内容

模型先生成对问题的不同观察，再组合成计划，最后据此写代码。研究将这种计划空间搜索与重复生成代码比较，分析多样性与测试时计算收益的关系。 [资料](https://arxiv.org/abs/2409.03733)

## 数据与使用范围

实验使用 HumanEval+、MBPP+ 和 LiveCodeBench，并公开代码。文中 pass@200 表示多次候选中存在正确答案的比例，与一次生成的 pass@1 分开比较。 [资料](https://arxiv.org/abs/2409.03733)

## 参考资料

- [PlanSearch：先搜索计划再生成代码：原始资料](https://arxiv.org/abs/2409.03733)
- [代码](https://github.com/scaleapi/plansearch)

资料核对截至 2026 年 9 月 10 日。实验结果对应所引资料的模型版本和评测设置。
