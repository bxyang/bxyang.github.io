---
title: "多模态候选人评估：结合简历与面试表现预测就业结果"
company: "micro1"
date: "2025-09-22"
dateLabel: "2025-09-22"
kind: "论文"
description: "介绍作者背景、简历筛选的研究脉络，以及 AI Match Score 与后续就业之间的关系。"
reviewed: "2026-09-14"
readingStatus: "summary"
paperVersion: "ResearchGate 作者上传全文，2025-09-25，14 页网页转写；PDF 下载受限"
---

[← micro1](/companies/micro1) · [全部工作](/research)

# 多模态候选人评估：结合简历与面试表现预测就业结果

原文：[Uncovering Candidate Potential with Multi-Modal AI Assessments](https://www.researchgate.net/publication/395809850_Uncovering_Candidate_Potential_with_Multi-Modal_AI_Assessments)。本文依据 Nima Yazdani 上传的全文转写，原 PDF 下载入口仍不可用。

## 0. 作者与机构背景

论文只有两位作者：**Rumi Allbert** 署名 micro1，**Nima Yazdani** 署名南加州大学（USC）与 micro1，没有共同第一作者标记。两人也共同撰写了公司的语音面试组件比较论文。

Rumi 具有数据科学与人文学科背景。Wolfram Institute 的介绍记录了其数据科学学士、人文学科硕士教育，以及语言模型行为和 AI 安全研究；Ralston College 的 2024 年报道确认他在该校取得人文学科硕士，并参加 Wolfram Summer School。[Wolfram Institute](https://wolframinstitute.org/people/rumi-albert) · [Ralston College](https://www.ralston.ac/news/ralston-college-graduate-accepts-to-prestigious-wolfram-summer-school)

Nima 在 USC 的早期研究涉及计算机科学与多媒体系统。2025 年 11 月校方介绍说明，他具有加州大学圣地亚哥分校数据科学学位，已从 USC 博士项目休学，在 micro1 负责 AI 研究与产品工作。该后续履历与论文发表时的机构署名分别记录。[USC 研究报道](https://viterbischool.usc.edu/news/2024/02/international-conference-on-holodecks-five-key-takeaways/) · [USC 活动介绍](https://calendar.usc.edu/event/trojan-talk-with-micro1-information-session)

研究直接评估 micro1 使用的候选人评分系统，公司同时在[研究页面](https://www.micro1.ai/research/uncovering-candidate-potential-with-multi-modal-ai-assessments)介绍了结果。

## 1. 摘要概述

作者上传版本未注明允许完整翻译的开放许可，以下是概述，不是逐句译文。

论文比较简历评分与结合面试表现的综合评分，研究它们与后续就业的关系。综合评分在所用数据中表现更好，两种分数的相关程度较低。[原摘要](https://www.researchgate.net/publication/395809850_Uncovering_Candidate_Potential_with_Multi-Modal_AI_Assessments)

## 2. 研究背景与相关研究

简历是能力的间接信号。Related Work 讨论人工筛选的主观性、履历信息的预测效度，以及自动评分中的偏差；还引用“招聘即探索”的思路，指出只寻找类似既往录用者的人可能遗漏其他人才。本文转而加入候选人的实际表现，但没有据此证明公平性已经改善。[原文第 1—2 节](https://www.researchgate.net/publication/395809850_Uncovering_Candidate_Potential_with_Multi-Modal_AI_Assessments)

## 3. 核心贡献

**核心问题。** 在简历之外加入面试信息，能否更好地区分后来就业与未观察到就业的候选人。

**核心方案。** 800 位候选人分别获得外部简历评分和 AI Match Score。后者结合简历、结构化面试、现场题目与岗位要求。招聘人员查看 LinkedIn 更新，核验候选人是否在观察期内开始相关工作，再比较两种评分的区分能力。[公司研究介绍](https://www.micro1.ai/research/uncovering-candidate-potential-with-multi-modal-ai-assessments)

**主要结论。** AI Match Score 的 AUC 为 0.742，简历评分为 0.641；两种评分的相关系数为 0.19。这里的 AUC 衡量排序区分能力，不能写成“74.2% 的招聘决定正确”。[公司结果说明](https://www.micro1.ai/research/uncovering-candidate-potential-with-multi-modal-ai-assessments)

这是观察研究，预测目标是公开履历中的就业变化，而非入职后的工作表现。论文将长期工作表现、跨行业验证与公平性评估列为后续方向。[原文第 5—6 节](https://www.researchgate.net/publication/395809850_Uncovering_Candidate_Potential_with_Multi-Modal_AI_Assessments)
