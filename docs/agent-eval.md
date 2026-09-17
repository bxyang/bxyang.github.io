---
title: "Agent Eval 周报"
description: "工业界大模型 Agent 评测的博客、访谈与工程方案，按周整理。"
---

# Agent Eval 周报

跟踪工业界如何评估大模型 Agent：从任务和评分标准，到多轮交互、运行环境、线上监控与失败分析。收集公司技术博客、从业者访谈、公开演讲及可执行的评测方案。

最近检索：**2026-09-17** · 累计 **92 条**资料。每周补充，按原始发布周归档，最新在前。

## 按年查看

- [2026 年周列表 · 92 条资料](/agent-eval/2026)

## 最近收录

- **09-16 · Microsoft · 方法博客** — [编程 Agent 评测的沙箱边界](https://developer.microsoft.com/blog/your-ai-coding-agent-evaluation-is-only-as-good-as-its-sandbox/)

  区分模型自身解决问题与从环境取回答案，说明环境约束为何影响评测有效性。

- **09-13 · Hamel Husain / Shreya Shankar · 实践问答** — [长执行轨迹的人工审阅方法](https://hamel.dev/blog/posts/evals-faq/what-if-the-source-material-is-too-large-for-a-person-to-review.html)

  优先寻找最早的上游错误，并按需展开工具结果和相关证据。

- **09-10 · AWS · 方法博客** — [多轮对话中的 Agent 正确性指标](https://aws.amazon.com/blogs/machine-learning/agent-evaluation-metric-for-multi-turn-conversations/)

  把整体评分拆成可检查的评价环节，定位正确性在何处失效。

- **09-08 · Sierra · 基准发布** — [Hyper-τ-bench：评测构建 Agent 的 Agent](https://sierra.ai/blog/hyper-t-bench-evaluating-agents-that-build-agents)

  把需求理解、构建和测试其他 Agent 作为长任务评测对象。

- **09-08 · AWS · 工程方案** — [用 GitHub Actions 自动运行 Agent 评测](https://aws.amazon.com/blogs/machine-learning/automated-agent-evaluation-with-amazon-bedrock-agentcore-and-github-actions/)

  将 AgentCore、身份验证和评测执行接入代码变更流程。

- **09-03 · Scale AI · 基准发布** — [READY：企业 Agent 的部署能力评测](https://labs.scale.com/blog/ready)

  围绕行业工作流与人机协作，检验 Agent 在实际业务中的完成能力。

## 收录方式

优先采用原作者、公司技术团队或活动主办方发布的资料。正文说明具体评测方法、工程经验或任务设计；单纯模型发布、泛化产品宣传和工具排行榜不作为周报主体。由公司参与的研究，只在有相关官方博客或方案说明时列入，论文介绍继续放在[公司研究](/companies)。

访谈按节目上线日归档，活动整理按文章发布日期归档。未观看视频时，只概括可核实的官方文字内容，并明确材料类型。每条简介用于判断是否值得阅读，不代替原文。

## 长期参考

以下是持续更新或首发早于 2026 年的资料，不混入 2026 年新发布列表。

- [Google Cloud：Agent 轨迹与最终响应评测](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/evaluation-agents) — 持续更新的官方文档。

- [MLflow：运行 Agent 评测](https://mlflow.org/docs/latest/genai/eval-monitor/running-evaluation/agents/) — 持续更新的官方文档。

- [Confident AI：Agent 评测指标](https://www.confident-ai.com/blog/llm-agent-evaluation-complete-guide) — 首发于 2025 年，2026 年更新。

- [Galileo：Agent 评测方法](https://galileo.ai/blog/ai-agent-evaluation) — 首发于 2025 年，2026 年更新。
