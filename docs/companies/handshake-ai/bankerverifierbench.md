---
title: "BankerVerifierBench：评估工作产物验证器"
company: "handshake-ai"
date: "2026-05-27"
dateLabel: "2026-05-27"
kind: "基准 / 同论文配套"
description: "Gandalf 论文的配套数据集：21 项投行任务、3,204 条专家判断，用于检查验证器是否正确识别不满足的评分项。"
reviewed: "2026-09-13"
---

[← Handshake AI](/companies/handshake-ai) · [Gandalf 论文完整精读](/companies/handshake-ai/gandalf) · [全部工作](/research)

# BankerVerifierBench：评估工作产物验证器

BankerVerifierBench（BVB）评估自动评分器本身。输入是一条已经完成的 agent 轨迹、最终工作环境和评分标准；验证器检查交付文件或工具状态，判断每条标准是否满足，再与专家标签比较。它不是用来重新执行投行任务、直接给任务 agent 排名的另一张榜单。

**本页是同论文配套介绍。** BVB 与 Gandalf 共同发表于 *Verifying Agents in Rubric-Graded Environments*；[Gandalf 主文](/companies/handshake-ai/gandalf) 已包含方法、公式、全部主要实验、消融、代码及复现边界。本页不另计一篇论文精读。

## 来源与版本

七位作者为 Markus Dücker、Vaibhav Kumar、Yi Liu、Ronak Chaudhary、Andreas Plesner、Francisco Guzmán、Anish Athalye，均署名 Handshake AI Research；Andreas Plesner 另署名 ETH Zürich。

本次依据 [KDD 2026 workshop 网站提供的 18 页原稿](https://kdd-eval-workshop.github.io/agenticai-evaluation-kdd2026/assets/papers/34_Verifying_Agents_in_Rubric_.pdf)，保留公司博客 2026-05-27 的时间线位置。RLEval 2026 也收录同名论文，但确切首次上传时间尚未核实。KDD workshop 论文列表不等同于 KDD 主会 proceedings；这些版本与日期在主文中分别记录。

## 数据包的评测单位

BVB 取材于 [BankerToolBench](/companies/handshake-ai/bankertoolbench) 的任务分布，涉及现金流折现、杠杆收购、可比公司分析和并购等工作。BankerToolBench 是任务环境，BVB 在固定 agent 产物上增加人工评分标签。（原文 §2–3）

| 层级 | 数量或内容 | 评测含义 |
| --- | --- | --- |
| 任务 | 21 项 | 不同投行工作实例 |
| agent 轨迹 | 每任务 1 条 | 不是同一任务多模型、多次采样的覆盖 |
| 环境证据 | 完整消息、工具调用及返回值、最终文件与状态 | 验证器据以取证 |
| 评分标准 | 共 3,204 条，每任务 47–286 条，中位数 160 | 与专家标签比较的判断项 |
| 标签 | `met` / `unmet` | 条件是否满足 |
| 类别分布 | `met` 占 78.7% | 需要关注少数“不满足”项 |

原评分标准有重要性权重和六类类别；论文后来使用语言模型重新归纳出九类验证能力，如重算指标、检查跨文件引用、视觉呈现和时间顺序。两套类别的用途不同。九类能力是用于分析验证器错误，不能当作九个独立测试集。

一项任务的多个评分项可能依赖同一份工作簿，因此 3,204 条判断不能视作 3,204 项彼此独立的工作。论文没有公开任务采样的完整细则，也没有报告覆盖不同执行 agent 分布的实验。

## 专家标签与质量检查

最初 6 项任务共 493 条标准由两位审核者独立判断，再由资深审核者给最终裁定；其余 15 项、2,711 条由一位审核者判断，并由资深审核者给最终裁定。初始部分的一致率为 89.5%。（§3）

这项一致率只覆盖双人独立标注的初始部分，不能推广为全体标签的双人一致率，也不能用它直接证明模型已经达到人类水平。原文没有提供可复算该一致率的完整协议、标签对或混淆矩阵。

## 评分方向与分母

主要指标是把“不满足”作为正类的 F1。正确抓到不满足项记为 TP，把满足项错判为不满足记为 FP，把不满足项放过记为 FN：

$$
F_1=\frac{2TP}{2TP+FP+FN}.
$$

这个指标评估验证器发现缺陷的能力。由于大多数条件满足，一个始终判定满足的模型也能有较高准确率，但不能找到真正不满足的项。

Gandalf 软件还会按标准权重计算任务奖励；它是对某条轨迹的任务评分，与验证器 F1 不同。主文说明了正负权重、错误重试和奖励归一化，不能把软件的 `reward.json` 当作 BVB 元评测指标。

论文表 2 的默认 Gandalf / Gemini 3 Flash、每会话 16 条标准配置为 F1 0.660，全套评分费用 64 美元。图 1 中更便宜的 GPT-5.4 Nano 配置为 0.633、42 美元。这些是同一研究中的配置结果，不是当前价格保证。

## 数据开放与复现状态

论文称公开 BVB；公司博客仍称数据计划后续发布。截至 2026-09-13，本次检查的官方 Gandalf 仓库、Handshake AI Research 公开 GitHub 仓库与 Hugging Face 数据集清单中，未定位到包含这 21 条固定轨迹、最终环境和 3,204 条专家标签的完整 BVB 下载包。不能由此判断数据不存在，但也不能把公开 BankerToolBench 环境当成已经下载了 BVB。

复现需要匹配任务、轨迹与标签，保留原始文件和工具状态，固定模型及批处理配置，并对所有验证器统一处理失败样本。尤其是论文补充的 RewardKit 只在 BVB 2,634 条完成子集上报告部分结果，不能与完整 3,204 条结果直接作同分母排名；其表 5 还有与主表不一致的指标和费用，详见[主文核查](/companies/handshake-ai/gandalf)。

本文仅完成论文与公开入口核对，没有运行验证器或重新产生人工标签。论文也没有测试验证器优势是否转化为更好的 RL 训练结果。

## 原始资料

- [论文 PDF：Verifying Agents in Rubric-Graded Environments](https://kdd-eval-workshop.github.io/agenticai-evaluation-kdd2026/assets/papers/34_Verifying_Agents_in_Rubric_.pdf)
- [Handshake 的 Gandalf / BVB 发布页](https://joinhandshake.com/research/ai/gandalf-the-grader/)
- [Gandalf 代码](https://github.com/Handshake-AI-Research/gandalf-the-grader)
- [BankerToolBench 任务环境](https://huggingface.co/datasets/handshake-ai-research/bankertoolbench)

资料核对截至 2026 年 9 月 13 日。
