---
title: "EchoChain：实时语音中断与推理"
company: "labelbox"
date: "2026-03-04"
dateLabel: "2026-03-04"
kind: "基准"
description: "评测模型在语音回答被打断后理解新指令并继续工作的能力。"
reviewed: "2026-09-09"
---

[← Labelbox](/companies/labelbox) · [全部工作](/research)

# EchoChain：实时语音中断与推理

评测模型在语音回答被打断后理解新指令并继续工作的能力。

| 项目 | 信息 |
| --- | --- |
| 时间 | 2026-03-04 |
| 类型 | 基准 |
| 公司参与 | Labelbox 发布 |

## 工作内容

200 个场景在模型讲话过程中加入中断，检查它是否仍执行过时要求、忘记先前信息，或偏离原来的目标。流程结合文字筛查和人工听评，关注真实全双工对话中的变化。

## 数据与使用范围

发布时最佳完成率为 47.5%，这是当时模型和评测条件下的结果。对照实验移除中断后，部分失败任务能够完成，说明该测试并非普通语音识别准确率测量。

## 参考资料

- [EchoChain：实时语音中断与推理：原始资料](https://labelbox.com/blog/introducing-echochain-an-audio-benchmark-for-reasoning-under-pressure-in-full-duplex-dialogue/)

资料核对截至 2026 年 9 月 9 日。实验结果对应所引资料的模型版本和评测设置。
