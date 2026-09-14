---
title: "GlideNet：结合场景与物体信息预测属性"
company: "scale-ai"
date: "2022-03-07"
dateLabel: "2022-03-07"
kind: "合作论文与模型"
description: "通过全局、局部和物体自身三类特征，处理不同类别的视觉属性识别。"
reviewed: "2026-09-14"
readingStatus: "summary"
paperVersion: "arXiv:2203.03079v2，2022-03-14；CVPR 2022"
---

[← Scale AI](/companies/scale-ai) · [全部工作](/research)

# GlideNet：结合场景与物体信息预测属性

## 0. 作者与机构背景

第一作者 **Kareem Metwaly** 署名宾夕法尼亚州立大学，第二作者 **Aerin Kim** 署名 Scale AI。论文没有共同第一作者标记。

Kareem 在宾夕法尼亚州立大学获得电气工程博士学位，研究计算机视觉与图像分析。他的个人主页和简历说明，2021 年在 Scale 实习时同时参与属性数据集和预测模型研究，后者发表于 CVPR 2022。[作者主页](https://kareem-metwaly.github.io/)、[个人简历](https://kareem-metwaly.github.io/KareemMetwaly.pdf)

Aerin 在 Scale 当时的官方介绍中担任工程经理，工作涉及训练数据与机器学习；此前在微软研究问答、语义解析和训练数据生成，拥有哥伦比亚大学运筹学硕士学位。[Scale 作者介绍](https://learn.scale.com/public/videos/fireside-chat-with-emily-denton)

另两位作者为 Scale 的 Elliot Branson 和宾夕法尼亚州立大学的 Vishal Monga。GlideNet 与同团队的 CAR 数据集相互关联，但它是一篇独立的预测模型论文，发表于 CVPR 2022 主会。[正式论文](https://openaccess.thecvf.com/content/CVPR2022/papers/Metwaly_GlideNet_Global_Local_and_Intrinsic_Based_Dense_Embedding_NETwork_for_CVPR_2022_paper.pdf)

## 1. 摘要概述

arXiv 版本为非独占传播许可，已找到的正式版本未核实到允许改编的许可，因此本节使用概述，完整摘要见[原文](https://arxiv.org/abs/2203.03079v2)。

GlideNet 研究多类物体的属性预测。模型组合整个场景、物体附近区域和物体自身的信息，并根据类别选择相关特征与输出属性。论文在 VAW 和 CAR 上评估这一结构，重点关注小物体及需要场景上下文的属性。

## 2. 研究背景与相关研究

物体类别不能完整说明它的状态。同样属于车辆的物体，可能具有不同方向或活动状态；不同类别又需要不同属性集合。已有属性识别常聚焦单一类别或通用标签，GlideNet 将类别差异和多尺度信息一起建模。[论文 Introduction 与 Related Work](https://arxiv.org/pdf/2203.03079v2)

## 3. 核心贡献

### 核心要解决的问题

在多类别属性任务中，同时利用场景关系与物体细节，并减少背景对像素占比很小的物体的干扰。

### 核心方案

模型设置全局、局部和物体自身三个特征分支，使用物体掩码及类别表示控制信息组合。最终预测按类别输出相应属性，避免要求所有类别共享完全相同的标签集合。[论文方法](https://arxiv.org/pdf/2203.03079v2)

### 结论

受测数据集上的结果支持三类特征联合使用，训练数据减少时也显示出较稳健的表现。这些证据针对已知属性体系和给定物体信息的视觉任务，不代表模型已经具备开放类别理解能力，也不是自动驾驶安全效果的直接验证。[论文结果与 Conclusion](https://arxiv.org/pdf/2203.03079v2)
