---
title: "CLIP 零样本校准：让置信度更接近实际表现"
company: "scale-ai"
date: "2023-03-11"
dateLabel: "2023-03-11"
kind: "论文"
description: "通过辅助数据学习温度参数，在新类别和新提示上改善 CLIP 的置信度校准。"
reviewed: "2026-09-14"
readingStatus: "summary"
paperVersion: "arXiv:2303.12748v4，2023-04-18；ICLR 2023 workshop"
---

[← Scale AI](/companies/scale-ai) · [全部工作](/research)

# CLIP 零样本校准：让置信度更接近实际表现

## 0. 作者与机构背景

前两位作者 **Will LeVine 与 Benjamin Pikus 是共同第一作者**。两人以及另外两位作者 Pranav Raja、Fernando Amat Gil 在论文中均署名 Scale AI。这是一篇 ICLR 2023 工作坊论文。

Will 在约翰斯·霍普金斯大学的早期个人资料中介绍过计算机科学、应用数学与统计等学习背景，以及图像分析研究经历。学校应用物理实验室的报道也介绍了他参与模型能力评估的研究。这里使用的是与研究相关的历史背景，不能把旧个人简历中的在读状态当作现职。[早期个人简历](https://pages.jh.edu/wlevine2/assets/CV.pdf)、[学校实验室报道](https://www.jhuapl.edu/news/news-releases/191029-blackboard-scribbles-neural-network-breakthrough)

Benjamin 的本人职业资料列出约翰斯·霍普金斯大学教育背景。该校医学机构在 2017 年的报道中介绍，他参与 MoTrack Therapy 项目，使用计算机视觉跟踪手部运动、支持居家康复训练。目前核实的材料不足以确定具体学位，因此不在此推断。[本人职业资料](https://www.linkedin.com/in/benjamin-pikus)、[学校项目报道](https://www.hopkinsmedicine.org/news/articles/2017/08/johns-hopkins-startup-developing-at-home-rehabilitation-game)

## 1. 摘要概述

arXiv v4 使用非独占传播许可；正式工作坊页面的许可信息暂未核实，因此本节使用概述，完整摘要见[原文](https://arxiv.org/abs/2303.12748v4)。

论文考察 CLIP 在零样本分类中的置信度是否可靠，并研究提示、数据集和模型结构带来的变化。作者使用辅助数据学习一个温度参数，再将其用于同一个 CLIP 模型的不同下游任务，以减少目标任务额外标注的需求。

## 2. 研究背景与相关研究

校准关注模型有多确定与它实际有多准确是否相符。它不同于分类准确率：模型可以预测正确，但对自身表现过于自信。

传统分类校准通常使用目标任务的验证数据。CLIP 则允许用户在推理时通过文本定义类别，零样本应用不一定拥有该任务的标注数据。论文的背景与预备知识部分据此比较了常规温度缩放和视觉语言模型的使用方式，指出目标任务专属校准与零样本应用之间的矛盾。[论文 Introduction 与 Preliminaries](https://arxiv.org/pdf/2303.12748v4)

## 3. 核心贡献

### 核心要解决的问题

在不为每个目标数据集重新准备标注和拟合参数的条件下，改善 CLIP 的预测置信度。

### 核心方案

作者提出 Zero-Shot-Enabled Temperature Scaling：在辅助数据集上学习温度参数，再用于新数据集和新文本提示。参数与具体的模型结构、预训练数据组合对应，并非所有 CLIP 模型共用一个数值。“零样本”指目标任务不再需要训练或校准，不代表整个方法没有使用标注数据。[论文方法](https://arxiv.org/pdf/2303.12748v4)

### 结论

在受测配置中，该方法改善了未经校准的 CLIP，但仍不及使用目标任务数据进行监督校准的效果。研究支持辅助校准参数在测试范围内的迁移能力，没有证明任意新分布都能获得可靠置信度，也不意味着分类准确率随之提高。[论文 Results 与 Conclusion and Future Work](https://arxiv.org/pdf/2303.12748v4)
