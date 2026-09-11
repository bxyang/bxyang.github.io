---
title: "Snorkel MeTaL：多任务弱监督"
company: "snorkel-ai"
date: "2018-06"
dateLabel: "2018-06"
kind: "创办前论文与系统"
description: "将不同粒度的弱标签整合到一个多任务学习系统中。"
reviewed: "2026-09-10"
---

[← Snorkel AI](/companies/snorkel-ai) · [全部工作](/research)

# Snorkel MeTaL：多任务弱监督

将不同粒度的弱标签整合到一个多任务学习系统中。

| 项目 | 信息 |
| --- | --- |
| 时间 | 2018-06 |
| 类型 | 创办前论文与系统 |
| 公司参与 | Ratner、Hancock、Ré 等在 Stanford 的研究 |

## 工作内容

用户先定义具有层级关系的子任务，例如同时判断一篇文档的大类与细分类，再为不同层级编写标注函数。系统利用子任务关系整合噪声标签，训练共享信息的多任务模型。 [资料](https://pubmed.ncbi.nlm.nih.gov/30931438/)

## 数据与评测

论文在放射学报告分流和细粒度新闻分类上验证。不同来源可以覆盖不同标签层级，系统需要同时处理来源可靠性和任务之间的一致性。 [资料](https://pubmed.ncbi.nlm.nih.gov/30931438/)

## 结果与公开范围

论文报告相对所设监督学习基线平均提高 11.2 个准确率百分点。论文发表于 2018 年 6 月，PMC 收录时间为 2019 年；时间线采用原始发表月份。 [资料](https://pubmed.ncbi.nlm.nih.gov/30931438/)

## 参考资料

- [Snorkel MeTaL：多任务弱监督：论文或发布说明](https://pubmed.ncbi.nlm.nih.gov/30931438/)
- [论文全文](https://pmc.ncbi.nlm.nih.gov/articles/PMC6436830/)

资料核对截至 2026 年 9 月 10 日。实验结果对应所引资料的模型版本和评测设置。
