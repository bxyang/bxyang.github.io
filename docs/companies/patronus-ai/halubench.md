---
title: "HaluBench：Lynx 论文的材料支持性评测集"
company: "patronus-ai"
date: "2024-07-11"
dateLabel: "2024-07-11"
kind: "基准"
description: "整理 HaluBench 的六类来源、公开字段、标签分布和评测口径；完整论文精读见 Lynx。"
reviewed: "2026-09-12"
---

[← Patronus AI](/companies/patronus-ai) · [Lynx 完整精读](/companies/patronus-ai/lynx) · [全部工作](/research)

# HaluBench：Lynx 论文的材料支持性评测集

HaluBench 是 Patronus AI 随 Lynx 发布的幻觉检测评测集。检测器同时读取问题、参考材料和待检查回答，判断回答是否受到材料支持。它与 Lynx 模型出自同一篇 *Lynx: An Open Source Hallucination Evaluation Model*，没有另一篇独立论文。本页整理数据入口与使用口径；合成方法、训练过程、全部实验及复现检查见 [Lynx 完整精读](/companies/patronus-ai/lynx)。

| 项目 | 信息 |
| --- | --- |
| 首次公开 | 2024 年 7 月 11 日 |
| 论文版本 | arXiv:2407.08488v2，2024 年 7 月 22 日 |
| 公司参与 | Patronus AI 作者参与研究，并以 PatronusAI 账号发布数据与模型 |
| 本地原文 | `research/papers/patronus-ai/lynx.pdf`，与 Lynx 共用 |
| 公开数据 | 14,900 条，单个 `test` split；论文约称 15k |
| 本页核对版本 | `5966a87929f51c204ab3cbef986b449495cc97b6` |

依据：[论文与作者记录](https://arxiv.org/abs/2407.08488v2)、[HaluBench 固定版本](https://huggingface.co/datasets/PatronusAI/HaluBench/tree/5966a87929f51c204ab3cbef986b449495cc97b6)。

## 一条记录包含什么

每条记录有六个字段：`id` 为样本标识，`passage` 为参考材料，`question` 为问题，`answer` 为待检测回答，`label` 为标准标签，`source_ds` 为数据来源。标签 `PASS` 表示回答忠实于材料，`FAIL` 表示存在不受支持或矛盾的信息。

检测时不应把 `label` 一起交给模型。评测器先根据问题、材料和回答输出判定，再与标签比较。它不要求模型另行生成一个正确答案，也不自动检查参考材料本身的真实性。论文的概念定义以材料忠实性为主，部分展示样例也涉及是否正确回答问题；完整精读对此边界作了说明。[论文 §3.1、图 1](https://arxiv.org/pdf/2407.08488v2)

## 来源分布与构造

以下为本文下载固定版本数据后实际统计的结果：

| 来源 | 条数 | PASS | FAIL |
| --- | ---: | ---: | ---: |
| DROP | 1,000 | 500 | 500 |
| FinanceBench | 1,000 | 500 | 500 |
| CovidQA | 1,000 | 500 | 500 |
| PubMedQA | 1,000 | 500 | 500 |
| HaluEval | 10,000 | 4,990 | 5,010 |
| RAGTruth | 900 | 740 | 160 |
| 合计 | 14,900 | 7,730 | 7,170 |

前四类包含原始忠实回答与 GPT-4o 构造的错误回答，各占 500 条。HaluEval 使用已有问答幻觉数据；RAGTruth 来自人工标注的 RAG 回答。这些来源的错误形成方式不同，不能把全部样本称为人工撰写，或全部称为合成数据。[论文 §3.2](https://arxiv.org/pdf/2407.08488v2)

作者对四组合成数据各抽 50 条进行人工核对，合计 200 条，标签一致率平均为 93.5%，论文约称 94%。这一抽查不等于 14,900 条都经过同一流程的人工审核。公开字段也不包含完整的修改记录、教师解释和人工审阅过程；更多标注说明与原文名称不一致之处见主精读。

## 汇总分数时保留来源

HaluEval 占全部数据约三分之二，直接按全部样本计算准确率会给它很大权重。论文中 Lynx、GPT-4o 等主要模型的 Overall 与六个来源的等权平均吻合，因此需要同时保留分项分数与聚合方式，不能把宏平均当作全部样本的正确比例。

RAGTruth 的标签分布尤其不均衡：始终预测 `PASS` 就有约 82.2% 准确率。实际评测应进一步记录 `FAIL` 的召回率、误报率及解析失败数量，才能看出检测器是否识别了需要关注的错误。论文部分模型行的 Overall 与分项平均不一致，主精读保留了具体核对结果。[论文表 3](https://arxiv.org/pdf/2407.08488v2)

使用官方推理代码前，还需要把六个公开字段转换成脚本要求的聊天消息与标签字段，并明确长文本过滤和 `PASS/FAIL` 解析规则。严格 JSON 解析与兼容作者历史输出的解析方式，可能得到不同的失败数量。主精读已对三个来源的公开 70B 输出进行重算，两个来源吻合论文分数，FinanceBench 仍存在未解决差异；这不等于重新运行了模型。

数据卡标注许可为 CC BY-NC 2.0。下载、字段定义及许可入口均见 [固定版本数据页](https://huggingface.co/datasets/PatronusAI/HaluBench/tree/5966a87929f51c204ab3cbef986b449495cc97b6)。本页是同篇论文的数据配套说明，不另设精读标记。
