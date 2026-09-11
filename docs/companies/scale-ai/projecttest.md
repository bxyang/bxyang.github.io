---
title: "ProjectTest：项目级单元测试生成"
company: "scale-ai"
date: "2025-02-10"
dateLabel: "2025-02-10"
kind: "合作论文与基准"
description: "在完整代码项目中评测语言模型生成可运行测试的能力。"
reviewed: "2026-09-10"
---

[← Scale AI](/companies/scale-ai) · [全部工作](/research)

# ProjectTest：项目级单元测试生成

在完整代码项目中评测语言模型生成可运行测试的能力。

| 项目 | 信息 |
| --- | --- |
| 时间 | 2025-02-10 |
| 类型 | 合作论文与基准 |
| 公司参与 | Scale 研究人员参与共同研究 |

## 工作内容

基准将单元测试生成放到项目级代码环境中，要求模型处理真实依赖、编译与执行关系。研究同时分析原始生成结果、人工修复错误和模型自行修复三种条件。 [资料](https://arxiv.org/abs/2502.06556)

## 数据与评测

任务覆盖 Python、Java 和 JavaScript，每种语言包含 20 个中等规模项目，共比较九个模型。错误分析包括编译错误及由基础错误引发的后续失败。 [资料](https://arxiv.org/abs/2502.06556)

## 结果与公开范围

论文报告被测模型在项目级环境中仍会产生基础执行错误，并公开代码及数据。修复后的结果和未经修复的结果分别记录，用来观察错误修复环节的作用。 [资料](https://arxiv.org/abs/2502.06556)

## 参考资料

- [ProjectTest：项目级单元测试生成：论文或发布说明](https://arxiv.org/abs/2502.06556)
- [代码与数据](https://github.com/YiboWANG214/ProjectTest)
- [Scale Labs 研究目录](https://labs.scale.com/papers)

资料核对截至 2026 年 9 月 10 日。实验结果对应所引资料的模型版本和评测设置。
