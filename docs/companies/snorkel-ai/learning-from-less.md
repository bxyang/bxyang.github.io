---
title: "Learning from Less：固定训练预算下，数据数量与难度怎样影响 RLVR"
company: "snorkel-ai"
date: "2026-04-20"
dateLabel: "2026-04-20"
kind: "论文"
description: "通过三类程序生成任务，研究数据量和难度组合如何影响资源受限条件下的强化学习。"
reviewed: "2026-09-14"
readingStatus: "summary"
paperVersion: "arXiv:2604.18381v1，2026-04-20"
---

[← Snorkel AI](/companies/snorkel-ai) · [全部工作](/research)

# Learning from Less：少量数据下的可验证奖励强化学习

原论文：[Learning from Less: Measuring the Effectiveness of RLVR in Low Data and Compute Regimes](https://arxiv.org/abs/2604.18381v1)，2026 年 4 月 20 日公开，发表于 [MLSys 2026](https://proceedings.mlsys.org/paper_files/paper/2026/hash/da85790fb1cb4f11f431648455c561b5-Abstract-Conference.html)。

## 0. 作者与机构背景

第一作者 **Justin Bauer** 在论文中署名 Snorkel AI。公司介绍显示，他研究合成数据、评估与基准，此前在 Google DeepMind 和 Tesla 实习，涉及强化学习和感知研究。[公司作者介绍](https://snorkel.ai/author/justin-bauer/)

第二作者 **Thomas Walshe** 同样署名 Snorkel AI。论文脚注明确说明研究在 Snorkel AI 完成，发表时已转至 Reflection AI。他此前在牛津大学开展博士阶段研究，导师为 Andrew Simpson，涉及机器学习与网络安全。[论文首页](https://arxiv.org/pdf/2604.18381v1#page=1)与[牛津大学目录](https://www.cs.ox.ac.uk/people/thomas.walshe/)

七位作者都列有 Snorkel AI 署名，Frederic Sala 同时署名威斯康星大学麦迪逊分校。这篇论文属于公司直接参与的研究，关注在数据和算力有限时，怎样设计可验证的训练任务。Walshe 名后的星号是任职说明，不是共同第一作者标记。

## 1. 摘要概述

arXiv 版本采用[非独占分发许可](https://arxiv.org/licenses/nonexclusive-distrib/1.0/)；[MLSys 出版说明](https://mlsys.org/FAQ/Copyright)也未提供面向公众的完整译文再发布许可，以下为概述。

论文研究少量数据和有限算力下的小语言模型强化学习。作者程序化生成计数、图推理和空间推理三类任务，改变训练集规模及难度组合。实验发现，较简单任务上的训练可以迁移到更难任务；混合难度的数据在部分设置下比只使用简单题更节省样本。作者希望借助可控数据进一步研究 RLVR 的数据规律。[原摘要](https://arxiv.org/abs/2604.18381v1)

## 2. 研究背景与相关研究

可验证奖励强化学习（RLVR）通过可以明确检查的答案给模型奖励，例如数学题的数值答案。它减少了对人类偏好判断的依赖，但许多成功案例使用大量高质量题目和算力，难以直接适用于资源有限的新任务。

论文的 Related Work 区分了模型与算力扩展、强化学习数据选择、以及可验证推理三条研究路线。Kaplan、Hoffmann 等人的扩展规律主要讨论模型、数据和计算量的关系；ScaleRL 等工作关注强化学习的计算预算；LIMR 等研究则表明，少量经过选择的数据也能有效训练。本文进一步把关注点放在固定资源条件下的数据组成，尤其是题目难度的混合方式。

作者使用程序生成任务，避免只从现成数据中抽样而难以分离题型差异。生成器能够改变图规模、操作数量或空间动作序列等属性，使数据规模和组成成为可调整的研究对象。不过“简单”和“混合”设置同时改变多个属性，并非只改变单一的难度因素。[第 1—3 节](https://arxiv.org/pdf/2604.18381v1#page=1)

## 3. 核心贡献

**核心问题。** 在模型规模和训练预算受限时，增加题目数量、加入更难的题目或混合难度，分别与训练效果和迁移能力有什么关系。

**核心方案。** 作者构建三类带程序化答案的任务：对整数进行筛选、变换和计数；根据图结构解决问题；追踪空间中的动作与状态。随后主要使用 Qwen3-4B 进行 RLVR，比较不同规模的简单题训练集和混合难度训练集，并在更广的难度范围上评估。由于答案能够自动核验，实验可以在不逐题人工标注的情况下系统调整训练数据。[第 3 节](https://arxiv.org/pdf/2604.18381v1#page=3)

**结论。** 模型在较简单任务上训练后，可以在部分更复杂任务上获得改善。混合难度在计数和空间推理中表现出样本效率优势：计数任务中，100 道混合题可达到 500 道简单题相近的测试准确率，构成论文“最高五倍样本效率”的具体例子。

这一结果有资源条件。训练步数固定时，扩大数据集意味着每道题得到的训练次数减少；图推理中的大图还可能让模型在给出可解析答案前耗尽输出长度，因而得不到有效奖励。论文将结果视为数据组成、训练时长和输出预算共同作用下的经验发现，没有建立适用于所有模型和任务的数据扩展定律。[第 4—5 节](https://arxiv.org/pdf/2604.18381v1#page=8)
