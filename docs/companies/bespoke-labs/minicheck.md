---
title: "Bespoke-MiniCheck-7B：文档事实核查"
company: "bespoke-labs"
date: "2024-09"
dateLabel: "2024-09"
kind: "模型"
description: "判断回答中的陈述是否得到给定文档支持。"
reviewed: "2026-09-09"
---

[← Bespoke Labs](/companies/bespoke-labs) · [全部工作](/research)

# Bespoke-MiniCheck-7B：文档事实核查

判断回答中的陈述是否得到给定文档支持。

| 项目 | 信息 |
| --- | --- |
| 时间 | 2024-09 |
| 类型 | 模型 |
| 公司参与 | Bespoke 发布 7B 模型；与原始 MiniCheck 论文分开归属 |

## 工作内容

模型接收参考文档和待检查陈述，输出支持性判断。它沿用 MiniCheck 的文档核查方向，用于检索增强问答、摘要和基于文档的对话。原始论文通过合成事实错误训练较小的核查模型。

## 数据与使用范围

Bespoke 的 7B 模型与 2024 年 4 月论文中的 MiniCheck-FT5 不是同一个版本。本页以模型卡为产品依据，原论文仅作为方法背景；核查范围是输入文档。

## 参考资料

- [Bespoke-MiniCheck-7B：文档事实核查：原始资料](https://huggingface.co/bespokelabs/Bespoke-MiniCheck-7B)
- [原始 MiniCheck 论文](https://arxiv.org/abs/2404.10774)
- [2024 年 9 月发布介绍](https://ollama.com/blog/reduce-hallucinations-with-bespoke-minicheck)

资料核对截至 2026 年 9 月 9 日。实验结果对应所引资料的模型版本和评测设置。
