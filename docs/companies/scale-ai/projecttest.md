---
title: "MultiFileTest：跨文件单元测试生成与错误修复"
company: "scale-ai"
date: "2025-02-10"
dateLabel: "2025-02-10"
kind: "合作论文与基准"
description: "研究模型能否理解项目依赖，生成可执行测试，并依据错误反馈改善测试。"
reviewed: "2026-09-14"
readingStatus: "summary"
paperVersion: "Findings of ACL 2026 正式版，22 页"
---

[← Scale AI](/companies/scale-ai) · [全部工作](/research)

# MultiFileTest：跨文件单元测试生成与错误修复

原文：[MultiFileTest: A Multi-File-Level LLM Unit Test Generation Benchmark and Impact of Error Fixing Mechanisms](https://aclanthology.org/2026.findings-acl.1403/)，本文依据 Findings of ACL 2026 正式版。早期预印本名为 ProjectTest，页面地址和首次发布日期继续保留。

## 0. 作者与机构背景

第一作者 **Yibo Wang** 署名伊利诺伊大学芝加哥分校（UIC），第二作者 **Congying Xia** 以独立研究者身份署名，二人没有共同第一作者标记。Scale AI 的参与者是共同作者 Chen Xing，团队还包括 UIC 与 Salesforce Research 的研究人员。[正式论文首页](https://aclanthology.org/2026.findings-acl.1403.pdf)

Yibo 在 UIC 攻读博士，导师为 Philip S. Yu，研究可信语言模型和自动测试生成。他于 2021 年获得埃默里大学计算机科学硕士学位，2019 年获得山东大学数学学士学位。[个人主页](https://yibowang214.github.io/)

Congying 于 2022 年春季获得 UIC 博士学位，导师为 Philip Yu，博士论文研究对话智能体的自然语言理解。学校校友名录也记录了她在 Salesforce 担任研究科学家的经历。正式论文使用独立研究者署名，因此不能根据过去或后来的任职把其他公司加入本次机构名单。[UIC 博士校友名录](https://cs.uic.edu/graduate/phd-alumni-list/)

## 1. 摘要翻译

以下完整翻译 Yibo Wang 等人的正式版摘要，原文按 [ACL 的 CC BY 4.0 许可](https://aclanthology.org/2026.findings-acl.1403/)发布。

单元测试生成已成为大语言模型一项有前景且重要的应用。然而，现有大语言模型单元测试生成评测基准主要关注函数级或类级代码，即单文件代码，而非更实用、也更具挑战性的多文件代码库。为解决这一局限，我们提出 MultiFileTest，一个覆盖 Python、Java 和 JavaScript 的多文件级单元测试生成基准。MultiFileTest 为每种语言提供 20 个高质量、中等规模的项目。

我们在 MultiFileTest 上评估了 11 个前沿大语言模型。结果表明，大多数被测模型表现一般，体现了这一基准本身的难度。我们还进行了全面的错误分析，发现即使是 Gemini 3.0 Pro 等先进模型，也会出现基础但关键的错误，包括可执行性错误和级联错误。

受到这一观察的启发，我们进一步在人工错误修复和自我错误修复场景下评估这些前沿模型，以判断它们配备错误修复机制后的潜力。我们的数据集发布于 MultiFileTest。

## 2. 研究背景与相关研究

给单个函数写测试时，模型通常可以直接看到所需输入和输出。真实项目中，一个文件可能调用另一个文件的类，并依赖其他模块、状态或工具。测试需要正确组织这些依赖，才能真正运行并检查程序行为。

论文第 2 节回顾了基于搜索、约束求解和随机生成的传统测试方法，以及利用语言模型生成、微调和迭代修改测试的方法。已有语言模型评测多聚焦函数、类或单文件；DevBench 等覆盖较完整的软件开发流程，但对跨文件单元测试的专项分析有限。

MultiFileTest 把跨文件依赖作为项目的必备条件，并将错误修复纳入评估。这样可以区分模型完全没有理解测试目标，与测试设计已有价值却被导入、初始化等基础问题阻断的情况。[论文第 1—2 节](https://aclanthology.org/2026.findings-acl.1403.pdf)

## 3. 核心贡献

**核心问题。** 评估模型在多文件项目中生成单元测试的能力，并分析修复基础错误后还可以释放多少潜力。

**核心方案。** 基准包含三种语言共 60 个项目，提供相关代码和测试生成任务。作者分别评估直接生成、人工修复基础错误，以及模型依据错误信息自行修复三种条件。人工修复主要处理阻止测试运行的可执行性与级联问题，而不是替模型重新设计全部测试逻辑。

评估同时观察测试是否能够执行、断言是否通过、代码行与分支覆盖程度，以及重复测试的情况。一个错误可能使后续很多测试都无法运行，因此错误类型与覆盖率需要一起理解。[论文第 3—4 节](https://aclanthology.org/2026.findings-acl.1403.pdf)

**主要结论。** 被测模型仍频繁出现基础执行问题；人工修复这些问题后，覆盖率显著改善，模型排名也会变化。模型自修复能够改善部分原始结果，但总体上尚未达到人工修复的可靠程度，有时还会删减测试，损失原有覆盖。[论文第 5 节](https://aclanthology.org/2026.findings-acl.1403.pdf)

这说明直接生成分数不能充分表达错误修复后的潜力，而修复成功也不等于测试足够全面。基准项目经过规模控制，结果不能直接推广到任意大型代码库；论文重点测量测试生成和覆盖，并未证明这些测试能发现所有真实软件缺陷。[论文结论与 Limitations](https://aclanthology.org/2026.findings-acl.1403.pdf)
