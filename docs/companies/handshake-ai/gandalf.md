---
title: "Gandalf：让验证器进入智能体的工作环境"
company: "handshake-ai"
date: "2026-05-27"
dateLabel: "2026-05-27"
kind: "论文 / 评测工具"
description: "Gandalf 通过实际检查文件和工具状态判断任务是否完成，并用 BankerVerifierBench 测量验证器与专家判断的一致程度。"
reviewed: "2026-09-14"
readingStatus: "summary"
paperVersion: "Verifying Agents in Rubric-Graded Environments，KDD 2026 workshop 网站版，18 页"
---

[← Handshake AI](/companies/handshake-ai) · [BankerVerifierBench 配套介绍](/companies/handshake-ai/bankerverifierbench) · [全部工作](/research)

# Gandalf：让验证器进入智能体的工作环境

论文：*Verifying Agents in Rubric-Graded Environments*。本文依据 [KDD 2026 工作坊网站原稿](https://kdd-eval-workshop.github.io/agenticai-evaluation-kdd2026/assets/papers/34_Verifying_Agents_in_Rubric_.pdf)，该工作坊论文不收入 KDD 主会论文集。页面日期沿用公司的 2026 年 5 月 27 日发布记录。

## 0. 作者与机构背景

第一作者 **Markus Dücker** 与第二作者 **Vaibhav Kumar** 均署名 Handshake AI Research，论文没有共同第一作者标注。公司的[研究发布页](https://joinhandshake.com/research/ai/gandalf-the-grader/)将两人的职务列为 Member of Technical Staff，即技术团队成员。

Dücker 的背景是软件工程与产品开发。他在[本人公开资料](https://de.linkedin.com/in/markus-duecker)中介绍了联合创办 Talentspace、公司后来加入 Handshake，以及参与 Handshake AI 早期开发的经历；资料也列有哈索·普拉特纳研究所的学习经历。

Kumar 的[公开个人资料](https://www.linkedin.com/in/vaibhav4595)列有卡内基梅隆大学教育经历，并介绍了模型后训练、Meta 和 Amazon 的工作背景。可见资料没有明确两人在本论文中的各自分工，因此不根据署名顺序推断。

七位作者均有 Handshake AI Research 署名，Andreas Plesner 同时署名苏黎世联邦理工学院。团队构建用于评价验证器的 BankerVerifierBench，开发 Gandalf 并比较不同验证方案。这是公司直接开展的评测研究；Gandalf 与 BankerVerifierBench 是同一论文中的工具和数据集。（原文首页、§3—§7。）

## 1. 摘要概述

目前未确认本工作坊版本允许完整翻译再发布的开放许可，以下为摘要概述。

论文研究如何检查智能体完成的复杂工作。作者构建了包含专家判断的 BankerVerifierBench，并从评分标准中整理验证器需要具备的能力。Gandalf 据此进入任务环境，主动检查文件和工具状态，再逐项判断结果。实验发现，这种设计在所测投行任务和另一组个人生产力任务上改善了验证表现，同时降低了部分配置的调用成本。

## 2. 研究背景与相关研究

智能体的交付物可能是电子表格、演示文稿和一系列应用操作。仅看最终回复，无法确认表格公式是否正确、不同文件的数据是否一致，或一次操作是否真的发生。如果验证器看不到这些证据，它的分数就可能偏离实际工作质量。（原文 §1。）

早期自动评测常依赖确定性的检查，例如 SWE-bench 的单元测试和 WebArena 的程序化验证。随着任务扩展到开放式专业工作，BankerToolBench、APEX-Agents 等使用逐条自然语言评分标准，让模型判断交付物是否符合要求。这使评分器本身也成为一个需要检验的系统。（原文 §1—§2。）

本文比较了不同的信息获取方式。AutoRubric 根据执行轨迹逐项评分；Archipelago 提取文件变化与视觉内容，再进行判断；Agent-as-a-Judge 使用预先组织的流程寻找和检查文件。Gandalf 进一步允许验证器根据当前发现选择下一步检查，并直接访问交付物的原生结构。（原文 §2、§9。）

## 3. 核心贡献

### 核心要解决的问题

论文要测量验证器能否发现未完成或错误完成的评分项，并研究什么样的验证流程更适合复杂文件与工具环境。

### 核心方案

**BankerVerifierBench 包含 21 项投行任务、3,204 条专家判断。** 每项任务保存一条智能体执行轨迹、最终文件和环境状态。专家对每条评分标准给出“满足”或“不满足”的结论，供研究者检验自动验证器，而不是重新给执行任务的智能体排名。（原文 §3。）

作者从这些标准中整理出九类验证能力，例如重新计算指标、核对原始数值、追踪跨文件引用，以及检查版面和会计规则。随后把验证器设计为三个相互配合的部分：根据发现主动选择检查步骤，使用与执行任务时相匹配的环境和工具，并接受独立的领域说明。（原文 §4—§5。）

Gandalf 将这些原则做成可运行的工具。验证器可以打开原始表格、查看公式或查询状态，获得足够证据后再对当前标准下结论。例如检查两个文件中的财务数字是否一致，需要实际追踪相关数值，而不是只相信智能体声称已经核对。（原文 §6。）

### 结论

在 BankerVerifierBench 中，Gandalf 的低成本配置取得 **0.633 的 F1**，高于论文最昂贵基线的 0.538；对应整套评分的模型调用成本分别为 42 美元和 414 美元。这里的 F1 衡量识别“不满足标准”的能力，不是任务完成率。论文在另一组个人生产力任务中也观察到改善。（原文 §7—§8。）

不同设计带来的作用并不相同：允许验证器主动决定检查路径，对准确性更关键；环境匹配和领域说明主要减少调用开销。这些结果支持在评测中保留文件结构与实际工具状态，但不能推断所有任务都能获得相同幅度的提升。（原文 §7—§8。）

本研究每道任务只包含一条执行轨迹，且只测试了两个领域。它没有进一步验证，将更准确的验证器用于强化学习后，是否一定能训练出更好的智能体。（原文 §10。）
