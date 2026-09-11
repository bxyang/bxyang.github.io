---
title: "OpenDiLoCo：低通信分布式训练"
company: "prime-intellect"
date: "2024-07-11"
dateLabel: "2024-07-11"
kind: "论文与开源框架"
description: "复现并扩展 DiLoCo，使不同地区的节点能够协作训练模型。"
reviewed: "2026-09-09"
---

[← Prime Intellect](/companies/prime-intellect) · [全部工作](/research)

# OpenDiLoCo：低通信分布式训练

复现并扩展 DiLoCo，使不同地区的节点能够协作训练模型。

| 项目 | 信息 |
| --- | --- |
| 时间 | 2024-07-11 |
| 类型 | 论文与开源框架 |
| 公司参与 | Prime Intellect 实现和扩展；DiLoCo 原方法来自 DeepMind |

## 工作内容

节点执行多次本地优化后再同步，降低频繁跨地域通信的需求。项目复现原方法，并扩大模型规模，在两个洲、三个国家的节点上进行实验。

## 数据与使用范围

公开代码与论文。实验报告约 90%—95% 的计算利用率，属于指定网络和硬件设置；这是 INTELLECT-1 前期的训练基础。

## 参考资料

- [OpenDiLoCo：低通信分布式训练：原始资料](https://www.primeintellect.ai/blog/opendiloco)
- [论文](https://arxiv.org/abs/2407.07852)

资料核对截至 2026 年 9 月 9 日。实验结果对应所引资料的模型版本和评测设置。
