---
title: "OEC：让专家从学生走过的轨迹接着纠错"
company: "scale-ai"
date: "2025-12-16"
dateLabel: "2025-12-16"
kind: "论文"
description: "先让学生模型执行任务，再由专家接手完成，用贴近学生实际状态的示范改善多轮智能体训练。"
reviewed: "2026-09-14"
readingStatus: "summary"
paperVersion: "arXiv:2512.14895v1，2025-12-16，32 页全文及附录"
---

[← Scale AI](/companies/scale-ai) · [全部工作](/research)

# OEC：让专家从学生走过的轨迹接着纠错

## 0. 作者与机构背景

[Imitation Learning for Multi-turn LM Agents via On-policy Expert Corrections](https://arxiv.org/abs/2512.14895) 的第一作者是 Niklas Lauffer，第二作者是 Xiang Deng。首页前三位作者后的星号表示“工作在 Scale AI 任职期间完成”，**不是共同第一作者标记**。本文依据 2025 年 12 月 16 日的 arXiv v1；该工作后来被列入 [ICML 2026](https://icml.cc/virtual/2026/poster/61984)。

Lauffer 在论文中署名 UC Berkeley。他的[个人网站](https://niklaslauffer.github.io/)记录，2021 年取得 UT Austin 计算机科学与数学学士学位，随后在 Berkeley 由 Stuart Russell 和 Sanjit Seshia 指导博士研究，关注人工智能安全、强化学习与智能体。他在 2025 年于 Scale 的 Reasoning and Agents 团队及 SEAL 实习，主页明确记录了同年 9 月完成实习。

Xiang Deng 的[个人网站](https://xiang-deng.github.io/)介绍，他取得中国科学技术大学计算机科学学士学位和 Ohio State University 博士学位，博士导师为 Huan Sun，并与 Yu Su 合作；曾在 Google Labs 和 Scale 工作，研究重点包括多源知识、语言模型与实际环境中的智能体。论文没有为他单列学校或公司编号，但脚注明确了本项研究在 Scale 完成。其后创办 NeoCognition 的经历不改变本文的历史归属。

第三作者 Srivatsa Kundurthy 署名 Cornell University，同样带有在 Scale 完成工作的脚注；Brad Kenstler 和 Jeff Da 直接署名 Scale。因此，这是一项由公司团队与有高校背景的研究者共同完成的智能体训练研究。

## 1. 摘要概述

[arXiv 版本](https://arxiv.org/abs/2512.14895)采用非独占传播许可；本次未能核实可完整翻译的正式版本许可，以下为摘要概述。

论文针对多轮智能体偏离专家示范后，遇到训练未覆盖状态的问题。OEC 让学生先执行、专家中途接手，在软件修复任务中验证了这种混合轨迹的数据价值。

## 2. 研究背景与相关研究

学生可能先找错文件，随后不断遇到与专家示范不同的情况；代码环境和对话历史都会积累这种差异。经典 DAgger 让学生执行，再请专家提供纠正动作。OEC 借鉴这一思路，连接了完整专家示范与学生自身轨迹两类训练数据。[原文 §1–2](https://arxiv.org/pdf/2512.14895v1)

## 3. 核心贡献：问题、方案与结论

核心问题是如何获得贴近学生实际状态的高质量示范。OEC 在随机轮次从学生切换到较强的专家模型，保留环境和历史，让专家继续完成任务。它不依赖人工程序员实时接管。

系统筛选通过任务测试的轨迹，并排除重复行为。微调时，学生部分只作上下文，只学习专家输出。实验中，OEC 与完整专家示范混合训练优于单独使用任一类；仅通过测试的学生轨迹仍可能包含不值得学习的行为。[原文 §3–5](https://arxiv.org/pdf/2512.14895v1)

这是一种数据生成方法，并未继承 DAgger 的理论保证。证据目前限于软件工程任务，且依赖专家和成功判定；学生更新后，旧轨迹也可能逐渐不再贴近其新策略。[作者代码与模型](https://github.com/niklaslauffer/on-policy-expert-corrections)已公开。
