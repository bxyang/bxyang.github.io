---
title: "Continual Learning Bench：测量智能体从连续经验中获得的收益"
company: "snorkel-ai"
date: "2026-06-04"
dateLabel: "2026-06-04"
kind: "合作论文与基准"
description: "展开六类有状态任务、奖励与增益归一化、稳定性和可塑性分解，并核对模型比较、成本与公开代码。"
readingStatus: "deep-read"
paperVersion: "arXiv:2606.05661v1，2026-06-04，33 页"
reviewed: "2026-09-12"
---

[← Snorkel AI](/companies/snorkel-ai) · [全部工作](/research)

# Continual Learning Bench：测量智能体从连续经验中获得的收益

一个智能体连续回答数据库问题，早期需要先查表名、列名和价格单位，后来可以复用已经发现的规律。如果中途数据库迁移，它还需要更新旧知识。Continual Learning Bench 把这类过程做成六个领域的任务序列，并对每个系统运行一组“逐题重置”的对照：有历史经验与没有历史经验的奖励差，才是这里要测量的学习增益。论文中，完整保留上下文的 Sonnet 4.6 取得最高的综合归一化增益 25.4%；这个数字表示捕获了约四分之一的参照提升空间，不是答对了 25.4% 的题。[第 3–5 节、表 1](https://arxiv.org/pdf/2606.05661v1#page=3)

| 项目 | 信息 |
| --- | --- |
| 原文 | *Continual Learning Bench: Evaluating Frontier AI Systems in Real-World Stateful Environments* |
| 作者 | Parth Asawa、Christopher M. Glaze、Gabriel Orlanski、Ramya Ramakrishnan、Benji Xu、Asim Biswal、Vincent Sunn Chen、Frederic Sala、Matei Zaharia、Joseph E. Gonzalez |
| 机构 | UC Berkeley、Snorkel AI、University of Wisconsin–Madison |
| Snorkel 参与 | Glaze、Ramakrishnan、Chen 署名 Snorkel AI；Sala 同时署名 Wisconsin–Madison 与 Snorkel AI |
| 版本 | 2026 年 6 月 4 日首次公开，arXiv v1，33 页，预印本 |
| 数据范围 | 六类任务，默认序列合计 301 个实例，每个实例包含一次或多次行动 |
| 发布内容 | 环境、任务日程、系统实现、运行框架、结果文件与分析工具 |
| 本文检查代码 | `pgasawa/continual-learning-bench`，提交 `5f8c50eb1e84b2eda2ef4faff757dfc812a0ea26` |

作者与版本见[原文首页](https://arxiv.org/pdf/2606.05661v1#page=1)及 [arXiv 记录](https://arxiv.org/abs/2606.05661v1)，代码见[固定提交](https://github.com/pgasawa/continual-learning-bench/tree/5f8c50eb1e84b2eda2ef4faff757dfc812a0ea26)。

## 评测单位是一段工作过程

论文中的 task 是一个完整任务序列，例如回答 40 个数据库问题；instance 是其中一道问题；step 是一次行动，例如执行 SQL；variant 是环境或数据分布的一种阶段；schedule 则规定这些阶段与实例的顺序。被评估的 system 包含模型、记忆方式、工具和执行框架，而不只是模型权重。[第 3 节](https://arxiv.org/pdf/2606.05661v1#page=3)

有状态系统可以保存上下文、笔记、检索记忆，某些任务还允许保留文件与训练出的预测器。无状态对照在每个实例开始时重新创建系统，从该实例独立开始。对照应面对同一个实例的环境状态：例如数据库已经迁移后的题目，仍在迁移后的数据库上回答，只是不带前 20 题的经验。它不是把环境也退回第一题。

论文要求新任务具有三项条件：初始表现留有提升空间；实例共享能够发现的潜在规律；早期观察能够帮助后续行动。数据库编码、对手下注策略、家具类别的增长规律都属于这种共享结构。软件任务使用真实仓库，其代码或历史仍可能出现在预训练中；“设计了未知结构”不等于对所有任务完成了预训练污染排除。[第 3.1 节](https://arxiv.org/pdf/2606.05661v1#page=4)

每项任务先由两位作者检查设计条件，再请 2–3 位领域专家评审真实性、知识可复用性和预期学习改善，按反馈迭代。论文报告每位专家每轮平均投入 2.14 小时，范围为 1–4.5 小时。这是任务设计验证，不是给每条回答都做人工打分，也不是已经证明存在一个达到最优奖励的可运行智能体。[第 3.2 节、图 2](https://arxiv.org/pdf/2606.05661v1#page=4)

## 六个领域分别要求记住什么

| 任务 | 默认实例数 | 可复用的结构 | 环境变化 |
| --- | ---: | --- | --- |
| 盲频谱监测 | 90 | 发射机的中心频率与带宽 | 分三阶段逐渐观测到更多信道 |
| 代码库适应 | 19 | 文件布局、测试方法、维护习惯 | 从 tablib 切换到 tenacity |
| 队列研究 | 20 | 跨研究变量对应关系与生存规律 | 五种研究，各四个实例 |
| 数据库探索 | 40 | 表关系、单位、编码、特殊字段 | 第 20 题之后迁移 |
| 可利用策略的扑克 | 120 | 三种确定性对手的策略 | 五段对手序列，旧对手再次出现 |
| 销售预测 | 12 | 商品类别与地点共享的增长规律 | 可见门店轮换，字段与干扰变量变化 |

实例数量合计 $90+19+20+40+120+12=301$。这些任务的奖励尺度不同，必须先看清评分方式，再比较综合分数。[图 3、附录 A](https://arxiv.org/pdf/2606.05661v1#page=5)

### 盲频谱监测：未出现不等于不存在

任务覆盖 340–508 MHz 的频段。每次输入包含扫描元信息、检测峰值、功率与带宽，智能体输出已知发射机列表。发射机可能长期休眠，因此输出不能只反映当前扫描中出现的信号。日程依次为 30 次以五个宽带信道为主的扫描、30 次新增四个窄带信道的扫描，以及 30 次完整 13 信道网格的扫描。

三个阶段的完整信道集合始终固定；变化的是哪些部分可被看见。这是观察信息逐渐增加，不是发射机真实集合每阶段都被替换。评分把预测占用频段 $A_t$ 与完整真值频段 $B$ 做交并比：

$$
r_t=\frac{|A_t\cap B|}{|A_t\cup B|},\qquad r_{max}=1.
$$

长度按 MHz 计算。没有见过、也无法从已有扫描推断的信道会压低初期成绩，所以这个满分参照包含完整信息。公开实现只给最简确认反馈，不向智能体逐区域透露正确性；主要学习信号来自连续扫描。[附录 A.1](https://arxiv.org/pdf/2606.05661v1#page=13)、[任务实现](https://github.com/pgasawa/continual-learning-bench/blob/5f8c50eb1e84b2eda2ef4faff757dfc812a0ea26/src/tasks/blind_spectrum_monitoring/task.py)

### 代码库适应：修复成功之后再计算节省的行动

19 个问题来自 SWE-bench 中的 `jazzband/tablib` 9 个问题和 `jd/tenacity` 10 个问题。筛选要求包括：问题描述至少 600 字符、代码补丁改变 8–300 行、测试补丁至少改变 4 行，排除仅文档或测试的改动；再选择时间连贯的最近窗口，总跨度不超过 365 天，相邻问题间隔不超过 120 天。

每道题在对应基准提交的新 Docker 容器中开始，通过 bash 操作后提交补丁，由隐藏回归测试判断。前一道题的代码修改不会直接成为下一道题的起点，可积累的是仓库知识与解决问题的方法。设成功提交所用步数为 $s$，预算为 40：

$$
r_t=\begin{cases}
1-\frac{s-1}{40},&\text{补丁通过测试},\\
0,&\text{失败、超时或未解决}.
\end{cases}
$$

一步解决得 1 分；耗费很多步骤但最终正确，仍与失败区分。它不是单纯的修复率，也没有统一不同 bash 命令内部的实际运行量。[附录 A.2](https://arxiv.org/pdf/2606.05661v1#page=14)

### 队列研究：从偏样本估计总体生存率

任务使用虚构疾病 Vardan-A Syndrome，要求为 36 个预定义队列分别预测诊断后 12、24、36 个月的生存概率，共 108 个数。五个研究 HERALD、MERIDIAN、MOSAIC、FORGE、CADENCE 各有不同的采样偏差、变量子集和编码方式。当前研究没有测量某个变量时，智能体需要利用以前研究的证据，而不能把所有不可见队列都视为当前总体。

每个实例提供 SQLite 患者表、字段描述和研究说明，可调用元数据、统计摘要、只读 SQL、分组生存估计、最终提交五类工具。疾病规律由合成潜在模型生成；这里的分数不涉及真实患者诊疗效果。

令 $p$ 为真实生存率，$q$ 为预测生存率，使用二元分布 KL 散度：

$$
D_{KL}(p\|q)=p\log_2\frac pq+(1-p)\log_2\frac{1-p}{1-q}.
$$

对 36 个队列与三个时间点求平均得到 $KL_{agent}$。参照 $KL_{flat}$ 来自“给所有队列都预测当前研究平均生存率”，奖励为：

$$
r_t=KL_{flat,t}-KL_{agent,t}.
$$

正值表示比这个平坦预测更接近总体真值，负值表示更差。它与有状态减无状态的 gain 是两个层次，不能混为一谈。代码将分布以 $\alpha=0.01$ 混入均匀分布再计算 KL，避免 0/1 概率带来无穷损失；上式说明未平滑时的核心定义。智能体不接收跨实例的真值分数反馈，只能从研究数据和已有知识中学习。[附录 A.3](https://arxiv.org/pdf/2606.05661v1#page=15)、[评分器](https://github.com/pgasawa/continual-learning-bench/blob/5f8c50eb1e84b2eda2ef4faff757dfc812a0ea26/src/tasks/cohort_studies/scorer.py)

该任务的 $r_{max}$ 是默认日程下 oracle 生存预测相对平坦基线的平均收益，论文约为 0.162 bits/cohort，代码为 0.162202。不同研究的偏差不同，逐实例上限也不同；它不是所有可能任务序列上的通用常数。

### 数据库探索：保存规律，也更新已过期的规律

数据来自 Amazon 商品元信息与评论，分别采样 Office Products、Electronics、Musical Instruments 三类各 50,000 个商品，构造 10 张表。领域专家编写 40 道问题。初始数据库有缩写列名、不同价格单位、类别间不一致的表结构和干扰列。

第 20 题后模拟迁移：电子产品引入新的价格列，旧列仍保留；办公用品的 verified 状态只有部分行迁移；乐器评论的时间戳被拆分；旧属性表变成 legacy 表。智能体既需要记忆，也需要重新检查信息是否仍有效。

每题最多 15 次探索 SQL 查询。设查询数为 $u$，则：

$$
r_t=\begin{cases}1-u/15,&\text{最终答案正确},\\0,&\text{错误、超时或超预算}.\end{cases}
$$

原文示意图使用 8 次查询的简化预算，附录例子还残留“用 1 次、剩 7 次”的文字；正式评分与当前代码预算都是 15，不能照示意图配置。[附录 A.4](https://arxiv.org/pdf/2606.05661v1#page=17)、[任务实现](https://github.com/pgasawa/continual-learning-bench/blob/5f8c50eb1e84b2eda2ef4faff757dfc812a0ea26/src/tasks/database_exploration/task.py)

当前代码在迁移后明确提示 schema 或列编码已发生变化，并建议重新检查。因此此版本测试的是收到变化通知后能否更新具体知识，不能称为完全无提示的漂移发现实验。[默认日程](https://github.com/pgasawa/continual-learning-bench/blob/5f8c50eb1e84b2eda2ef4faff757dfc812a0ea26/src/tasks/database_exploration/schedules/default.json)、[变化通知实现](https://github.com/pgasawa/continual-learning-bench/blob/5f8c50eb1e84b2eda2ef4faff757dfc812a0ea26/src/tasks/database_exploration/task.py)

### 扑克：识别固定策略并在对手再次出现时复用

两人德州扑克环境中，每手重置双方 1,000 筹码，小盲 5、大盲 10。对手采用确定性规则：跟注型几乎始终跟注；fit-or-fold 类型只在较强牌力时继续；松凶型早期激进、后期收紧。120 手分为 20、30、10、35、25 手五段，前两类对手之后再次出现，以检验保留与再适应。各段固定随机种子，牌面可重现，但智能体不知道对手底牌与未来公共牌。[附录 A.5](https://arxiv.org/pdf/2606.05661v1#page=18)

每手奖励是筹码净收益除以大盲：$r_t=\Delta chips_t/10$，任务平均值单位为 bb/hand。归一化参照约 9.49 bb/hand，来自知道对手策略的专家策略模拟；当前代码使用 9.4875。它是参照策略的表现，不是已证明的最高可能收益，因此理论上其他系统可能超过这个数。[专家参照实现](https://github.com/pgasawa/continual-learning-bench/blob/5f8c50eb1e84b2eda2ef4faff757dfc812a0ea26/src/tasks/exploitable_poker/oracle.py)

### 销售预测：跨门店积累数据与模型

虚构家具零售商有旧金山、纽约、芝加哥三家门店。每个年度只提供一家门店前一年的销售数据，要求输出未来五年共 75 个商品—地点—年份预测。12 个实例对应 2027–2038 年，分三个阶段；门店轮换，字段名不同，并加入天气、营销等看似相关但非因果的干扰字段。潜在增长规律跨商品类别和地点共享。

工作空间可以跨实例保留，因此智能体可以保存历史面板、拟合程序和预测模型，而不只依赖语言笔记。当前代码为无状态对照启用逐实例清理工作空间；只清除聊天而保留历史数据文件，并不构成这个任务所需的无状态对照。[附录 A.6](https://arxiv.org/pdf/2606.05661v1#page=19)、[工作空间配置](https://github.com/pgasawa/continual-learning-bench/blob/5f8c50eb1e84b2eda2ef4faff757dfc812a0ea26/src/tasks/sales_prediction/task.py)

评分是 WAPE skill：

$$
r_t=1-\frac{\sum_{j=1}^{75}|\widehat y_j-y_j|}{\sum_{j=1}^{75}|y_j|}.
$$

完美预测为 1，全部预测零为 0，严重高估可以得到负分。它不是每一行百分比误差的简单平均，单行真实值为零也不需要逐行除零。当前代码对整段五年预测计分，但返回给智能体的反馈只计算已经过去的年度，避免把未来五年真值同时泄露为反馈。这一区别比附录示例中笼统的 composite score 更具体。[评分代码](https://github.com/pgasawa/continual-learning-bench/blob/5f8c50eb1e84b2eda2ef4faff757dfc812a0ea26/src/tasks/sales_prediction/evaluator.py)、[反馈调用](https://github.com/pgasawa/continual-learning-bench/blob/5f8c50eb1e84b2eda2ef4faff757dfc812a0ea26/src/tasks/sales_prediction/task.py)

## 奖励与学习增益的公式

设一个任务有 $N$ 个实例。$r_t^{sf}$ 为有状态奖励，$r_t^{sl}$ 为同一系统独立完成该实例的无状态奖励。原始任务累计奖励和增益分别为：

$$
R^{sf}=\sum_{t=1}^{N}r_t^{sf},\qquad
G=\sum_{t=1}^{N}(r_t^{sf}-r_t^{sl}).
$$

$G>0$ 表示保留历史总体有帮助；$G<0$ 表示在该次评估中旧状态带来的损失超过收益。高绝对奖励不必伴随高增益，低绝对奖励也可能因为对照更差而出现正增益。奖励曲线随时间上升同样不够：后半段问题可能本来就比较容易。[第 4.1–4.2 节](https://arxiv.org/pdf/2606.05661v1#page=6)

跨任务时先把累计值除以实例数，记均值为 $\bar r$，再计算：

$$
\widehat G=\frac{\bar r^{sf}-\bar r^{sl}}{r_{max}-\bar r^{sl}}.
$$

分母是该系统自身的无状态表现到任务参照之间的空间。综合增益是六个任务的 $\widehat G$ 等权平均，不按 301 个实例直接混合，否则扑克和频谱任务会因实例多而占更大权重。

综合奖励使用另一分母和基线。设 $r_{ext}$ 为 GPT-5.4 ICL 在对应任务上的无状态平均奖励：

$$
\widehat R=\frac{\bar r^{sf}-r_{ext}}{r_{max}-r_{ext}}.
$$

所有系统在这个指标上使用同一个外部参照，便于比较绝对任务表现。GPT-5.4 ICL 的两项综合指标相同，是因为它自身的无状态基线恰好就是外部基线。[第 4.3 节](https://arxiv.org/pdf/2606.05661v1#page=6)

例如，表 3 中 Sonnet 4.6 ICL 在代码任务上的累计奖励为 9.755，累计增益为 2.705，可倒推出无状态累计奖励 7.050。由此得到：

$$
\widehat G_{code}=\frac{2.705}{19-7.050}\approx22.6\%.
$$

但 GPT-5.4 ICL 的无状态累计奖励为 $10.140-0.690=9.450$，所以同一 Sonnet 系统的归一化奖励仅为：

$$
\widehat R_{code}=\frac{9.755-9.450}{19-9.450}\approx3.2\%.
$$

这两个数可以同时成立：历史帮助 Sonnet 弥补了自身的初始不足，但最终奖励只略高于固定外部基线。这是按原文打印值进行的算术核对，不是重新运行智能体。[表 3](https://arxiv.org/pdf/2606.05661v1#page=23)

归一化分数可以为负；对专家策略参照也可能超过 100%。当无状态奖励恰好等于参照时，分母为零，公式不可用。当前汇总代码对近零分母返回缺失值，并平均可用任务，因而比较新系统还应检查实际纳入了几个任务。它没有把所有结果自动裁剪进 0–100%。[分析脚本](https://github.com/pgasawa/continual-learning-bench/blob/5f8c50eb1e84b2eda2ef4faff757dfc812a0ea26/scripts/analyze_final_results.py)

## 比较了哪些系统，随机性怎样处理

完整上下文 ICL 保存整个任务的交互历史，超过输入限制后才裁剪。Notepad 保留模型自行更新的笔记，每个实例内仍保留完整互动，跨实例清除互动正文。Mem0 自动提取记忆，并在下一步检索最相关的 10 条；ACE 每个实例之后更新 playbook。Claude Code 和 Codex 使用 headless 执行框架，整项任务保持一个会话，并允许自动压缩上下文。

因此，“有记忆”不是单一开关：可见历史、检索过程、记忆提取模型、工具执行框架与额外调用均不同。论文并未对所有模型和所有记忆系统做完全交叉比较，主要用 GPT-5.4 比较专用记忆架构，以控制一部分基础模型差异。[第 5 节、附录 B.2](https://arxiv.org/pdf/2606.05661v1#page=7)

使用的模型包括 Sonnet 4.6、Opus 4.7、Gemini 3.1 Pro、Gemini 3 Flash 和 GPT-5.4，采用默认推理设置，尽可能启用提示缓存。每个任务通常做五次有状态 rollout，在阶段内部重排实例或按任务要求重复采样；阶段本身的先后结构仍保留。无状态基线每个系统—任务组合只跑一次。

无状态实例不依赖顺序，可以免去顺序重排；这并不表示模型采样、服务端行为和工具调用本身没有随机性。现有区间主要反映有状态 rollout 的波动，没有覆盖重复估计无状态基线的所有不确定性。Codex 因资源限制没有同样的重复与区间：附录多数表列一次，销售表却列五次且仍无区间，不能统一写成“所有 Codex 结果都做了五次”。[附录 B.1、表 2–7](https://arxiv.org/pdf/2606.05661v1#page=21)

## 主结果：完整上下文是强基线，任务差异仍然很大

以下采用论文表 1。归一化奖励与增益的单位均为百分比；± 为作者报告的 95% 置信区间幅度，Codex 未报告。表格按归一化奖励排列，并非按增益排列。

| 系统 | 模型 | 归一化奖励 | 归一化增益 | 表列费用（美元） |
| --- | --- | ---: | ---: | ---: |
| ICL | Sonnet 4.6 | 22.3 ± 4.1 | 25.4 ± 3.6 | 30.4 |
| ICL | GPT-5.4 | 20.1 ± 9.1 | 20.1 ± 9.1 | 18.4 |
| Claude Code | Sonnet 4.6 | 19.0 ± 7.1 | 23.9 ± 5.7 | 38.6 |
| Mem0 | GPT-5.4 | 15.1 ± 6.4 | 20.2 ± 5.9 | 18.3 |
| ICL | Opus 4.7 | 10.2 ± 4.4 | 19.5 ± 4.1 | 49.6 |
| Notepad | GPT-5.4 | 8.0 ± 3.3 | 7.8 ± 3.0 | 14.3 |
| ICL | Gemini 3 Flash | 8.0 ± 4.7 | 16.4 ± 3.8 | 7.6 |
| Codex | GPT-5.4 | 6.6 | 14.6 | 27.2 |
| ACE | GPT-5.4 | 4.6 ± 2.7 | 8.6 ± 2.5 | 62.8 |
| Notepad | Sonnet 4.6 | 3.5 ± 5.7 | 18.2 ± 3.4 | 31.5 |
| Notepad | Gemini 3.1 Pro | −0.2 ± 3.4 | 9.4 ± 3.0 | 13.3 |
| ICL | Gemini 3.1 Pro | −5.6 ± 4.1 | 6.2 ± 3.8 | 15.2 |

[表 1](https://arxiv.org/pdf/2606.05661v1#page=7)

Sonnet 4.6 ICL 的综合均值最高，但与 GPT-5.4 ICL、Claude Code 的区间有重叠；表格没有提供二者差值的专门显著性检验。GPT-5.4 的 Mem0 增益均值 20.2% 略高于 ICL 的 20.1%，同时绝对奖励较低。因此结果支持“完整上下文是有竞争力的基线”，不支持“每一种专用记忆都在每个指标、每个任务上更差”。

费用还有一处文字口径差异：表 1 表注说跨任务平均成本，但 Sonnet ICL 的六项任务费用相加为 $3.6+6.9+5.6+1.9+9.4+3.0=30.4$，正好等于主表，而不是再除以六。当前分析脚本也分别输出跨任务总费用和平均单任务费用。本文把主表数字理解为各任务平均 rollout 费用相加的量级，不把 30.4 美元写成一项任务的均价，更不把它当成完成全部五次实验及无状态对照的总账单。[表 2–7](https://arxiv.org/pdf/2606.05661v1#page=22)、[费用汇总代码](https://github.com/pgasawa/continual-learning-bench/blob/5f8c50eb1e84b2eda2ef4faff757dfc812a0ea26/scripts/analyze_final_results.py)

### 总体排名不能代替逐任务分析

下面列出各任务累计奖励最高的系统及其累计增益。这里 ± 是附录表中的**标准误**，不同于主表的 95% 区间；不同任务的原始单位也不能直接相加。

| 任务 | 累计奖励最高系统 | 累计奖励 | 累计增益 |
| --- | --- | ---: | ---: |
| 频谱监测 | ICL / GPT-5.4 | 46.198 ± 1.001 | 26.437 ± 1.001 |
| 代码库适应 | ACE / GPT-5.4 | 11.580 ± 0.181 | 1.580 ± 0.181 |
| 队列研究 | ICL / GPT-5.4 | 0.957 ± 0.393 | −0.037 ± 0.393 |
| 数据库探索 | Claude Code / Sonnet 4.6 | 22.053 ± 1.182 | 13.853 ± 1.182 |
| 扑克 | Claude Code / Sonnet 4.6 | 343.020 ± 29.367 | 58.520 ± 29.367 |
| 销售预测 | Notepad / Sonnet 4.6 | 10.073 ± 0.095 | 5.790 ± 0.095 |

[附录表 2–7](https://arxiv.org/pdf/2606.05661v1#page=22)

频谱任务的第一行相当于平均 IoU 约 0.513，无状态约 0.220，显示积累扫描历史有明显作用。代码任务虽然 ACE 的最终奖励最高，Mem0 的累计增益 2.980 更高。队列研究中，奖励最高的系统相对自身无状态对照仍略退化；相反，Sonnet Notepad 奖励为 −0.784、增益为 +0.795，说明它虽改善了自己更差的起点，仍低于任务内部平坦生存预测基线。

图 5 也显示，数据库增益有时主要表现为无状态系统频繁归零，而非有状态奖励持续上升。销售与频谱的历史积累更明显，队列、代码和扑克则更不稳定。扑克牌面方差较大，不能看到后半段盈利就直接推断学到了对手规律。[图 5、附录 B](https://arxiv.org/pdf/2606.05661v1#page=8)

## 稳定性与可塑性是怎样分出来的

论文以每个阶段的第一个实例作为边界集合 $B$，其余实例作为 $W$。设 $f_B=|B|/N$、$f_W=|W|/N$，保持整个任务统一的分母 $H=r_{max}-\bar r^{sl}$：

$$
\widehat G_{stab}=f_B\frac{\bar r_B^{sf}-\bar r_B^{sl}}{H},\qquad
\widehat G_{plas}=f_W\frac{\bar r_W^{sf}-\bar r_W^{sl}}{H}.
$$

按加权平均恒等式，有 $\widehat G=\widehat G_{stab}+\widehat G_{plas}$。边界项观察换到一个阶段时能否利用过去状态；阶段内部项观察有该阶段经验之后的收益。六个任务先分别计算，再等权平均。[附录 C](https://arxiv.org/pdf/2606.05661v1#page=30)

这是按位置分解观测到的增益，不是通过移除旧知识、关闭新知识学习得到的因果消融。边界题也受难度和阶段设计影响，内部题也可能大量使用很早以前的知识。“可塑性项”不能完全等同于新知识贡献，“稳定性项”也不能当成通用遗忘率。它适合描述当前日程中的收益分布。

图 21 关于 BSM 的说明另有待澄清之处：按附录定义，90 个实例只有三个阶段首实例，$f_B=3/90$。该任务奖励为 0–1，Opus 的无状态均值约 0.220，所以边界项理论上最多约 $(3/90)/(1-0.220)=4.3\%$。但图注称其 stability 为 13.5% 的提升空间。这个数字无法按附录的加权边界公式直接解释，本文不采用它作为已核实的稳定性结果。[图 21、附录 C、表 2](https://arxiv.org/pdf/2606.05661v1#page=31)

## 错误案例与没有完成的消融

附录 D 的销售预测案例中，系统根据一次反馈认定纽约床架预测过高，把未来五年预测调整为近乎不变；下一轮又认定低估，改成每年约 16% 增长。作者用它说明近期反馈可能压过已有的长期规律，但没有对该条轨迹提供“保留其他条件、只改记忆策略”的反事实实验。

队列研究案例更直接：笔记里已有以前研究的家庭史、认知指标和生物标志物信息，新研究到来后，系统却把涉及缺失字段的 28 个队列当作“不适用于当前研究”，给它们相同的三项生存概率。最终奖励约为 0.005，接近平坦预测。它说明“已经保存信息”与“在正确时机调用信息”是不同环节。[附录 D](https://arxiv.org/pdf/2606.05661v1#page=31)

论文没有系统扫描 Mem0 检索条数、笔记长度、ACE 更新频率或上下文压缩强度，也没有完成所有模型—记忆系统的全组合实验。当前结果比较的是指定实现与默认设置，不是证明检索记忆或压缩在所有预算下都劣于完整上下文。测试时更新模型参数的方法同样没有纳入首版实验。[第 6 节、附录 B.2](https://arxiv.org/pdf/2606.05661v1#page=9)

## 公开实现与复现时需要固定的内容

代码提交 `5f8c50eb1e84b2eda2ef4faff757dfc812a0ea26` 提供任务定义、JSON 日程、系统配置、评分器、已有运行结果和汇总工具。本文检查了这些源码，没有运行付费 API、Docker 任务或整套模型评估。

README 的环境要求为 Python 3.13+、`uv`，涉及容器的任务还需要本机 Docker。`pyproject.toml` 固定了一部分依赖，例如 `litellm==1.81.6`、`openai==2.16.0`、`texasholdem==0.11.0`、`mini-swe-agent==2.2.4`，另一些使用最低版本约束，完整复现宜同时固定 lockfile。API 密钥由本地环境提供。[README](https://github.com/pgasawa/continual-learning-bench/blob/5f8c50eb1e84b2eda2ef4faff757dfc812a0ea26/README.md)、[依赖定义](https://github.com/pgasawa/continual-learning-bench/blob/5f8c50eb1e84b2eda2ef4faff757dfc812a0ea26/pyproject.toml)

官方给出的安装与小规模入口为：

```bash
uv sync --all-extras
source .venv/bin/activate
clbench setup --all
clbench list
clbench run exploitable_poker --schedule quick_test --system icl
```

这只是环境与小任务入口，不会自动重现论文表 1。应先检查系统的模型名、推理设置、日程、预算、种子、是否运行无状态基线、重复次数和价格记录，再执行对应配置。小任务仍可能调用收费模型。

| 核对项 | 代码中的行为与含义 |
| --- | --- |
| 无状态隔离 | 每个基线实例创建独立任务与系统，先定位到对应实例；销售任务额外清理持久工作空间 |
| ICL 历史 | 按模型输入限制保留上下文，超预算时先进先出裁剪；不是无限历史 |
| Notepad | 每步可用新笔记完整覆盖旧笔记；跨实例只保留笔记，不保留完整交互正文 |
| Mem0 | 检索默认 10 条，提取模型可独立配置，embedding 默认 `text-embedding-3-small`，每个运行隔离向量存储 |
| 阶段顺序 | 默认数据库与扑克日程指定五次运行及阶段内重排；销售日程使用保持时序的重复方式 |
| 归一化参照 | 从任务类读取 `r_max`，代码值含 cohort 0.162202、poker 9.4875；汇总还允许参照覆盖配置 |
| 历史结果兼容 | 队列旧结果曾用裁剪的相对分数，数据库旧结果曾用负 regret；当前脚本从原始 KL 或 regret 重新统一评分 |
| 缺失记录 | 汇总优先逐实例记录，再回退其他结果字段；比较时需要核对实际实例数、任务数与缺失原因 |

对应源码为[基线执行器](https://github.com/pgasawa/continual-learning-bench/blob/5f8c50eb1e84b2eda2ef4faff757dfc812a0ea26/src/runs/baseline.py)、[ICL](https://github.com/pgasawa/continual-learning-bench/blob/5f8c50eb1e84b2eda2ef4faff757dfc812a0ea26/src/systems/icl/system.py)、[Notepad](https://github.com/pgasawa/continual-learning-bench/blob/5f8c50eb1e84b2eda2ef4faff757dfc812a0ea26/src/systems/icl_notepad/README.md)、[Mem0](https://github.com/pgasawa/continual-learning-bench/blob/5f8c50eb1e84b2eda2ef4faff757dfc812a0ea26/src/systems/mem0/README.md)及[汇总脚本](https://github.com/pgasawa/continual-learning-bench/blob/5f8c50eb1e84b2eda2ef4faff757dfc812a0ea26/scripts/analyze_final_results.py)。

旧结果文件中已经存了一个 reward 字段，并不意味着可以跳过重算直接与新结果比较。任务评分、参照上限、阶段定义和提供给智能体的反馈版本，都可能改变最终排名；这些版本应与模型版本一起记录。

## 研究结论的范围

CL-Bench 展示了一个可执行的评测方式：在共享环境的任务序列上，单独报告最终表现、历史状态带来的收益及成本。首版结果说明完整上下文具有竞争力，也暴露了记忆保存、知识检索、更新旧判断之间的差距。它没有验证持续数月或数年的部署，没有覆盖所有真实行业流程，也没有比较参数更新式持续学习、小模型和开源权重系统。

本次精读覆盖全文、附录 A–D、六类评分函数、表 1–7、主要学习曲线和分解公式，并核对固定版本的任务、系统、基线与汇总代码。文中算术与公式关系已经检查；模型分数、置信区间和 API 成本均为作者报告或原表重算，尚未独立复现。[论文限制](https://arxiv.org/pdf/2606.05661v1#page=9)
