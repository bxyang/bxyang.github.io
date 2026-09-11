---
title: "SWE Atlas：代码理解、测试编写与重构"
company: "scale-ai"
date: "2026-05-07"
dateLabel: "2026-05-07"
kind: "论文与基准套件"
description: "在真实代码库中评测问题修复之外的软件工程工作。"
reviewed: "2026-09-10"
---

[← Scale AI](/companies/scale-ai) · [全部工作](/research)

# SWE Atlas：代码理解、测试编写与重构

在真实代码库中评测问题修复之外的软件工程工作。

| 项目 | 信息 |
| --- | --- |
| 时间 | 2026-05-07 |
| 类型 | 论文与基准套件 |
| 公司参与 | Scale 研究人员发表或参与共同研究 |

## 工作内容

套件包含三个部分：Codebase QnA 检查代码理解，Test Writing 检查测试编写，Refactoring 检查结构改进。评分结合程序检查与细项评审，覆盖行为正确性、完整性和可维护性。 [资料](https://scale.com/blog/swe-atlas-complete)

## 数据与评测

完整套件共 284 个任务，分别为 124 个问答、90 个测试编写和 70 个重构任务。任务保留一定需求不明确性，要求 agent 探索代码库并判断适当实现。 [资料](https://scale.com/blog/swe-atlas-complete)

## 结果与公开范围

5 月 7 日公告确认三个子榜单全部上线，代码和任务公开。当前仓库还记录对测试编写任务网络访问的调整，复现需要固定任务与运行配置。 [资料](https://scale.com/blog/swe-atlas-complete)

## 参考资料

- [SWE Atlas：代码理解、测试编写与重构：论文或发布说明](https://scale.com/blog/swe-atlas-complete)
- [论文与任务分布](https://labs.scale.com/papers/sweatlas)
- [代码](https://github.com/scaleapi/SWE-Atlas)
- [Scale Labs 研究目录](https://labs.scale.com/papers)

资料核对截至 2026 年 9 月 10 日。实验结果对应所引资料的模型版本和评测设置。
