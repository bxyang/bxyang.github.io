---
title: "语音面试系统：比较转写、语言模型与语音合成的组合"
company: "micro1"
date: "2025-07-29"
dateLabel: "2025-07-29 · 8 月修订论文"
kind: "论文"
description: "比较 Zara 五种生产配置，并分析自动质量评分与候选人体验之间的关系。"
readingStatus: "summary"
reviewed: "2026-09-14"
paperVersion: "arXiv:2507.16835v2，2025-08-21"
---

[← micro1](/companies/micro1) · [全部工作](/research)

# 语音面试系统：比较转写、语言模型与语音合成的组合

原文：[Evaluating Speech-to-Text × LLM × Text-to-Speech Combinations for AI Interview Systems](https://arxiv.org/abs/2507.16835v2)。本文依据 2025 年 8 月 21 日的 v2，保留公司研究页面的 7 月 29 日作为时间线日期。

## 0. 作者与机构背景

第一作者 **Rumi Allbert** 署名 micro1，第二作者 **Nima Yazdani** 署名南加州大学（USC）与 micro1，没有共同第一作者标注。另有 Ali Ansari、Aruj Mahajan 具有 micro1 署名，团队还包括斯坦福大学研究者。研究使用公司 Zara 系统的实际面试记录，属于公司直接参与的产品评估。[论文首页](https://arxiv.org/pdf/2507.16835v2)

Rumi 具有数据科学与人文学科交叉背景。Wolfram Institute 的机构介绍记录了其数据科学学士、人文学科硕士教育，以及语言模型行为和 AI 安全方面的研究兴趣；Ralston College 的 2024 年报道确认了他在该校取得人文学科硕士并参加 Wolfram Summer School 的经历。这些资料补充其研究背景，本文发表时的公司身份以论文署名为准。[Wolfram Institute 介绍](https://wolframinstitute.org/people/rumi-albert) · [Ralston College 报道](https://www.ralston.ac/news/ralston-college-graduate-accepts-to-prestigious-wolfram-summer-school)

Nima 此前在 USC 攻读计算机科学博士，研究涉及多媒体系统。USC 后来在 2025 年 11 月介绍，他具有加州大学圣地亚哥分校的数据科学学位，已从博士项目休学，在 micro1 负责 AI 研究与产品工作。他也是介绍 Zara 候选人反馈系统的论文第一作者。[USC 研究报道](https://viterbischool.usc.edu/news/2024/02/international-conference-on-holodecks-five-key-takeaways/) · [USC 活动介绍](https://calendar.usc.edu/event/trojan-talk-with-micro1-information-session)

## 1. 摘要翻译

以下完整翻译 [v2 摘要](https://arxiv.org/abs/2507.16835v2)。原文由 Rumi Allbert 等六位作者撰写，采用 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)；中文为翻译版本。

基于语音的对话式 AI 系统越来越依赖将语音转文字（STT）、大语言模型（LLM）和文字转语音（TTS）组件组合起来的级联架构。我们使用从超过 30 万次 AI 求职面试中抽样得到的数据，对 STT × LLM × TTS 组合进行了大规模实证比较。我们采用以大语言模型作为裁判的自动评估框架，评估对话质量、技术准确性和技能评估能力。

对五种生产配置的分析表明，Google STT、GPT-4.1 和 Cartesia TTS 的组合，在客观质量指标和用户满意度评分上均优于其他方案。出乎意料的是，我们发现客观质量指标与用户满意度评分的相关性较弱，这表明语音 AI 系统的用户体验还取决于技术表现以外的因素。我们的发现为多模态对话中的组件选择提供了实践参考，并提出了一种经过验证的人机交互评估方法。

## 2. 研究背景与相关研究

语音面试由连续的处理环节组成：先转写候选人的回答，再由语言模型决定如何追问，最后将问题合成为语音。每个组件都可以单独优化，但最终体验由整条流程共同形成。本文关注这些组件放进真实产品后，不同组合的表现是否一致，以及模型打出的质量分能否反映候选人的体验。

Related Work 首先比较两类架构。AudioGPT 将现成语音模块与语言模型组合；SpeechGPT 等工作直接处理语音 token，探索更统一的语音对话模型。另一些研究处理同时听与说、异步执行和打断，以改善实时交互。

评估方面，ESPnet-SDS 为不同语音组件提供统一接口，便于开展受控比较。本文选择的补充方向是分析生产数据：在实际面试场景中比较不同组件组合，并将自动质量评分与用户反馈放在一起观察。它没有直接比较级联架构与端到端架构的优劣。[论文第 1—2 节](https://arxiv.org/pdf/2507.16835v2)

## 3. 核心贡献

**核心问题。** 不同语音组件组合如何影响面试内容与候选人体验，以及自动评分能在多大程度上代表真实用户感受。

**核心方案。** 作者从 Zara 的生产记录中抽取超过 5,000 次面试，比较五种配置。系统每轮根据转写内容、历史对话和岗位技能生成后续问题，再合成为语音。评估使用 Claude 3.5 Sonnet 阅读面试转录，判断对话衔接、提问质量和技能评估是否符合记录，同时收集候选人的五分制体验评分。[论文第 3 节](https://arxiv.org/pdf/2507.16835v2)

**主要结论。** Google STT、GPT-4.1、Cartesia TTS 组合的平均对话质量、技术问题质量和用户体验评分最高，体验均值为 4.53/5；但其技能评估一致性分数并非最高。因此，摘要中整体领先的表述不应扩展为每个指标都领先。

多数自动质量指标与用户评分的相关系数低于 0.11，说明在这些记录中，自动评分很难代替用户体验反馈。论文据此建议同时保留两类评估。[论文第 4 节](https://arxiv.org/pdf/2507.16835v2)

各配置在不重叠的时段部署，候选人和岗位也可能随时间变化；五种配置又没有覆盖所有组件组合。因此，结果是这些生产样本中的比较，不能单独确定某一个组件造成了多少改善。本文的自动评分主要依据文本，也未直接测量完整音频的声学体验。[论文第 5 节](https://arxiv.org/pdf/2507.16835v2)
