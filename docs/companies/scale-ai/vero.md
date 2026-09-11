---
title: "VeRO：用 coding agent 优化 agent"
company: "scale-ai"
date: "2026-02-25"
dateLabel: "2026-02-25"
kind: "论文与开源框架"
description: "记录候选实现、运行反馈和预算，评测 agent 自我改进工具链的能力。"
reviewed: "2026-09-10"
---

[← Scale AI](/companies/scale-ai) · [全部工作](/research)

# VeRO：用 coding agent 优化 agent

记录候选实现、运行反馈和预算，评测 agent 自我改进工具链的能力。

| 项目 | 信息 |
| --- | --- |
| 时间 | 2026-02-25 |
| 类型 | 论文与开源框架 |
| 公司参与 | Scale 研究人员发表或参与共同研究 |

## 工作内容

VeRO 将目标 agent 的代码作为可版本化产物，组织修改、执行、评估和选择过程。每个候选版本保留代码快照和结构化轨迹，使优化结果能够追溯。 [资料](https://arxiv.org/abs/2602.22480)

## 数据与评测

框架提供目标 agent 与参考评测任务，并控制评估预算。实验比较不同优化器配置，以及提示、工具和执行流程等改动对下游任务表现的影响。 [资料](https://arxiv.org/abs/2602.22480)

## 结果与公开范围

项目公开代码。当前仓库已扩展到程序、文本与 agent 优化，原论文版本保存在 paper-v1 标签及 legacy 目录；复现实验需要区分这两个版本。 [资料](https://arxiv.org/abs/2602.22480)

## 参考资料

- [VeRO：用 coding agent 优化 agent：论文或发布说明](https://arxiv.org/abs/2602.22480)
- [代码与版本说明](https://github.com/scaleapi/vero)
- [Scale Labs 研究目录](https://labs.scale.com/papers)

资料核对截至 2026 年 9 月 10 日。实验结果对应所引资料的模型版本和评测设置。
