---
title: "Continual Learning Bench：从连续任务中学习"
company: "snorkel-ai"
date: "2026-06-04"
dateLabel: "2026-06-04"
kind: "合作论文与基准"
description: "比较保留经验和每次重置的系统，测量经验带来的增益。"
reviewed: "2026-09-10"
---

[← Snorkel AI](/companies/snorkel-ai) · [全部工作](/research)

# Continual Learning Bench：从连续任务中学习

比较保留经验和每次重置的系统，测量经验带来的增益。

| 项目 | 信息 |
| --- | --- |
| 时间 | 2026-06-04 |
| 类型 | 合作论文与基准 |
| 公司参与 | UC Berkeley 与 Snorkel 研究人员共同发表 |

## 工作内容

基准把相关任务排成序列，让系统在多轮环境交互中保留记忆或其他状态。对照系统使用相同配置，但每次任务前重置；两者奖励之差定义为 gain，用来区分基础能力与经验积累的作用。 [资料](https://arxiv.org/abs/2606.05661)

## 数据与评测

论文涵盖软件工程、信号处理、疾病预测、数据库查询、策略游戏及需求预测六个领域。网站后续版本列出具体环境，包括代码库适应、频谱监测、队列研究、数据库探索、扑克和销售预测。 [资料](https://arxiv.org/abs/2606.05661)

## 结果与公开范围

研究比较普通上下文学习和专门记忆系统，发现保存经验未必带来正增益。项目公开环境、运行框架、系统配置及结果工具；总奖励、增益和成本分别报告。 [资料](https://arxiv.org/abs/2606.05661)

## 参考资料

- [Continual Learning Bench：从连续任务中学习：论文或发布说明](https://arxiv.org/abs/2606.05661)
- [代码](https://github.com/pgasawa/continual-learning-bench)
- [当前环境说明](https://snorkel.ai/leaderboard/continual-learning-bench/)

资料核对截至 2026 年 9 月 10 日。实验结果对应所引资料的模型版本和评测设置。
