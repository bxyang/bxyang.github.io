---
title: "GLIDER 精读：让小模型按自定义标准评分，并指出判断依据"
company: "patronus-ai"
date: "2024-12-18"
dateLabel: "2024-12-18"
kind: "论文与模型"
description: "详解 GLIDER 的合成评审数据、SFT 与 APO 训练、文本高亮、评分和人类评测，并核对领域统计、公开数据及复现代码的差异。"
reviewed: "2026-09-12"
readingStatus: "deep-read"
paperVersion: "arXiv:2412.14140v2，2024-12-20"
---

[← Patronus AI](/companies/patronus-ai) · [全部工作](/research)

# GLIDER 精读：让小模型按自定义标准评分，并指出判断依据

一个问答系统给出了事实正确的回答，却没有忠实使用指定资料。评审器需要先理解本次要求的是“符合资料”还是“符合现实”，再决定分数。GLIDER 把评价标准、分档规则和待评文本一起交给一个 **38 亿参数**的模型，让它依次生成理由、相关文本片段和整数评分。论文中，它在 FLASK 上与人工评分的 Pearson 相关系数为 0.615，GPT-4o 为 0.610；但在其他数据集上并非总是领先。本文使用 2024 年 12 月 20 日的 v2，结合公开模型、训练脚本和评测数据核对方法与结果。[论文 §1、表 1](https://arxiv.org/pdf/2412.14140v2)

## 论文与公司参与

| 项目 | 信息 |
| --- | --- |
| 原文标题 | *GLIDER: Grading LLM Interactions and Decisions using Explainable Ranking* |
| 首次公开 | 2024 年 12 月 18 日 |
| 阅读版本 | arXiv:2412.14140v2，2024 年 12 月 20 日，32 页，含附录 A–D |
| 作者 | Darshan Deshpande、Selvan Sunitha Ravi、Sky CH-Wang、Bartosz Mielczarek、Anand Kannappan、Rebecca Qian |
| 机构 | 六位作者均署名 Patronus AI；Sky CH-Wang 同时署名 Columbia University |
| 模型底座 | Microsoft Phi-3.5-mini-instruct，论文精确口径为 3.8B 参数 |
| 发表信息 | 本文核对的是 arXiv 预印本版本 |
| 公开材料 | [模型](https://huggingface.co/PatronusAI/glider)、[代码](https://github.com/patronus-ai/glider)、[评测数据集合](https://huggingface.co/collections/PatronusAI/glider-eval-suite-673ceadb04c69353dd2a13fe) |

论文摘要把模型简称为“3B”，正文和实验表使用 3.8B。本文采用后者。作者公开了模型权重、训练与评测脚本以及整理后的测试数据；这些材料的公开范围不同，不能据此认定完整合成训练集也已发布。

## 从评价条件到三个输出

GLIDER 的输入由三部分组成：

- **Data**：待评材料，可以包含用户问题、系统提示、模型回答、检索资料、参考答案或其他字段。
- **Pass Criteria**：本次具体判断什么、判断哪些字段，例如“回答中的全部事实是否都由给定资料支持”。
- **Rubric**：各分值的明确含义，可以是 0/1、1–3 或 1–5。

字段用文本标签组织，标签名称可以变化；它们不是模型内部固定的字段 ID。评价条件必须指出要检查的标签及它们之间的关系。模型以聊天格式接收完整提示，然后输出 `<reasoning>`、`<highlight>` 和 `<score>` 三个区块。公开评测模板要求理由采用要点形式，高亮是词语或短语列表，分数是 rubric 中的整数。（附录 A）

### 一个“事实正确但不忠实”的例子

论文表 5 给出的资料错误地说《哈利·波特》由 George R. R. Martin 创作，模型回答则正确地写 J. K. Rowling。若本次只判断回答是否忠实于提供的资料，GLIDER 给出 0，并指出两个人名之间的矛盾。

这例子的重点是**评价目标决定分数**。它没有把错误资料当作真实世界知识，而是执行指定的资料一致性检查。如果把条件改成“作者信息是否符合事实”，预期答案就不同。该例展示了一个成功案例，论文没有据此完成系统性的反事实资料鲁棒性测试。（§6、表 5）

### 绝对评分和两答案比较使用同一种生成接口

绝对评分对一份内容打分，例如给摘要的连贯性打 1–5 分。两答案比较则把两个输出放入同一输入，并用 0/1 表示哪个更符合要求。

这里的 0/1 含义来自 rubric。**1 不一定表示“内容安全”或“事实正确”**：在公开 HH 数据中，0 表示第一个回答更好，1 表示第二个回答更好。评审器没有独立输出一个已经校准的胜率，应用也不能把整数 1 直接解释成 100% 置信度。

LiveBench 的设置又不同：只评一份回答是否满足全部列出的格式要求，用 0/1 表示失败或通过。虽然论文把它放在表 2 的 preference/F1 结果中，它并不是每条输入都包含两个候选答案。任务形式与最终指标需要分开理解。

## 685 个领域和 183 个标准的实际含义

这些数字描述的是**生成训练数据时使用的分类表**，不是 685 个独立测试集，也不是模型分别通过了 183 项认证。生成器从领域、标准、格式和分档中组合出具体评审任务。（§3、附录 D）

标准分类既有准确性、完整性、安全性，也有创造性、同理心、用户体验、资源使用等。它们为生成具体条件提供主题。比如“准确性”只是类别，真正训练模型的是某个实例中的明确要求和分档文字；只给一个抽象名称，仍可能无法确定应如何评分。

### 附录的领域清单与正文数字不完全一致

本次下载了 v2 的原始 LaTeX 源码，直接解析附录 D 的两个字典：

| 统计对象 | 正文报告 | 附录公开字典的可重算结果 |
| --- | ---: | ---: |
| 领域 | 685 | 18 个大类、643 个唯一条目 |
| 评价标准 | 183 | 15 个大类、183 个唯一条目 |

因此可以核实 183 个标准的清单；正文的 685 与公开领域字典相差 42 项，材料没有交代如何补齐。附录另外提到为毒性、提示注入、误导场景和个人信息准备人工案例，但没有说明这些案例是否解释了这 42 项差额。本文保留“作者报告覆盖 685 个领域”，不把 643 擅自改成完整训练覆盖数。[v2 源码](https://arxiv.org/src/2412.14140v2)

领域分类的粒度也不相等：法律与伦理下面有 171 个条目，医学与健康有 78 个，环境科学只有 12 个。即使每个细分条目采样均衡，也不等于各大类训练量相等。附录列出的 29 个需生成代码的领域只是非穷尽清单，不能当作模型已经通过 29 项可执行代码评测。

## 训练数据怎样生成和筛选

作者使用 Llama-3.1-70B 生成评审数据，再混入已有数据集的改编样本。生成与复核都使用同一家族的模型，因此自动复核提供了第二次判断，但并不是来自独立人工来源的正确答案。（§3）

### 第一步：变化字段、任务和目标分数

点式评分的生成脚本随机选择字段名、包含哪些字段、评价哪个字段、领域、文本或代码形式，以及评分范围和目标分数。输入、输出、资料和参考答案各有 15 个备选标签，脚本列出 15 种非空字段组合。这样做是为了降低模型对固定 `MODEL OUTPUT` 名称的依赖。（图 3）

生成器还随机请求不同长度，温度在 0.8–1.0、top-p 在 0.9–1.0 之间变化。图 3 中长度候选从 50 到 10,000；变量名是 `num_words`，实际提示有一处写成 tokens，所以这些是生成请求的长度控制，不能当成最终数据的精确 token 分布。

它先得到某份材料、评价条件、rubric 和正确评分理由，再构造错误评分及相应理由。两答案比较则要求产生质量不同的两个输出，并生成比较标准和正确、错误的评审结果。多标准任务通过把多个要求写进同一 pass criteria 和 rubric 来构建。（附录 C.2、图 3–4）

这里有两层“配对”，容易混淆：输入可以包含两个待比较回答；训练记录本身又包含 **chosen 和 rejected 两份评审结果**。后者才是偏好优化使用的胜出、落败序列。一个单答案评分任务，同样能生成 chosen/rejected 评审对。

### 第二步：重新检查分数和理由

作者再次调用 Llama-3.1-70B，要求它根据 rubric 检查并修正正确、错误评分及理由。验证提示能够改写标签，不只是决定保留或丢弃。随后人工扫描数据，清理重复、非整数分数、格式和 rubric 问题，共删除 18,258 条，文中称约占生成数据的 14.6%。（§3、图 5）

长文本也存在生成失败：模型会写“此处还有若干字”来缩略本应完整生成的内容。作者没有用迭代扩写补齐，而是删除这些实例。表格等结构化内容仍可保留在标准或 rubric 中，用于增加模型对不同格式的适应性。

论文图 2 展示三种评分尺度的数量大致均衡，但 0–5 各数字的全局频率不同，因为这些数字出现于不同尺度。它没有给出一份可直接对应最终 SFT、对齐阶段和增广样本的完整数量表；不能只用“删除约 14.6%”反推一个精确、已核实的最终训练总量。

### 第三步：加入解释性高亮

生成器根据评价材料及理由提取重要词语或短语，要求它们来自被评文本，而不是评价指令。高亮可以帮助读者定位一个矛盾、敏感字段或格式要求对应的内容。（§3）

这不是逐 token 分类器：公开模型生成的是字符串列表，没有字符起止位置、每个片段的概率或独立定位头。若一个短语在材料中出现多次，后续工具仍需决定标记哪一处。论文也承认模型有时会把提示或 rubric 中的词误当成高亮，没有完成对这类错误的全面测试。（Limitations）

高亮的“相关性”也不等同于因果忠实性。它表示模型生成了一段与判断相关的解释材料；论文没有通过删除该片段、替换片段等干预实验，证明每个高亮都真正决定了评分。

### 第四步：改编已有数据，并改变背景

表 8 列出的八个外部来源及使用量如下：

| 来源 | 使用样本数 |
| --- | ---: |
| MOCHA | 2,500 |
| FinQA | 2,000 |
| pile-nontoxic-chunk-0 | 100 |
| PII-Dataset | 100 |
| SetFit/toxic_conversations | 1,000 |
| RealToxicityPrompts | 2,500 |
| HelpSteer | 2,000 |
| BeaverTails | 1,000 |
| 合计 | 11,200 |

作者还改变部分样本的领域和背景，形成增广数据。11,200 是这张表所列外部样本的总和，不包括一个已明确披露的增广倍数；也不是全部合成数据规模。论文没有提供足够材料重建每个来源的筛选 ID、改编版本和训练混合比例。（附录 C.3、表 8）

## SFT 与 APO 分两步训练

GLIDER 先学习按格式给出正确评审，再学习提高正确评审相对于错误评审的概率。底座都是 Phi-3.5-mini-instruct。

### 监督微调学习评审格式与判断

第一阶段进行一轮监督微调，即 SFT。公开脚本将记录里的 `prompt` 变成 user 消息、`chosen` 变成 assistant 消息。它不在这一阶段用 rejected 回答作为目标。

从学习目标上看，这是对训练序列做自回归预测：

$$
\mathcal L_{\mathrm{SFT}}=-\sum_{t\in\mathcal I}\log\pi_\theta(z_t\mid z_{<t}).
$$

$z$ 是格式化后的训练序列，$\mathcal I$ 是实际参与损失计算的位置。公式用于说明交叉熵的作用；公开脚本没有额外指定仅监督 assistant 部分的专用掩码，不能只凭对话映射断言所有 user tokens 都排除在损失之外。

作者选择一轮训练，希望减少过拟合和遗忘。论文没有进行完整的训练轮数扫描，因此“一轮最优”及“比大模型更不容易遗忘”都不是由这一设置单独证明的结论。

### APO-zero 同时提高 chosen、降低 rejected

第二阶段使用 APO-zero，并加入 chosen 上的负对数似然项。论文第 6 页把含梯度的表达式标为损失 $\mathcal L$，其中 $\delta$ 没有展开定义，参考策略与奖励的记号也不够清晰。为便于实现，下面给出**根据项目锁定的 TRL 0.11.4 代码整理的标量目标**，与原文排版式区分。（§4；`train_dpo.py`）

令 $x$ 为评价输入，$y_w$、$y_l$ 分别为正确、错误的完整评审输出；$\pi_\theta$ 是正在更新的模型，$\pi_{\mathrm{ref}}$ 是从 SFT 模型建立的冻结参考。定义：

$$
u_w=\beta\left[\log\pi_\theta(y_w\mid x)-\log\pi_{\mathrm{ref}}(y_w\mid x)\right],
\qquad
u_l=\beta\left[\log\pi_\theta(y_l\mid x)-\log\pi_{\mathrm{ref}}(y_l\mid x)\right].
$$

APO-zero 项为：

$$
\mathcal L_{\mathrm{APO0}}=1-\sigma(u_w)+\sigma(u_l),
\qquad
\mathcal L=\mathcal L_{\mathrm{APO0}}+\alpha\mathcal L_{\mathrm{NLL}}(y_w\mid x).
$$

$\sigma$ 是 sigmoid，$\beta=0.1$，$\alpha=1$。最小化第一项会提高正确评审相对参考模型的概率，最小化第二项会降低错误评审的概率；NLL 继续监督 chosen 的文本内容。TRL 中，偏好项使用序列 log probability，额外 NLL 是 chosen 有效 tokens 的平均交叉熵，两者的归一化方式不同。[TRL 0.11.4 实现](https://github.com/huggingface/trl/blob/v0.11.4/trl/trainer/dpo_trainer.py)

说明示例：初始化时两份策略相同，$u_w=u_l=0$，APO-zero 项为 $1-0.5+0.5=1$。若后续 $u_w$ 上升到 1、$u_l$ 降到 −1，该项约为 0.538，优化方向与“强化正确评审、削弱错误评审”一致。这里是公式算例，不是论文训练日志。

脚本文件虽然名为 `train_dpo.py`，实际明确设置 `loss_type="apo_zero"` 和 `rpo_alpha=1`，不能把它写成标准 DPO 的两回答 log-ratio 差值损失。它也不是在每一步在线采样环境反馈的强化学习；偏好来自预先构造的 AI 评审对。

### 训练配置与公开脚本之间的差别

| 项目 | 论文配置 | 当前固定代码 |
| --- | --- | --- |
| 训练资源 | 8 张 H100、FSDP，总计约 5 小时 | README 要求用户另外配置 Accelerate；没有完整运行配置文件 |
| SFT / 对齐学习率 | $5\times10^{-5}$ / $5\times10^{-7}$ | 一致 |
| SFT / 对齐每设备 batch | 8 / 2 | SFT 为 2，梯度累积 4；对齐为 2 |
| 最大训练长度 | 8,192 tokens | 一致；对齐还设 prompt 上限 8,000 |
| 轮数 | SFT 一轮 | 两个脚本都设置一轮 |
| 调度相关参数 | cosine，并称 decay 0.05 | SFT warmup 0.03、weight decay 0.01；对齐 warmup 0.05 |
| 保存与选模 | 没有给出完整细节 | SFT 每 epoch；对齐每 500 步评估和保存，均加载 best model |

SFT 的“batch 2 × 累积 4”与论文写的每设备 batch 8 数值上有关联，但它们不是同一个参数；运行时显存、更新次数和多卡配置仍需核对。论文的 5 小时是报告资源开销，本文没有重训以验证。（§4、公开训练脚本）

## 评测数据需要按实际实例数理解

论文介绍原始 benchmark 的规模；公开 suite 则包含已经套好评价模板的具体实例。同一道原始问题可以对应多个回答或标准，因此原始题数和待评分记录数不能互换。

本次下载固定 revision 的全部 40 个 Parquet 文件并逐文件统计，得到以下实际评测入口：

| 评测集 | 论文介绍 | 公开 GLIDER suite 的记录数 |
| --- | --- | ---: |
| FLASK | 80 个基础测试提示及细粒度标准 | 2,001 |
| Feedback Bench | 200 个具体指令、1,000 条实例 | 1,000 |
| SummEval | 100 篇新闻 × 16 个摘要系统，三个专家评分 | 四项标准各 1,600 |
| BigGen Bench | 765 个实例、77 类任务，另有多语言部分 | human_eval 2,780；多语言 420 |
| HH Eval | 无害 58、有帮助 59、诚实 61 对 | 58 / 59 / 61 |
| MT-Bench | 原始约 3,300 个人类偏好对 | 2,575 |
| RewardBench | 2,945 条 | Chat 318、Chat-Hard 456、Safety 740、Reasoning 1,431，合计 2,945 |
| LiveBench 指令跟随 | 2024 年 11 月版本 | 200 |
| 多语言 RewardBench | 文中称 23 种语言 | 23 个语言/文字分区，每个 2,869 |

这些统计来自公开套件，不证明论文每一行结果都用了下载快照中的每一条记录。MT-Bench 的原始规模与 suite 差异没有给出完整筛选清单。某些评测文件的 split 叫 `train`，但它们属于 **eval-suite**，脚本把它们用于测试；不能据 split 名称认定它们进入了 GLIDER 训练。

SummEval 中，作者先平均三名专家的评分，再四舍五入成整数，之后计算相关性。这与保留连续人工均值的评测不同。公开 BigGen `human_eval` 还包含四条 `score=-1`，对应 rubric 却是 1–5；评分脚本没有专门过滤它们。本文没有推定 −1 的语义，完整复现需要查明这些标签的处理方式。

### 公开多语言数据是 23 个分区，主表只展示 20 列

suite 包含阿拉伯语、捷克语、德语、希腊语、法语、希伯来语、印地语、印尼语、意大利语、日语、韩语、荷兰语、波斯语、波兰语、葡萄牙语、罗马尼亚语、俄语、西班牙语、土耳其语、乌克兰语、越南语，以及简体、繁体中文。这里最后两个是同一语言的文字变体，因此直接称“23 种不同语言”不够准确。

论文表 3 只展示 20 个语言列，未单列波斯语、葡萄牙语，也没有拆分简繁中文。本文不把这张表的列数、公开分区数和独立语言数当作同一统计量。

## Pearson 与 macro-F1 分别衡量什么

对于 1–5 等分档评分，论文表 1 使用 Pearson 相关系数。设人工标签为 $h_i$，模型分数为 $s_i$：

$$
\rho=\frac{\sum_i(h_i-\bar h)(s_i-\bar s)}
{\sqrt{\sum_i(h_i-\bar h)^2}\sqrt{\sum_i(s_i-\bar s)^2}}.
$$

它衡量分数变化是否具有线性一致性，范围为 −1 到 1，越高越好。相关性不是逐条完全相同的比例；若模型分数系统性偏高，它仍可能与人工分数高度相关。任一侧没有变化时，Pearson 还可能无定义。

二分类评测的公开脚本使用 `f1_score(..., average="macro")`。对每个类别 $c$，先计算精确率 $P_c$、召回率 $R_c$，再平均类别 F1：

$$
F_{1,c}=\frac{2P_cR_c}{P_c+R_c},
\qquad F_{1,\mathrm{macro}}=\frac1{|\mathcal C|}\sum_{c\in\mathcal C}F_{1,c}.
$$

这里 $\mathcal C$ 是参与计算的类别集合。它给类别等权，不等于所有样本的正确率，更不是只计算“通过”类别的 F1。对于比例不平衡的数据，只报 accuracy 可能掩盖模型对少数类的遗漏。（公开 `extract_accuracies.py`）

### 格式失败会影响指标分母

脚本从 `<score>` 中提取数字。无法提取时会 `continue`，不把该条加入指标数组；因此报告值是**成功解析输出上的指标**。脚本内部累加了 `failures`，但没有把解析失败数写入最终 metrics，用户只看结果文件可能忽略覆盖率。

它还先读浮点数再转整数，未检查是否属于 rubric；例如 2.9 会进入整数数组成为 2。起始标签检查先加上标签长度，导致某些缺失 `<score>` 的畸形输出仍能被接受。本次用纯函数算例确认：`abcdef1</score>` 会被解析成 1。这个例子只证明解析逻辑的边界，没有证明模型在论文实验中实际产生了多少此类输出。

因此，复现应同时保存总记录数、合法输出数、解析失败数和越界分数。若修正解析器后重新计算，要同时保留原协议与修正协议的结果，不能将两者混作原论文成绩。

## 主结果：优势集中在具体任务

闭源基线包括 GPT-4o `2024-11-20`、GPT-4o-mini `2024-07-18`、Claude-3.5-Sonnet `2024-10-22`；开放模型包括 Llama-3.1-70B、Qwen-2.5-72B、Prometheus 2 和 FlowAI Judge。论文设置 temperature 0、top-p 1。Prometheus 在这些数据上没有得到参考答案；Feedback Bench 又是它的域内测试集，这些条件都会影响比较。（§4）

### 点式评分：FLASK 很接近 GPT-4o，其余指标各有差别

下表摘录表 1，全部是 Pearson 相关系数。最后一列是前七个指标的平均，SummEval 因有四列而占其中四份权重，并非四个 benchmark 等权。

| 模型 | BigGen | FLASK | Feedback | 摘要相关性 | 摘要一致性 | 摘要连贯性 | 摘要流畅性 | 平均 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| GPT-4o | 0.614 | 0.610 | 0.810 | 0.312 | 0.550 | 0.419 | 0.522 | 0.548 |
| GPT-4o-mini | 0.231 | 0.565 | 0.803 | 0.431 | 0.425 | 0.423 | 0.283 | 0.452 |
| Claude-3.5-Sonnet | 0.592 | 0.592 | 0.812 | 0.464 | 0.620 | 0.497 | 0.496 | 0.582 |
| Llama-3.1-70B | 0.580 | 0.572 | 0.792 | 0.391 | 0.497 | 0.527 | 0.391 | 0.536 |
| Phi-3.5-mini-instruct | 0.294 | 0.331 | 0.731 | 0.245 | 0.166 | 0.261 | 0.266 | 0.328 |
| Prometheus-2-8x7B | 0.524 | 0.555 | 0.898 | 0.287 | 0.320 | 0.328 | 0.293 | 0.458 |
| FlowAI Judge 3.8B | 0.460 | 0.400 | 0.787 | 0.286 | 0.358 | 0.351 | 0.309 | 0.422 |
| GLIDER，无高亮 | 0.490 | 0.570 | 0.759 | 0.367 | 0.418 | 0.433 | 0.321 | 0.480 |
| GLIDER | 0.604 | 0.615 | 0.774 | 0.398 | 0.522 | 0.462 | 0.365 | 0.534 |

GLIDER 相对底座的平均相关系数提高 0.206，相对同尺寸 FlowAI Judge 提高 0.112。它在 FLASK 比 GPT-4o 高 **0.005**，不是高 0.5% 的准确率；在 Feedback Bench 则比 GPT-4o 低 0.036，比 Prometheus-2-8x7B 低 0.124。其平均 0.534 接近 Llama-3.1-70B 的 0.536，但不能据此断言两者在所有领域可互换。

论文为 GLIDER 的七列分别列出 ±0.005、±0.01、±0.01、±0.02、±0.01、±0.01、±0.03，但没有清楚定义这些值是标准差、标准误还是置信区间，也未交代对应独立重复次数。不能把 FLASK 的 0.005 差异写成已经统计证明的稳定领先。

### 二分类与偏好：LiveBench 较强，复杂聊天仍有差距

以下逐项保留表 2 的 GLIDER 成绩，便于看到同一模型内部的差异；F1 范围为 0–1，越高越好。

| 项目 | GLIDER | 无高亮 GLIDER | GPT-4o | GPT-4o-mini |
| --- | ---: | ---: | ---: | ---: |
| LiveBench 指令满足 | 0.654 ± 0.040 | 0.542 | 0.661 | 0.481 |
| HH：无害 | 0.946 ± 0.003 | 0.946 | 0.983 | 0.948 |
| HH：有帮助 | 0.830 ± 0.005 | 0.829 | 0.898 | 0.863 |
| HH：诚实 | 0.778 ± 0.002 | 0.783 | 0.831 | 0.812 |
| MT-Bench | 0.628 ± 0.060 | 0.577 | 0.813 | 0.786 |
| RewardBench：Chat | 0.876 ± 0.005 | 0.835 | 0.950 | 0.943 |
| RewardBench：Chat-Hard | 0.575 ± 0.002 | 0.577 | 0.697 | 0.566 |
| RewardBench：Safety | 0.797 ± 0.010 | 0.797 | 0.861 | 0.802 |
| RewardBench：Reasoning | 0.888 ± 0.010 | 0.904 | 0.893 | 0.859 |
| RewardBench 报告平均 | 0.784 ± 0.006 | 0.778 | 0.850 | 0.793 |
| 表 2 报告总平均 | 0.776 | 0.754 | 0.843 | 0.784 |

GLIDER 的 LiveBench F1 比 GPT-4o-mini 高 0.173、比 GPT-4o 低 0.007；MT-Bench 则比 GPT-4o 低 0.185。摘要或总平均中的“接近”会掩盖这种任务差异。

总平均不能作为统一、已重算的总体正确率。论文没有清楚给出所有汇总列的权重，而且表 2 的部分其他模型存在算术不一致：Claude 的四项 RewardBench 数值平均为 0.791，表中 Avg 却为 0.849；Llama 的四项平均为 0.764，表中为 0.826。本文保留作者报告的 GLIDER 汇总值，并优先解释逐项结果，没有据此重新发布一套“修正排行榜”。

## 高亮消融支持的结论

无高亮版本从训练数据中移除了 highlight spans，再比较最终表现。因此它研究的是训练时加入这一输出成分的效果，不等于同一个已训练模型在推理时简单隐藏高亮文本。（§5）

| 比较项 | 无高亮 | 完整 GLIDER | 差值 |
| --- | ---: | ---: | ---: |
| 表 1 平均 Pearson | 0.480 | 0.534 | +0.054 |
| BigGen Pearson | 0.490 | 0.604 | +0.114 |
| LiveBench F1 | 0.542 | 0.654 | +0.112 |
| MT-Bench F1 | 0.577 | 0.628 | +0.051 |
| RewardBench Reasoning F1 | 0.904 | 0.888 | −0.016 |
| 表 2 报告总平均 F1 | 0.754 | 0.776 | +0.022 |

高亮版本在若干细粒度任务上提高，但并非每个子集都有收益：Reasoning 下降，HH 诚实略降，Safety 不变。原文 RQ4 把 pointwise/pairwise 的名称及表号部分写反；本文按表 1 的 Pearson 和表 2 的 F1 来解释，避免把“0.054 相关性”写成“偏好准确率提高 5.4%”。

论文没有分别消融理由、领域数量、字段随机化、外部增广、SFT 和 APO，也没有报告高亮带来的输出长度或延迟开销。因此这些设计各自贡献多少、是否必须同时使用，无法由当前消融表完整分解。

## 多语言表现与遗忘结论的边界

GLIDER 使用英语训练数据，随后在多语言测试集上评测。表 4 的 BigGen 多语言 Pearson 为 0.545，高于底座的 0.290、FlowAI Judge 的 0.410和 Llama 的 0.450，低于 GPT-4o 的 0.583及 Claude 的 0.554。表标题写成 BigBench，但正文和公开数据入口对应 BigGen Bench 多语言部分。（表 4）

在多语言 RewardBench 中，GLIDER 报告平均 F1 为 0.777，Llama 为 0.755，Prometheus 为 0.741，FlowAI Judge 为 0.640。不同语言差异明显：法语 0.830、日语 0.827、韩语 0.819，而希腊语为 0.626，印地语和印尼语均为 0.708。（表 3）

表 3 还有不能直接采用的统计项：GPT-4o 的平均写为 0.835，高于该行所有展示语言列，`var` 又写为 0.700。论文没有解释这些汇总列与展示数据的关系；本文不使用它们证明跨语言稳定性。表中 GLIDER 的较好表现也没有隔离 SFT 轮数和 APO 的作用，不能由此证明“小模型一定比大模型遗忘更少”。

## 两次人类研究的分母不同

### 训练数据质量：100 条、三名标注者、九项检查

作者随机抽取 100 条训练记录，三名标注者检查材料、rubric、正确和错误评审。附录规定标注者需英语流利、成年；专家条件是拥有学士或同等学历，或已经完成至少 25 次标注。它不等于各领域都由相应行业专家验证。（附录 C.4）

| 检查 | 表 7 的平均认可比例 |
| --- | ---: |
| 材料可理解 | 95% |
| 评价条件结构适当 | 95% |
| Rubric 无歧义 | 88% |
| Chosen 理由合适 | 91% |
| Chosen 高亮正确 | 96% |
| Chosen 分数最合适 | 87% |
| Rejected 理由不理想 | 100% |
| Rejected 高亮错误 | 99% |
| Rejected 分数错误 | 98% |

后面三项越高，表示负例越符合“应被拒绝”的预期，并非模型的三项预测准确率。Chosen 分数的认可率为 87%，也说明训练标签仍有噪声。这些百分比是九个不同问题的结果，不能合成“全部训练集 96% 正确”。

### 模型输出质量：另外 100 条测试输出、三项检查

作者从测试集取 100 条输出，由三名标注者评价：理由正确性 91.8%、高亮相关性 90.5%、分数正确性 91.7%。三项的简单平均约为 **91.3%**，与摘要的人类 agreement 数字一致；分数正确性本身是 91.7%，不是 91.3%。（§6、表 6）

作者报告总体 Krippendorff’s alpha 为 0.838，用于衡量标注者之间的一致性。它和“人类是否认可模型输出”的比例是不同指标，也不是 Pearson 相关系数。

论文没有公开这 100 条输出的完整样本 ID、各数据集所占比例、逐人标签、置信区间及完整聚合细节。不能把该抽查比例推广为任意输入、任意语言和任意自定义标准上的准确率。高亮相关性也没有用字符跨度 F1、交并比或人工定位标注来验证，因此它是相关性判断，不是精确定位正确率。

## 失败案例说明 rubric 需要给出边界

表 5 的另一例是土耳其语问句，大意为询问某种药物是否用于 11 岁以下儿童。评价条件只要求文本不能含错误信息，没有说明对问句、未知信息和不相关内容怎样处理。GLIDER 把其中的年龄和询问语气当作缺乏证据的信息，给出 0。作者把它归因于条件未规定中性情形。（§6）

这个例子说明，文字标准必须区分“断言错误事实”“提出问题”和“缺少资料无法核实”。它并不能证明任何标准写得越长越好。论文没有系统比较不同详细程度的 rubric，也没有在输入扰动、混淆资料或评审器提示注入上完成鲁棒性实验。

作者还报告在 logical-fallacy 数据上的 95.6% 准确率，但没有给出足够的划分、样本量及完整结果表。本文将它保留为补充报告，不把它与表 1–2 的已列出基准合并。生成器来自单一模型的偏差、底座原有弱点和解释内容出错，仍可能进入最终模型。（§6、Limitations、Ethics Statement）

## 公开版本和实际复现入口

本次检查固定了以下材料：

| 材料 | 版本 |
| --- | --- |
| 论文 | arXiv:2412.14140v2，2024-12-20 |
| GitHub 代码 | `40a2a8a7af8ec0fa098f3bea5f02fa6793ef4dc4`，2024-12-20 |
| Hugging Face 模型 | `5639434e21faee47a8d3a092cd3105ab051c8b01` |
| 训练依赖声明 | Python 3.10.15、Torch 2.4.0、Transformers 4.45.2、TRL 0.11.4 |
| 评测数据 | 12 个数据仓库、40 个 Parquet；按各自 revision 下载并核对数量 |

模型卡和代码都声明 CC-BY-NC-4.0。开放权重及源码不等于没有使用条件；部署前应查看对应版本的许可。[固定代码](https://github.com/patronus-ai/glider/tree/40a2a8a7af8ec0fa098f3bea5f02fa6793ef4dc4)、[固定模型卡](https://huggingface.co/PatronusAI/glider/blob/5639434e21faee47a8d3a092cd3105ab051c8b01/README.md)

### 先复现已发布模型的评分

公开推理脚本使用 vLLM，`temperature=0`、`top_p=1`、最多生成 2,048 tokens，并将整个 prompt 放入 user 消息。它遍历官方 collection 中的全部数据集和 split，再保存生成文本和标签。若只运行单题，应保留相同聊天模板、评价条件及输出格式。

模型训练上限是 8,192 tokens；模型卡称试过约 12,000，而配置中的位置上限为 131,072。这三个数字分别是训练设置、额外使用观察和模型配置能力，**不能把 131,072 当成本文已验证的长上下文评审长度**。脚本的 `max_model_len=8192` 默认注释掉，`max_seq_len_to_capture=131072` 也不等于训练数据扩展到了该长度。

以下是原仓库入口示意，本文没有执行模型推理：

```bash
git clone https://github.com/patronus-ai/glider.git
cd glider
git checkout 40a2a8a7af8ec0fa098f3bea5f02fa6793ef4dc4
# 按固定环境准备推理依赖，预先保存模型与评测数据 revision
python eval/vllm_test_local.py --model /path/to/pinned-glider --output_dir /path/to/results
python eval/extract_accuracies.py --eval_dir /path/to/results --output_file /path/to/metrics.jsonl
```

原脚本通过 collection 读取最新条目，且 `load_dataset` 没有传 revision。若直接照运行，不能保证加载到本文或论文时点的数据。README 还提到发布时 Phi 模型 LongRoPE 的 vLLM 问题，指向一个临时修复分支；它没有固定该分支提交和完整推理环境，复现时需记录实际依赖版本。

### 重训前需要处理两个可确认的脚本问题

`train_sft.py` 先导入 Hugging Face 的 `load_dataset`，又定义同名函数。函数内部调用 `load_dataset(..., split="train")` 时会调用自己，因不接受 `split` 而失败。本次提取该函数、使用虚拟路径进行纯 Python 检查，确认错误为 `unexpected keyword argument 'split'`；这一步没有加载数据或模型。

README 的对齐命令使用 `--model_dir`，实际 `train_dpo.py` 接受的是 `--model_path`。SFT 默认模型名也与论文使用的完整底座名不同。调用时应显式提供 `microsoft/Phi-3.5-mini-instruct`，并将对齐输入指定为自己完成的 SFT checkpoint。

这些问题意味着“有训练代码”不等于“一条命令原样重训成功”。此外，脚本需要一个含 `train`、`eval` split 以及 `prompt/chosen/rejected` 字段的训练集；官方公开的 GLIDER 数据 collection 是评测套件，本次在官方仓库与同名数据列表中没有找到完整合成训练集。因此即使修正脚本，也不能仅靠这些材料精确重建论文训练过程。

### 数据版本索引

下面列出本次下载检查的 revision，避免移动的 collection 成为唯一复现依据：

| 官方数据仓库 | Revision |
| --- | --- |
| [FLASK](https://huggingface.co/datasets/PatronusAI/glider-flask-eval-suite/tree/5eb4eb1412dac00357f9dfd771ffbd0347fc6acc) | `5eb4eb1412dac00357f9dfd771ffbd0347fc6acc` |
| [Feedback](https://huggingface.co/datasets/PatronusAI/glider-feedback-bench-suite/tree/01f28a32c8227dfb4a6105eb87a63b4cabb7bdb8) | `01f28a32c8227dfb4a6105eb87a63b4cabb7bdb8` |
| [SummEval](https://huggingface.co/datasets/PatronusAI/glider_summeval_suite/tree/5c085dca20dad677565703e3492233b1a7039386) | `5c085dca20dad677565703e3492233b1a7039386` |
| [BigGen](https://huggingface.co/datasets/PatronusAI/glider-biggen-bench-suite/tree/92b1edb16bad057755210cc5dcb5d9650e91e94f) | `92b1edb16bad057755210cc5dcb5d9650e91e94f` |
| [HH](https://huggingface.co/datasets/PatronusAI/glider-hh-alignment-suite/tree/21506ead30c137002e01fcf4d4ec0af9df3e6992) | `21506ead30c137002e01fcf4d4ec0af9df3e6992` |
| [MT-Bench](https://huggingface.co/datasets/PatronusAI/glider-mt-bench-suite/tree/09b3194a5b55468a35581550d0016ddd222be65b) | `09b3194a5b55468a35581550d0016ddd222be65b` |
| [RewardBench Chat](https://huggingface.co/datasets/PatronusAI/glider-reward-bench-suite-chat/tree/7949d18420c3b95251bf6cfb713dbff263d7ca7a) | `7949d18420c3b95251bf6cfb713dbff263d7ca7a` |
| [RewardBench Chat-Hard](https://huggingface.co/datasets/PatronusAI/glider-reward-bench-suite-chat_hard/tree/f19fe1bd61e7b044878d8852cd25d6caa4a8d4df) | `f19fe1bd61e7b044878d8852cd25d6caa4a8d4df` |
| [RewardBench Safety](https://huggingface.co/datasets/PatronusAI/glider-reward-bench-suite-safety/tree/5e75cd61d312f50b6281e7291fe82ea0b7e753c8) | `5e75cd61d312f50b6281e7291fe82ea0b7e753c8` |
| [RewardBench Reasoning](https://huggingface.co/datasets/PatronusAI/glider-reward-bench-suite-reasoning/tree/f3836170f58adc6964988e564be883697c22b03a) | `f3836170f58adc6964988e564be883697c22b03a` |
| [LiveBench](https://huggingface.co/datasets/PatronusAI/glider_livebench_instruction_suite/tree/1fba00ddf595b9c7a925a14a3a7b9de800da0184) | `1fba00ddf595b9c7a925a14a3a7b9de800da0184` |
| [多语言 RewardBench](https://huggingface.co/datasets/PatronusAI/glider-multilingual-reward-bench-suite/tree/fdc174fcfdaa569feb2ee29bbdc7a949d462e981) | `fdc174fcfdaa569feb2ee29bbdc7a949d462e981` |

## 阅读覆盖与结果范围

本篇阅读了 v2 全部正文和附录，包括生成提示、分类表、训练公式、实验和两个人类研究；查看了 PDF 主表与公式版面，并核对 LaTeX 源码、模型配置、全部公开评测分区及四个训练/评测脚本。完成了分类字典计数、数据标签统计、解析器和 SFT 加载函数的本地检查。**没有下载模型权重、运行 GPU 推理或训练，也没有重新计算论文模型成绩。**

GLIDER 的已展示结果是：小型模型经专门训练后，可以在一些细粒度评分和指令判断任务上接近更大的评审模型，并同时提供可阅读的理由与相关片段。性能仍随任务、语言、评价条件和输出解析方式变化。完整训练数据、汇总指标细节、独立重复的误差定义，以及高亮的因果忠实性和扰动鲁棒性，仍超出当前公开证据。

## 原始资料

- [论文 v2 与附录](https://arxiv.org/pdf/2412.14140v2)、[版本与作者记录](https://arxiv.org/abs/2412.14140v2)
- [论文原始 LaTeX 源码](https://arxiv.org/src/2412.14140v2)
- [固定版本 GitHub 仓库](https://github.com/patronus-ai/glider/tree/40a2a8a7af8ec0fa098f3bea5f02fa6793ef4dc4)
- [固定模型文件与模型卡](https://huggingface.co/PatronusAI/glider/tree/5639434e21faee47a8d3a092cd3105ab051c8b01)
- [官方评测 collection](https://huggingface.co/collections/PatronusAI/glider-eval-suite-673ceadb04c69353dd2a13fe)
- [项目依赖的 TRL 0.11.4 偏好训练实现](https://github.com/huggingface/trl/blob/v0.11.4/trl/trainer/dpo_trainer.py)
