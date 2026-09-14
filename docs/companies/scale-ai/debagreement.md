---
title: "DEBAGREEMENT：识别在线回复中的赞同与分歧"
company: "scale-ai"
date: "2021-10-11"
dateLabel: "2021-10-11"
kind: "合作论文与数据集"
description: "保留评论、回复和互动关系，为文本与社交上下文结合的立场识别提供数据。"
reviewed: "2026-09-14"
readingStatus: "summary"
paperVersion: "NeurIPS 2021 Datasets and Benchmarks 正式论文"
---

[← Scale AI](/companies/scale-ai) · [全部工作](/research)

# DEBAGREEMENT：识别在线回复中的赞同与分歧

## 0. 作者与机构背景

**John Pougué-Biyong 与 Valentina Semenova 是共同第一作者**，均署名牛津大学。

John 当时在牛津从事博士研究，研究经历涉及网络和在线互动。牛津 INET 的校友记录将他列为博士生校友；后来任职公司的正式团队页确认了牛津博士与 Centrale Paris 教育背景。这些后来的职业信息与论文时期的大学署名需要区分。[牛津 INET 校友记录](https://www.inet.ox.ac.uk/people/alumni)、[公司团队介绍](https://kamoa.app/team-members)

Valentina 拥有牛津大学数学博士学位，研究大数据、人工智能和经济学的交叉问题，博士前曾在 Palantir 和高盛工作。牛津 INET 现有简介将她列为国际货币基金组织经济学家及 INET 关联研究人员。[牛津作者介绍](https://www.inet.ox.ac.uk/people/valentina-semenova)

Scale AI 的 Alexandre Matton、Rachel Han 和 Aerin Kim 参与共同研究。论文发表于 NeurIPS 2021 数据集与基准赛道，是 Scale 与牛津大学合作的数据集项目。[正式论文页面](https://datasets-benchmarks-proceedings.neurips.cc/paper/2021/hash/6f3ef77ac0e3619e98159e9b6febf557-Abstract-round2.html)

## 1. 摘要概述

已核实的开放许可针对数据标注，未明确覆盖论文的改编，因此本节使用概述，完整摘要见[正式论文](https://datasets-benchmarks-proceedings.neurips.cc/paper/2021/hash/6f3ef77ac0e3619e98159e9b6febf557-Abstract-round2.html)。

DEBAGREEMENT 收集五个 Reddit 讨论区的 42,894 组评论与回复，标注赞同、中立或反对，并保留作者、时间与互动关系。它包含网络讨论中常见的俚语、讽刺和话题特定表达，支持研究文本及其上下文如何帮助判断回复立场。

## 2. 研究背景与相关研究

一条回复的立场取决于它回应的内容，不能仅靠情感正负判断。既有立场数据往往只提供文本，部分社交媒体数据虽带互动信息，却依赖转发、标签等平台特征。本文希望同时保留自然讨论语言与用户互动结构。[论文 Introduction 与 Related datasets](https://datasets-benchmarks-proceedings.neurips.cc/paper/2021/file/6f3ef77ac0e3619e98159e9b6febf557-Paper-round2.pdf)

## 3. 核心贡献

### 核心要解决的问题

为在线赞同与分歧识别提供同时包含文本、回复关系和社交上下文的数据，而不仅是独立句子的标签。

### 核心方案

数据按评论—回复对组织，给出三类立场标签，同时保留能够构建互动图的信息。论文测试当时的预训练语言模型，并比较不同文本输入和讨论区之间的迁移表现，为后续结合图表示与语言模型提供基准。[论文数据与基线实验](https://datasets-benchmarks-proceedings.neurips.cc/paper/2021/file/6f3ef77ac0e3619e98159e9b6febf557-Paper-round2.pdf)

### 结论

这些在线表达仍难以准确分类，加入被回复的原评论有助于理解回复。标注本身也存在歧义：只有约 33% 的样本获得全部标注者一致判断。数据只覆盖五个讨论区，评论对也无法完整表达长对话；图与文本深度融合主要是论文提出的后续研究方向，不能写成已经验证的新模型。[论文 Limitations and Future work 与 Conclusion](https://datasets-benchmarks-proceedings.neurips.cc/paper/2021/file/6f3ef77ac0e3619e98159e9b6febf557-Paper-round2.pdf)
