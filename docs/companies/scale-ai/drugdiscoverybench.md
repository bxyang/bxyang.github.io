---
title: "DrugDiscoveryBench：评估早期药物研究中的计算工作流"
company: "scale-ai"
date: "2026-06-30"
dateLabel: "2026-06-30"
kind: "合作基准"
description: "使用专家编写的可验证任务，测试编码智能体获取资料、处理数据和持续遵守研究约束的能力。"
reviewed: "2026-09-14"
readingStatus: "summary"
paperVersion: "Scale Labs 27 页预印本，本地下载快照"
---

[← Scale AI](/companies/scale-ai) · [全部工作](/research)

# DrugDiscoveryBench：评估早期药物研究中的计算工作流

## 0. 作者与机构背景

**Afra Feyza Akyürek 与 Xinming Tu 是共同第一作者**，分别署名 Scale AI 和 Phylo。

Feyza 在 Scale 担任研究科学家，研究语言模型后训练、评估，以及专业和科学领域的人类数据。她在波士顿大学获得计算机科学博士学位，导师为 Derry Wijaya，本科在 Koç University 学习计算机工程和工业工程。[作者主页](https://feyzaakyurek.github.io/)

Xinming 的个人简历记载，他于 2026 年 4 月加入 Phylo，担任技术人员；此前在北京大学学习生物科学和计算机科学，自 2021 年起在华盛顿大学攻读计算机科学与计算分子生物学博士，并有 Genentech 和微软亚洲研究院的研究经历。[个人简历](https://xinmingtu.cn/cv/)

论文由 Scale 与生物医学 AI 公司 Phylo 合作，另一位 Phylo 作者为 Yuanhao Qu，其余作者署名 Scale。研究使用由 Biomni 改造的工具环境，将两家公司的专家任务与生物医学智能体研究结合起来。[论文首页](https://static.scale.com/uploads/6691558a94899f2f65a87a75/DrugDiscoveryBench.pdf)

## 1. 摘要概述

目前核实的 MIT 许可针对代码仓库，未明确覆盖独立发布的论文 PDF，因此本节使用概述。完整摘要见[原文](https://static.scale.com/uploads/6691558a94899f2f65a87a75/DrugDiscoveryBench.pdf)。

DrugDiscoveryBench 将早期药物研究中的资料检索和计算分析整理成 82 个专家任务，让编码智能体调用生物医学工具完成。研究比较不同模型及运行框架，发现独立完成整套工作流仍有困难，而提供专家方法提示能帮助解决一部分失败任务。

## 2. 研究背景与相关研究

科学工作不仅需要知识，还需要找到正确资料、执行计算并在多步操作中保持约束。本文承接执行型智能体基准，以及科学、机器学习和生物医学智能体研究，将评估范围集中到早期药物研究的计算与信息检索环节。[论文 Introduction 与 Related Work](https://static.scale.com/uploads/6691558a94899f2f65a87a75/DrugDiscoveryBench.pdf)

## 3. 核心贡献

### 核心要解决的问题

评估通用编码智能体在专业工具环境中持续完成药物研究计算任务的可靠性。

### 核心方案

专家根据论文、专利和数据库记录编写可验证任务，智能体通过代码和工具处理资料，再按专家细则评估结果。研究同时改变推理投入，并对未解决任务提供专家方法提示，以观察规划与执行中的困难。[论文方法](https://static.scale.com/uploads/6691558a94899f2f65a87a75/DrugDiscoveryBench.pdf)

### 结论

论文最佳配置的平均通过率为 51.6%；提供专家方法后，多个智能体的联合可解覆盖达到 80/82。后者不是单个模型的通过率，不能与前者作为同一曲线比较。基准不包含完整药物开发流程或临床有效性验证；外部数据库变化、评分判断和工具环境差异也会影响结果。[论文结果与 Discussion and Limitations](https://static.scale.com/uploads/6691558a94899f2f65a87a75/DrugDiscoveryBench.pdf)
