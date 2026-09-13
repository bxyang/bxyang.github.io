---
title: "Lynx：训练模型判断回答是否忠实于参考材料"
company: "patronus-ai"
date: "2024-07-11"
dateLabel: "2024-07-11"
kind: "论文与模型"
description: "精读 Lynx 的合成训练、HaluBench 六领域评测、结果口径与公开代码复现条件。"
reviewed: "2026-09-12"
readingStatus: "deep-read"
paperVersion: "arXiv:2407.08488v2，2024-07-22"
---

[← Patronus AI](/companies/patronus-ai) · [HaluBench 数据页](/companies/patronus-ai/halubench) · [全部工作](/research)

# Lynx：训练模型判断回答是否忠实于参考材料

检索增强生成把参考材料交给模型，但回答仍可能改错数字、张冠李戴，或者加入材料没有提供的信息。Lynx 在生成回答之后增加一个检查环节：同时阅读问题、参考材料和回答，先给出判断依据，再输出 `PASS` 或 `FAIL`。作者用带有解释的合成样本微调 Llama 3，并构建 HaluBench 评测检测能力。论文中 Lynx 70B 的六领域平均准确率为 87.4%，GPT-4o 为 86.5%；这一优势属于论文的特定数据和评测设置，部分领域仍由对照模型领先。[论文 §3—5、表 3](https://arxiv.org/pdf/2407.08488v2)

| 项目 | 核对信息 |
| --- | --- |
| 原文 | *Lynx: An Open Source Hallucination Evaluation Model* |
| 作者 | Selvan Sunitha Ravi、Bartosz Mielczarek、Anand Kannappan、Douwe Kiela、Rebecca Qian |
| 机构与公司参与 | Ravi、Mielczarek、Kannappan、Qian 署名 Patronus AI；Kiela 署名 Contextual AI 与 Stanford University。Patronus 发布模型、数据与代码 |
| 首发与阅读版本 | 2024 年 7 月 11 日首发；本文完整阅读 7 月 22 日的 arXiv v2，共 13 页，含附录 A、B |
| 发表信息 | 本文依据 arXiv 预印本，不另行推定会议录用情况 |
| 本地原文 | `research/papers/patronus-ai/lynx.pdf` |
| 配套成果 | Lynx 8B、70B；HaluBench 与本文属于同一篇论文，不重复计算为独立精读 |

版本日期见 [arXiv 记录](https://arxiv.org/abs/2407.08488v2)，作者机构见原文首页。

## 检查的是回答与材料的关系

论文表 1 给出一个需要比较数字的例子：比赛材料记录，Chiefs 的 Lawrence Tynes 踢进 42 码射门，Rams 的 Jeff Wilkins 踢进 41 码射门。问题询问哪支球队完成了更远的射门，待检查回答却是 Rams。检测器要把球员、球队和距离对应起来，才能判断答案不受材料支持。只看到两个球队名字都出现在材料中，并不足以给出 `PASS`。[原文表 1](https://arxiv.org/pdf/2407.08488v2)

Lynx 的输入可以写成三元组 `(问题 q，材料 c，回答 a)`。输出包含解释 `REASONING` 和二元标签 `SCORE`。以下是根据上述例子整理的说明性输出，不是一次实际运行结果：

```json
{
  "REASONING": ["Chiefs 的射门为 42 码，Rams 为 41 码；回答把距离更远的球队写反了。"],
  "SCORE": "FAIL"
}
```

这里的“幻觉”主要指回答中出现材料不支持或与材料矛盾的信息。论文称它为 reference-free evaluation，含义是推理时不需要标准答案；参考材料仍然是必要输入。它没有单独检查检索材料是否真实、是否最新，也没有完成面向外部世界的事实核验。§3.1 甚至明确区分了相关性和忠实性：检索内容与问题无关，但回答忠实于该内容时，仍可视为忠实。

原文的示例与这一定义并非完全一致。图 1 中，问题要求识别 Clytostoma 与 Syneilesis 所属的分类层级，回答只说两者都是植物；Lynx 因为没有回答“属”而判为失败。这个例子也涉及是否答对问题、答案是否足够具体。因此，不能把论文所有示例都理解成纯粹的“材料是否蕴含回答”测试。实际使用仍需要先固定判定标准，再检查它与本地业务标签是否一致。[原文 §3.1、图 1](https://arxiv.org/pdf/2407.08488v2)

## 从通用裁判到专门训练的检测器

论文比较了两类已有做法。一类直接给通用大模型判定提示，让它充当裁判；另一类把回答拆成若干陈述，检查每条是否被材料支持，再聚合为分数。后者以 RAGAS 的 faithfulness 指标为代表。

Lynx 保留“阅读材料后解释判断”的交互方式，但对裁判模型本身进行监督微调。基础模型为 Llama 3 Instruct 的 8B 和 70B 版本，训练目标包含解释与最终标签。主要改变发生在训练数据：从已有问答出发，构造不易靠表面词汇识别的错误，再让教师模型提供判断理由。[原文 §2、§3.3](https://arxiv.org/pdf/2407.08488v2)

### 合成错误回答

设已有样本为 `(q,c,a,y)`，其中 `y` 表示回答是否忠实。论文用扰动函数生成修改后的回答，并把标签翻转：

$$
\widetilde a \sim f_p(q,c,a),\qquad
D' = \{(q,c,\widetilde a,1-y):(q,c,a,y)\in D\}.
$$

`f_p` 由 GPT-4o 实现。实际构造重点是把原本忠实的回答改成不忠实回答：尽量保留自然表达，只修改关键事实，例如数值、实体关系或陈述的肯否。标签翻转是构造目标，不是自动成立的数学保证；修改后的答案可能仍被材料支持，因此还需要质量检查。

附录 A 的扰动提示要求教师返回 `new_answer` 和 `change_made`，采样温度为 0。随后，生成失败样本解释时，教师同时看到问题、材料、原标准答案、修改内容和新回答；提示要求解释新回答为什么不忠实，并避免在解释中直接提及标准答案或修改记录。成功样本则生成支持回答的解释。[原文 §3.2、附录 A.1](https://arxiv.org/pdf/2407.08488v2)

这一区分影响如何理解训练理由：教师已经知道预期标签和错误的构造过程，解释属于带有额外信息的监督信号。它不是另一个独立裁判对合成标签的盲审，也不能据此断定每条解释都可靠。

### 监督训练与资源

论文报告训练集 2,400 条、验证集 800 条，来源为 RAGTruth、DROP、CovidQA、PubMedQA；训练部分每个来源 600 条，其中 300 条采用扰动。FinanceBench 和 HaluEval 没有出现在这份训练来源清单中，但公开资料不足以逐条验证原始训练集与评测集之间的重叠情况。

模型学习输出完整的“解释＋标签”。为说明这一过程，可用标准自回归监督学习目标表示：

$$
\mathcal L(\theta)= -\frac{1}{N}\sum_{i=1}^{N}\sum_{t=1}^{|z_i|}
\log p_\theta(z_{i,t}\mid q_i,c_i,a_i,z_{i,<t}),
$$

其中 `z_i` 是教师生成的输出序列，包含解释和最终分数；最小化损失，使模型更可能生成这些目标 token。这个公式是对监督微调的说明性表达，论文没有另外提出新的损失函数，也没有给出解释与标签分别加权的实验。

原文训练设置为 3 个 epoch、学习率 `5e-7`、batch size 256。70B 使用 32 张 H100，配合混合精度、FlashAttention、FSDP FULL_SHARD 与激活检查点。优化器为 LionW，两个动量参数为 0.9、0.95，梯度范数裁剪为 1，学习率采用余弦调度并设置 100 步预热。模型卡记录最大训练序列长度 8,000。论文没有完整报告训练耗时、成本及逐项资源消耗。[原文 §3.3、附录 B.1](https://arxiv.org/pdf/2407.08488v2)、[70B 模型卡固定版本](https://huggingface.co/PatronusAI/Llama-3-Patronus-Lynx-70B-Instruct/blob/503b9b9469aec7be01144517e697a20bd966f27a/README.md)

## HaluBench 的组成与标签质量

HaluBench 汇集六个来源。本文实际下载固定版本 Parquet，统计得到 **14,900 条**；论文中的“15k”是近似表述。`PASS` 表示忠实，`FAIL` 表示不忠实。

| 来源 | 总数 | PASS | FAIL | 内容与构造 |
| --- | ---: | ---: | ---: | --- |
| DROP | 1,000 | 500 | 500 | 需要数值、比较等离散推理的阅读理解；包含合成错误 |
| FinanceBench | 1,000 | 500 | 500 | 财务材料问答；包含合成错误 |
| CovidQA | 1,000 | 500 | 500 | 疫情相关文献问答；包含合成错误 |
| PubMedQA | 1,000 | 500 | 500 | 生物医学文献问答；包含合成错误 |
| HaluEval | 10,000 | 4,990 | 5,010 | 问答幻觉数据，原始问题与材料来自 HotpotQA |
| RAGTruth | 900 | 740 | 160 | 来自人工标注的 RAG 回答，转换为回答级二元标签 |
| 合计 | 14,900 | 7,730 | 7,170 | HaluEval 约占 67.1% |

数据构造见[原文 §3.2](https://arxiv.org/pdf/2407.08488v2)；精确行数与标签分布为本文对 [HaluBench 固定版本](https://huggingface.co/datasets/PatronusAI/HaluBench/tree/5966a87929f51c204ab3cbef986b449495cc97b6) 的本地统计。它们不是重新运行检测模型得到的结果。

前四个来源各取 500 条忠实回答，并构造另 500 条不忠实回答。HaluEval 与 RAGTruth 已经包含幻觉标注，其来源和错误形成机制与这四组不同。特别是 RAGTruth 的自然模型错误与人工标注，不应与 GPT-4o 刻意改写的错误混为一类。

作者对四组合成数据各抽 50 条进行人工检查，共 200 条。标签一致率依次为 DROP 92%、FinanceBench 90%、CovidQA 96%、PubMedQA 96%，平均 93.5%，论文概括为 94%。这是合成标签与人工判断的样本一致率，不是 Cohen’s κ，也不表示整个评测集逐条经过人工确认。文中还表示对 FinanceBench 示例进行了全面人工检查并采用人工标签，但该句把数据集写成了 HaluEval；这一名称不一致需要保留，不能据此补全未公开的标注流程。[原文 §3.2](https://arxiv.org/pdf/2407.08488v2)

公开测试数据包含 `id`、`passage`、`question`、`answer`、`label`、`source_ds` 六个字段，能够重新评分，却不能恢复教师每一次扰动和人工修订的全过程。原始 2,400/800 条训练验证数据的可核对清单，以及完整去重、污染检查流程，未在此次检查的论文配套仓库中找到。

## 评分与实验设置

各大模型使用相同的零样本判定提示，输出解释与最终 `PASS/FAIL`。对某个来源 `d`，准确率为：

$$
A_d = \frac{1}{n_d}\sum_{i=1}^{n_d}\mathbf 1[\widehat y_i=y_i].
$$

分母是该来源的评测样本数，指标越高越好。论文的主要模型行中，Overall 与六个来源准确率的等权平均吻合：

$$
A_{\mathrm{macro}}=\frac{1}{6}\sum_{d=1}^{6}A_d.
$$

例如 Lynx 70B 的六个分数平均为 87.383…%，四舍五入为 87.4%。这不能读成“14,900 条中有 87.4% 判对”。如果按实际样本数量加权，10,000 条 HaluEval 的权重会远大于其他来源。使用表中已经舍入的分项近似计算，Lynx 70B 的样本加权结果约为 88.05%；这只是口径演示，不是论文另报的结果。

RAGAS 的设置也需要单独说明。它先计算回答陈述中得到材料支持的比例，再以 0.5 为阈值：低于 0.5 判为失败，其余判为成功。这样的聚合允许部分陈述不受支持时仍得到成功标签，与提示中“出现不支持的信息就失败”的回答级标准存在差别。它是论文实际使用的基线配置，不能直接代表 RAGAS 在其他阈值下的效果。[原文 §4](https://arxiv.org/pdf/2407.08488v2)

70B 推理采用 vLLM、8 张 H100、张量并行度 8；8B 使用 Hugging Face 推理流程和 Accelerate。原文写明贪心解码，最多生成 600 个新 token。闭源模型包括 GPT-4o、GPT-4 Turbo、GPT-3.5 Turbo、Claude 3 Sonnet 与 Haiku，但没有给出足以锁定全部接口行为的日期化模型快照。论文没有为主要结果报告多次运行方差、置信区间或显著性检验。[原文 §4、附录 B.1](https://arxiv.org/pdf/2407.08488v2)

## 主要结果及其口径差异

下表摘录表 3 的关键行。单位为百分比，Overall 保留论文原值。

| 模型 | HaluEval | RAGTruth | FinanceBench | DROP | CovidQA | PubMedQA | Overall |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| GPT-4o | 87.9 | 84.3 | 85.3 | 84.3 | 95.0 | 82.1 | 86.5 |
| GPT-4 Turbo | 86.0 | 85.0 | 82.2 | 84.8 | 90.6 | 83.5 | 85.0 |
| Llama 3 Instruct 8B | 83.1 | 80.0 | 55.0 | 58.2 | 75.2 | 70.7 | 70.4 |
| Lynx 8B | 85.7 | 80.0 | 72.5 | 77.8 | 96.3 | 85.2 | 82.9 |
| Llama 3 Instruct 70B | 87.0 | 83.8 | 72.7 | 69.4 | 85.0 | 82.6 | 80.1 |
| Lynx 70B | 88.4 | 80.2 | 81.4 | 86.4 | 97.5 | 90.4 | 87.4 |

来源：[原文表 3](https://arxiv.org/pdf/2407.08488v2)。Lynx 70B 相对 GPT-4o 的 Overall 增加 **0.9 个百分点**，PubMedQA 增加 **8.3 个百分点**。同时，它在 FinanceBench 低于 GPT-4o，在 RAGTruth 低于 GPT-4 Turbo、GPT-4o，甚至低于基础 Llama 3 70B。训练带来的改进并不覆盖每个来源；Lynx 8B 的 RAGTruth 与其基础模型同为 80.0%。

原文中有几处数字需要按表格重新核对。Lynx 70B 与基础 70B 的 Overall 差为 `87.4−80.1=7.3` 个百分点，正文写作 7.8；与 GPT-3.5 Turbo 表中 58.7 的差为 28.7 个百分点，正文写作 27.6。本文引用分数时以表中对应行明确计算，不沿用这些文字差值。

Overall 一列也不能对所有行统一解释为已经验证的宏平均。例如 Claude 3 Sonnet 的六项分数平均约为 82.6%，表内 Overall 却为 78.8%；按公开数据规模加权也不能得到该值。论文未解释这个差异。因此，上述宏平均判断适用于已经核算吻合的主要模型行，不替作者修正其余行，也不利用存在口径疑点的数值扩大排名结论。

另一个影响结果解释的因素是类别不均衡。在公开 RAGTruth 子集中，始终预测 `PASS` 就能达到 `740/900≈82.2%` 的准确率，高于 Lynx 70B 表中的 80.2%。这不说明模型一定没有识别幻觉的能力，而是说明仅凭准确率不能判断少数类 `FAIL` 的召回率、误报率和业务代价。论文没有提供完整混淆矩阵，无法从总准确率反推出这些指标。

## 补充实验揭示的变化

附录 B.3 在原训练基础上加入 2,000 条 RAGTruth 数据。表 4 报告的结果如下：

| 70B 训练版本 | HaluEval | RAGTruth | FinanceBench | DROP | CovidQA | PubMedQA | Overall |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 原 Lynx | 88.4 | 80.2 | 81.4 | 86.4 | 97.5 | 90.4 | 87.4 |
| 增加 RAGTruth | 88.8 | 85.8 | 81.2 | 85.3 | 96.9 | 88.8 | 87.8 |

增加同来源数据后，RAGTruth 提高 5.6 个百分点，Overall 提高 0.4 个百分点；FinanceBench、DROP、CovidQA、PubMedQA 则略有下降。这个实验支持训练数据分布会影响各领域表现，但不是“去掉解释”或“只用自然错误”的消融，不能据此单独证明解释监督、某一种扰动方式的贡献。[原文附录 B.3、表 4](https://arxiv.org/pdf/2407.08488v2)

附录 B.2 还比较了 Llama 2 Chat 13B 微调前后：表 5 的原始模型准确率为 3.3%，微调后为 77.8%。作者解释，未微调版本经常无法遵循规定的 JSON 输出格式。这个结果把格式遵循和判断能力放在一起衡量，不能把 3.3% 简单理解成模型几乎完全不懂支持关系。

论文没有提供成体系的解释有无对照、合成与自然错误比例扫描、教师模型替换、训练样本量曲线，或者对全部失败样本的人工错误归因。8B 与 70B 的比较体现不同规模模型在相同研究框架下的结果，但不足以推导普遍的规模规律。

## 公开代码与论文配置的差异

本文固定检查 [官方仓库提交 `241fc162`](https://github.com/patronus-ai/Lynx-hallucination-detection/tree/241fc162cf5e76a01138128a97b34bdb2b343bee)。仓库提供训练和推理配置、两份推理脚本及依赖文件，并非一条命令就能重建论文所有实验的完整流水线。

| 项目 | 论文或模型说明 | 固定代码与文件中的情况 |
| --- | --- | --- |
| 训练 batch | 256 | 训练 YAML 为 `global_train_batch_size: 32`，不能不加调整就称为原配置 |
| 解码 | 贪心，最多 600 新 token | 推理 YAML 使用 2,000；模型 `generation_config.json` 默认 `do_sample: true`、温度 0.6、`top_p: 0.9`，需要显式覆盖 |
| 数据输入 | 问题、材料、回答与标签 | 脚本期望 `messages`、`_id`、`LABEL`；HaluBench 原始字段需要转换 |
| 命令参数 | 推理入口 | v2 脚本接收 `--hf_ds_path`，对应配置却使用 `--test_ds_path`，需要对齐 |
| 长度处理 | 评测样本总量见论文 | 配置将消息 token 上限设为 4,000，代码会过滤过长输入；必须记录最终评测分母 |
| 分数解析 | 期望 `PASS/FAIL` | v2 正则要求分数字符串有引号；v1 额外兼容无引号输出 |

差异依据上述仓库的 `mcli` 配置及推理脚本，以及 [70B 固定生成配置](https://huggingface.co/PatronusAI/Llama-3-Patronus-Lynx-70B-Instruct/blob/503b9b9469aec7be01144517e697a20bd966f27a/generation_config.json)。模型卡中 70B 页面的一段示例使用了 8B 模型名，实际执行时也需要确认载入的模型路径。

代码还通过特定提示文本拆分完整解码结果；修改提示后可能找不到这个分隔字符串。复现时更明确的处理方式是根据输入 token 长度切出新生成部分，保存原始文本，并把解析失败作为单独状态统计。原脚本最后会把结果上传 Hugging Face；只做本地验证时，应改为本地保存，避免把上传步骤误当作评分的必要条件。

### 对已发布输出的本地重算

本次没有下载模型权重或运行 GPU 推理，而是下载作者发布的 70B 输出，对其中可通过 `custom_id` 与 HaluBench `id` 直接一一对应的三个来源重新评分。使用 v1 风格规则：先匹配带引号的 `SCORE`，再兼容无引号 `PASS/FAIL`；无法解析的输出计为错误，分母保留全部 1,000 条。

| 来源 | 匹配条数 | 重算正确数 | 本次重算 | 论文表 3 |
| --- | ---: | ---: | ---: | ---: |
| DROP | 1,000 | 864 | 86.4% | 86.4% |
| PubMedQA | 1,000 | 904 | 90.4% | 90.4% |
| FinanceBench | 1,000 | 799 | 79.9% | 81.4% |

对应输出固定版本为 [DROP `88a68f7`](https://huggingface.co/datasets/PatronusAI/lynx-70b-instruct-drop-generations/tree/88a68f7f97d9d2125b7da311cd2dd1b7caef8d88)、[PubMedQA `4fc7407`](https://huggingface.co/datasets/PatronusAI/lynx-70b-instruct-pubmedqa-generations/tree/4fc740701aa78827cee8e44b7e671f7f1a0c1ad1)、[FinanceBench `86af9f8`](https://huggingface.co/datasets/PatronusAI/lynx-70b-instruct-financebench-generations/tree/86af9f8d37b505b92650f69e91ada95a8a6fbc2b)。测试标签统一使用下文固定的 HaluBench 版本。

三个文件的回答都无法直接通过严格 JSON 解析，常见形式是解释数组使用单引号、最终 `SCORE` 的标签没有引号。采用上述兼容规则可以重算 DROP 与 PubMedQA；FinanceBench 还有 2 条不能提取有效标签，其差异不能仅用这 2 条解释。现有证据不足以确认剩余差异来自标签修订、输出版本还是其他评分步骤，本文保留未解决状态。其他来源的输出 ID 与当前测试集命名不直接一致，本次没有通过猜测位置或编号强行拼接。

这项工作验证的是公开结果文件在指定标签与解析规则下的分数，不能替代原模型推理复现，也不能证明闭源基线或所有 Overall 都已重现。

### 固定版本后再执行模型评测

可从以下版本开始组织复现材料：

| 组件 | 固定标识 |
| --- | --- |
| 论文 | `arXiv:2407.08488v2` |
| 官方代码 | `241fc162cf5e76a01138128a97b34bdb2b343bee` |
| HaluBench | `5966a87929f51c204ab3cbef986b449495cc97b6` |
| Lynx 70B | `PatronusAI/Llama-3-Patronus-Lynx-70B-Instruct`，`503b9b9469aec7be01144517e697a20bd966f27a` |
| Lynx 8B | `PatronusAI/Llama-3-Patronus-Lynx-8B-Instruct`，`5523f869eb5eecb4bca417b6e6d3532e746a9664` |

[模型 8B 固定版本](https://huggingface.co/PatronusAI/Llama-3-Patronus-Lynx-8B-Instruct/tree/5523f869eb5eecb4bca417b6e6d3532e746a9664)、[模型 70B 固定版本](https://huggingface.co/PatronusAI/Llama-3-Patronus-Lynx-70B-Instruct/tree/503b9b9469aec7be01144517e697a20bd966f27a)。数据卡标注 CC BY-NC 2.0，模型卡标注 CC BY-NC 4.0，并需要同时查看基础模型的使用条件。

执行时先按公开提示转换字段，保留原始 ID 和来源；显式设置贪心解码及 600 新 token；记录 tokenizer、运行库、设备与长度过滤情况；最后同时输出各领域准确率、宏平均、样本加权准确率、解析失败数和混淆矩阵。这些记录可以区分模型判断错误、格式错误与被过滤样本。

完整重训还需要原始训练验证拆分、教师生成记录及人工修订信息。Patronus 后来公开的 `lynx-train-v0.1`、`v0.2`、`v0.4` 数据在 2024 年 12 月创建，条数也与论文的 2,400/800 不同，不能直接当作 7 月实验的原始训练集。[后续训练数据 v0.1](https://huggingface.co/datasets/PatronusAI/lynx-train-v0.1)、[v0.2](https://huggingface.co/datasets/PatronusAI/lynx-train-v0.2)、[v0.4](https://huggingface.co/datasets/PatronusAI/lynx-train-v0.4)

## 适用范围与尚未验证的部分

论文验证的是英语材料支持性检测，包含通用、金融和医学文献问答，没有据此证明多语言、任意长度上下文、实时知识核验或专业结论审核的可靠性。模型给出的解释方便检查，但解释本身也由模型生成，不能用解释流畅程度替代标签质量。

结果显示，小规模的领域监督数据可以明显改变裁判模型的行为，尤其是数值推理和部分专业材料中的判断。但自然错误与合成错误、领域分布、标签标准、输出格式都会影响最终分数。原文缺少解释监督的独立消融与完整错误分布，公开实现又存在若干配置差异，因此目前能够确认的是论文报告的分项实验、公开数据结构，以及上述有限的结果文件重算；完整训练和推理实验仍待复现。

本文阅读覆盖正文 §1—6、附录 A 的构造与解释提示、附录 B 的训练推理和补充实验，核对图 1、表 1—5、公开模型卡、数据文件及固定提交的配置与推理代码。资料核对截至 2026 年 9 月 12 日。
