---
title: "FORTRESS：同时评估风险回答与过度拒绝"
company: "scale-ai"
date: "2025-06-17"
dateLabel: "2025-06-17"
kind: "论文与基准"
description: "以成对的风险和正常请求，观察模型防护在国家安全与公共安全领域的表现。"
reviewed: "2026-09-14"
readingStatus: "summary"
paperVersion: "arXiv:2506.14922v2，2025-06-24"
---

[← Scale AI](/companies/scale-ai) · [全部工作](/research)

# FORTRESS：同时评估风险回答与过度拒绝

## 0. 作者与机构背景

第一位作者 **Christina Q. Knight** 被标为项目负责人；第二、第三位作者 **Kaustubh Deshpande 与 Ved Sirdeshmukh** 被标为同等贡献。不能把这组标记统一解释成前三位共同第一作者。全体作者及 Scale Red Team、SEAL Research Team 均署名 Scale AI。[论文首页](https://arxiv.org/pdf/2506.14922v2)

Christina 的公开作者介绍记载，她曾在美国商务部和美国 AI Safety Institute 工作，拥有斯坦福大学符号系统学士及哲学硕士背景，研究经历涉及人工智能与公共政策。[作者介绍](https://www.lawfaremedia.org/contributors/cknight)、[斯坦福资料](https://globalscholarships.stanford.edu/people/christina-knight)

Kaustubh 在 Scale 从事后训练研究；他的个人主页确认，2021 年在加州大学戴维斯分校获得生物医学工程学士学位、辅修计算机科学，2023 年在 UCLA 获得应用统计学硕士学位。Ved 的本人资料列出 BITS Pilani 教育背景，曾参与 Scale 模型评估工作，后来的任职信息为 Labelbox。[Kaustubh 个人主页](https://kaus0399.github.io/)、[Ved 本人资料](https://www.linkedin.com/in/ved-sirdeshmukh)

## 1. 摘要概述

论文采用 [CC BY-NC-ND 4.0 许可](https://arxiv.org/abs/2506.14922v2)，不允许分发改编，因此本节使用概述，完整摘要见原文。

FORTRESS 将高风险请求与对应的正常请求配对，并用逐题评分细则同时衡量风险回答和过度拒绝。公开集包含 500 个风险请求，覆盖国家安全与公共安全相关的三大领域。模型之间呈现不同的防护与可用性取舍。

## 2. 研究背景与相关研究

相关领域具有双重用途，拒绝更多请求可能降低风险，也可能妨碍正常用户获得帮助。既有安全训练、过滤器与红队评估分别解决其中一部分问题，FORTRESS 将风险回答和正常用途被阻止放在同一框架中观察。[论文 Introduction 与 Related Work](https://arxiv.org/pdf/2506.14922v2)

## 3. 核心贡献

### 核心要解决的问题

在专业风险领域同时衡量模型防护的有效性与正常用途的可用性。

### 核心方案

公开集提供 500 个对抗请求、500 个正常版本及逐题细则。风险响应和正常请求的拒绝分别计分，避免将“拒绝更多”直接当作全面改善。[论文设计与评估](https://arxiv.org/pdf/2506.14922v2)

### 结论

受测模型在两类指标上存在不同取舍，单一安全分数不足以概括表现。这些指标描述特定静态单轮任务中的响应，不是现实危害发生率；有限的题量、专家覆盖和单轮设置也限制了结论范围。[论文结果与 Limitations](https://arxiv.org/pdf/2506.14922v2)
