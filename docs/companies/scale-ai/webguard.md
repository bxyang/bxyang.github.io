---
title: "WebGuard：网页操作的风险识别"
company: "scale-ai"
date: "2025-07-18"
dateLabel: "2025-07-18"
kind: "合作论文与数据集"
description: "在 agent 执行网页操作前，判断动作可能带来的风险。"
reviewed: "2026-09-10"
---

[← Scale AI](/companies/scale-ai) · [全部工作](/research)

# WebGuard：网页操作的风险识别

在 agent 执行网页操作前，判断动作可能带来的风险。

| 项目 | 信息 |
| --- | --- |
| 时间 | 2025-07-18 |
| 类型 | 合作论文与数据集 |
| 公司参与 | Scale 研究人员发表或参与共同研究 |

## 工作内容

研究为网页操作标注安全、低风险和高风险等级，结合页面画面与动作上下文训练判断模型。任务关注具体动作的后果，而不是只识别网页主题。 [资料](https://arxiv.org/abs/2507.14293)

## 数据与评测

数据包含 4,939 个动作，来自 193 个网站和 22 个领域。论文比较通用模型与专门训练的视觉语言模型，并单独统计高风险动作的召回率。 [资料](https://arxiv.org/abs/2507.14293)

## 结果与公开范围

Qwen2.5-VL-7B 在所测数据上的准确率由 37% 提高到 80%，高风险召回率由 20% 提高到 76%。项目公开数据、代码和标注工具。 [资料](https://arxiv.org/abs/2507.14293)

## 参考资料

- [WebGuard：网页操作的风险识别：论文或发布说明](https://arxiv.org/abs/2507.14293)
- [代码与数据](https://github.com/OSU-NLP-Group/WebGuard)
- [Scale Labs 研究目录](https://labs.scale.com/papers)

资料核对截至 2026 年 9 月 10 日。实验结果对应所引资料的模型版本和评测设置。
