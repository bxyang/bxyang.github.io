---
title: "ARCA：利用适配器残差分配训练信号"
company: "scale-ai"
date: "2026-05-29"
dateLabel: "2026-05-29"
kind: "论文与开源方法"
description: "根据 LoRA 实际改变模型的位置，分配不同 token 的训练权重。"
reviewed: "2026-09-10"
---

[← Scale AI](/companies/scale-ai) · [全部工作](/research)

# ARCA：利用适配器残差分配训练信号

根据 LoRA 实际改变模型的位置，分配不同 token 的训练权重。

| 项目 | 信息 |
| --- | --- |
| 时间 | 2026-05-29 |
| 类型 | 论文与开源方法 |
| 公司参与 | Scale 研究人员发表或参与共同研究 |

## 工作内容

研究指出，低秩微调下依赖熵或概率差异的 token 信号可能在归一化后趋于均匀，或集中在少数与任务无关的位置。ARCA 改用适配器前后隐藏状态之差衡量每个位置的作用。 [资料](https://labs.scale.com/papers/arca)

## 数据与评测

实验在 Qwen3-1.7B、MATH 与 GRPO 的小规模组合上比较，控制轨迹预算及适配器秩，并用权重 Gini 和有效 token 比例观察分配是否退化。 [资料](https://labs.scale.com/papers/arca)

## 结果与公开范围

方法不需要额外奖励模型、价值头或搜索树。结果展示较均衡的分配，并与所比较基线维持竞争力；日期采用 Scale 的 5 月 29 日发布记录。 [资料](https://labs.scale.com/papers/arca)

## 参考资料

- [ARCA：利用适配器残差分配训练信号：论文或发布说明](https://labs.scale.com/papers/arca)
- [论文](https://arxiv.org/abs/2606.00257)
- [Scale Labs 研究目录](https://labs.scale.com/papers)

资料核对截至 2026 年 9 月 10 日。实验结果对应所引资料的模型版本和评测设置。
