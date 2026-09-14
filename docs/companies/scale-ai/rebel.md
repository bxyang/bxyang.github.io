---
title: "REBEL：用多项标准重新排序检索结果"
company: "scale-ai"
date: "2025-03-14"
dateLabel: "2025-03-14"
kind: "论文与代码"
description: "REBEL 在 RAG 的重排序环节加入深度、多样性、清晰度等标准，并按问题动态调整这些标准。"
reviewed: "2026-09-14"
readingStatus: "summary"
paperVersion: "arXiv:2504.07104v1"
---

[← 公司页面](/companies/scale-ai) · [全部工作](/research)

# REBEL：用多项标准重新排序检索结果

原文：[Relevance Isn’t All You Need: Scaling RAG Systems With Inference-Time Compute Via Multi-Criteria Reranking](https://arxiv.org/abs/2504.07104v1)，本文依据 arXiv v1。该工作发表在 [ICLR 2025 的 SCOPE Workshop](https://openreview.net/pdf?id=bl884pjXhN)。

## 0. 作者与机构背景

论文只有两位作者：第一署名 **Will LeVine** 来自 Microsoft，第二署名 **Bijan Varjavand** 来自 Scale AI。两人标为同等贡献，Will 是通讯作者。Will 的早期个人主页记载了在约翰斯·霍普金斯大学学习计算机科学及应用数学与统计的经历。2019 年该校应用物理实验室的介绍记录了他参与神经网络能力估计研究，并说明他当时一边在实验室工作，一边在印第安纳大学攻读数学学士学位。本文只采用这些有明确时间的背景，不推断完整转学或毕业路径。[早期个人主页](https://pages.jh.edu/wlevine2/)、[APL 研究介绍](https://www.jhuapl.edu/news/news-releases/191029-blackboard-scribbles-neural-network-breakthrough)

Bijan 在约翰斯·霍普金斯大学学习材料科学与工程、应用数学与统计，曾参与应用物理实验室的深度学习目标检测项目，之后取得生物医学工程硕士学位。他加入 Scale 时的本人公告介绍了提示工程工作，后续机构履历也确认其在 Scale 从事过研究工程。[JHU 背景介绍](https://engineering.jhu.edu/magazine-archive/2019/05/geese-be-gone/)、[个人履历](https://www.linkedin.com/in/bijanvarjavand)、[加入 Scale 的公告](https://www.linkedin.com/posts/bijanvarjavand_happy-to-announce-ive-started-a-new-position-activity-7275642948392771584-zxH_)

本研究的公司关系是 Microsoft 与 Scale 员工共同署名。实现代码发布在 Microsoft 的开源仓库中；REBEL 在此指 **RErank BEyond reLevance**，即在相关性之外考虑更多标准的重排序方法。[项目仓库](https://github.com/microsoft/REBEL)

## 1. 摘要内容概述

arXiv v1 采用非独占分发许可；目前未确认可完整翻译再发布的论文许可。本节因此提供内容概述，**不是逐句摘要翻译**。[原摘要与许可入口](https://arxiv.org/abs/2504.07104v1)

RAG 系统需要为回答挑选有用的资料。本文观察到，在所测流程中，单纯提高资料与问题的相关程度，有时反而降低最终回答质量。REBEL 在重排序时加入多项标准：既可以使用固定标准，也可以先根据问题生成标准，再给候选内容排序。作者的实验表明，这样能够在投入更多推理时间时，同时改善检索相关性和回答评分。

## 2. 研究背景与相关研究

RAG 通常先从文档库检索片段，再将筛选后的内容交给模型生成回答。重排序器决定哪些片段优先进入上下文。问题在于，几段高度相关但重复、含糊或不够充分的内容，未必比能够提供互补信息的材料更有用。[论文第 1 节](https://arxiv.org/html/2504.07104v1)

本文没有独立的 Related Work 章节，相关研究主要在引言、指标讨论和附录中展开。作者延续 ARAGOG 对不同 RAG 流程的比较，将检索相关程度与最终回答质量放在一起观察；同时引用最大边际相关性（MMR）、xQuAD、PM-2 等多标准或多样化检索方法，说明“相关性以外还应考虑其他因素”已有研究基础。

REBEL 的具体位置，是用语言模型和提示词实现多标准重排序，并让标准随问题变化。这里没有训练新的基础模型；额外计算用于分析问题与候选文档。作者借助信息瓶颈、多标准决策等理论解释动机，但本文结果不意味着提高相关性在所有 RAG 系统中都会损害回答。[论文第 1、3 节及附录 B](https://arxiv.org/html/2504.07104v1)

## 3. 核心贡献

**核心问题是让检索材料更好地服务于最终回答。** 重排序不只判断片段是否谈论同一个主题，还要考虑内容是否充分、表达是否明确，以及哪些额外属性对当前问题有帮助。

**核心方案有两个版本。** 单轮版本使用固定提示词，除相关性外，还检查内容深度、观点多样性、清晰与具体程度、权威性和时效性，再综合排序。两轮版本先分析用户问题，生成适合该问题的评价标准及权重，再用生成的提示词评估文档。第二种方式多一个调用阶段，用更长推理时间换取更有针对性的选择。[论文第 2 节](https://arxiv.org/html/2504.07104v1)

**主要结论是在本文的学术问答测试中，多标准重排序同时改善了两项指标。** 评测使用 423 篇 AI 论文构成文档库，以及基于其中 13 篇论文制作的 107 组问答；GPT-4o 负责生成与重排序，GPT-4 评估上下文相关程度和回答与参考答案的一致程度。与不重排序及仅按相关性排序的比较方案相比，两种 REBEL 方案表现出更好的组合结果，两轮版本进一步改善质量，但需要更多推理时间。[论文第 4—5 节](https://arxiv.org/html/2504.07104v1)

这些结果来自一个较小的领域数据集，回答质量由模型裁判评分。它们支持在该场景中使用多标准选择上下文，但尚不足以说明所有领域、模型或评价方式下都有同样收益；把安全性加入排序标准，则是论文提出的后续方向，而非已经验证的效果。[论文第 6—7 节](https://arxiv.org/html/2504.07104v1)
