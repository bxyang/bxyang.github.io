---
title: "Agent-RLVR：引导与环境奖励"
company: "scale-ai"
date: "2025-06-13"
dateLabel: "2025-06-13"
kind: "论文"
description: "用计划和错误反馈帮助软件 agent 找到成功轨迹，再进行 RLVR。"
reviewed: "2026-09-10"
---

[← Scale AI](/companies/scale-ai) · [全部工作](/research)

# Agent-RLVR：引导与环境奖励

用计划和错误反馈帮助软件 agent 找到成功轨迹，再进行 RLVR。

| 项目 | 信息 |
| --- | --- |
| 时间 | 2025-06-13 |
| 类型 | 论文 |
| 公司参与 | Scale 研究团队发布 |

## 工作内容

agent 先尝试解决任务，单元测试检查结果，再加入策略提示或针对失败的反馈，让它重新探索。训练使用这些有引导的轨迹及环境奖励，缓解困难多步任务中成功奖励稀少的问题。 [资料](https://arxiv.org/abs/2506.11425)

## 数据与使用范围

论文中 Qwen2.5-72B-Instruct 在 SWE-bench Verified 的 pass@1 从 9.4% 提高到 22.4%；额外奖励模型实验另计。训练时提供的引导与测试时条件分别说明。 [资料](https://arxiv.org/abs/2506.11425)

## 参考资料

- [Agent-RLVR：引导与环境奖励：原始资料](https://arxiv.org/abs/2506.11425)

资料核对截至 2026 年 9 月 10 日。实验结果对应所引资料的模型版本和评测设置。
