---
title: "Terminal-Bench：在真实终端中评测智能体"
company: "bespoke-labs"
date: "2025-05-19"
dateLabel: "2025-05-19"
kind: "合作基准"
description: "介绍作者与公司关系、摘要，以及复杂终端任务的构建和验证方法。"
reviewed: "2026-09-14"
readingStatus: "summary"
paperVersion: "arXiv:2601.11868v1，2026-01-17"
---

[← 公司页面](/companies/bespoke-labs) · [全部工作](/research)

# Terminal-Bench：在真实终端中评测智能体

原文：[*Terminal-Bench: Benchmarking Agents on Hard, Realistic Tasks in Command Line Interfaces*](https://arxiv.org/abs/2601.11868v1)，2026 年 1 月 17 日 v1，主要介绍 Terminal-Bench 2.0；页面日期沿用项目首发日期。

## 0. 作者与机构背景

第一、第二署名作者 **Mike A. Merrill 与 Alexander G. Shaw** 为共同第一作者和共同通讯作者。Merrill 署名斯坦福大学；其[个人主页](https://mikemerrill.io/)记录，他在华盛顿大学获得博士学位后，曾在斯坦福与 Ludwig Schmidt 从事博士后研究，并共同创建 Terminal-Bench。

Shaw 署名 Laude Institute，其[本人公开资料](https://www.linkedin.com/in/alexgshaw)列有杨百翰大学教育经历。在[项目团队访谈](https://snorkel.ai/blog/chat-with-the-terminal-bench-team/)中，他介绍了自己此前在 Google 工作，以及之后在 Laude 开发评测项目的经历。

该项目由斯坦福与 Laude 发起，并由多机构社区共同贡献。Bespoke Labs 的署名作者包括 Shreyas Pimpalgaonkar、Ryan Marten 和 Alex Dimakis。因此，它是公司参与的合作基准，不是 Bespoke 独立发布的研究。论文同时有 Snorkel AI 等其他企业作者。（原文首页；[项目发布说明](https://www.tbench.ai/news/announcement)）

## 1. 摘要翻译

以下按原文顺序翻译；[论文采用 CC BY 4.0 许可](https://arxiv.org/abs/2601.11868v1)。

AI 智能体可能很快就能在不同领域自主完成有价值、耗时较长的任务。当前基准要么不测量实际任务，要么难度不足，无法有意义地测量前沿模型。为此，我们提出 Terminal-Bench 2.0：一个经过精心整理的高难度基准，包含 89 道计算机终端环境中的任务，灵感来自实际工作流程中的问题。

每道任务都有独特的环境、人工编写的解法，以及用于验证的完整测试。我们发现，前沿模型和智能体在该基准上的得分低于 65%，并通过错误分析确定模型与智能体可以改进的方面。我们在 tbench.ai 发布数据集与评测框架，以帮助开发者和研究者开展后续工作。

## 2. 研究背景与相关研究

终端是软件工程、科学计算、系统管理和机器学习工作的重要接口。使用终端的智能体不仅要生成命令，还要根据执行结果调整计划、理解已有文件和依赖，直到系统真正达到要求。

论文将已有评测分为软件工程、工具调用、计算机操作和科学任务等类型，例如 SWE-bench、τ-Bench、WebArena、OSWorld 与 MLGym-Bench。还有一些研究专门测量 Bash 命令生成或软件环境配置。作者希望把更广泛的专业工作放进同一个真实终端接口，避免只衡量狭窄命令能力。

Terminal-Bench 2.0 因而通过社区专家提供任务，强调实际环境、较长的行动链和可执行的结果验证。（原文 §1、§6）

## 3. 核心贡献

**核心要解决的问题。** 建立足够困难且可核验的终端任务，测量智能体是否真正完成工作，而非只输出看似正确的解释。

**核心方案。** 每道题包括任务说明、初始化容器、人工参考解、结果测试和时间限制。智能体可以自由选择命令和工具；测试检查运行结束后的文件与系统状态，而不是强制复现参考解的步骤。

团队从社区贡献的 229 道任务中筛选出 89 道，经过多位审核者检查说明是否清晰、参考解是否可行，以及能否通过不符合任务目的的捷径得分。论文还提供 Harbor 运行框架和 Terminus 2 基线智能体，用于比较不同模型与运行方式。（原文 §2–3）

**结论。** 论文中最佳组合为 GPT-5.2 搭配 Codex CLI，平均完成率约 63%；不同模型、智能体框架和资源预算均影响结果。失败分析涵盖找不到命令、缺少模块、运行错误等执行问题，但这些命令错误并不都意味着整项任务最终失败。

基准使用真实终端并允许联网，环境依赖和机器资源可能随运行条件变化；公开任务也存在被训练数据收录的风险。因此，比较结果需要同时说明模型、框架、任务版本与资源设置。它衡量的是这组专业终端任务的完成能力。（原文 §4–5）
