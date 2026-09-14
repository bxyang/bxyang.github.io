---
title: "WMDP：用知识测验评估机器遗忘"
company: "scale-ai"
date: "2024-03-05"
dateLabel: "2024-03-05"
kind: "合作基准"
description: "建立危险知识的公开代理测验，并研究减少相关知识时如何保留一般能力。"
reviewed: "2026-09-14"
readingStatus: "summary"
paperVersion: "ICML 2024 正式版，PMLR 235:28525–28550，26 页"
---

[← Scale AI](/companies/scale-ai) · [全部工作](/research)

# WMDP：用知识测验评估机器遗忘

原文：[The WMDP Benchmark: Measuring and Reducing Malicious Use with Unlearning](https://proceedings.mlr.press/v235/li24bc.html)，本文依据 ICML 2024 正式论文，目录日期保留预印本首次发布的 2024 年 3 月 5 日。

## 0. 作者与机构背景

**Nathaniel Li 与 Alexander Pan 是共同第一作者**。Li 同时署名 Center for AI Safety（CAIS，AI 安全中心）和加州大学伯克利分校，Pan 署名伯克利。前两位作者在这篇论文中都不是以 Scale 员工身份署名。

Li 具有伯克利电气工程与计算机科学教育背景，在本研究中参与危险知识评测与机器遗忘。他的公开履历没有明确列出所获具体学位，因此不作推断。其后来在模型安全评测方面的任职与本文时期的 CAIS、伯克利身份需分开理解。[本人履历](https://www.linkedin.com/in/nli0)

Pan 在伯克利完成计算机科学博士研究，导师为 Jacob Steinhardt，此前在加州理工学院学习数学与计算机科学。他的研究涉及奖励设定偏差、模型对齐与滥用风险；个人主页现列出的 xAI 安全团队任职是之后的经历。[个人主页](https://aypan17.github.io/)

WMDP 汇集 CAIS、Scale、MIT、SecureBio 及多所大学的研究者。Scale 的共同作者包括 Summer Yue、Daniel Berrios 和 Alexandr Wang 等，因此公司直接参与了这项研究。论文所研究的机器遗忘，是调整模型使特定知识更难被调用；它与公司参与的模型风险评测工作相关。[正式论文首页](https://raw.githubusercontent.com/mlresearch/v235/main/assets/li24bc/li24bc.pdf)

## 1. 摘要翻译

以下完整翻译 Nathaniel Li 等发表于 ICML 2024 的[论文摘要](https://proceedings.mlr.press/v235/li24bc.html)。正式出版版本依据 [PMLR 出版协议](https://proceedings.mlr.press/pmlr-license-agreement.pdf)采用 CC BY 4.0 许可。

白宫关于人工智能的行政命令强调了大语言模型帮助恶意行为者开发生物、网络和化学武器的风险。为衡量这些风险，政府机构和主要 AI 实验室正在开发针对大语言模型危险能力的评估。然而，现有评估不公开，且只覆盖少数恶意使用场景，这限制了减少恶意使用的进一步研究。

为填补这些空缺，我们发布大规模杀伤性武器代理评测基准（Weapons of Mass Destruction Proxy，WMDP）。这一数据集包含 3,668 道选择题，用于间接衡量生物安全、网络安全和化学安全领域的危险知识。

为引导机器遗忘研究的进展，我们开发了 RMU，一种基于控制模型表征的先进遗忘方法。RMU 降低了模型在 WMDP 上的表现，同时保留了生物学和计算机科学等领域的一般能力，说明机器遗忘可能成为减少大语言模型恶意使用的一条具体路径。我们在 [wmdp.ai](https://wmdp.ai) 公开发布基准与代码。

## 2. 研究背景与相关研究

语言模型掌握的知识可能同时用于正常研究和恶意活动。研究者需要评估危险知识的可获取程度，也需要判断安全干预是否损害正常用途。仅记录模型是否拒绝一次请求，难以回答模型还保留多少相关知识。

论文第 2 节回顾了三类工作。第一类是危险能力评测，其中不少测试由模型实验室内部开展，公开研究难以比较。第二类是拒绝训练、输入过滤和训练数据筛选，它们从行为或数据入口降低风险。第三类是机器遗忘，早期主要服务于隐私保护，删除指定样本、事实或概念。

WMDP 把机器遗忘的评估对象扩展到特定领域知识，并提供公开测试集。其设计目标是在减少危险知识的同时，保留日常教育、科研和防御工作所需的能力。它以知识题提供可重复测量的信号，作为更完整风险评估的一部分。[论文第 1—2 节](https://raw.githubusercontent.com/mlresearch/v235/main/assets/li24bc/li24bc.pdf)

## 3. 核心贡献

**核心问题。** 建立可公开使用的危险知识测验，并检验一种遗忘方法能否降低相关题目的作答能力，同时尽量保留一般知识与对话能力。

**核心方案。** 作者组织领域专家编写 3,668 道四选一问题，覆盖生物、网络和化学三个方向，并筛除不适合公开的敏感内容。题目测量的是与危险能力相关的知识基础，因此称为“代理评测”，并不直接测量现实中的完整行动能力。

论文同时提出 **Representation Misdirection for Unlearning（RMU）**。它在训练时改变模型处理待遗忘内容的内部表征，并约束模型在普通文本上的表征尽量保持原样。两种目标共同作用，减少特定知识的可调用性，而不让模型的所有回答能力一起下降。主要遗忘实验覆盖生物和网络方向，化学部分用于提供基准，并未在本文中进行同样的遗忘实验。[论文第 3—5 节](https://raw.githubusercontent.com/mlresearch/v235/main/assets/li24bc/li24bc.pdf)

**主要结论。** 以 Zephyr-7B 为例，RMU 将生物部分的准确率从 63.7% 降到 31.2%，网络部分从 44.0% 降到 28.2%，接近四选一随机作答的 25%。与此同时，MMLU 总分从 58.1% 变为 57.1%。在论文测试的模型和对照方法中，RMU 较好地兼顾了这两项目标。[论文表 1](https://raw.githubusercontent.com/mlresearch/v235/main/assets/li24bc/li24bc.pdf)

不过，总分保留并不表示所有邻近领域都不受影响。作者观察到病毒学、计算机安全等相关课程能力下降，说明遗忘的范围还不够精确。低 WMDP 分数也不能证明知识已永久消失：选择题不覆盖完整交互风险，公开权重模型还可能重新学习被削弱的知识。论文因此将 WMDP 定位为一项测量工具，并把更精确、稳健的遗忘方法留作后续研究。[论文结论与附录 D.1](https://raw.githubusercontent.com/mlresearch/v235/main/assets/li24bc/li24bc.pdf)
