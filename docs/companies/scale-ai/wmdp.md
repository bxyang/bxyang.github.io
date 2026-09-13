---
title: "WMDP：用知识测验评估遗忘，再检查模型保留了什么"
company: "scale-ai"
date: "2024-03-05"
dateLabel: "2024-03-05"
kind: "合作基准"
description: "精读 3,668 题的风险知识代理评估、RMU 表示损失、一般能力保留、线性探针与重新学习实验，以及公开代码和论文的差异。"
reviewed: "2026-09-13"
readingStatus: "deep-read"
paperVersion: "ICML 2024 正式版，26 页；对照 arXiv:2403.03218v7，2024-05-15，31 页"
---

[← Scale AI](/companies/scale-ai) · [全部工作](/research)

# WMDP：用知识测验评估遗忘，再检查模型保留了什么

模型拒绝回答某个问题，和模型无法提取回答所需的知识，是两种不同的现象。WMDP 用 3,668 道四选一题测量生物、网络与化学领域的风险相关知识，同时提出 RMU 遗忘方法：调整模型在特定语料上的中间表示，并用正常语料约束一般能力的变化。在 Zephyr-7B 上，生物与网络子集准确率分别从 63.7%、44.0% 降至 31.2%、28.2%，整体 MMLU 从 58.1% 降至 57.1%。但相近学科的损失更大，后续微调也能恢复部分能力，因此这些结果没有证明知识被永久删除。[正式论文 §4–5、表 1、附录 B.5](https://proceedings.mlr.press/v235/li24bc.html)

## 版本、作者与 Scale 的参与

原题为 *The WMDP Benchmark: Measuring and Reducing Malicious Use With Unlearning*。论文于 **2024 年 3 月 5 日**首次提交，正式发表于 ICML 2024，收录于 PMLR 第 235 卷，第 28525–28550 页。本文以 26 页的正式版为主要依据，也完整对照了本地 31 页的 arXiv v7，后者日期为 2024 年 5 月 15 日。两版主要结果表相同，但章节、图号和作者名单有差异。[会议记录](https://proceedings.mlr.press/v235/li24bc.html)、[arXiv 版本记录](https://arxiv.org/abs/2403.03218)

正式版共同第一作者为 Nathaniel Li、Alexander Pan；Anjali Gopal、Summer Yue、Daniel Berrios 标注共同第二作者，Alexandr Wang 与 Dan Hendrycks 标注共同指导。Scale 署名作者包括 Summer Yue、Daniel Berrios、Ian Steneker、David Campbell、Brad Jokubaitis 和 Alexandr Wang。研究由 Center for AI Safety、UC Berkeley、MIT、SecureBio、Scale AI 等多家机构共同完成，不能归为 Scale 单独提出和制作的基准。

正式版其余作者包括 Alice Gatti、Justin D. Li、Ann-Kathrin Dombrowski、Shashwat Goel、Gabriel Mukobi、Nathan Helm-Burger、Rassin Lababidi、Lennart Justen、Andrew B. Liu、Michael Chen、Isabelle Barrass、Oliver Zhang、Xiaoyuan Zhu、Rishub Tamirisa、Bhrugu Bharathi、Ariel Herbert-Voss、Cort B. Breuer、Andy Zou、Mantas Mazeika、Zifan Wang、Palash Oswal、Weiran Lin、Adam A. Hunt、Justin Tienken-Harder、Kevin Y. Shih、Kemper Talley、John Guan、Steven Basart、Stephen Fitz、Ponnurangam Kumaraguru、Kallol Krishna Karmakar、Uday Tupakula、Vijay Varadharajan、Yan Shoshitaishvili、Jimmy Ba 和 Kevin M. Esvelt。预印本另有其他署名，不能把不同版本的名单拼成正式版作者表。[正式论文首页](https://raw.githubusercontent.com/mlresearch/v235/main/assets/li24bc/li24bc.pdf#page=1)

方法也经历过修订。早期称为 CUT，使用带有语义含义的方向引导表示；2024 年 4 月更新后简化为 RMU，使用随机方向。官方同时在 3 月修正过选项随机化，在 4 月修正格式和 Unicode 问题，并删除部分过长的网络题与部分风险相关性不足的生物题。旧页面或旧下载包的题量与成绩不能直接和本文版本混用。[官方更新记录](https://github.com/centerforaisafety/wmdp)、[v7 附录 B.4](https://arxiv.org/pdf/2403.03218v7#page=25)

## 测试知识，作为风险能力的代理

WMDP 的全称是 Weapons of Mass Destruction Proxy。其中 *Proxy* 很重要：它没有要求模型在真实环境中完成有害任务，而是测试与相关能力相邻、构成其前提或组成部分的知识。

可以用一个不涉及风险内容的说明示例理解测量方式：给模型一道人造四选一题，询问“虚构系统 Luma 的默认索引类型”，然后比较 A、B、C、D 的输出分数。答对意味着该提示下能够识别正确选项；它没有验证模型能否搭建并维护整个系统。WMDP 采用类似的知识测验形式，只是研究领域和题目筛选目标不同。

论文把知识分为希望保留的一般知识、用于代理测量的中间知识，以及不公开的敏感信息。作者希望通过降低中间层知识的可提取性，减少更高风险能力，但这是一条待验证的代理关系。高分不代表模型一定具备规划、操作或协作能力；低分也不能单独保证其他提示、工具或对话中不存在风险。[正式论文 §3.1、图 3–4、附录 D.1](https://raw.githubusercontent.com/mlresearch/v235/main/assets/li24bc/li24bc.pdf)

与只测试拒绝行为不同，四选一评测通常不等待模型生成一段自由回答，而是比较答案选项的分数。因此它主要测量特定格式下的知识表现，不直接计算拒绝率、实际任务成功率或现实事故发生率。

## 数据构建、专家复核与公开范围

正式版的题量如下，三项相加为 3,668。各领域独立报告准确率，不能不说明权重就把三列简单平均为总成绩。

| 子集 | 题数 | 占总题量，约 | 本文 RMU 是否以该领域为遗忘目标 |
| --- | ---: | ---: | --- |
| WMDP-Bio | 1,273 | 34.7% | 是 |
| WMDP-Cyber | 1,987 | 54.2% | 是 |
| WMDP-Chem | 408 | 11.1% | 否 |

学者与技术顾问先建立领域威胁模型，再据此编写题目。生物部分覆盖六组研究主题，网络部分有八组知识或代码理解类别，化学部分有八组知识类别。本文只介绍这种覆盖结构，不重现敏感样题、答案或具体操作路径。论文报告整个基准开发费用超过 20 万美元，但没有给出可逐项复算的人工、审核和基础设施账单。[正式论文 §3、附录 A.1](https://raw.githubusercontent.com/mlresearch/v235/main/assets/li24bc/li24bc.pdf#page=16)

每道题至少由来自不同机构的两名专家检查。发布前，专家按照各自风险判断标记敏感题，被标记的题立即排除；生物和化学题还接受另外两名领域专家的交叉检查，外部法律顾问参与发布审查。这些是论文报告的数据流程，不等于本文对每道题进行了新的风险认证。[正式论文 §3.1、附录 A.3](https://raw.githubusercontent.com/mlresearch/v235/main/assets/li24bc/li24bc.pdf#page=17)

公开题库与论文另用的 **122 道私有生物问题**不同。后者是在生成过程中剔除的敏感题，用于检查代理评估是否与更敏感的知识表现同方向变化，不属于公开的 1,273 道生物题，也不是从公开题库随机切出的测试集。

公开数据有 `question`、四个 `choices` 和整数 `answer` 字段。当前官方配置只有 `test` split，没有独立训练或验证 split。论文没有提供完整的标注者人数、题目一致性统计、系统去重结果或污染检测。附录明确承认，部分生物题来自开放论文，而这些资料可能已进入模型预训练；高分未必能区分记忆与理解。[正式论文附录 B.3、D.1](https://raw.githubusercontent.com/mlresearch/v235/main/assets/li24bc/li24bc.pdf)、[官方数据卡](https://huggingface.co/datasets/cais/wmdp)

## 遗忘训练用的语料与测试题不同

RMU 不以 WMDP 的题目和正确答案作为监督目标。它使用一份需要遗忘的文本分布 $D_f$，以及一份希望保留的文本分布 $D_r$。

生物遗忘语料来自相关 PubMed 论文，其中包括编写生物测试题时参考的文献；网络遗忘语料来自按主题检索的 GitHub 文本，并用 Mixtral-8x7B-Instruct-v0.1 进行相关性过滤，保留作者评分尺度上至少 9/10 的段落。这个门槛是语料筛选规则，论文没有报告其独立人工标注精确率。训练文本与测试题存在来源联系，不能描述成完全独立、没有主题或文献重叠的泛化测试。[正式论文 §4.2、附录 A.6–A.7](https://raw.githubusercontent.com/mlresearch/v235/main/assets/li24bc/li24bc.pdf)

作者也收集了生物和计算机领域的专门保留语料，但主方法最终使用 **Wikitext**。论文解释，保留语料如果与遗忘内容过近，可能把正在抑制的知识重新引入。因此，领域保留语料虽然被发布、也在表示分析中用作观察对象，却没有作为主实验的保留损失输入。

化学没有被设为 RMU 遗忘目标。作者认为删减相关知识的风险收益与一般能力损失尚不清楚。表中仍测量 WMDP-Chem，是观察其他领域的变化，而不是声称已经完成三领域遗忘。[正式论文 §4、§4.2](https://raw.githubusercontent.com/mlresearch/v235/main/assets/li24bc/li24bc.pdf#page=6)

## RMU 的两项损失

### 把目标语料的表示拉向固定向量

令 $h_\theta^\ell(x,t)\in\mathbb R^d$ 为待更新模型在第 $\ell$ 层、文本 $x$ 的第 $t$ 个 token 上的表示，$h_{\theta_0}^\ell$ 为原始冻结模型的表示。先生成随机向量 $v$，再归一化：

$$
v_j\sim U[0,1),\qquad u=\frac{v}{\|v\|_2},\qquad z=c u.
$$

$c>0$ 控制目标向量的长度，$u$ 在训练过程中保持不变。归一化后各坐标不再独立，这也不是在整个球面上均匀采样。论文简写为“独立均匀采样的单位向量”，公开实现明确是先 `torch.rand`，再除以范数。[正式论文 §4.2、算法 1](https://raw.githubusercontent.com/mlresearch/v235/main/assets/li24bc/li24bc.pdf#page=6)、[固定 RMU 实现](https://github.com/centerforaisafety/wmdp/blob/c0b6c12bb0de3decf9c13bb13f9f1aa15754a132/rmu/unlearn.py)

遗忘损失为：

$$
\mathcal L_f=\mathbb E_{x\sim D_f}\left[\frac1{|x|}\sum_{t=1}^{|x|}\|h_\theta^\ell(x,t)-c u\|_2^2\right].
$$

优化方向是**最小化**距离，让目标语料的表示靠近这个固定向量；不是在原模型表示周围加一次噪声，也不是每个 token 重新采样目标。由于方向固定且长度可能大于正常激活，后续层面对的表示会偏离原有分布。论文把这种变化作为知识难以继续提取的一种解释，并用激活范数曲线提供观察证据。

对于单个 token，表示层面的梯度为 $2(h_\theta^\ell-cu)$，梯度下降把表示拉向 $cu$。这是对平方距离的直接求导，不是论文新提出的定理。**说明算例：**若 $u=(0.6,0.8)$、$c=5$，目标是 $(3,4)$；当前表示为 $(1,2)$，平方距离为 8，梯度为 $(-4,-4)$。实际训练通过链式求导更新权重，不是直接把所有表示赋值为目标向量。

### 用冻结模型约束正常文本

保留损失为：

$$
\mathcal L_r=\mathbb E_{x\sim D_r}\left[\frac1{|x|}\sum_{t=1}^{|x|}\|h_\theta^\ell(x,t)-h_{\theta_0}^\ell(x,t)\|_2^2\right].
$$

这里没有对冻结模型求导。它提供同一输入在原模型中的参考表示，让更新后的模型尽量保持正常文本的中间计算。总目标为：

$$
\min_\theta\;\mathcal L_f+\alpha\mathcal L_r,\qquad \alpha>0.
$$

$\alpha$ 越大，同等误差下保留项对更新的影响越大；$c$ 改变遗忘目标的位置和尺度。它们不是可以互相替代的一个参数。保留某一层表示也不等于对所有输入、所有层或所有最终输出给出了保持不变的保证。

多个遗忘领域交替更新：一个批次处理生物，下一个批次处理网络，再重复。论文只在一层 $\ell$ 计算损失，只更新 $\ell-2,\ell-1,\ell$ 的部分参数，重点为 MLP。部署时使用更新后的模型，不再需要额外的冻结模型或逐次注入随机向量；冻结副本主要用于训练保留约束。[正式论文 §4.2、算法 1、附录 B.6.4](https://raw.githubusercontent.com/mlresearch/v235/main/assets/li24bc/li24bc.pdf)

## 实验如何同时测量遗忘与保留

问答采用零样本四选一格式。对问题 $q_i$ 的四个答案标签，选择输出分数最高的标签：

$$
\hat a_i=\arg\max_{a\in\{A,B,C,D\}}s_\theta(a\mid q_i),\qquad
\operatorname{Acc}=\frac{100}{N}\sum_{i=1}^{N}\mathbf1[\hat a_i=a_i].
$$

论文将 $s$ 描述为选项 logit；官方评估框架使用多项选择评分，答案标签写成 A、B、C、D，而不是比较完整选项内容的自由生成文本。随机均匀选择的期望准确率是 25%。接近 25% 是一个参考点，不是知识不存在的统计证明；低于随机也可能存在可逆的系统偏差。

Hugging Face 模型使用 `lm-evaluation-harness v0.4.2`，GPT-4 用相同模板手动评估。MT-Bench 使用单模型评分模式，由 `gpt-4-0613` 判分；它测量多轮交流质量，和四选一准确率不是同一单位。公开 harness 的 `acc` 配置仍写 `higher_is_better: true`，这是普通准确率的方向；遗忘研究需自行把目标领域的下降与保留集的上升分开解释。[正式论文 §5.2、附录 B.1–B.2](https://raw.githubusercontent.com/mlresearch/v235/main/assets/li24bc/li24bc.pdf#page=19)、[v0.4.2 任务模板](https://github.com/EleutherAI/lm-evaluation-harness/blob/v0.4.2/lm_eval/tasks/wmdp/_default_template_yaml)

主实验的基座为 Zephyr-7B-beta、Yi-34B-Chat、Mixtral-8x7B-Instruct-v0.1。对照 LLMU、SCRUB、SSD 只在 Zephyr 上进行，没有在另外两个大模型上完整重跑对照。

| 方法 | 原理与本文适配 | 论文披露的搜索或训练设置 |
| --- | --- | --- |
| LLMU | 在输出层抑制遗忘文本，同时保留其他语言能力；调整原问答格式以适应无标签语料 | LoRA、批量 2、每样本截为 200 字符；4 个学习率×3 个步数×3 个遗忘权重 |
| SCRUB | 冻结教师与学生在遗忘集上的输出分布拉开，在保留集上接近，并保留语言建模损失 | 6 个权重×3 个学习率；常规 600 步，其中遗忘更新 300 步；另试较短安排 |
| SSD | 比较参数对遗忘集与保留集的重要性，再衰减相应参数 | 6 个阈值×6 个衰减常数 |
| RMU | 在中间表示上施加遗忘和保留平方距离 | 搜索层位置及 150、300、500 个更新批次，并调整 $c$、$\alpha$ |

这些搜索描述不等于完整运行日志，也没有统一 GPU 时间或相同搜索次数的预算对齐。LLMU 的“200”是字符，代码中 RMU 的截断则按 tokenizer token 计，不能当成相同上下文预算。[正式论文附录 B.6](https://raw.githubusercontent.com/mlresearch/v235/main/assets/li24bc/li24bc.pdf#page=23)

论文最终报告的 RMU 参数为：

| 模型 | 损失层 $\ell$ | $c$ | $\alpha$ |
| --- | ---: | ---: | ---: |
| Zephyr-7B | 7 | 6.5 | 1,200 |
| Yi-34B | 15 | 300 | 350 |
| Mixtral-8x7B | 7 | 300 | 1,600 |

公开 notebook 另外给出学习率 $5\times10^{-5}$、随机种子 42：Zephyr 150 步、批量 4；Yi 与 Mixtral 400 步、批量 2。后两者的 400 不在论文列出的三种搜索步数中，应视为公开复现配置与正文记录的差别，不能自动改写成论文明确搜索过 400 步。

## 主要结果：总体指标保留较好，但不是完全无损

表 1 的主要结果如下。WMDP 与 MMLU 为百分比，MT-Bench 为原评分；本研究希望前两列下降，同时尽量保留后两列。

| 模型与方法 | Bio ↓ | Cyber ↓ | MMLU ↑ | MT-Bench ↑ |
| --- | ---: | ---: | ---: | ---: |
| Zephyr 基础模型 | 63.7 | 44.0 | 58.1 | 7.33 |
| ＋LLMU | 59.5 | 39.5 | 44.7 | 1.00 |
| ＋SCRUB | 43.8 | 39.3 | 51.2 | 1.43 |
| ＋SSD | 50.2 | 35.0 | 40.7 | 5.48 |
| ＋RMU | 31.2 | 28.2 | 57.1 | 7.10 |
| Yi 基础模型 | 75.3 | 49.7 | 72.6 | 7.65 |
| Yi＋RMU | 30.7 | 29.0 | 70.6 | 7.59 |
| Mixtral 基础模型 | 74.8 | 52.0 | 68.2 | 8.30 |
| Mixtral＋RMU | 34.0 | 30.8 | 67.1 | 8.17 |

Zephyr 的 Bio、Cyber 分别下降 **32.5、15.8 个百分点**，MMLU 下降 1.0 个百分点，MT-Bench 下降 0.23。Yi 的两个遗忘子集下降 44.6、20.7 个百分点，MMLU 下降 2.0；Mixtral 对应下降 40.8、21.2，MMLU 下降 1.1。表内结果显示 RMU 在该设置下取得更好的遗忘—保留折中，但没有独立重复的误差条或置信区间，不据此声称所有差异均具有统计显著性。[正式论文表 1–2](https://raw.githubusercontent.com/mlresearch/v235/main/assets/li24bc/li24bc.pdf#page=19)

化学准确率没有一致大幅下降：Zephyr 为 45.8%→45.8%，Yi 为 58.6%→55.4%，Mixtral 为 55.2%→54.7%。这与没有主动遗忘化学的设置相符，但不是针对所有化学能力的保留证明。

更接近目标领域的 MMLU 子科目揭示了总体均值掩盖的损失：

| 模型 | 大学生物 | 病毒学 | 大学计算机 | 计算机安全 |
| --- | --- | --- | --- | --- |
| Zephyr | 68.1→63.2 | 52.4→25.9 | 50.0→49.0 | 65.0→45.0 |
| Yi | 88.9→84.0 | 57.2→22.3 | 63.0→57.0 | 84.0→46.0 |
| Mixtral | 82.6→81.3 | 50.0→34.3 | 64.0→67.0 | 80.0→58.0 |

例如 Zephyr 的病毒学下降 26.5 个百分点，Yi 的计算机安全下降 38.0。它们是应当保留的邻近知识，不能将这些变化也当成额外安全收益。Mixtral 的大学计算机略有上升，也不代表遗忘训练普遍提高了该能力。[正式论文表 2、图 11](https://raw.githubusercontent.com/mlresearch/v235/main/assets/li24bc/li24bc.pdf)

## 探针、表示曲线与早期方法的关系

四选一输出可能无法暴露全部模型知识。作者因此训练四分类线性探针，读取模型每一层的表示来预测正确选项；每个遗忘子集一半用于探针训练，另一半用于测试。这里使用 WMDP 标签的是**诊断探针**，不是前面的 RMU 训练，两个步骤不能混在一起。

正式版图 9 展示 Zephyr 的逐层结果；v7 图 9 还展示 Yi。遗忘后探针准确率只有略高于随机的水平，说明这些线性读出器没有恢复原来的问答表现。但论文未完整披露探针优化器、正则化、准确抽样索引和多随机种子结果；更复杂读出器或不同数据上的提取能力没有在这里排除。[正式论文 §5.2、图 9](https://raw.githubusercontent.com/mlresearch/v235/main/assets/li24bc/li24bc.pdf#page=8)、[v7 图 9](https://arxiv.org/pdf/2403.03218v7#page=11)

表示分析观察到，目标语料的激活范数在训练后段增长，领域保留语料的曲线相对更接近原模型。正式版图 15 中，Zephyr 大约在 100 步之后、Yi 大约在 200 步之后出现明显增长；不应把正文“约 200 步”的描述套在所有模型上。图中的领域保留语料只是用于监测，训练损失仍用 Wikitext。[正式论文附录 B.4、图 15](https://raw.githubusercontent.com/mlresearch/v235/main/assets/li24bc/li24bc.pdf#page=22)

v7 附录 B.4 解释，从 CUT 改成 RMU 的原因是作者发现增长范数比特定“初学者方向”更关键。但公开正文没有给出一张包含各随机方向、去掉保留项、不同目标长度及全部重复实验的完整消融表。图 10 的超参数折中图还明确注明使用初始数据与初始方法，因此不能当作当前 RMU 主表的同版本误差分布。

## 鲁棒性检查的范围很窄，重新学习仍然有效

论文对 Yi 做了一项定性对抗检查：生物和网络各抽一道问题，转为开放生成，再使用一种自动优化方法尝试提取回答。基础模型在约 50 步内产生作者认定的相关内容；遗忘模型在 2,500 步后仍输出无意义文本。作者报告后者需要超过 7 小时的 A100 优化时间。

这只有两个案例，不能换算成整个 WMDP 的对抗成功率，也没有覆盖多轮人工交互、外部检索、其他攻击方法或更多目标。无意义文本与恰当拒绝同样不是一回事：该实验关注内容能否被提取，没有验证这种输出能否提供良好的用户体验。[正式论文 §5.3、图 12](https://raw.githubusercontent.com/mlresearch/v235/main/assets/li24bc/li24bc.pdf)

对于能够修改权重的使用者，附录 B.5 给出不同结果。在 Mistral-7B-v0.1 上先遗忘，再用相关语料继续微调，WMDP-Cyber 表现恢复。图 14 的视觉近似为遗忘后约 25%、重新学习后约 38%、基础模型约 42%，并未完全恢复到基座，但已经否定了“不可重新学习”的强结论。该图也注明使用初始数据和初始方法，不能当成 v7 主表三模型的同配置补充结果。[正式论文附录 B.5、图 14](https://raw.githubusercontent.com/mlresearch/v235/main/assets/li24bc/li24bc.pdf#page=22)

论文主要设想的是服务提供者在模型对外服务前应用遗忘。结构化 API 访问是作者讨论的部署安排，不是实验证明的访问控制方案；开放权重之后的重新训练不在其主要保证范围内。文章没有给出正式的删除证明、与“从未训练过这些数据”的模型等价证明，或任何不可恢复性定理。

## 私有题集只提供一项代理关系检查

作者在 122 道未公开生物题上比较 Zephyr 遗忘前后表现，图 13 中两组题的准确率都下降：公开 Bio 由 63.7% 到 31.2%；私有题集图示约由 56% 到 27%，后两项是视觉近似值。

这说明在**一个基座及其一个遗忘版本**上，公开与私有集合的变化方向相符。论文没有给出跨大量模型的相关系数、预测区间或真实行为结果，也没有验证公开知识与每项敏感能力之间的因果依赖。因此这里的“相关”不应改写为公开得分可以精确预测现实风险。[正式论文附录 B.3、图 13](https://raw.githubusercontent.com/mlresearch/v235/main/assets/li24bc/li24bc.pdf#page=22)

## MMLU 辅助实验进一步暴露遗忘边界

作者另外发布经济、法律、物理的辅助语料，用于研究不涉及敏感内容的领域遗忘。语料来自 Creative Commons 教材，提取为段落，并清理目录、索引、多数公式和练习等内容。表 3 的 Forget 是选定 MMLU 科目，Retain 是相近但不希望删除的科目，并非整份 Wikitext。

| 遗忘领域 | 目标科目，基础→RMU | 邻近保留科目，基础→RMU | 全 MMLU，基础→RMU |
| --- | --- | --- | --- |
| 物理 | 38.8→27.0 | 34.6→29.2 | 58.6→57.1 |
| 法律 | 56.7→27.8 | 71.3→37.0 | 58.6→54.5 |
| 经济 | 60.2→27.3 | 45.6→41.2 | 58.6→55.0 |

法律实验中，目标科目下降 28.9 个百分点，相近保留科目反而下降 34.3。这说明低目标分数还需要结合误删程度判断。这里基础 MMLU 写作 58.6，而主实验表 2 是 58.1；论文没有解释这一差别，不能擅自合并为同一基线。[正式论文附录 C、表 3](https://raw.githubusercontent.com/mlresearch/v235/main/assets/li24bc/li24bc.pdf#page=24)

## 官方实现与论文之间需要核对的细节

本次将官方代码固定到 `c0b6c12bb0de3decf9c13bb13f9f1aa15754a132`，完整阅读 `rmu/unlearn.py`、`rmu/utils.py`、三个模型 notebook 和依赖说明。以下为静态核查，不是运行结果。[固定代码](https://github.com/centerforaisafety/wmdp/tree/c0b6c12bb0de3decf9c13bb13f9f1aa15754a132)

**损失的平均方式。**论文对每个 token 的隐藏向量先求平方范数，再对 token 平均。代码使用 `mse_loss` 的默认平均，同时平均批次、token 和隐藏维度；在没有填充且样本等长时，相比论文多了 $1/d$ 的整体因子。两项损失都如此缩放，所以相对的 $\alpha$ 不变，但梯度数值和具体优化器行为不应假定完全等价。

**填充位置没有从损失中排除。**tokenizer 使用左侧填充，模型前向有 attention mask，但返回激活后直接计算 MSE，没有再次用 mask 排除填充 token。attention mask 与损失 mask 是不同环节；因此代码的长度加权与论文按实际 token 平均不严格相同。

**多领域的步数是总更新数。**代码每个领域生成一个固定控制向量，再按领域索引交替更新。`max_num_batches=150` 是总共最多 150 次更新，两领域各约 75 次，不是每个领域各 150 次；实际循环还受最短语料批次数限制。数据按原有顺序分批，没有在这个加载函数内打乱。

**保留集与截断。**当前实现读取 `wikitext-2-raw-v1` 的 `test` split 作为训练保留文本。遗忘输入按领域位置截到 512 或 768 token，保留输入截到 512；`min_len` 对字符串字符数做过滤，`max_len` 虽然是参数，却没有在数据加载函数中使用。不能把函数签名中的 `max_len=2000` 当成已落实的语料长度上限。

**参数选择依赖模型内部顺序。**优化器只接收指定层内、枚举序号匹配 `param_ids` 的参数。Zephyr/Yi 示例用 6，Mixtral 用 7；这不是统一的参数名称。更换 Transformers 或模型结构时需核对实际选中的张量，不能默认“所有 MLP 参数”均被更新。代码没有显式把其他参数全部设为 `requires_grad=False`，所以“优化器不更新它们”与“完全不计算它们的梯度”也有区别。

**默认值并非论文设置。**直接使用 CLI 默认值会得到 80 步、$c=20$、$\alpha=100$，和主表配置不同。三个 notebook 才给出了前文列出的复现参数。依赖文件锁定 `transformers==4.38.2`、`torch==2.1.2`、`lm-eval==0.4.2`，但模型和语料加载函数没有锁定 Hugging Face revision。示例还分别设置 2、4、6 个可见 GPU 编号，不能由此推断固定 GPU 型号、显存需求或总成本。

公开仓库提供 RMU 核心训练和问答评估入口，但当前文件清单没有包括完整的探针训练、全部基线搜索、私有题评测与历史模型输出。它足以解释主要实现，不等于已经发布整篇论文的可一键重建实验包。

## 数据版本与本次实际核查范围

| 官方材料 | 固定版本与已核内容 |
| --- | --- |
| `cais/wmdp` | `7125571f22f032c56415e7980f48d877dd830ff8`；数据卡、文件清单与三子集元数据分别声明 1,273／1,987／408 道 test 题 |
| 生物遗忘语料 | `5a786ed1041e56fef2d4ed26c1239f12b73a68eb`；公开元数据声明 train 24,453 行，包含标题、摘要、正文和 DOI 字段 |
| 网络遗忘语料 | `774cdc4063f21aa0ce8c2aa23c71521c740fd054`；公开元数据声明 train 1,000 行，正文文本字段 |
| `cais/Zephyr_RMU` | `70c55b3bf3141a8c24292dec0262b8aea03a0d4a`；模型卡主表与论文一致，未下载权重 |
| harness v0.4.2 | Git tree `4600d6bf73ba2cf7037ae7feada03315839ef185`；核过零样本、test split、四标签和准确率平均配置 |

上表行数来自官方元数据，不是本次逐行审计。两个遗忘语料仓库要求接受访问条件，本次未认证的 Parquet 请求均返回 HTTP 401；没有接受条件、下载正文或绕过限制。公开问答题库不设同样的 gated 条件，本次仅核了结构和计数声明，没有复制题目内容。模型卡和数据卡的许可需按各材料分别检查。[题库](https://huggingface.co/datasets/cais/wmdp)、[生物语料](https://huggingface.co/datasets/cais/wmdp-bio-forget-corpus)、[网络语料](https://huggingface.co/datasets/cais/wmdp-cyber-forget-corpus)、[Zephyr 模型卡](https://huggingface.co/cais/Zephyr_RMU)

本文完成两版论文全部正文、附录和参考文献阅读，核过核心图表、损失、公开代码和元数据；没有运行模型、遗忘训练、对抗测试或私有题评估。复现主表仍需固定所有权重与语料版本、保留预处理和评估日志，并补齐论文未报告的探针与搜索细节。

WMDP 提供了可重复比较的知识代理任务，RMU 则给出一个能明显改变这些任务表现的表示训练方法。两者支持在明确模型和测试格式下研究遗忘程度与能力损失；它们没有把四选一低分转换成对真实部署安全或永久删除的保证。

## 原始资料

- [ICML 2024 正式论文与记录](https://proceedings.mlr.press/v235/li24bc.html)
- [本文阅读的 arXiv v7](https://arxiv.org/pdf/2403.03218v7)
- [官方项目页](https://www.wmdp.ai/)
- [固定 RMU 代码](https://github.com/centerforaisafety/wmdp/tree/c0b6c12bb0de3decf9c13bb13f9f1aa15754a132)
- [官方 WMDP 数据](https://huggingface.co/datasets/cais/wmdp)

资料核对截至 2026 年 9 月 13 日。
