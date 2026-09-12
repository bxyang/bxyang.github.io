---
title: "Snorkel MeTaL：把不同粒度的弱标签用于多任务学习"
company: "snorkel-ai"
date: "2018-06-15"
dateLabel: "2018-06-15"
kind: "创办前论文与系统"
description: "解读 2018 年原型中的任务树、层级标签模型、网络结构、三组消融及历史代码差异。"
reviewed: "2026-09-11"
readingStatus: "deep-read"
paperVersion: "DEEM 2018，DOI:10.1145/3209889.3209898"
---

[← Snorkel AI](/companies/snorkel-ai) · [全部工作](/research)

# Snorkel MeTaL：把不同粒度的弱标签用于多任务学习

一篇财经新闻可以先被分为“公司”或“市场”，再进一步分成“公司业绩”“公司融资”“货币市场”“商品市场”。已有分类器可能只支持大类，一些规则却能识别细分类。MeTaL 把这些不同粒度的监督放进同一棵任务树，生成相互一致的概率标签，再训练共享表示的多任务模型。

本文介绍 2018 年的四页原型论文。这一版本使用层级生成模型与树上的推断，不应与后续 MeTaL 论文或代码中的矩阵估计方法混在一起。

| 项目 | 信息 |
| --- | --- |
| 原论文 | Snorkel MeTaL: Weak Supervision for Multi-Task Learning |
| 作者 | Alex Ratner、Braden Hancock、Jared Dunnmon、Roger Goldman、Christopher Ré |
| 机构 | Stanford University |
| 发表 | DEEM 2018，2018 年 6 月 15 日 |
| 阅读版本 | 作者网站提供的四页论文，DOI `10.1145/3209889.3209898` |
| 与公司的关系 | Snorkel 创始团队的早期研究，发表于公司成立前 |

[作者提供的论文](https://ajratner.github.io/assets/papers/deem-metal-prototype.pdf)。

## 用任务树表达分类关系

论文的财经新闻例子包含三个子任务：

| 子任务 | 可取标签 | 作用 |
| --- | --- | --- |
| $y_0$ | 公司、市场 | 根任务，决定大类 |
| $y_1$ | 业绩、融资、$\varnothing$ | 只在公司类中有效 |
| $y_2$ | 货币、商品、$\varnothing$ | 只在市场类中有效 |

例如，最终类别“货币市场”对应 $(y_0,y_1,y_2)=(\text{市场},\varnothing,\text{货币})$。其中 $\varnothing$ 表示这个子任务对当前样本不适用。它不是“模型没把握”的意思。

标注函数的弃权另用 0 表示：$\lambda_{t,j}(x)=0$ 表示第 $t$ 个任务的第 $j$ 条规则不提供意见。任务不适用与函数弃权属于不同层次，实现数据接口时需要区分，即使具体代码可能用同一个数值表示它们。

任务树由用户提供。论文把学习任务结构放在未来工作中，没有自动从文本发现这棵树。本文中的四分类示例也不是三个任意独立分类器的组合：有效路径由任务结构和最终类别的互斥约束限定。[第 3 节与图 2](https://ajratner.github.io/assets/papers/deem-metal-prototype.pdf#page=2)。

## 层级标签模型的目标

用户为不同任务提供标注函数，函数可以读取关键词、知识库、已有分类器或其他弱信号。模型希望根据它们在未标注数据上的一致和冲突，估计各函数的质量。

论文采用条件独立假设：给定相应任务标签，同一任务中的函数输出相互独立。对每个任务和函数，定义两个统计量：

$$
h^{\mathrm{lab}}_{t,j}(\lambda,y)
=\mathbf1\{y_t\ne\varnothing\}\mathbf1\{\lambda_{t,j}\ne0\},
$$

$$
h^{\mathrm{acc}}_{t,j}(\lambda,y)
=h^{\mathrm{lab}}_{t,j}(\lambda,y)
\left[\mathbf1\{\lambda_{t,j}=y_t\}
-\mathbf1\{\lambda_{t,j}\ne y_t\}\right].
$$

第一个统计量表示任务有效且函数投票；第二个表示这个投票与潜在任务标签的一致方向。任务无效或函数弃权时，这两个因子不提供相应的投票贡献。

把所有统计量拼成 $h$，联合分布为：

$$
p_\theta(\lambda,y)=\frac{\exp(\theta^Th(\lambda,y))}{Z_\theta}.
$$

$\theta$ 是待学习参数，$Z_\theta$ 是归一化项。对观测到的标签矩阵 $\bar\lambda$，学习目标是负边缘对数似然：

$$
\mathcal L(\theta)=-\sum_{i=1}^N
\log\sum_{y\in\mathcal Y_{\mathrm{valid}}}
 p_\theta(\bar\lambda_i,y).
$$

这里 $\mathcal Y_{\mathrm{valid}}$ 表示满足任务树约束的标签组合，是本文为明确求和范围采用的记号。模型不需要给训练样本提供真实类别，而是对可能的有效类别求和。[第 3 节](https://ajratner.github.io/assets/papers/deem-metal-prototype.pdf#page=2)。

### 梯度与树上的推断

论文将负对数似然梯度写为：

$$
\nabla_\theta\mathcal L
=\sum_i\left[
\mathbb E_{\lambda,y\sim p_\theta}[h(\lambda,y)]
-\mathbb E_{y\sim p_\theta(\cdot\mid\bar\lambda_i)}
[h(\bar\lambda_i,y)]
\right].
$$

第一项是模型整体分布下的期望，第二项是固定观测规则输出后的后验期望。优化通过调整参数，使模型更好解释实际观测到的标签模式。

论文利用任务树结构，通过一次向上、一次向下的消息传递计算条件期望。这个精确推断结论依赖所设树结构，不能直接套到任意带环任务图。模型随后把后验分布作为训练标签传给下游网络。[第 3 节续](https://ajratner.github.io/assets/papers/deem-metal-prototype.pdf#page=3)。

## 多任务网络怎样连接

下游网络由三个部分组成：输入模块将原始样本转换为向量；中间模块学习共享表示；每个任务的输出头负责预测对应类别。系统使用 PyTorch，按任务结构配置这些模块。

论文比较三个架构：

- **SingleTask**：共享的输入和中间网络后，只预测最终四分类标签。
- **FlatMTL**：多个任务头都连接到最上层共享表示。
- **HierMTL**：任务头位于不同中间层，并把子任务头的输出作为父任务头的额外输入。

最后一项容易读反。论文图 3 中，两个子任务头连接较早的中间层，根任务头位于更高层；输出信息从子任务传向父任务。任务树的父子定义与前向计算顺序不是同一个概念。

网络用标签模型产生的概率标签训练。四页正文没有给出各任务损失的完整权重配置，也没有明确输出头间传递的是哪一种数值表示，因此本页不补写未经确认的实现细节。[第 4 节与图 3](https://ajratner.github.io/assets/papers/deem-metal-prototype.pdf#page=3)。

## 两个任务与训练设置

| 项目 | RCV1 财经新闻 | OpenI 放射学报告 |
| --- | --- | --- |
| 最终类别 | 公司业绩、公司融资、货币市场、商品市场 | 正常、非紧急、紧急、危急 |
| 任务结构 | 3 个子任务、2 个层级 | 3 个子任务、2 个层级 |
| 未标注训练样本 | 1,000 篇文章 | 2,630 份报告 |
| 人工开发样本 | 50 | 50 |

OpenI 的目标是对报告文本分流，标签由专业放射科医生确定。这项实验没有直接读取 X 光图像，也没有报告临床部署效果。

全部实验使用词频特征、恒等输入层，以及宽度为 250、50 的全连接中间层和 ReLU。它们不是使用预训练语言模型的实验。作者在相同设置下更换随机种子，运行 20 次并报告平均结果。

50 个开发样本用于辅助编写规则，并用于标签模型和下游模型的交叉验证。论文另外使用随机抽取的人工测试集，但没有在这四页中列出其精确大小，也未给出完整规则清单、每任务函数数、学习率、训练轮数和交叉验证划分协议。[第 5 节](https://ajratner.github.io/assets/papers/deem-metal-prototype.pdf#page=3)。

## 主结果中的基线含义

表 1 比较三种设置：只用 50 个开发标签训练相同的 HierMTL 网络；直接用标签模型预测；使用概率标签训练完整下游网络。

| 任务 | 50 个标签训练网络 | 标签模型直接预测 | 完整 MeTaL |
| --- | ---: | ---: | ---: |
| RCV1 | 75.4 ± 0.59 | 60.5 ± 0.02 | 78.4 ± 1.39 |
| OpenI | 54.6 ± 6.28 | 72.9 ± 0.01 | 74.0 ± 0.46 |
| 平均 | 65.0 | 66.7 | 76.2 |

数值为最终类别准确率，按百分数表示。表中 `±` 数字照录原文；正文说明了 20 次运行，但没有明确将它定义为标准差、标准误还是置信区间，本页不替作者指定。

摘要中“比监督基线提高 11.2 点”来自 $76.2-65.0$，对照只有 50 个人工训练标签。它不是超过充分标注的大规模监督模型。两个任务的增益也不同：RCV1 提高 3.0 点，OpenI 提高 19.4 点。

完整网络相对标签模型平均提高 9.5 点，但这个对照是已经学习了权重的标签模型，不能写成相对原始规则多数票的同一增益。[表 1](https://ajratner.github.io/assets/papers/deem-metal-prototype.pdf#page=4)。

## 消融分别说明了什么

### 使用更多层级的监督

两个任务都只有两层，因此这一消融比较是否加入根任务的弱监督。作者报告加入后平均准确率提高 16.3 点，但没有列出每个任务的完整对照表。它支持粗粒度监督在这些实验中有帮助，不能当成每增加一个层级就固定提高 16.3 点的规律。[第 5 节](https://ajratner.github.io/assets/papers/deem-metal-prototype.pdf#page=3)。

### 标签模型的合并策略

| 任务 | Hard MV | Soft MV | 学习后的标签模型 |
| --- | ---: | ---: | ---: |
| RCV1 | 56.4 ± 0.02 | 59.7 ± 0.02 | 60.5 ± 0.02 |
| OpenI | 70.8 ± 0.06 | 72.3 ± 0.05 | 72.9 ± 0.01 |

Hard MV 从根节点开始逐层做多数票，平票时随机选择。Soft MV 使用相同的概率标签模型，但把权重固定在初始值，不训练。第三列才学习函数质量。

因此，Soft MV 不是简单把每层多数票写成小数；它保留了标签模型的结构。相比 Soft MV，权重学习在两个任务上分别提高 0.8、0.6 点。不能把从硬投票到完整流程的全部增益都归因于准确率估计。[表 2](https://ajratner.github.io/assets/papers/deem-metal-prototype.pdf#page=4)。

### 下游架构

| 任务 | SingleTask | FlatMTL | HierMTL |
| --- | ---: | ---: | ---: |
| RCV1 | 76.3 ± 0.87 | 76.1 ± 1.75 | 78.4 ± 1.39 |
| OpenI | 72.6 ± 0.57 | 73.1 ± 0.76 | 74.0 ± 0.46 |

HierMTL 在两个任务上均取得最好均值，但增幅有限；FlatMTL 在 RCV1 上还略低于 SingleTask。这个结果支持论文指定的层级结构，不能概括为多任务学习无论怎样连接都优于单任务。论文没有给出配对显著性检验。[表 3](https://ajratner.github.io/assets/papers/deem-metal-prototype.pdf#page=4)。

## 历史代码并非原实验的完整映射

本文检查了公开仓库在 2018 年 6 月附近的提交 `4710f920d25d525032bb09c8463dcdf8b13ede94`。时间接近不等于作者确认的实验版本，实际检查发现至少三处需要区分：

1. `LabelModel._task_loss` 根据函数重叠矩阵优化参数乘积与观测值的平方差，属于矩估计式目标，与本文介绍的负边缘对数似然和树上推断不同。
2. 下游网络的 `head_layers='auto'` 分支仍抛出 `NotImplementedError`，使用该提交不能直接假定自动层级配置已完整实现。
3. `pass_predictions` 分支要求父任务先于子任务，并将父输出接入子任务头，与论文图 3 描述的子到父连接方向不同。

这些是所读公开提交的行为，不据此推断作者运行论文实验时使用了哪一份代码。后续仓库还继续演变，README 将另一篇 AAAI 2019 论文列为主要参考，因此安装后来的包也不能直接复现这份四页原型。[历史标签模型](https://github.com/HazyResearch/metal/blob/4710f920d25d525032bb09c8463dcdf8b13ede94/metal/label_model/label_model.py)，[历史下游模型](https://github.com/HazyResearch/metal/blob/4710f920d25d525032bb09c8463dcdf8b13ede94/metal/end_model/end_model.py)，[后续项目说明](https://github.com/HazyResearch/metal)。

按论文重新实现时，需要先明确任务树中的有效标签映射和弃权约定，选择与论文一致的标签学习目标，再配置图 3 的网络连接。还需补齐原始数据拆分、规则、损失权重与训练参数，才能把新的实验与原表作严格比较。

本文完成了四页全文、三组结果表、网络示意图和历史实现的核对，未重新训练原任务。所读论文没有额外附录，也没有提供这些未披露参数的完整清单。

## 参考资料

- [作者版本：Snorkel MeTaL 原型论文](https://ajratner.github.io/assets/papers/deem-metal-prototype.pdf)
- [论文 DOI](https://doi.org/10.1145/3209889.3209898)
- [历史代码快照](https://github.com/HazyResearch/metal/tree/4710f920d25d525032bb09c8463dcdf8b13ede94)
- [前作：Data Programming 精读](/companies/snorkel-ai/data-programming)

资料核对截至 2026 年 9 月 11 日。
