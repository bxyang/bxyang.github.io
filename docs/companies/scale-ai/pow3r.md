---
title: "POW3R：根据模型当前表现调整评分项奖励"
company: "scale-ai"
date: "2026-05-19"
dateLabel: "2026-05-19"
kind: "论文"
description: "保留最终评分目标，在训练中提高能区分当前回答的评分项权重。"
reviewed: "2026-09-14"
readingStatus: "summary"
paperVersion: "arXiv:2605.20164v1，2026-05-19"
---

[← Scale AI](/companies/scale-ai) · [全部工作](/research)

# POW3R：根据模型当前表现调整评分项奖励

原论文：*Not Every Rubric Teaches Equally: Policy-Aware Rubric Rewards for RLVR*。[2026 年 5 月预印本](https://arxiv.org/abs/2605.20164v1)

## 0. 作者与机构背景

第一作者 **Utkarsh Tyagi** 和第二署名作者 **Xingang Guo（郭鑫钢）** 均署名 Scale AI，论文没有共同一作标注。Utkarsh 的个人主页记录，他于 2021 年取得德里理工大学计算机科学与工程学士学位，2023 年开始在马里兰大学攻读计算机科学硕士，在 Dinesh Manocha 和 Ramani Duraiswami 指导下研究语音、语言、音频及视频理解；此处是其教育与研究经历，不将旧主页的学生身份视为论文发表时的职位。[Utkarsh 主页](https://utkarsh4430.github.io/)、[本人职业资料](https://www.linkedin.com/in/utkarsh4430)

Xingang 的个人主页记录了阿卜杜拉国王科技大学电气与计算机工程硕士，以及在伊利诺伊大学厄巴纳—香槟分校跟随 Bin Hu 开展博士研究的经历。他于 2026 年 1 月加入 Scale 担任研究科学家，工作涉及前沿模型评测和后训练，研究方向包括大语言模型、强化学习与优化。[Xingang 主页](https://sites.google.com/view/guoxingang/home)

论文八位作者中七位来自 Scale，一位 Daniel George 来自 Persona。研究由 Scale 团队参与方法设计和训练评测，并制作内部多模态评分数据；另一套文本数据使用已有的 HealthBench。公司在本篇中的角色是后训练方法与评测研究，而不只是提供标注服务。[原文首页及第 5 节](https://arxiv.org/pdf/2605.20164v1)

## 1. 摘要概述（非逐句翻译）

该版本采用 [CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/) 许可，未确认可公开发布完整译文的授权，以下提供概述。

POW3R 研究评分清单式强化学习：某项要求即使重要，也未必能帮助模型当前的训练。作者根据同一问题下回答的差异调整训练奖励，同时保留最终评测标准。

## 2. 研究背景与相关研究

开放式回答通常需要同时满足准确、完整和遵循指令等要求。HealthBench 等研究用逐项评分处理这类任务，但固定权重未必反映每一阶段的学习需要。本文沿着评分清单奖励与多目标强化学习的路线，研究训练时怎样汇总这些分数。[原文第 1—2 节](https://arxiv.org/pdf/2605.20164v1)

## 3. 核心贡献

**核心要解决的问题。** 同一组回答若在某项标准上全部通过或全部失败，这一项就不能提供相对优劣的信息。

**核心方案。** POW3R 在类别内提高能区分当前回答的评分项权重，以人工权重为基础，保留类别平衡与最终评分目标。[原文第 4 节](https://arxiv.org/pdf/2605.20164v1)

**结论。** 在多模态与医疗文本任务中，方法取得 30 个“模型与指标”比较项中的 24 项最高分；这不是 30 次独立训练实验。达到相近训练平台的步数有所减少，但不能等同于全部计算成本同比下降。结果限于已测试模型与数据，动态调整也依赖评判模型的可靠性。[原文第 6—8 节](https://arxiv.org/pdf/2605.20164v1)
