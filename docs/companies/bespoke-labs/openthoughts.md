---
title: "OpenThoughts：寻找开放推理数据的训练配方"
company: "bespoke-labs"
date: "2025-01-28"
dateLabel: "2025-01-28"
kind: "合作数据与模型"
description: "介绍作者背景、摘要与通过系统实验改进推理训练数据的方法。"
reviewed: "2026-09-14"
readingStatus: "summary"
paperVersion: "arXiv:2506.04178v2，2025-06-05，72 页"
---

[← 公司页面](/companies/bespoke-labs) · [全部工作](/research)

# OpenThoughts：寻找开放推理数据的训练配方

原文：[*OpenThoughts: Data Recipes for Reasoning Models*](https://arxiv.org/abs/2506.04178v2)，2025 年 6 月 5 日 v2；页面日期沿用项目首批数据发布日。

## 0. 作者与机构背景

第一、第二署名作者是 **Etash Guha 与 Ryan Marten**。前五位作者 Guha、Marten、Sedrick Keh、Negin Raoof、Georgios Smyrnis 标注为同等贡献，论文说明这组作者顺序随机决定。

Guha 署名斯坦福大学与华盛顿大学；他的[个人介绍](https://etash.me/)说明，博士阶段研究文本与图像模型的数据整理，包括合成数据生成、筛选与采样。Marten 署名 BespokeLabs.ai；[伊利诺伊大学的历史介绍](https://siebelschool.illinois.edu/54592)记录了他在 Hoiem AI Lab 攻读硕士及在 AI2 实习的经历。

这是多所大学、研究机构与企业共同开展的开放项目。Bespoke 的参与者包括 Marten、Trung Vu、Shreyas Pimpalgaonkar 等，以及联合创始人 Maheswaran Sathiamoorthy 和 Alexandros G. Dimakis。公司直接参与数据与模型研究，属于合作团队的一部分。（原文首页）

## 1. 摘要翻译

以下按原文顺序翻译；[论文采用 CC BY 4.0 许可](https://arxiv.org/abs/2506.04178v2)。

推理模型在许多数学、编程和科学基准上取得了快速进展。然而，关于推理模型最佳训练配方的问题仍有很多，因为最先进的模型往往依赖专有数据集，公开信息很少甚至没有。为解决这一问题，OpenThoughts 项目旨在创建用于训练推理模型的开源数据集。

经过初步探索，我们的 OpenThoughts2-1M 数据集带来了 OpenThinker2-32B。这是第一个使用公开推理数据训练、能在 AIME 和 LiveCodeBench 等标准推理基准上达到 DeepSeek-R1-Distill-32B 水平的模型。随后，我们通过超过 1000 次受控实验，系统研究数据生成流程的每一步，进一步改进数据集，得到 OpenThoughts3。

将这套流程扩展到 120 万个样本，并使用 QwQ-32B 作为教师，得到了 OpenThinker3-7B 模型。它取得了当时最先进的结果：AIME 2025 为 53%，LiveCodeBench 2024 年 6 月至 2025 年 1 月部分为 51%，GPQA Diamond 为 54%；相较 DeepSeek-R1-Distill-Qwen-7B，分别提高 15.3、17.2 和 20.5 个百分点。所有数据集和模型均可在 openthoughts.ai 获取。

## 2. 研究背景与相关研究

训练推理模型的一种方式，是让较强的教师模型生成包含推理过程的回答，再用这些数据监督微调较小模型。DeepSeek 的蒸馏模型表明，这条路线可以得到较强的数学、编程和科学能力，但完整的数据制作细节往往不公开。

论文讨论了不同开放数据路线：OpenR1、OpenMathReasoning 等从论坛与竞赛收集题目；Natural Reasoning 从预训练语料生成问题；s1 与 LIMO 则关注少量精心筛选的难题。它们通常同时改变多个数据制作环节，使人难以分清来源、筛选、样本数量和教师选择各自的作用。

OpenThoughts 用一系列受控实验逐步比较这些选择，希望给出可以公开重用的数据配方。论文关注监督微调的数据，不研究强化学习数据或所有可能的后训练方法。（原文 §1–2）

## 3. 核心贡献

**核心要解决的问题。** 找到能稳定提高小型推理模型表现的数据制作方法，并公开数据、模型和实验依据。

**核心方案。** 团队依次比较题目来源、不同来源的混合、题目筛选、去重、同题多答案、答案过滤和教师选择。先用较小规模实验选择有效方案，再扩展数据量。最终从数学、编程和科学题目中选取约 7.5 万道问题，为每道采样 16 个回答，形成 OpenThoughts3-1.2M；用它监督微调 Qwen2.5-7B-Instruct，得到 OpenThinker3-7B。（原文 §3–5）

**结论。** 实验显示，同一题生成多种回答可以有效扩充训练数据；教师自身基准分数更高，不一定意味着它生成的数据更适合学生；在所测设置中，答案过滤没有带来足以弥补样本减少的收益。最后一项比较包含使用全部样本、计算量未完全相等的基线，因此不能概括为错误答案永远有益。

最终模型在 AIME 2025、指定时间段的 LiveCodeBench 和 GPQA Diamond 上取得约 53%、52% 和 54% 的成绩。结果支持这套公开配方在论文所测模型规模和任务上的有效性，尚未证明同一选择在其他规模、课程式训练或强化学习中也最优。（原文 §4–6）
