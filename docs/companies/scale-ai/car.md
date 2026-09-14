---
title: "CAR：为街景中的物体补充属性标注"
company: "scale-ai"
date: "2021-11-16"
dateLabel: "2021-11-16"
kind: "合作论文与数据集"
description: "在 Cityscapes 上增加面向自动驾驶的分类属性体系，支持更细致的场景理解。"
reviewed: "2026-09-14"
readingStatus: "summary"
paperVersion: "arXiv:2111.08243v1，2021-11-16"
---

[← Scale AI](/companies/scale-ai) · [全部工作](/research)

# CAR：为街景中的物体补充属性标注

## 0. 作者与机构背景

第一作者 **Kareem Metwaly** 署名宾夕法尼亚州立大学，论文脚注说明工作完成于 Scale AI 实习期间。他的个人主页和简历记载，他在该校获得电气工程博士学位，研究计算机视觉、图像恢复和分析；2021 年 6 月至 12 月在 Scale 实习，参与 CAR 数据集与属性预测模型的开发。后来他于 2023 年加入三星半导体，研究图像与视频模型。[作者主页](https://kareem-metwaly.github.io/)、[个人简历](https://kareem-metwaly.github.io/KareemMetwaly.pdf)

第二作者 **Aerin Kim** 署名 Scale AI。Scale 在 2021 年的官方活动介绍中将她列为工程经理，工作涉及通过机器学习构建高质量训练数据；此前她在微软担任高级研究软件工程师，研究问答、语义解析和训练数据生成，并拥有哥伦比亚大学运筹学硕士学位。[Scale 官方作者介绍](https://learn.scale.com/public/videos/fireside-chat-with-emily-denton)

另外两位作者是 Scale 的 Elliot Branson 和宾夕法尼亚州立大学的 Vishal Monga。论文没有共同第一作者标记。CAR 是 Scale 与大学研究人员合作的数据集工作，属于公司早期的自动驾驶视觉研究。[论文首页](https://arxiv.org/pdf/2111.08243v1)

## 1. 摘要概述

原文采用 arXiv 非独占传播许可，目前核实的公开版本未提供允许改编的开放许可，因此本节使用概述，完整摘要可阅读[原文](https://arxiv.org/abs/2111.08243v1)。

CAR 为 Cityscapes 街景数据中的物体增加属性标签。它关注类别识别之外的信息，例如车辆状态、交通设施含义和行人活动，并按照物体类别设计不同的属性集合。论文介绍了超过 3.2 万个实例的标注及配套 API，目的是为自动驾驶场景中的细粒度视觉理解提供研究数据。

## 2. 研究背景与相关研究

检测出“这里有一辆车”并不能完整描述交通场景。车辆处于何种状态、交通灯显示什么信号，都可能影响后续决策。因此，类别识别与属性识别承担不同任务：前者判断物体是什么，后者描述它的具体特征与状态。

此前的视觉属性研究包括行人、车辆以及通用图像中的属性预测。通用属性数据集覆盖面广，却不一定突出驾驶场景关心的信息；针对单类物体的数据又难以形成完整的街景描述。CAR 在已有 Cityscapes 标注基础上补充属性，并为不同物体类别设计相应的属性结构。[论文 Introduction 与 Related Work](https://arxiv.org/pdf/2111.08243v1)

## 3. 核心贡献

### 核心要解决的问题

为同一街景中的多类物体建立适用的属性标注：既保留某些跨类别的共同特征，也允许不同类别拥有自己的属性集合。

### 核心方案

CAR 复用 Cityscapes 的图像和物体分割标注，增加经过组织的属性层，并提供读取和使用标注的 API。识别属性有时需要观察物体自身，有时需要结合整个场景和物体之间的关系。[论文数据集介绍](https://arxiv.org/pdf/2111.08243v1)、[官方 API](https://github.com/kareem-metwaly/CAR-API)

### 结论

论文交付的是包含 **32,729 个实例**的数据集和属性体系，并未报告自动驾驶系统在真实道路上的安全提升。其覆盖仍受 Cityscapes 现有标注限制，例如缺少分割标注的类别无法直接补充实例属性。作者将扩大数据规模和类别覆盖列为后续方向。[论文 Limitations and Future Work 与 Conclusion](https://arxiv.org/pdf/2111.08243v1)
