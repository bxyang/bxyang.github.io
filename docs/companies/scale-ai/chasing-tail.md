---
title: "Chasing the Tail：高质量回答的奖励区分"
company: "scale-ai"
date: "2025-09-25"
dateLabel: "2025-09-25"
kind: "论文"
description: "改进奖励对高质量回答之间细微差异的识别。"
reviewed: "2026-09-10"
---

[← Scale AI](/companies/scale-ai) · [全部工作](/research)

# Chasing the Tail：高质量回答的奖励区分

改进奖励对高质量回答之间细微差异的识别。

| 项目 | 信息 |
| --- | --- |
| 时间 | 2025-09-25 |
| 类型 | 论文 |
| 公司参与 | Scale 研究人员发表或参与共同研究 |

## 工作内容

研究关注回答质量分布的高分部分：普通评分器可能能区分明显好坏，却难以比较两个都较好的回答。作者从多样化高质量答案中提炼评分标准，构建更细致的奖励信号。 [资料](https://arxiv.org/abs/2509.21500)

## 数据与评测

实验比较不同评分标准来源与奖励设置，观察模型优化后质量是否继续提高，以及评分器是否被表面特征误导。研究也分析高质量训练样本不足的问题。 [资料](https://arxiv.org/abs/2509.21500)

## 结果与公开范围

论文报告细项评分有助于缓解过度优化，并公开相关代码。首发于 2025 年，后续进入 ICLR 2026 论文流程。 [资料](https://arxiv.org/abs/2509.21500)

## 参考资料

- [Chasing the Tail：高质量回答的奖励区分：论文或发布说明](https://arxiv.org/abs/2509.21500)
- [代码](https://github.com/Jun-Kai-Zhang/rubrics)
- [Scale Labs 研究目录](https://labs.scale.com/papers)

资料核对截至 2026 年 9 月 10 日。实验结果对应所引资料的模型版本和评测设置。
