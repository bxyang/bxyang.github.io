---
title: "MCP-Atlas：真实 MCP 工具工作流"
company: "scale-ai"
date: "2025-12-18"
dateLabel: "2025-12-18"
kind: "基准"
description: "要求 agent 自行发现并组合真实 MCP 服务，完成多步任务。"
reviewed: "2026-09-10"
---

[← Scale AI](/companies/scale-ai) · [全部工作](/research)

# MCP-Atlas：真实 MCP 工具工作流

要求 agent 自行发现并组合真实 MCP 服务，完成多步任务。

| 项目 | 信息 |
| --- | --- |
| 时间 | 2025-12-18 |
| 类型 | 基准 |
| 公司参与 | Scale 发布 |

## 工作内容

论文版本覆盖 36 个 MCP 服务和 220 个工具，包含 1,000 道任务。提示不直接告诉模型使用哪个服务；agent 需发现工具、传入正确参数并整合结果。评分按最终答案满足的事实要求给部分分。 [资料](https://arxiv.org/abs/2602.00933)

## 数据与使用范围

公开 500 题及容器化执行框架。公司目录记录 2025 年 12 月公开，arXiv 版于 2026 年 1 月提交；仓库后续工具数量已有变化，论文规模与当前仓库规模分别看。 [资料](https://arxiv.org/abs/2602.00933)

## 参考资料

- [MCP-Atlas：真实 MCP 工具工作流：原始资料](https://arxiv.org/abs/2602.00933)
- [代码及版本](https://github.com/scaleapi/mcp-atlas)
- [公司时间记录](https://labs.scale.com/papers)

资料核对截至 2026 年 9 月 10 日。实验结果对应所引资料的模型版本和评测设置。
