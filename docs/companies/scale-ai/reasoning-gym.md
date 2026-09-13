---
title: "Reasoning Gym：可程序生成的推理任务"
company: "scale-ai"
date: "2025-05-30"
dateLabel: "2025-05-30"
kind: "开源框架与论文"
description: "用生成器、评分器和难度参数组织推理训练；详解任务生成、部分分、课程学习、跨域迁移和论文与代码的复现差异。"
reviewed: "2026-09-13"
readingStatus: "deep-read"
paperVersion: "arXiv:2505.24760v2，2025-10-20，44 页，含附录 A.1–A.6"
---

[← Scale AI](/companies/scale-ai) · [全部工作](/research)

# Reasoning Gym：可程序生成的推理任务

推理训练可以使用一份现成题库，也可以使用一个持续出题的程序。Reasoning Gym 采用后一种方式：每类任务同时实现问题生成、参考答案或状态信息、回答评分，以及可调节的难度参数。论文用这些任务评估当时的语言模型，并对 Qwen2.5-3B-Instruct 做强化学习，观察同领域迁移、跨领域迁移和从简单到困难的课程学习。实验在多项指标上取得提升，也出现负迁移和高难度仍接近零分的情形。理解这些结果，需要区分生成器的部分分、严格成功率和含格式奖励的训练曲线。[论文 §2–5](https://arxiv.org/pdf/2505.24760v2)

## 版本、团队与公司参与

| 项目 | 核对结果 |
| --- | --- |
| 原文 | *REASONING GYM: Reasoning Environments for Reinforcement Learning with Verifiable Rewards* |
| 首次公开 | 2025 年 5 月 30 日，arXiv v1 |
| 本文阅读版本 | 2025 年 10 月 20 日的 v2，共 44 页，包含参考文献、checklist 与附录 A.1–A.6 |
| 发表 | NeurIPS 2025 Datasets and Benchmarks Track；arXiv 记录注明 Spotlight |
| 作者 | Zafir Stojanovski、Oliver Stanley、Joe Sharratt、Richard Jones、Abdulhakeem Adefioye、Jean Kaddour、Andreas Köpf |
| 机构关系 | 除 Jean Kaddour 署名 UCL 外，其余作者署名 Open-Thought；Oliver Stanley 另署名 Scale AI |
| 贡献说明 | 前四位作者共同贡献；Jean Kaddour 与 Andreas Köpf 共同指导 |
| 公开入口 | [官方代码](https://github.com/open-thought/reasoning-gym)、[官方评测结果仓库](https://github.com/open-thought/reasoning-gym-eval) |

因此这是 Open-Thought 社区与研究人员参与的联合工作，Scale 的关联可以落实到 Oliver Stanley 的作者署名。不能把整个项目写成 Scale 独立开发。页面时间线保留论文首发日期；10 月 20 日对应修订版本。[arXiv 版本记录](https://arxiv.org/abs/2505.24760)、[论文首页](https://arxiv.org/pdf/2505.24760v2#page=1)

## 一道题如何由程序产生并被评分

以论文附录的螺旋矩阵任务为例，程序先生成一个整数矩阵，再按固定的顺时针遍历规则计算参考序列。模型收到的是矩阵和输出规则，需要返回按顺序排列的数字。矩阵大小可以从很小变为几十行、几十列，从而改变需要跟踪的状态与输出长度。[附录 A.2.2、A.3](https://arxiv.org/pdf/2505.24760v2#page=21)

另一些任务没有唯一答案。例如最短路径任务可以存在多条同样短的路径。评分器需要执行候选移动序列，确认没有越界或撞上障碍，并检查是否到达目标和是否达到最短长度。它不能只把字符串与某条参考路径做相等比较。

库把这些差别封装在统一接口中：

```python
import reasoning_gym

dataset = reasoning_gym.create_dataset(
    "spell_backward", size=100, seed=42,
    min_word_len=4, max_word_len=4,
)
entry = dataset[0]
question = entry["question"]
reference = entry["answer"]
score = dataset.score_answer(answer=reference, entry=entry)
```

一个样本包含 `question`、`answer`、`metadata`。前两项是题目与参考答案，元数据保存源任务、索引、随机生成的对象、解或难度信息。评分器可以利用元数据检查候选答案，模型输入通常只需要题目。把包含解的元数据一并放进模型输入，会改变原任务。

可以用下面的记号概括这个接口，而不是把它看成论文提出的新优化公式：

$$
(q,a,m)=G_\tau(c,s,i),\qquad r=V_\tau(y;q,a,m).
$$

$\tau$ 是任务类型，$c$ 是配置，$s$ 是随机种子，$i$ 是样本索引；$G$ 生成题目、参考解和元数据，$V$ 给模型回答 $y$ 评分。生成器与评分器共同定义任务，不能只保留一份问题文本而丢掉评分所需的配置和元数据。[官方历史代码：dataset.py](https://github.com/open-thought/reasoning-gym/blob/2c4e45d9a9bafc367ef5a07ee411d81979bbd2d8/reasoning_gym/dataset.py)

## “可持续生成”与“不重复”之间的区别

固定配置、种子和索引通常会产生相同问题，这使实验可以重放。以历史版本的倒写单词为例，它用 `Random(seed + idx)` 选择词表里的一个词，再将字符反转得到答案。扩大 `size` 只是扩大可访问的虚拟数据长度，不会先把所有问题写入磁盘。[spell_backward.py](https://github.com/open-thought/reasoning-gym/blob/2c4e45d9a9bafc367ef5a07ee411d81979bbd2d8/reasoning_gym/algorithmic/spell_backward.py)

这套机制方便生成大量样本，但并不保证每题唯一。词表和有限尺寸棋盘都可能重复；相邻种子也可能对应平移后的相同随机流。本次对未修改的倒写生成器做了轻量检查：`seed=42, idx=1` 与 `seed=43, idx=0` 生成相同题目，固定索引重复访问也完全一致。前一种现象来自两者使用相同的 `seed + idx`。

论文引言把程序生成概括为避免记忆、不会生成相同实例，这一表述不能直接作为库级保证。训练和测试仍应记录种子及索引区间，检查实际问题重叠；新种子也不代表新的推理规则。本文没有对全部任务执行去重审计，也没有据此断言论文测试已发生泄漏。

混合任务由 `CompositeDataset` 按权重选择子任务。若任务 A、B 的权重为 2、1，抽样概率为 $2/3$、$1/3$，不是保证每连续三题一定按这个比例出现。配置中的任务权重控制训练分布，任务内部的难度参数控制题目内容，这两层可以分别调整。[composite.py](https://github.com/open-thought/reasoning-gym/blob/2c4e45d9a9bafc367ef5a07ee411d81979bbd2d8/reasoning_gym/composite.py)

## 任务范围与数据来源

论文描述超过 100 类任务，涵盖代数、算术、算法、代码执行、图论、几何、逻辑、归纳和游戏。这里的“环境”主要是单轮文本问答：魔方、迷宫和逻辑电路也用字符形式呈现，不代表模型通过工具在多轮中操作图形界面。[§2、§7](https://arxiv.org/pdf/2505.24760v2#page=3)

| 能力与任务例子 | 生成或验证的内容 | 可变参数例子 |
| --- | --- | --- |
| 代数：方程、积分、多项式乘法 | 生成表达式，计算解或检查等价关系 | 项数、次数、系数范围 |
| 算法：螺旋矩阵、排序、素数计数 | 执行确定算法产生参考结果 | 矩阵维度、序列长度、整数范围 |
| 图论：最短路径、课程安排 | 构造网格或图，验证路径与依赖关系 | 节点数、障碍比例、边数 |
| 逻辑：骑士与骗子、电路 | 生成命题或布尔结构，计算满足赋值 | 人数、逻辑深度、输入数量 |
| 游戏：迷你数独、魔方、倒水 | 生成局面，检验规则或动作序列 | 空格数、打乱步数、容器数量 |
| 文本中的空间与模式识别 | ASCII 字体、矩阵、ARC 类规则 | 字体、词长、网格尺寸、变换类型 |

上表是能力导向的整理，不是严格复写论文的唯一分类。附录表 6 与评测配置的归类本身不完全相同：例如 `complex_arithmetic` 在任务概览归于算术，在样例和零样本配置里归于代数；`boxnet` 在表 6 的两个类别重复出现。按表中类别数量简单相加，会得到 102 个条目，不能直接写成 102 个互不重复的生成器。[附录 A.1–A.3](https://arxiv.org/pdf/2505.24760v2#page=20)

项目也使用已有开源资产。`NOTICE.txt` 列出 ARC 1D、Re-ARC、BF-it、推箱子生成器和 Zebra Puzzles 等来源与许可证。部分任务从词表、已有程序或既有谜题结构取材，因此“程序生成”不意味着全部内容都从零创造，或完全不依赖有限的源材料。整体代码使用 Apache-2.0，具体复用资产仍应按声明保留归属。[历史版本 NOTICE](https://github.com/open-thought/reasoning-gym/blob/2c4e45d9a9bafc367ef5a07ee411d81979bbd2d8/NOTICE.txt)

## 自动评分可以包含部分分和格式惩罚

统一接口返回数值，不要求所有任务都是严格的二元对错。

倒写单词评分器先忽略大小写。完全正确返回 1；否则会根据对应位置的正确字符比例给部分分。本次检查四字母答案只改错首字符，得分为 0.75。这个分数说明输出有部分字符正确，不能解释为“75% 的题完全答对”。

迷你数独评分器优先匹配规范答案，之后尝试解析每行数字并计算匹配比例，非规范格式还乘以 0.9；过长回答再受长度惩罚。本次对 20 个生成问题检查参考答案评分，全部为 1。将其中一个正确答案的空格改为分隔符，数字不变，得分为 0.9。[mini_sudoku.py](https://github.com/open-thought/reasoning-gym/blob/2c4e45d9a9bafc367ef5a07ee411d81979bbd2d8/reasoning_gym/games/mini_sudoku.py)

最短路径评分器对合法且等长的另一条最短路径给 1，对能到达目标但更长的合法路径给 0.5，对不合法路径给 0。它衡量的不只是最终位置，也包含路径效率。[shortest_path.py](https://github.com/open-thought/reasoning-gym/blob/2c4e45d9a9bafc367ef5a07ee411d81979bbd2d8/reasoning_gym/graphs/shortest_path.py)

这些规则有助于给训练提供更细的反馈，同时也把表面格式纳入分数。论文强调自动验证，公开实现却不支持把所有平均分都称为严格正确率。任务提示也需要检查：附录最短路径样例前面要求移动序列，末句却写“路径长度”，答案仍给移动序列；历史代码保留同样措辞。这样的输入歧义不能通过程序评分自动消除。[附录 A.2.9](https://arxiv.org/pdf/2505.24760v2#page=26)

### 难度参数未必等于实际难度

迷你数独从完整 4×4 解出发，逐个移除线索，每次检查解的唯一性。如果继续移除会产生多个解，就保留该线索。因此设定移除 12 格，并不保证最终一定空 12 格。对上述 20 个 `min_empty=max_empty=12` 的样本，本次实际得到 16 个空 12 格、3 个空 11 格、1 个空 10 格；元数据记录实际空格数。

这只是选定种子上的生成器检查，不是论文实验统计。它说明复现课程难度时应同时保存配置值和实际生成属性，而不是仅凭配置名称判断模型见过什么。

## 零样本评测的结果与分母

图 3a 报告 hard 配置下的平均分：

| 模型，按论文当时名称 | 平均得分，% |
| --- | ---: |
| OpenAI o3-mini | 63.51 |
| DeepSeek-R1 | 59.52 |
| Grok-3-mini-beta | 55.06 |
| Llama-4-Maverick | 41.50 |
| QwQ-32B | 40.52 |
| Claude-3.5-Sonnet | 40.33 |
| Llama-4-Scout | 30.01 |
| Gemma-3-27B-IT | 20.26 |

这是论文所选任务与生成参数下的结果，不是当前模型排行榜。o3-mini 与 Llama-4-Maverick 相差 22.01 **个百分点**；比较模型的训练数据、架构和推理预算都不同，不能仅由这张横向表推出某一种训练方法的独立因果效果。[§3，图 3a](https://arxiv.org/pdf/2505.24760v2#page=4)

官方结果仓库的一份 o3-mini hard 记录包含 100 个任务、每任务 50 题，共 5,000 题。对其中 `dataset_mean_scores` 的 100 个任务均值再等权平均，得到 **63.513143%**，与图 3a 的 63.51% 一致。这也确认该分数保留任务评分器的部分分。

用记号表示，若任务 $\tau$ 有 $N_\tau$ 题，每题评分为 $r_{\tau i}$，该记录的汇总为：

$$
S=\frac{100}{100}\sum_{\tau=1}^{100}
\left(\frac1{N_\tau}\sum_{i=1}^{N_\tau}r_{\tau i}\right).
$$

式子外层分子 100 是百分比换算，分母 100 是任务数；在该记录中 $N_\tau=50$，所以与 5,000 题直接平均等价。若以后各任务题数不同，“任务等权”与“样本等权”就不再相同。

记录还保存生成器 git hash `71787c6a0e2fc46b67fcb7c50af7ad0aa43b6439`、每题 1 次生成、最大 32,768 token，以及请求配置温度 0.6、top-p 0.95。这里是所保存请求与运行元数据；不同服务端如何支持采样参数仍应按对应服务核实。不能把一份 o3-mini 配置视为全部模型的统一推理成本。[固定原始 summary](https://github.com/open-thought/reasoning-gym-eval/blob/5f09fecc342a25d693895b7304a9dec43b47f436/reasoninggym-paper-experiments/zero-shot/hard/openai_o3-mini_20250414_163909/summary.json)

### easy 与 hard 是具体配置，不是普遍难度定理

附录 A.3 给出每项任务的 easy 参数和 hard 参数。例如螺旋矩阵从 2–10 阶改为 25–50 阶；魔方从 3 阶、3–10 次打乱改为 5 阶、25–50 次打乱；最短路径网格由 5–8 行列改为 25–50 行列。这样的变化会同时增加状态空间、输入长度与答案长度。

图 3b 中，o3-mini 的 code、graphs、geometry、algorithmic 类别分别下降 71.93、33.80、33.13、25.57 个百分点；DeepSeek-R1 对应下降 61.82、29.60、11.83、27.85 个百分点。code 包含程序输出预测等任务，不能把这个类别的下降全部描述成常规代码生成能力下降。[图 3b、附录 A.3–A.5](https://arxiv.org/pdf/2505.24760v2#page=4)

也有反例：图中的 Llama-4-Scout 在 graphs 类别提高 6.40 个百分点。配置本身并非每项都沿单调方向变化，例如 mini_sudoku 的 easy 空格范围为 8–12，hard 却为 6–10；`quantum_lock` 的 difficulty 从 10 改为 5。由此应把 hard 当作作者选定的配置组，不宜概括为“所有任务只提高一个难度变量，所有模型都会下降”。

## RLVR 怎样使用这些分数

论文主要以 Qwen2.5-3B-Instruct 为起点，使用 GRPO：对同一个问题采样一组回答，根据组内相对奖励更新模型。算法不是本文重新提出的；Reasoning Gym 提供数据与可调用的奖励接口。

为解释奖励进入训练的方式，可以将同题第 $j$ 条回答的奖励写成 $R_j$，组内优势写成：

$$
A_j=\frac{R_j-\overline R}{\sigma_R+\epsilon}.
$$

这是 GRPO 的组内标准化形式，说明高于同组平均奖励的回答受到鼓励；具体数值稳定与 KL 实现由训练框架处理。生成器给出的正确性分数会与配置启用的辅助项相加：

$$
R_j=r_{\mathrm{task},j}
+\sum_k\lambda_k r_{k,j}.
$$

论文正文特别说明，训练图使用总奖励，而结果表只报告正确性部分，并换算为百分数。格式奖励鼓励使用 `<think>…</think><answer>…</answer>`，可以使刚开始训练的奖励迅速升高，即使解题能力还没有同等幅度的改善。[§4，图 4–5](https://arxiv.org/pdf/2505.24760v2#page=5)

公开配置比“正确性 1.0 加格式 0.2”的简述更复杂。跨域算法配置还启用系数 0.2 的长度奖励；部分域内和倒写课程配置启用系数 0.3 的 cosine 奖励。因此不能对所有训练曲线统一减去 0.2，就把剩下的数值当作准确率。

历史 `length_reward` 实现对不完全正确的回答奖励更长的文本，形式为：

$$
r_{\mathrm{length}}=
\lambda\,(1-r_{\mathrm{task}})
\min\left(\frac{|y|}{1024},1\right),
$$

其中默认上限 1024 作用于 Python 字符串长度，**不是 tokenizer 的 token 数**。当前读取的调用传入正确性分数但未覆盖这个默认长度。这个式子描述已发布函数的默认行为，不代表所有实验都启用了该项。[历史奖励函数与调用](https://github.com/open-thought/reasoning-gym/blob/2c4e45d9a9bafc367ef5a07ee411d81979bbd2d8/training/rewards/reward.py)、[跨域算法配置](https://github.com/open-thought/reasoning-gym/blob/2c4e45d9a9bafc367ef5a07ee411d81979bbd2d8/training/configs/inter_generalisation/algorithmic_qwen_3b.yaml)

### 训练资源与配置的适用范围

附录 A.6 的示例和对应跨域算法 YAML 给出以下设置，不应当作 RG-Math 等全部实验的统一配置：

| 设置 | 示例值 |
| --- | --- |
| 基础模型 | Qwen/Qwen2.5-3B-Instruct |
| 虚拟训练数据规模 | 20,000 |
| 每题生成数 | 8 |
| 训练 batch size | 32 个提示 |
| 采样 | 温度 1.0、top-p 1、top-k -1 |
| 最大提示／回答长度 | 4,096／2,048 token |
| 学习率 | $10^{-6}$，恒定调度，无 warmup |
| PPO mini-batch／每 GPU micro-batch | 16／8 |
| clip ratio／梯度裁剪 | 0.2／1.0 |
| entropy coefficient／KL loss coefficient | 0.001／0.001 |
| 训练计划 | 1 epoch，上限 500 step；每 100 step 测试、保存 |
| 硬件 | Runpod 上的 4×A6000 节点 |

论文估计全部所报告实验共消耗约 **1,500 A6000 GPU 小时**，不是每个模型 1,500 小时，也不是单节点运行 1,500 小时。表中设置以配置文件为准，真实生成 token 数、各实验墙钟时间和完整费用没有逐项给出。[§4、附录 A.6](https://arxiv.org/pdf/2505.24760v2#page=41)

## 同领域迁移与 Acc@3 的含义

域内实验只在某类任务的子集上训练，再测试同类别的未训练任务。历史配置提供了具体例子：代数训练使用简单方程与多项式乘法，测试简单积分；算法测试数字排序；算术测试质因数分解；游戏测试汉诺塔。认知评测 YAML 列出数列与模网格两个任务，不能据正文“每类一个留出任务”的概括忽略实际文件。[域内训练与评测配置](https://github.com/open-thought/reasoning-gym/tree/2c4e45d9a9bafc367ef5a07ee411d81979bbd2d8/training/evaluations/intra-generalisation)

| 测试领域 | 基础模型 | 同领域 RG-RLVR | 提升，百分点 |
| --- | ---: | ---: | ---: |
| 代数 | 5.0 | 16.7 | 11.7 |
| 算法 | 52.3 | 59.7 | 7.4 |
| 算术 | 89.7 | 96.0 | 6.3 |
| 认知 | 40.3 | 42.3 | 2.0 |
| 游戏 | 0.0 | 3.3 | 3.3 |

来源：[表 1](https://arxiv.org/pdf/2505.24760v2#page=6)。论文把这个指标写成 Acc@3。公开 `evaluate_model.py` 对每道题重复生成三次，分别评分后取平均；它虽然保存三次中的最高分，但汇总字段用的是平均分。因而不能把它写成“尝试三次，只要有一次成功就算成功”的 Pass@3。

若按该脚本严格成功的路径记 $b_{ir}=\mathbf 1[V(y_{ir})\ge1]$，则：

$$
\mathrm{Acc@3}=\frac{100}{3N}\sum_{i=1}^{N}\sum_{r=1}^{3}b_{ir}.
$$

脚本先把低于 1 的任务分置为 0，再对三次生成、全部问题取均值。因此它与零样本评测中保留部分分的程序不同。[历史本地模型评测脚本](https://github.com/open-thought/reasoning-gym/blob/2c4e45d9a9bafc367ef5a07ee411d81979bbd2d8/training/evaluations/evaluate_model.py)

这里存在尚未消解的版本差异：正文写在相同的 50 题评测集上运行三次，所查域内 YAML 普遍写 `size: 100`、`eval_repeats: 3`，认知还有两个 100 题任务。论文也没有逐项给出三个独立训练种子的标准差。公开配置确认三次回答的平均方式，但不能仅凭 `eval_repeats: 3` 宣称所有模型都独立训练了三次。

游戏从零分到 3.3% 是这套留出问题上的变化，不能由此证明基础模型的真实成功概率严格为零，或断言模型获得了此前绝对不存在的能力。

## 跨领域迁移包含改善和退化

跨域实验分别在代数、算法、逻辑、游戏任务上训练，然后测试其他领域。表中破折号表示未报告，不是零分。

| 测试领域 | 基础模型 | RG-Algebra | RG-Algorithmic | RG-Logic | RG-Games |
| --- | ---: | ---: | ---: | ---: | ---: |
| 代数 | 23.83 | — | 52.89 | — | 45.61 |
| 算法 | 13.49 | 20.68 | — | 16.43 | — |
| ARC | 6.49 | 4.18 | — | — | 4.26 |
| 算术 | 29.56 | 46.14 | 45.17 | — | — |
| 认知 | 11.62 | — | — | 24.94 | 24.71 |
| 游戏 | 8.40 | 9.23 | — | 7.64 | — |
| 几何 | 0.83 | — | 23.17 | — | 6.83 |
| 图论 | 19.81 | — | — | 28.86 | 22.49 |

来源：[表 2](https://arxiv.org/pdf/2505.24760v2#page=7)，单位为百分数。算法训练后代数提高约 29.1 个百分点，几何提高约 22.3 个百分点；逻辑训练后认知和图论也改善。但代数训练的 ARC 从 6.49 降到 4.18，游戏训练的 ARC 降到 4.26；逻辑训练的游戏由 8.40 降到 7.64。

因此证据支持“部分训练组合可以迁移到部分其他领域”，没有覆盖所有训练与测试领域的笛卡尔积。表 1 和表 2 的同名领域也有不同留出设置和基础分数，不能把两张表拼成统一难度的一场竞赛。没有足够的对照或内部表征实验，将这些变化进一步归因于某个共同推理模块仍属于作者解释。

## 外部 benchmark：数学收益较明显，提示条件并不完全相同

RG-Math 使用代数、算术和几何任务混合训练 800 个 GRPO step；RG-Algorithmic 复用跨域实验的检查点。外部评估用 Language Model Evaluation Harness。[§4.3](https://arxiv.org/pdf/2505.24760v2#page=7)

| 基准与提示设置 | 基础模型得分 ± 标准误 | RG-Math 得分 ± 标准误 | 提升，百分点 |
| --- | ---: | ---: | ---: |
| GSM8K，8-shot CoT | 76.2 ± 1.17 | 76.7 ± 1.16 | 0.5 |
| MATH，0-shot CoT | 48.5 ± 0.68 | 58.2 ± 0.66 | 9.7 |
| Big-Bench Hard，3-shot CoT | 8.68 ± 0.30 | 16.34 ± 0.40 | 7.66 |

表 3 的标准误描述评测统计的不确定性，不是不同训练种子的标准差。GSM8K 的 0.5 个百分点提升小于表中各自标准误量级，论文没有给出配对显著性检验，不能将其写成已确证的稳定提升。

MMLU-Pro 的所选八个学科如下，保留绝对分数以展示外推范围：

| 学科 | 基础模型 | RG-Algorithmic | RG-Math |
| --- | ---: | ---: | ---: |
| 数学 | 54.63 | 53.89 | 60.25 |
| 计算机科学 | 37.80 | 40.73 | 42.20 |
| 物理 | 38.49 | 39.26 | 44.19 |
| 工程 | 28.28 | 31.48 | 31.17 |
| 经济 | 50.59 | 53.44 | 53.55 |
| 商业 | 51.58 | 53.36 | 54.12 |
| 心理学 | 50.75 | 55.01 | 56.77 |
| 生物 | 56.90 | 59.00 | 61.09 |

来源：[表 4](https://arxiv.org/pdf/2505.24760v2#page=8)。RG-Math 在所列学科均提高；RG-Algorithmic 的数学低于基线 0.74 个百分点。这是所选学科，不是完整 MMLU-Pro 总分。

代码 README 还披露，Qwen RG-Math 在数学评测中使用训练时的 system prompt；基础 Qwen 试过同一提示后分数较差，最终报告使用标准 CoT 提示。因此最终比较不是“同一提示下只改变模型权重”。这一选择没有隐藏基础模型表现更好的提示，但仍应和模型训练收益分别记录。[历史训练 README：External benchmark evaluations](https://github.com/open-thought/reasoning-gym/blob/2c4e45d9a9bafc367ef5a07ee411d81979bbd2d8/training/README.md)

## 课程学习如何提高难度

论文比较两种训练分布。课程模型从最简单等级开始，在最近 20 个训练步的表现超过 70% 时增加难度；非课程模型从全部难度同时均匀采样。两者都训练一个 epoch，再在每个难度等级的 50 道留出题上评测。所谓 fixed difficulty 是分布固定，不是只训练一种难度。[§5](https://arxiv.org/pdf/2505.24760v2#page=8)

表 5 给出全部等级结果，单位为百分数：

| 任务与难度 | 基础模型 | 非课程 | 课程 |
| --- | ---: | ---: | ---: |
| 倒写，4 字母 | 12.00 | 30.00 | 70.67 |
| 倒写，6 字母 | 3.33 | 10.67 | 30.00 |
| 倒写，8 字母 | 0.00 | 1.13 | 3.37 |
| 倒写，10 字母 | 0.00 | 0.01 | 0.01 |
| 迷你数独，4–6 空格 | 1.13 | 54.00 | 56.00 |
| 迷你数独，6–8 空格 | 0.00 | 25.33 | 28.00 |
| 迷你数独，8–10 空格 | 0.00 | 6.67 | 20.00 |
| 迷你数独，10–12 空格 | 0.00 | 1.13 | 5.33 |
| 素数计数，100–500 | 12.00 | 4.00 | 30.67 |
| 素数计数，100–1,000 | 3.33 | 5.03 | 12.67 |
| 素数计数，100–5,000 | 1.33 | 0.00 | 3.03 |

来源：[表 5](https://arxiv.org/pdf/2505.24760v2#page=9)。课程对 4 字母倒写提高 40.67 个百分点，对 8–10 空格数独提高 13.33 个百分点。10 字母倒写两组均为 0.01，没有提高，因此不能照搬正文“所有难度都更好”的概括。素数计数第一档差值按表为 26.67 个百分点，正文另写 26.27，本文采用表中可计算的差值。

倒写训练在增加难度后会突然降分，因为面对的题变难；这与固定混合分布的训练奖励不能直接横比。迷你数独课程到第 72 步已进入最高难度。素数计数课程始终没有离开最初等级，仍比混合难度模型更好。因此该实验同时改变难度顺序和各等级的暴露量；没有单独的“始终只训练最简单等级”对照，不能把素数计数的优势全部解释成成功爬升难度的收益。[图 6、§5](https://arxiv.org/pdf/2505.24760v2#page=8)

表 5 的 0.01、1.13 等值也不宜强行解释为 50 题二元判定的计数比例。作者没有逐格展开这些分数的汇总及部分分处理；公开的严格评测脚本与本表细粒度小数之间仍需要逐条输出或原始评测脚本对应关系来确认。

### 论文课程描述与可执行代码的差异

历史 `spell_backward.yaml` 启用 `automatic: False`，由表现触发升降级。训练器对每个任务取 `score_board.aggregate(last_n=20)`，聚合代码明确取最近 **20 条评分记录**，不是最近 20 个优化器步。它在均值高于 0.70 时升一级，低于 0.10 时降一级，并在变级后清空该任务的记分板。

可用代码还支持另一条分支：`automatic: True` 时每隔 `update_steps` 固定升难度，不使用 70% 门槛。附录示例中该值为 30，但注释写 50；课程本身在那份跨域示例中又是关闭的。因此复现时应读取真实启用分支，不能按字段名称推测行为。[训练器](https://github.com/open-thought/reasoning-gym/blob/2c4e45d9a9bafc367ef5a07ee411d81979bbd2d8/training/trainers/ray_grpo_trainer.py)、[记分板聚合](https://github.com/open-thought/reasoning-gym/blob/2c4e45d9a9bafc367ef5a07ee411d81979bbd2d8/reasoning_gym/coaching/score_board.py)

倒写课程的公开 `word_len` 等级为 3、5、7、9、11，而论文表 5 测试 4、6、8、10 字母。训练等级和评测等级可以不同，但当前材料没有完整说明这一对应。迷你数独和素数计数课程的逐次运行配置，也不能从倒写 YAML 自动推导出来。

## 复现入口、版本与尚未解决的边界

本次固定了三层材料：

| 材料 | 固定版本 |
| --- | --- |
| 论文 | [arXiv:2505.24760v2](https://arxiv.org/pdf/2505.24760v2)，2025-10-20 |
| 修订前的官方代码快照 | [2c4e45d9a9bafc367ef5a07ee411d81979bbd2d8](https://github.com/open-thought/reasoning-gym/tree/2c4e45d9a9bafc367ef5a07ee411d81979bbd2d8)，2025-10-06；本次按 v2 提交时间向前查询所得，不冒充作者全部运行的精确 commit |
| 当前代码快照 | [49b07130b3fcd12f2d064bba7c43869543a0e7e7](https://github.com/open-thought/reasoning-gym/tree/49b07130b3fcd12f2d064bba7c43869543a0e7e7) |
| 官方评测记录 | [5f09fecc342a25d693895b7304a9dec43b47f436](https://github.com/open-thought/reasoning-gym-eval/tree/5f09fecc342a25d693895b7304a9dec43b47f436)，包含模型输出与评测 summary |

训练说明固定了 Python 3.11、CUDA 11.8、verl commit `c34206925e2a50fd452e474db857b4d488f8602d`、vLLM 0.7.3，并列出 FlashAttention 2.7.3 的兼容安装方式。RG 修改了部分 verl 训练器，直接换成最新 verl 不保证兼容。跨域算法入口为 `training/train_grpo.py` 与 `configs/inter_generalisation/algorithmic_qwen_3b.yaml`；本地模型评测入口是 `training/evaluations/evaluate_model.py`。[训练 README](https://github.com/open-thought/reasoning-gym/blob/2c4e45d9a9bafc367ef5a07ee411d81979bbd2d8/training/README.md)

当前 README 新增了 cascade scorer，会依次尝试字符串、数值、符号数学等匹配，放宽部分格式差异。它可以提升原评分，但不是论文各张表已统一使用的计分规则。重跑旧结果时应固定原评分器；使用新评分时应单独报告版本变化。[当前 README](https://github.com/open-thought/reasoning-gym/tree/49b07130b3fcd12f2d064bba7c43869543a0e7e7)

公开代码已经允许逐项检查题目生成和评分，但仍有几处影响精确复现：

- 论文 A.6 指向单独的 `training/qwen-math` 实现；本次所查历史与当前快照均未包含该目录，不能用另一个训练配置替代后声称复现 RG-Math 的 800 步结果。
- 课程的窗口单位、辅助奖励、训练难度等级和评测 YAML 数量，与论文概述存在上述差异；需要原始运行配置及结果文件建立对应关系。
- 训练适配器的正确性评分函数从 `self.train_dataset.data` 取题；验证回调也走同一路径，没有在该函数中切换到 `val_dataset`。这是所查实现的边界，尤其不宜把训练过程中的内部验证值直接当作独立留出性能。论文外部测试脚本另行构造评测题，不能把两者混为一谈。
- 不同任务的有限源材料、随机种子和模板仍需检查训练测试重叠。算法可计算参考答案，也不自动证明题面无歧义、评分器无漏洞或难度标注一致。

本次完整阅读了 44 页论文及附录，核对主要表格和全任务热图，静态检查生成器、课程、训练奖励与评测入口，并执行了倒写与迷你数独的轻量生成和评分检查。没有运行模型推理、训练或付费 API，尚未复现论文成绩。论文已验证的范围主要是单轮文本、可编程验证的推理任务；开放式创作、知识密集判断、多轮交互与真实多模态任务仍在其覆盖范围之外。

## 参考资料

- [Reasoning Gym 论文与版本记录](https://arxiv.org/abs/2505.24760)
- [v2 全文，含附录 A.1–A.6](https://arxiv.org/pdf/2505.24760v2)
- [官方代码历史快照](https://github.com/open-thought/reasoning-gym/tree/2c4e45d9a9bafc367ef5a07ee411d81979bbd2d8)
- [官方模型输出与评测记录](https://github.com/open-thought/reasoning-gym-eval/tree/5f09fecc342a25d693895b7304a9dec43b47f436)
- [Scale Labs 研究目录](https://labs.scale.com/papers)
