---
title: "BrowserART：浏览器 agent 的安全拒绝评测"
company: "scale-ai"
date: "2024-10-11"
dateLabel: "2024-10-11"
kind: "合作论文与基准"
description: "检查聊天场景中的拒绝行为能否延续到浏览器操作。"
reviewed: "2026-09-10"
---

[← Scale AI](/companies/scale-ai) · [全部工作](/research)

# BrowserART：浏览器 agent 的安全拒绝评测

检查聊天场景中的拒绝行为能否延续到浏览器操作。

| 项目 | 信息 |
| --- | --- |
| 时间 | 2024-10-11 |
| 类型 | 合作论文与基准 |
| 公司参与 | Scale Red Team 与合作研究人员共同发表 |

## 工作内容

BrowserART 将安全测试放进 agent 的实际工具环境，观察模型是否执行应拒绝的浏览器任务。测试同时覆盖合成站点和真实网站，并比较同一底层模型作为聊天助手与浏览器 agent 的行为。 [资料](https://arxiv.org/abs/2410.13886)

## 数据与评测

测试套件包含 100 种浏览器相关风险行为。论文评测多个浏览器 agent，记录模型拒绝情况与实际操作，研究聊天式安全训练向工具执行场景的迁移。 [资料](https://arxiv.org/abs/2410.13886)

## 结果与公开范围

研究发现两种使用方式的安全表现存在差异，并公开测试套件。论文中的模型结果对应当时版本和指定测试条件。 [资料](https://arxiv.org/abs/2410.13886)

## 参考资料

- [BrowserART：浏览器 agent 的安全拒绝评测：论文或发布说明](https://arxiv.org/abs/2410.13886)
- [Scale Labs 研究目录](https://labs.scale.com/papers)

资料核对截至 2026 年 9 月 10 日。实验结果对应所引资料的模型版本和评测设置。
