---
title: "SWiM：测试长上下文中的信息利用，并用多次排列选择答案"
company: "snorkel-ai"
date: "2024-07-04"
dateLabel: "2024-07-04"
kind: "论文与基准"
description: "在具体文档问答中测量上下文长度和位置影响，并通过重排文档、多次作答缓解错误。"
reviewed: "2026-09-14"
readingStatus: "summary"
paperVersion: "arXiv:2407.03651v2，2024-07-14"
---

[← Snorkel AI](/companies/snorkel-ai) · [全部工作](/research)

# SWiM：测试长上下文中的信息利用

原论文：[Evaluating Language Model Context Windows: A “Working Memory” Test and Inference-time Correction](https://arxiv.org/abs/2407.03651v2)。本文依据 2024 年 7 月 14 日的 v2。

## 0. 作者与机构背景

第一作者 **Amanda Dsouza** 在论文中署名 Snorkel AI，研究语言模型评估。加入公司前，她曾在 Jasper.ai 从事大语言模型工作，并在 Fractal.ai 带领自然语言处理和文本挖掘团队。[公司作者介绍](https://snorkel.ai/author/amanda-dsouza/)

第二作者 **Christopher Glaze** 同样署名 Snorkel AI。公司介绍确认他具有博士研究背景，工作涉及机器学习工具、数学模型、数据挖掘与应用研究；这里不依据同名资料补充未确认的学历细节。[公司作者介绍](https://snorkel.ai/author/chris-glaze/)

论文由 Snorkel AI 与威斯康星大学麦迪逊分校合作完成，Changho Shin 署名大学，Frederic Sala 同时署名两家机构。SWiM 全称为 Snorkel Working Memory Test，代码也发布在公司的 GitHub 组织下，因此是公司直接参与的评测研究。[原文首页](https://arxiv.org/pdf/2407.03651v2#page=1)

## 1. 摘要概述

原文采用[非独占分发许可](https://arxiv.org/licenses/nonexclusive-distrib/1.0/)，未确认完整译文的再发布授权，以下为概述。

论文提出 SWiM，用特定文档和任务检验语言模型是否真正利用了长上下文。对八个模型的测试发现，答案信息处于上下文中间时，部分强模型仍明显退化。作者进一步提出 medoid voting：多次打乱文档顺序并作答，再从答案中选出与其他答案最相近的一条，以缓解位置带来的影响。[原摘要](https://arxiv.org/abs/2407.03651v2)

## 2. 研究背景与相关研究

能够接收很长的输入，不等于能够稳定使用其中的所有信息。企业文档问答不仅需要找到某个字符串，还需要理解问题与文档之间的关系；答案所在的位置和无关文档的数量都会影响结果。

常见的“大海捞针”测试将一条特定信息插入长文本，检查模型能否找回。论文指出，这种人工插入的信息与背景内容往往关系较弱，任务也比真实文档问答简单。Related Work 还介绍了 RULER、LongBench、Long Range Arena 和 ∞Bench，它们扩展了任务范围或上下文长度，但固定数据和任务未必对应某个具体应用。

SWiM 因此提供可定制的评测流程：从用户关心的文档出发构造问答，检查模型在不同位置与干扰条件下的表现。它延续了“Lost in the Middle”对位置敏感性的研究，将其转化为面向具体文档的测试方法。[第 1、5 节](https://arxiv.org/pdf/2407.03651v2#page=1)

## 3. 核心贡献

**核心问题。** 对目标文档问答任务，区分模型标称支持的上下文长度与实际能够可靠利用的上下文，并尝试在不重新训练模型的情况下减少位置影响。

**核心方案。** SWiM 包括任务生成、人工参与的验证、模型作答和答案评估。它先生成文档问答，再控制包含答案的文档位置，或逐步增加不包含答案的干扰文档，观察表现如何变化。验证环节很重要，因为自动生成的问题、参考答案和模型裁判都可能出错。

为缓解中间位置的退化，medoid voting 多次随机重排同一组文档，每次生成答案，再将答案转换为向量，选出与其余答案整体最相近的那一条。它选择已有答案，不是把多个答案拼接为新文本，也不需要更新模型参数，但需要额外的推理调用。[第 2—3 节](https://arxiv.org/pdf/2407.03651v2#page=2)

**结论。** 论文在 Cosmopedia 合成故事上构造单文档问答，将其他故事作为干扰，对八个模型的测试显示：干扰增加和答案处于中间位置都会使部分模型退化。重排后投票在 GPT-4-Turbo 和 GPT-3.5-Turbo-16k 上分别带来约 17.3 和 24.2 个准确率百分点的提升，少至三次作答已有帮助。结果来自这组问答和模型设置，尚不能代表多文档综合推理、专业文档分析或引用生成等更复杂场景；论文也将这些列为后续研究方向。[第 4、6 节](https://arxiv.org/pdf/2407.03651v2#page=5)
