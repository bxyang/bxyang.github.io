---
title: "DEBAGREEMENT：在线讨论中的同意与反对"
company: "scale-ai"
date: "2021-10-11"
dateLabel: "2021-10-11"
kind: "合作论文与数据集"
description: "详解 Reddit 评论回复对的四类标注、时间划分、语言模型基线、跨社区迁移，以及文本与互动图的使用边界。"
reviewed: "2026-09-13"
readingStatus: "deep-read"
paperVersion: "NeurIPS 2021 Datasets and Benchmarks 正式稿，12 页；官方补充材料，11 页"
---

[← Scale AI](/companies/scale-ai) · [全部工作](/research)

# DEBAGREEMENT：在线讨论中的同意与反对

一条回复可以先认可对方的一部分观点，再反对另一部分；也可以用带有讽刺意味的疑问表达反对。DEBAGREEMENT 把这样的 Reddit 评论与回复配成样本，标注双方在这次交流中是同意、中立还是反对，并保留作者、帖子和时间等关联信息。论文报告的语言模型基线准确率约为 62%—64%，其中“中立”最难识别；跨数据集和跨社区实验进一步说明，训练语料的讨论方式与来源会影响结果。[正文 §4、表 2–6](https://datasets-benchmarks-proceedings.neurips.cc/paper/2021/file/6f3ef77ac0e3619e98159e9b6febf557-Paper-round2.pdf)

## 论文版本与 Scale 的参与

原题为 *DEBAGREEMENT: A comment-reply dataset for (dis)agreement detection in online debates*，发表于 **NeurIPS 2021 Datasets and Benchmarks Track，Round 2**。本文阅读正式正文 12 页及官方补充材料 11 页。网站时间线保留 Scale Labs 目录所列的 **2021 年 10 月 11 日**；这个日期作为目录收录日期使用，不据此推断审稿版本首次公开的准确时间。[会议论文页](https://datasets-benchmarks-proceedings.neurips.cc/paper/2021/hash/6f3ef77ac0e3619e98159e9b6febf557-Abstract-round2.html)、[Scale Labs 项目页](https://labs.scale.com/papers/debagreement-a-comment-reply-dataset-for-disagreement-detection-in-online-debates)

七位作者中，John Pougué-Biyong、Valentina Semenova、Renaud Lambiotte、J. Doyne Farmer 署名牛津大学；Alexandre Matton、Rachel Han、Aerin Kim 署名 Scale AI。前两位作者等贡献。补充材料说明，Scale 作为合作方提供数据标注；它同时参与研究，并非只转发外部数据集。牛津团队的资助来源另列于致谢，包括 Baillie Gifford、Oxford Martin School 的 Institute for New Economic Thinking，以及英国 EPSRC。[正文首页、致谢；补充 A.6.1](https://datasets-benchmarks-proceedings.neurips.cc/paper/2021/file/6f3ef77ac0e3619e98159e9b6febf557-Supplemental-round2.zip)

## 判断的是回复对评论的关系

每条样本围绕一对文本：父评论 `body_parent` 与直接回复它的子评论 `body_child`。标注对象是回复对前一条评论或其作者表达的关系，不是这句话情绪愉快还是愤怒，也不是评论者属于哪一个政治阵营。

标注时有四个选项，最后用于主要分类评测的是前三个：

| 标签 | 标注含义 | 发布字段编码 |
| --- | --- | ---: |
| disagree | 回复表达不认可、反对，或对原评论者的不赞同 | 0 |
| neutral | 在同一话题下交流，但没有表达明确同意或反对 | 1 |
| agree | 回复认可原评论或原评论者的观点 | 2 |
| unsure | 根据给出的信息无法作出判断 | −100，出现在另列的 Unsure 数据中 |

编码依据补充材料 A.5，不是按“负数代表反对、正数代表同意”直接编码。讨论互动图时可以另作符号映射，但不能将映射后的值与数据字段混用。[补充 A.3、A.5](https://datasets-benchmarks-proceedings.neurips.cc/paper/2021/file/6f3ef77ac0e3619e98159e9b6febf557-Supplemental-round2.zip)

“中立”与“不确定”有不同含义。前者是对互动关系的判断，后者是标注者缺乏足够依据。补充说明提醒，澄清问题常常是中立，但讽刺或愤怒的疑问也可能表达反对；互不相关、无法理解的文字不能因为没有出现反对词就直接判为中立。

正文提供了一个被模型误判的例子。父评论认为英国政府理解移民的经济价值，政策上的敌意主要出于选票考虑；回复认同“政府知道英国需要移民”，但质疑政府官员本人的态度。人工将这段部分认可、部分反对的交流标为中立，BERT 却高置信度判为同意。这是论文对原样本的分析，不代表所有“先同意再反对”的回复都有一条机械适用的标签规则。[正文 §4.2，第 7–8 页](https://datasets-benchmarks-proceedings.neurips.cc/paper/2021/file/6f3ef77ac0e3619e98159e9b6febf557-Paper-round2.pdf)

附录还提供澄清乳业环境影响的中立回复、补充对方论据的同意回复，以及在同一政治阵营内部否定对方具体判断的反对回复。它们说明，赞同或反对的目标必须从当前评论对中读取，不能用话题或社区名称代替。

## 从五个社区筛选浅层互动

### 来源、时间与文本清理

作者通过当时的 PushShift API 收集 Reddit 历史内容，覆盖 r/Brexit、r/climate、r/BlackLivesMatter、r/Republican、r/democrats。前两类追溯较长时间的讨论，其他三类从 2020 年 1 月起收集，关注当年的社会运动与美国选举。正文称 Brexit 与 climate 的抓取范围追溯至社区建立、截至 2021 年 5 月，但筛选后表 1 的最早日期分别是 2016 年 6 月和 2015 年 1 月。原始抓取起点与最终保留数据起点应分开理解。[正文 §3.1、表 1](https://datasets-benchmarks-proceedings.neurips.cc/paper/2021/file/6f3ef77ac0e3619e98159e9b6febf557-Paper-round2.pdf)

清理过程去掉空评论、已删除作者、因隐私原因不可见的内容和包含超链接的评论，移除段落换行并替换少量特殊字符。作者特意保留可能冒犯或带攻击性的文字，以保留原讨论的表达方式。本文的说明不以这些文本中的事实主张为已验证事实。

进一步的筛选包括：

- 对主题帖，按至少 10 个词和评论数量阈值筛选；评论数阈值 $k$ 分别为 BLM 2、climate 5、Republican 5、democrats 5、Brexit 10。
- 对评论，去掉不足 10 个词或超过 100 个词的内容，以及带超链接的内容。
- 给标注者展示的主题帖截断至 100 个词，用于提供语境。
- 只保留父评论直接回复主题帖、子评论再回复父评论的浅层评论对，而不是整条往返讨论。

正文解释，较深的交流可能走向反复攻击，而意见相近者的交流有时较短，因此选择浅层互动作为两名用户交流的代理。这是作者的采样设计，不能据此推断深层讨论普遍缺乏内容。[正文 §3.1](https://datasets-benchmarks-proceedings.neurips.cc/paper/2021/file/6f3ef77ac0e3619e98159e9b6febf557-Paper-round2.pdf)

### 附录过滤比例的分母不能相加

补充材料列出各筛选规则影响的数据比例：

| 过滤规则 | Brexit | Republican | Democrats | Climate | BLM |
| --- | ---: | ---: | ---: | ---: | ---: |
| 主题帖评论数低于 $k$ | 58% | 71% | 71% | 75% | 70% |
| 主题帖不足 10 词 | 32% | 44% | 43% | 30% | 52% |
| 评论不足 10 词 | 21% | 31% | 32% | 21% | 34% |
| 评论超过 100 词 | 12% | 5% | 5% | 14% | 6% |
| 评论包含超链接 | 6% | 6% | 4% | 14% | 6% |
| 评论嵌套层级超过 2 | 55% | 42% | 41% | 45% | 35% |

这是[补充 A.2 的两张表](https://datasets-benchmarks-proceedings.neurips.cc/paper/2021/file/6f3ef77ac0e3619e98159e9b6febf557-Supplemental-round2.zip)合并展示。前两行以帖子为对象，后四行以评论为对象；同一内容也可能触发多个条件。原文没有完整交代每行分母是否随顺序更新，因此不能将比例简单相加来推算最终保留率。

Brexit 的互动远多于其他社区，作者又只保留在某个月内至少对 10 个帖子发表评论的活跃用户。其他社区没有这项相同的活跃度限制。最终送入标注流程的评论回复对共 **49,140 条**。因此，数据不是随机抽取的 Reddit 用户样本，Brexit 子集还额外偏向持续活跃的讨论者。

## 529 名标注者如何形成最终标签

标注团队由 **529 名英语熟练的 Scale 标注者**组成。培训包含书面说明、内部领域专家讲解、社会运动及英美政治入门材料，以及示例和测验。作者先标注 **74 条黄金样本**，根据标注者在这些样本上的表现筛选人员，并形成个人置信度分数。[正文 §3.2](https://datasets-benchmarks-proceedings.neurips.cc/paper/2021/file/6f3ef77ac0e3619e98159e9b6febf557-Paper-round2.pdf)

每项任务给出社区名称、初始帖子、评论回复对和常见缩写表。标注者还可以查询不理解的俚语或政治背景。主文提到完整说明有 10 页、含 10 个示例；官方补充展示了其中三页说明，额外示例和黄金数据需向作者索取。不能把这三张截图当作全部培训材料。

每条样本由 **3—5 人**标注。Scale 的动态共识流程根据参与者平均置信度与最低要求决定人数，最终采用多数类；同意、中立、反对票数相同时，交给内部领域专家复核。论文说明报酬高于标注者所在劳动力市场的最低工资，但没有给出地区分布、具体单价、工时或总标注费用。

过滤掉 unsure 和一致程度不足 $2/3$ 的样本后，主要数据集剩 **42,894 条**。与 49,140 相比净减少 **6,246 条**，约为 12.7%；原文没有分别列出 unsure、低一致性及二者重叠的准确数量，不能把 6,246 当成两个互不重叠过滤类别各自的计数。

用 $n_i$ 表示样本 $i$ 的标注人数、$v_i$ 表示支持最终标签的人数，补充字段 `agreement_fraction` 可以解释为：

$$
a_i=\frac{v_i}{n_i}.
$$

保留要求是 $a_i\ge2/3$。例如三人中两人同意最终标签时刚好通过；若五人中只有三人支持，则 $3/5=0.6$，不能通过。这个比例衡量标注共识，不是标签正确的概率。数据说明另列 `individual_kappa`，称其为基于 Fleiss’ kappa 的字段；它与简单赞同票比例不是同一个量，不能把二者混称为“准确率”。[补充 A.5](https://datasets-benchmarks-proceedings.neurips.cc/paper/2021/file/6f3ef77ac0e3619e98159e9b6febf557-Supplemental-round2.zip)

论文报告只有约 **33%** 的标注完全一致。它说明这类短交流存在明显解释分歧，而不是说其余 67% 的标签必然错误，也不是模型准确率的理论上限。过滤争议样本可以提高共识程度，但会改变最终评测集所覆盖的困难程度。

## 发布内容与互动图

### 社区规模与标签比例

下表保持正文表 1 的统计。正向、负向分别对应同意和反对，不是独立的情感分类标签。

| 社区 | 最早保留日期 | 图中用户节点 | 评论回复边 | 同意 | 中立 | 反对 |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| Brexit | 2016-06 | 722 | 15,745 | 29% | 29% | 42% |
| climate | 2015-01 | 4,580 | 5,773 | 32% | 28% | 40% |
| BlackLivesMatter | 2020-01 | 2,516 | 1,929 | 45% | 22% | 33% |
| Republican | 2020-01 | 8,832 | 9,823 | 34% | 25% | 41% |
| democrats | 2020-01 | 6,925 | 9,624 | 42% | 22% | 36% |

五行边数相加为 42,894。用户数不能直接相加当作跨社区去重后的总人数；同一用户可能参与多个社区。标签比例经过取整，也不能用其乘以边数反推每类精确条数。[正文表 1](https://datasets-benchmarks-proceedings.neurips.cc/paper/2021/file/6f3ef77ac0e3619e98159e9b6febf557-Paper-round2.pdf)

作者将每个社区组织成带时间信息、允许同一对用户有多次互动的图。节点是用户，每次评论回复关系是一条边；文本、标签、主题与时间是边相关信息。两人可以在不同帖子上多次交流，甚至表达不同关系，因此不能把所有互动压成一次永久“友好”或“敌对”的判断。

### 三类文件与主要字段

补充 A.5 说明计划提供三类文件：清理前的 Raw、通过一致性过滤的 Labeled Data，以及包含 unsure 或低一致性样本的 Unsure Labels。后者不能未经筛选就加入三分类测试集。

| 字段 | 用途 |
| --- | --- |
| `msg_id_parent`、`msg_id_child` | 识别两条评论，检查重复评论和共享父评论 |
| `submission_id`、`submission_text` | 识别主题帖，保留截断后的主题语境 |
| `body_parent`、`body_child` | 模型直接使用的评论与回复文本 |
| `author_parent`、`author_child` | Reddit 用户名，用于构建互动关系 |
| `subreddit` | 社区来源 |
| `exact_time`、`datetime` | 互动的 UTC 时间及可读时间表示 |
| `label`、`agreement_fraction`、`individual_kappa` | 最终关系标签及标注一致性相关字段 |

这些是论文给出的字段说明，本次未取得原始数据包，未逐文件验证是否全部存在，也没有重计重复文本、跨划分共享用户或共享帖子。[补充 A.5](https://datasets-benchmarks-proceedings.neurips.cc/paper/2021/file/6f3ef77ac0e3619e98159e9b6febf557-Supplemental-round2.zip)

用户名提供了图连接键，不等于不可关联的匿名编号。补充 A.1 也承认文本可能意外暴露个人信息，并提出允许申请移除帖子或用户名；不能只因没有真实姓名字段，就将数据描述成不存在识别风险。本文不展示具体用户档案或根据标签推断个人政治属性。

## 基线模型怎样训练与评分

作者使用 Hugging Face 的 BERT、XLNet、RoBERTa、DeBERTa 实现，把父评论、分隔标记 `[SEP]`、子评论连接成输入，完成三分类。这里的“预训练模型”是被用于训练分类器的语言模型，不是对对话模型直接进行零样本提问。

通用三分类器可以表示为：

$$
p_\theta(y\mid x)=\operatorname{softmax}(z_\theta(x))_y,
\qquad
\hat y=\arg\max_{y\in\{0,1,2\}}p_\theta(y\mid x).
$$

若采用标准交叉熵，训练目标是 $-\log p_\theta(y\mid x)$。这只是解释文本分类流程的常见形式；论文没有列出训练损失、分类头及其实现代码，不能把该表达当作作者披露的精确优化配置。

训练、验证、测试按时间顺序划分为 **80%／10%／10%**，较晚的数据用于测试。每个模型用不同随机种子训练 **4 次**。硬件为两张 **NVIDIA TITAN RTX 24GB**。论文没有给出学习率、优化器、epoch、batch size、最大 token 数、截断策略、早停与最佳检查点选择，也没有公开这四个种子的具体值。[正文 §4.1–4.2](https://datasets-benchmarks-proceedings.neurips.cc/paper/2021/file/6f3ef77ac0e3619e98159e9b6febf557-Paper-round2.pdf)

时间划分限制了监督训练直接看到较晚评论，但并不自动实现作者隔离、帖子隔离或预训练污染排除。若同一主题帖、用户或父评论跨越划分边界，仍可能共享背景；图方法还需明确预测时允许看到哪些历史边。论文没有给出逐样本划分清单和这些重叠审计。

主要指标为准确率：

$$
\operatorname{Accuracy}=\frac1N\sum_{i=1}^{N}\mathbf1[\hat y_i=y_i].
$$

$N$ 是对应实验测试集里的评论回复对数，不是用户数或总标注人数。针对某一类，还报告：

$$
\operatorname{Precision}_c=\frac{TP_c}{TP_c+FP_c},\qquad
\operatorname{Recall}_c=\frac{TP_c}{TP_c+FN_c},\qquad
F_{1,c}=\frac{2\operatorname{Precision}_c\operatorname{Recall}_c}
{\operatorname{Precision}_c+\operatorname{Recall}_c}.
$$

`support` 是该类真实样本数。它与模型预测成该类的数量不同。

## 三分类结果与中立类失误

正文表 2 的结果如下。括号是四次训练的**标准差**，不是置信区间；换成百分点解释，例如 0.6% 表示准确率标准差 0.6 个百分点。

| 模型 | 平均准确率 | 标准差 |
| --- | ---: | ---: |
| BERT base uncased | 62.4% | 0.6% |
| BERT base cased | 61.8% | 0.1% |
| BERT large uncased | 63.7% | 1.2% |
| XLNet base | 63.6% | 0.8% |
| XLNet large | 63.3% | 0.6% |
| RoBERTa base | 63.2% | 1.4% |
| RoBERTa large | 64.1% | 1.3% |
| DeBERTa base | 63.0% | 0.6% |
| DeBERTa large | 64.1% | 0.8% |

从 BERT base uncased 到表中最高均值的差距为 1.7 个百分点。模型增大并非每一组都提高，例如 XLNet large 的均值略低于 base；但四次运行及这些标准差不足以建立稳定的架构优劣结论，论文也没有报告配对显著性检验。[正文表 2](https://datasets-benchmarks-proceedings.neurips.cc/paper/2021/file/6f3ef77ac0e3619e98159e9b6febf557-Paper-round2.pdf)

表 3 进一步给出 BERT base uncased 的分类表现：

| 真实类别 | Precision | Recall | F1 | support |
| --- | ---: | ---: | ---: | ---: |
| 反对 | 64.3% | 73.8% | 68.7% | 557 |
| 中立 | 63.7% | 44.1% | 52.1% | 517 |
| 同意 | 60.1% | 69.4% | 64.4% | 500 |

中立类召回率只有 44.1%，不是说“预测为中立的结果只有 44.1% 正确”；后者对应 precision。表 4 的行归一化混淆矩阵显示，真实中立样本约 28% 被判为反对、约 28% 被判为同意，只有约 44% 保留为中立。反对类约 74% 判对，同意类约 69% 判对。[正文表 3–4](https://datasets-benchmarks-proceedings.neurips.cc/paper/2021/file/6f3ef77ac0e3619e98159e9b6febf557-Paper-round2.pdf)

### 测试分母尚有说明不足

表 3 的 support 合计为 **1,574**，接近 Brexit 的 15,745 条数据的 10%，并非全体 42,894 条的 10%。同一模型的 62.4% 也出现在后文 Brexit 单社区实验里。不过，表 2–3 本身没有清楚标注每张表对应的社区范围及精确测试清单，因此不能将它们不加说明地称为“全数据集约 4,289 条测试样本的成绩”。

表 3 的最大类别占比为 $557/1574\approx35.4\%$，与表 6 的 Brexit 多数类基线相符。正文对表 2 泛称模型超过多数类约 22—24 个百分点，也不能据此倒推出所有表格使用同一个 40% 基线。本文保留原表数字，将未说明的对应关系留作复现时需要确认的部分。

## 正式论辩与 Reddit 讨论的迁移

作者用 Perspectrum 对比更加正式、结构化的论辩文本。为统一任务，Perspectrum 只保留 support／oppose，DEBAGREEMENT 只保留 agree／disagree，**移除 neutral，转成二分类**。因此，这一实验的 80% 左右准确率不能与上一节的三分类分数直接比较。[正文 §4.2、表 5](https://datasets-benchmarks-proceedings.neurips.cc/paper/2021/file/6f3ef77ac0e3619e98159e9b6febf557-Paper-round2.pdf)

| 训练来源 → 测试来源 | Brexit | Republican | Democrats | Climate | BLM | Perspectrum |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 所有 Reddit 社区训练 | 82.1% | 78.4% | 81.0% | 83.9% | 79.2% | 57.7% |
| Perspectrum 训练 | 56.4% | 54.1% | 57.1% | 55.2% | 58.4% | 90.5% |
| 测试集多数类基线 | 52.5% | 52.7% | 51.0% | 58.3% | 69.8% | 52.9% |

Perspectrum 训练的模型在该数据上达到 90.5%，迁移到各 Reddit 社区只有 54.1%—58.4%。在 Climate 和 BLM 上还低于对应多数类基线，分别差 3.1 和 11.4 个百分点。反过来，Reddit 训练的模型在 Perspectrum 上为 57.7%，也远低于该数据的同域训练成绩。

**57.7% 的方向是 Reddit 训练、Perspectrum 测试。**Scale 的后续介绍将这个数字写成 Perspectrum 训练后测试 Reddit 的结果，与主文表 5 不符，本文采用论文表格。[论文表 5](https://datasets-benchmarks-proceedings.neurips.cc/paper/2021/file/6f3ef77ac0e3619e98159e9b6febf557-Paper-round2.pdf)、[Scale 作者介绍](https://learn.scale.com/public/blogs/exploring-online-debates-with-debagreement-aerin-kim-neurips)

这组实验展示了两类语料之间的迁移困难。但写作风格、话题、样本构成与标签形成过程都同时变化，实验没有只改变“正式程度”。因而，它不能单独证明性能差距全部由俚语或讽刺造成，也不能将结果推广成所有领域迁移都无效。

## 跨社区训练与父子评论消融

### 跨社区不等于每一项都更好

表 6 回到三分类，比较在目标社区自身、其余社区或全部社区训练 BERT base uncased 的结果：

| 训练条件 | Brexit | Republican | Democrats | Climate | BLM |
| --- | ---: | ---: | ---: | ---: | ---: |
| 多数类基线 | 35.4% | 40.3% | 39.7% | 41.2% | 53.6% |
| 仅目标社区 | 62.4% | 64.6% | 65.3% | 62.2% | 58.3% |
| 其他社区 | 62.2% | 64.3% | 66.9% | 65.4% | 70.8% |
| 全部社区 | 64.1% | 64.9% | 66.9% | 66.1% | 68.6% |

全部社区训练相对于仅目标社区，在五列中都有更高均值。尤其 BLM 从 58.3% 到 68.6%，提高 10.3 个百分点；仅其他社区训练则达到 70.8%，还高于全部社区训练的结果。

“其他社区训练优于自身训练”并非五个社区都成立：Brexit 低 0.2 点，Republican 低 0.3 点。论文的概括应结合逐列数据理解。跨社区实验没有提供等训练样本量控制或重复运行误差，因此不能分清增加训练量、增加话题多样性与目标社区特性各贡献多少。[正文 §4.3、表 6](https://datasets-benchmarks-proceedings.neurips.cc/paper/2021/file/6f3ef77ac0e3619e98159e9b6febf557-Paper-round2.pdf)

### 回复包含更多直接信号，父评论仍有作用

在 Brexit 上，模型分别用双文本、只用父评论、只用回复重新训练：

| 输入 | 准确率 |
| --- | ---: |
| 父评论与回复 | 62.4% |
| 仅父评论 | 38.1% |
| 仅回复 | 60.7% |

只用回复比只用父评论高 22.6 个百分点；加上父评论后又比只用回复高 **1.7 个百分点**。这说明在此设置下，回复本身含有较多可预测关系标签的信号，前文语境仍提供额外信息。[正文 §4.3](https://datasets-benchmarks-proceedings.neurips.cc/paper/2021/file/6f3ef77ac0e3619e98159e9b6febf557-Paper-round2.pdf)

这是改变训练输入的对照，不是训练完成后临时遮住一段文本的测试。它也没有检验加入主题帖、完整讨论串、历史互动图或作者嵌入的独立收益。不能把 1.7 点提升解释成图结构带来的提升。

## 图分析与语言模型实验的界线

论文用三个月滚动平均展示各社区的互动数量、Brexit 中同意／中立／反对的比例，并将曲线与一些事件日期对照。作者还在整段时间汇总的 Brexit 带符号互动图上使用既有社区发现方法，得到四个群体，再阅读各群体活跃用户的评论，解释其讨论方向：其中一个倾向脱欧，另三个倾向留欧，但关注的具体议题不同。[正文 §3.3、图 3–4](https://datasets-benchmarks-proceedings.neurips.cc/paper/2021/file/6f3ef77ac0e3619e98159e9b6febf557-Paper-round2.pdf)

这里是基于已标注互动的描述性分析。事件前后曲线变化没有通过对照设计识别因果；样本本身也经过活跃度、长度和嵌套层级过滤，不能直接充当全体用户或社会舆论的比例。社区解释来自作者对活跃用户文本的阅读，而不是对每个节点另行完成的政治立场标注。

**把用户嵌入注入语言模型、用图神经网络预测边符号，都属于第 5 节的未来方向。**论文提供了实现这些研究所需的关联字段，但未报告文本模型与“文本＋图模型”的性能消融表。既有短介绍中泛称“研究额外上下文作用”，具体应落到已经验证的父评论上下文和数据来源对照上，不能补出一个并不存在的图增强模型。

## 原始数据、代码和复现的现状

### 官方资料能取得的范围

本次取得正式正文和完整补充材料，并固定了本地文件。官方补充下载链接以 `.zip` 结尾，但实际响应的文件头是 PDF，共 11 页；其中 A.3 的三页标注说明嵌在图片里，已渲染逐页阅读，不能只看文本提取结果。[会议页及 Supplemental 入口](https://datasets-benchmarks-proceedings.neurips.cc/paper/2021/hash/6f3ef77ac0e3619e98159e9b6febf557-Abstract-round2.html)

原始下载地址 `scale.com/open-datasets/oxford`，以及后来文献使用的 `scale.com/open-av-datasets/oxford`，在本次访问时都跳转到 Scale 的汽车业务页面，未提供本数据集文件。补充材料称清理软件是公开 Python 软件，但未给出可用于定位其版本的专门仓库地址。本次检查论文、Scale 项目及作者介绍后，未取得可确认对应本篇实验的训练与划分代码、完整数据包或训练权重。

第一作者后续公开的社交图嵌入和 Signed Louvain 仓库属于其他论文，不能据此替代本篇模型或重建其 2021 年实验。第三方重新上传的数据和后来微调的模型，也不能仅因名称含有 DEBAGREEMENT 就自动视为作者的固定发布版本。

因此，本次没有可列出的 **DEBAGREEMENT 官方代码 commit 或数据文件哈希**，没有重新计算 42,894 条样本及其划分，也没有复现模型准确率。这里的边界是目前可访问材料不足，不是断言这些资源从未发布。

### 复现需要补齐的设置

| 环节 | 需要确认的材料 |
| --- | --- |
| 数据版本 | Raw、Labeled、Unsure 三类文件及哈希，标签和一致性过滤是否已经应用 |
| 时间划分 | 按哪个时间字段排序，按社区还是全体划分，边界时间和样本 ID，表 2–3 的实际范围 |
| 关联泄漏 | 评论、主题帖、作者跨划分重叠，图中测试期间的边是否可见 |
| 模型训练 | 检查点和 tokenizer 版本、分类头、学习率、优化器、epoch、batch size、长度与截断、四个种子 |
| 结果输出 | 每次运行预测、最佳模型选择规则、类别映射、accuracy 和逐类指标的计算脚本 |
| 额外实验 | 二分类过滤、Perspectrum 划分、跨社区训练量、父子评论移除方式 |

论文报告使用两张 TITAN RTX 24GB，但没有训练耗时和总预算，不能由硬件型号推算为作者实际成本。根据公开材料整理的流程也不等于可直接运行的复现命令。

### 数据说明保留的限制

附录称数据通常按 CC BY 4.0 加上 Scale／Oxford 的附加数据条款提供；不能简写成没有附加条件的任意使用许可。附录同时说明没有独立伦理审查和影响评估，没有逐个通知发帖者，删除请求机制是作者提出的维护安排。其资料表还有“不会对外分发”与“审稿后公开发布”并存等未统一的条目，应结合正文和实际发布状态理解，不能把所有回答都当作经过独立验证的保证。[补充 A.1、A.6](https://datasets-benchmarks-proceedings.neurips.cc/paper/2021/file/6f3ef77ac0e3619e98159e9b6febf557-Supplemental-round2.zip)

## 这项研究覆盖的范围

DEBAGREEMENT 的主要贡献是把关系标签与评论、回复、作者、主题帖和时间放在同一份数据结构里，让研究者既能做文本分类，也能研究互动关系。其实际实验揭示了中立类的识别困难、正式论辩与 Reddit 交流之间的迁移落差，以及父评论和跨社区训练所提供的额外信息。

它覆盖的是五个英语政治和社会议题社区中的经过筛选的浅层交流。完整讨论串、其他语言、消费或技术类社区、当前大模型，以及图增强分类器都没有在本文中完成系统评测。阅读结果时，需要同时保留这些采样条件、标注分歧和各张实验表的具体任务。

## 原始资料

- [NeurIPS 2021 论文页、正文及补充材料](https://datasets-benchmarks-proceedings.neurips.cc/paper/2021/hash/6f3ef77ac0e3619e98159e9b6febf557-Abstract-round2.html)
- [Scale Labs 项目与目录日期](https://labs.scale.com/papers/debagreement-a-comment-reply-dataset-for-disagreement-detection-in-online-debates)
- [Aerin Kim 的官方介绍，2022-03-24](https://learn.scale.com/public/blogs/exploring-online-debates-with-debagreement-aerin-kim-neurips)
- [作者 Valentina Semenova 的研究页面](https://sites.google.com/view/valentinams/research)
- [论文原始数据入口，当前已跳转](https://scale.com/open-datasets/oxford)

资料核对截至 2026 年 9 月 13 日。已通读 12 页正式稿、全部参考文献和 11 页补充材料，视觉核对标注说明及主要图表；未运行语言模型、训练、GPU 实验或付费调用。
