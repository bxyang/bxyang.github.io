---
title: "OpenDiLoCo：让不同地区的 GPU 减少训练同步"
company: "prime-intellect"
date: "2024-07-10"
dateLabel: "2024-07-10（论文）；07-11 项目发布"
kind: "论文与开源框架"
description: "OpenDiLoCo 复现低通信训练方法，使分散设备先独立训练再合并更新，并验证跨洲训练的可行性。"
reviewed: "2026-09-14"
readingStatus: "summary"
paperVersion: "arXiv:2407.07852v1，2024-07-10"
---

[← Prime Intellect](/companies/prime-intellect) · [全部工作](/research)

# OpenDiLoCo：让不同地区的 GPU 减少训练同步

论文：*OpenDiLoCo: An Open-Source Framework for Globally Distributed Low-Communication Training*。本文依据 [arXiv v1](https://arxiv.org/abs/2407.07852v1)。

## 0. 作者与机构背景

第一作者是 **Sami Jaghouar**，第二作者是 **Jack Min Ong**，第三作者为 Johannes Hagemann。三人均署名 Prime Intellect，首页没有共同第一作者标注。（原文首页。）

Jaghouar 的研究涉及分布式模型训练。他的[公开个人资料](https://www.linkedin.com/in/sami-jaghouar-805505193/en)列有贡比涅技术大学的教育经历；其[本人研究回顾](https://www.linkedin.com/posts/sami-jaghouar-805505193_so-proud-of-all-weve-shipped-in-less-than-activity-7301488318788083712-cQVD)介绍了在 Prime Intellect 参与分布式训练、计算验证和协作训练的工作。可见资料不足以确认具体学位。

Ong 的背景同样偏向训练与计算基础设施。他在[OpenDiLoCo 发布时的本人介绍](https://www.linkedin.com/posts/jackminong_i-remember-my-first-gpu-procurement-meeting-activity-7217240784440373248-lYma)中提到，高带宽网络的采购成本促使他关注减少通信的训练方式；其[个人网站](https://jackminong.com/)也记录了模型训练和推理系统方面的技术工作。

**Prime Intellect 直接开发并发布了这套实现。** 公司将低通信算法接入可以跨网络运行的训练框架，并组织跨地区实验。论文致谢 DiLoCo 作者 Arthur Douillard 对复现细节的帮助，以及 Max Ryabinin 对 Hivemind 的指导；原始 DiLoCo 方法与本公司的开源复现需要区分。（原文 §1、致谢。）

## 1. 摘要翻译

以下完整翻译 Jaghouar、Ong 和 Hagemann 的摘要；[原文](https://arxiv.org/abs/2407.07852v1)采用 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) 许可，本节为中文翻译。

OpenDiLoCo 是大语言模型分布式低通信训练方法 DiLoCo 的开源实现与复现。我们提供了可复现的 DiLoCo 实验实现，并通过 Hivemind 库将其整合进可扩展的去中心化训练框架。我们通过跨两个大洲、三个国家训练一个模型，展示了这一方法的有效性，同时保持了 90%—95% 的计算利用率。此外，我们开展了消融研究，关注算法的计算效率、工作节点数量的扩展能力，并表明其梯度可以使用 FP16 进行全局归约而不损害性能。我们还将 OpenDiLoCo 扩展到原工作三倍的模型规模，展示了它对十亿参数级模型的有效性。

## 2. 研究背景与相关研究

常见的分布式训练需要设备频繁交换模型更新。同一机房可以使用高速互联，但设备分散到不同国家后，带宽与延迟会使同步变成明显负担。问题因此不仅是凑齐多少 GPU，还包括让这些设备在等待通信之外持续工作。（原文 §1。）

DiLoCo 承接本地随机梯度下降这一思路：各组设备先在自己的数据上训练一段时间，再合并这一阶段的参数变化。它减少了跨组同步次数，但也需要验证独立更新后的模型能否保持训练质量。

OpenDiLoCo 的工作是复现该方法，并解决实际网络中的运行问题。PyTorch 的分布式工具适合构建简洁的参考实现；Hivemind 提供对等节点发现、低带宽通信和容错能力。作者将这些工具与组内的模型训练结合起来。论文没有独立的 Related Work 章节，相关背景集中于引言与实现部分。（原文 §1—§2。）

## 3. 核心贡献

### 核心要解决的问题

使 DiLoCo 能够在分散、连接条件较差的设备上实际运行，并检查减少通信之后的模型质量和计算效率。

### 核心方案

每组设备保存一份模型，先独立完成若干步训练，再计算当前模型与上次同步模型之间的参数变化。各组共同合并这些变化，更新共享模型，然后开始下一轮本地训练。组内可以继续使用高速互联，跨地区的交换则只在间隔较长的同步时进行。（原文 §2。）

团队提供了两种开源实现：一个简洁的 PyTorch 参考版本，以及适用于互联网训练的 Hivemind 版本。后者处理节点发现与通信，并支持把一组工作节点扩展到多张 GPU。作者还比较了同步间隔、工作节点数量和交换数据的精度。（原文 §2—§3；[代码](https://github.com/PrimeIntellect-ai/OpenDiloco)。）

### 结论

在 1.5 亿参数实验中，每 500 步同步一次的模型，与使用相近计算和数据预算的数据并行基线取得接近的语言建模表现。扩大到 11 亿参数后，每 125 步同步的方案比每 500 步同步更接近基线，说明同步频率仍需要随训练设置调整。（原文 §3。）

跨加拿大、芬兰和美国的实验展示了实际运行的可行性，论文报告 90%—95% 的计算利用率。这里表示较少时间花在通信和等待上，不等于相同模型质量所需的计算量也同比减少。较短训练下，增加工作节点并未始终达到传统数据并行的计算效率。（原文 §3—§4。）

本文提供了开放、可运行的低通信训练框架及十亿参数级验证；更大规模和更多节点下的效率，仍需要进一步实验。
