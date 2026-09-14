---
title: "Terminal-Bench 2.0：Snorkel 的任务与评测分析贡献"
company: "snorkel-ai"
date: "2025-11-07"
dateLabel: "2025-11-07"
kind: "合作基准"
description: "介绍 Snorkel 在 Terminal-Bench 2.0 中的任务贡献、难度评估与失败分析；论文介绍见同一研究的主页面。"
reviewed: "2026-09-12"
---

[← Snorkel AI](/companies/snorkel-ai) · [全部工作](/research) · [论文介绍](/companies/bespoke-labs/terminal-bench)

# Terminal-Bench 2.0：Snorkel 的任务与评测分析贡献

Terminal-Bench 2.0 是 Stanford 与 Laude Institute 组织、多个机构共同贡献的终端任务基准。它提供 89 个容器化任务，让 agent 操作文件、程序和服务，再用测试检查最终结果。Snorkel 参与了任务制作和评测分析。

本页介绍公司参与情况。对应论文是 2026 年 1 月 17 日公开的 *Terminal-Bench: Benchmarking Agents on Hard, Realistic Tasks in Command Line Interfaces*；它与 Bespoke Labs 目录下的 Terminal-Bench 页面是**同一篇合作论文**。作者背景、研究背景、核心方案与结论统一整理在 [论文介绍](/companies/bespoke-labs/terminal-bench)，不重复计为另一篇独立论文。

## 参与依据

Snorkel 于 2025 年 11 月 7 日发布贡献说明，列出三个方向：为任务提供一致的难度评估方式；建立失败分类并分析执行轨迹；向任务注册表和 2.0 数据集提交任务。该说明没有逐题列出全部公司贡献，也没有给出每项研究的独立人员分工，因此不据此推断 Snorkel 独立完成了整套基准。[公司贡献说明](https://snorkel.ai/blog/terminal-bench-2-0-raising-the-bar-for-ai-agent-evaluation/)

论文首页中，**Jeong Yeon Shin 同时署名 Stanford 和 Snorkel AI**，为研究参与提供了作者层面的依据。研究包含多所大学、公司及独立贡献者，Mike A. Merrill 和 Alexander G. Shaw 是共同第一及通讯作者。[论文 v1 首页](https://arxiv.org/pdf/2601.11868v1)

## 这些分析如何进入基准

难度分析把人类给出的任务难度与统一 Terminus 2 框架下的模型完成率比较。论文发现，人类标为 hard 的任务中，93.3% 对所测模型也属于 hard；人类标为 medium 的任务仍有 54.5% 对模型较难。这个经验难度依赖所测模型和预算，并不是永远固定的任务属性。[论文 §4.3、图 7]

失败分析则区分执行、连贯性和验证问题，例如重复无进展操作、忘记已经修改的环境状态、未完成必要检查就宣布成功。分析使用执行轨迹和专门的标签定义；同一轨迹可以对应多个问题。这类诊断帮助解释失败行为，与通过测试得到的任务完成率是不同的测量。[论文 §4.4、附录 C]

论文同时强调参考解、人工审查和自动检查，也承认联网依赖、资源差异、测试覆盖和公开数据污染仍可能影响结果。因此，本页不把公司发布说明中的质量表述当作“所有环境已永久无误”的保证。

## 版本与阅读入口

本页日期保留 **2.0 发布及 Snorkel 贡献说明的 2025 年 11 月 7 日**。论文介绍使用 **arXiv:2601.11868v1，2026 年 1 月 17 日**，两者时间不同。这里不混入后续版本的任务或榜单。

- [论文介绍：Terminal-Bench 的研究背景、任务设计与主要结论](/companies/bespoke-labs/terminal-bench)
- [原始论文与完整作者名单](https://arxiv.org/abs/2601.11868v1)
- [Snorkel 的 2.0 贡献说明](https://snorkel.ai/blog/terminal-bench-2-0-raising-the-bar-for-ai-agent-evaluation/)
- [Terminal-Bench 2.0 与 Harbor 发布说明](https://www.tbench.ai/news/announcement-2-0)
