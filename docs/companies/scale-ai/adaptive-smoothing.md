---
title: "Adaptive Smoothing：分类准确率与鲁棒性的组合"
company: "scale-ai"
date: "2023-01-29"
dateLabel: "2023-01-29"
kind: "合作论文与开源方法"
description: "根据输入情况组合普通分类器与鲁棒分类器的输出。"
reviewed: "2026-09-10"
---

[← Scale AI](/companies/scale-ai) · [全部工作](/research)

# Adaptive Smoothing：分类准确率与鲁棒性的组合

根据输入情况组合普通分类器与鲁棒分类器的输出。

| 项目 | 信息 |
| --- | --- |
| 时间 | 2023-01-29 |
| 类型 | 合作论文与开源方法 |
| 公司参与 | Scale 研究人员参与共同研究 |

## 工作内容

方法将擅长普通样本的分类器与经过鲁棒训练的分类器组合。混合网络根据输入调整两个模型的权重，论文分析鲁棒模型对正确与错误样本的置信度差异如何影响组合效果。 [资料](https://arxiv.org/abs/2301.12554)

## 数据与评测

实验使用 AutoAttack 和自适应攻击评测。CIFAR-100 上报告普通样本准确率 85.21%，在指定 l∞ 扰动预算 8/255 下的 AutoAttack 准确率为 38.72%。 [资料](https://arxiv.org/abs/2301.12554)

## 结果与公开范围

论文同时给出一定假设下的鲁棒性保证，并公开实现。两个准确率分别对应普通输入和攻击输入，应结合论文的模型配置与扰动条件阅读。 [资料](https://arxiv.org/abs/2301.12554)

## 参考资料

- [Adaptive Smoothing：分类准确率与鲁棒性的组合：论文或发布说明](https://arxiv.org/abs/2301.12554)
- [实现](https://github.com/Bai-YT/AdaptiveSmoothing)
- [Scale Labs 研究目录](https://labs.scale.com/papers)

资料核对截至 2026 年 9 月 10 日。实验结果对应所引资料的模型版本和评测设置。
