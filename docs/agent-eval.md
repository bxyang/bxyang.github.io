---
title: "Agent Eval 周报"
description: "工业界大模型 Agent 评测的博客、访谈与工程方案，按周整理。"
---

# Agent Eval 周报

跟踪工业界如何评估大模型 Agent：从任务和评分标准，到多轮交互、运行环境、线上监控与失败分析。收集公司技术博客、从业者访谈、公开演讲及可执行的评测方案。

最近检索：**2026-10-05** · 累计 **115 条**资料。每周补充，按原始发布周归档，最新在前。

## 按年查看

- [2026 年周列表 · 115 条资料](/agent-eval/2026)

## 最近收录

- **10-02 · Arize AI · 实验博客** — [多轮购物 Agent 的缓存、成本与延迟比较](https://arize.com/blog/prompt-caching-benchmark/)

  用 Harbor 执行 20 组多轮购物对话，每个模型与服务商组合重复运行五次，再用 Phoenix 记录缓存、延迟和估算成本。缓存复用率高不一定意味着总成本低；模型与服务商同时变化，费用未与账单核对，不能把差异全部归因于缓存。 **日期说明：**正文只显示月份，按官方文章 API 的原始发布日期归档。

- **10-02 · Arize AI · 工程方案** — [从生产轨迹建立 Agent 的逐轮优化评测](https://arize.com/blog/claude-hillclimb-production-traces/)

  以自动添加追踪的 coding skill 为例，将应用、模型和技能版本组成评测数据，用代码检查与 LLM judge 同时衡量质量、耗时和 token 用量。介绍隔离环境、防止读取参考实现，以及把生产失败纳入回归集；这是 Arize 对 hillclimb 流程的工程接入说明。 **日期说明：**正文只显示月份，按官方文章 API 的原始发布日期归档。

- **10-01 · LangChain · 实验博客** — [用线上 A/B 实验评估 coding Agent 的模型路由](https://www.langchain.com/blog/how-to-build-a-model-router-in-the-harness)

  从 Open SWE 的真实任务轨迹归纳任务类型，在首次消息时选择模型档位，再比较合并 PR 的比例、用户反馈和成本。973 个会话的实验中，路由方案成本较低，合并率差异未达到统计显著；这不能证明两种方案质量完全相同。

- **09-29 · Multiverse Computing · 技术博客** — [ProvenanceGuard：检查 MCP Agent 是否引用了正确来源](https://huggingface.co/blog/MultiverseComputingCAI/getting-the-source-right-not-just-the-fact-source)

  将回答拆成具体主张，保留 MCP 工具输出的来源标识，分别核查事实支持和来源归属，避免将其他来源中的事实误归到所引用的记录。介绍医疗 Agent 轨迹上的离线验证与修复；相似来源仍难区分，部分修复通过保守回退完成，不能等同于恢复了有用答案。

- **09-29 · Google Cloud · 工程方案** — [为大规模 Agent 评测加速沙箱启动](https://cloud.google.com/blog/products/containers-kubernetes/accelerate-agentic-rl-with-gke-agent-sandbox)

  介绍 GKE Agent Sandbox 如何缓解并行 Agent 训练和评测中的环境启动瓶颈，并衔接编排 SDK 与任务运行框架。以软件工程任务环境测试启动延迟和资源开销；加速结果衡量的是评测基础设施，不代表 Agent 任务成功率提高。

- **09-28 · Arize AI / TypeSafe AI · 实验博客** — [用 judge 概率与重复判断识别需要人工复核的样例](https://arize.com/blog/jev-llm-judge-consistency/)

  在包含工具调用、工具响应处理等十类评测的 517 个标注样例上，比较 Jev 标签概率与 LLM 多次判断的不一致性，探索如何优先安排人工复核。重复运行没有增加独立样例数，部分错误数量很少；结果限于这些二分类任务，不能直接推广到开放式评分。 **日期说明：**正文只显示月份，按官方文章 API 的原始发布日期归档。

## 收录方式

优先采用原作者、公司技术团队或活动主办方发布的资料。正文说明具体评测方法、工程经验或任务设计；单纯模型发布、泛化产品宣传和工具排行榜不作为周报主体。由公司参与的研究，只在有相关官方博客或方案说明时列入，论文介绍继续放在[公司研究](/companies)。

访谈按节目上线日归档，活动整理按文章发布日期归档。未观看视频时，只概括可核实的官方文字内容，并明确材料类型。每条简介用于判断是否值得阅读，不代替原文。

## 长期参考

以下是持续更新或首发早于 2026 年的资料，不混入 2026 年新发布列表。

- [Google Cloud：Agent 轨迹与最终响应评测](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/evaluation-agents) — 持续更新的官方文档。

- [MLflow：运行 Agent 评测](https://mlflow.org/docs/latest/genai/eval-monitor/running-evaluation/agents/) — 持续更新的官方文档。

- [Confident AI：Agent 评测指标](https://www.confident-ai.com/blog/llm-agent-evaluation-complete-guide) — 首发于 2025 年，2026 年更新。

- [Galileo：Agent 评测方法](https://galileo.ai/blog/ai-agent-evaluation) — 首发于 2025 年，2026 年更新。
