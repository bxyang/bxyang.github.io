---
title: "Natural Adversarial Objects：真实图像中的检测错误"
company: "scale-ai"
date: "2021-11-07"
dateLabel: "2021-11-07"
kind: "合作论文与数据集"
description: "收集未经对抗修改、却容易使检测模型高置信度误判的自然图像。"
reviewed: "2026-09-10"
---

[← Scale AI](/companies/scale-ai) · [全部工作](/research)

# Natural Adversarial Objects：真实图像中的检测错误

收集未经对抗修改、却容易使检测模型高置信度误判的自然图像。

| 项目 | 信息 |
| --- | --- |
| 时间 | 2021-11-07 |
| 类型 | 合作论文与数据集 |
| 公司参与 | Scale 研究人员参与共同研究 |

## 工作内容

研究从真实图像中筛选物体检测器容易识别错误的样本，构建 NAO 数据集。分析分别改变局部图像排列和背景，并结合归因方法观察模型依赖的信息。 [资料](https://arxiv.org/abs/2111.04204)

## 数据与评测

NAO 包含 7,934 张图像和 9,943 个物体。实验比较多个物体检测架构在 NAO 与 MSCOCO 验证集上的表现，考察常规准确率和困难样本鲁棒性的关系。 [资料](https://arxiv.org/abs/2111.04204)

## 结果与公开范围

论文报告 EfficientDet-D7 在 NAO 上的 mAP 相比 MSCOCO 验证集下降 74.5%；不同架构在常规验证集上的优势未必延续到 NAO。论文附有数据下载入口。 [资料](https://arxiv.org/abs/2111.04204)

## 参考资料

- [Natural Adversarial Objects：真实图像中的检测错误：论文或发布说明](https://arxiv.org/abs/2111.04204)
- [Scale Labs 研究目录](https://labs.scale.com/papers)

资料核对截至 2026 年 9 月 10 日。实验结果对应所引资料的模型版本和评测设置。
