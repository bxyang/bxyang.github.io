---
title: "CAR：道路物体的细粒度属性标注"
company: "scale-ai"
date: "2021-11-16"
dateLabel: "2021-11-16"
kind: "合作论文与数据集"
description: "在 Cityscapes 上增加车辆、行人等物体的属性标注。"
reviewed: "2026-09-10"
---

[← Scale AI](/companies/scale-ai) · [全部工作](/research)

# CAR：道路物体的细粒度属性标注

在 Cityscapes 上增加车辆、行人等物体的属性标注。

| 项目 | 信息 |
| --- | --- |
| 时间 | 2021-11-16 |
| 类型 | 合作论文与数据集 |
| 公司参与 | Scale 与高校研究人员共同发表 |

## 工作内容

Cityscapes Attributes Recognition 为不同物体类别设计各自适用的属性体系，使场景描述包含物体类别之外的状态、外观和行为信息。属性设计面向自动驾驶中的视觉场景理解。 [资料](https://arxiv.org/abs/2111.08243)

## 数据与评测

首篇论文报告标注超过 32,000 个物体实例。每类对象对应一组适用属性，模型需要结合对象类别识别具体属性，而不是对所有对象使用完全相同的标签集合。 [资料](https://arxiv.org/abs/2111.08243)

## 结果与公开范围

项目发布 CAR-API，方便读取和处理新增标注。后续 GlideNet 研究将 CAR 作为多类别属性预测的评测数据之一。 [资料](https://arxiv.org/abs/2111.08243)

## 参考资料

- [CAR：道路物体的细粒度属性标注：论文或发布说明](https://arxiv.org/abs/2111.08243)
- [CAR-API](https://github.com/kareem-metwaly/CAR-API)
- [Scale Labs 研究目录](https://labs.scale.com/papers)

资料核对截至 2026 年 9 月 10 日。实验结果对应所引资料的模型版本和评测设置。
