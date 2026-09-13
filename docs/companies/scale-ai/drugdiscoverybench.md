---
title: "DrugDiscoveryBench：早期药物发现计算任务"
company: "scale-ai"
date: "2026-06-30"
dateLabel: "2026-06-30"
kind: "合作基准"
description: "精读 82 个专家任务、结果与过程评分、29 种模型配置、专家步骤提示实验，以及公开环境与论文的版本差异。"
reviewed: "2026-09-13"
readingStatus: "deep-read"
paperVersion: "Scale Labs 27 页预印本，2026-09-11 下载快照；2026-09-13 同源文件哈希一致"
---

[← Scale AI](/companies/scale-ai) · [全部工作](/research)

# DrugDiscoveryBench：早期药物发现计算任务

早期药物研究中的一道计算题，往往需要先找到正确的结构或数据库记录，再完成筛选、计算和比较。程序每一步都能执行，并不保证最后回答的是原问题。DrugDiscoveryBench 将这类工作整理成 82 道专家编写的任务，让通用编码 agent 在生物医学工具环境中完成。论文最好的配置平均通过 51.6% 的任务；专家提供操作步骤后，多个系统的合并可解覆盖从 76/82 增至 80/82。前者是单个配置的平均表现，后者是多个系统与尝试的联合覆盖，不能直接作为同一条性能曲线。[论文摘要、§5、§7](https://static.scale.com/uploads/6691558a94899f2f65a87a75/DrugDiscoveryBench.pdf)

## 版本、作者与合作关系

原题为 **DrugDiscoveryBench: Can Coding Agents Assist Early-Stage Drug Discovery?**，由 Scale AI 与 Phylo 合作。Afra Feyza Akyürek 和 Xinming Tu 为共同第一作者，分别署名 Scale AI、Phylo；另一位 Phylo 作者是 Yuanhao Qu。其余作者署名 Scale AI，包括 Alec Gutmanstein、Jason Qin、Divyansh Agarwal、Sofia Monasdotter、Sergey Chekhov、Brenda Hernandez Villegas、Kirill Chugunov、Judah Engel、Veronica Chatrath、Oscar Kavanagh、Geobio Boo、Ernesto Hernandez、Ying Liu、Emily Xue、Aakash Sabharwal、Daniel Yue Zhang、Zainab Doctor、Yunzhong He 和 Sami Hassaan。

页面时间线保留官方博客的 2026 年 6 月 30 日。作者主页将论文列为 Scale Labs preprint；本文没有将其标为已录用的会议论文或自行补一个 arXiv 版本号。阅读材料是官方静态链接的 27 页 PDF，包括附录 A–D。该地址没有版本号；本地 9 月 11 日下载文件与 9 月 13 日重新获取文件的 SHA-256 一致，均以 `d300e81f8da94fcf` 开头。[官方发布](https://scale.com/blog/drugdiscoverybench) [作者出版目录](https://xinmingtu.cn/publications/)

当前网页榜单已增加论文未评测的模型，网页说明中也留有与 PDF 不同的旧数字。下面先解释固定 PDF 的实验，最后单列网页和代码的差异，不把几份材料拼成一次实验。

## 一道任务如何执行

论文图 2 的例子给出两种 KRAS G12C 化合物的共晶结构 `6USX` 和 `6UT0`。任务要求识别一个构象改变的残基：其变化让它与第二个化合物产生更多疏水接触。预期输出只是带编号的残基名 `THR58`。

完成这道题需要取得两份 PDB 文件、叠合结构、找出发生构象变化的候选残基，并检查它们与配体的空间接触。只输出正确字符串和实际完成这些步骤，是两种不同的成功条件。图中结果项权重为 +30，另有取得结构、结构叠合、接触检查三项过程要求，权重分别为 +20、+20、+25；**主榜只用结果项**，没有将四项合成一个 95 分的总榜指标。[论文图 2、§2.3](https://static.scale.com/uploads/6691558a94899f2f65a87a75/DrugDiscoveryBench.pdf)

每个任务通过 Harbor 启动独立容器。agent 收到具体问题和统一说明，查看工具源码及数据目录，用 Bash、Python 调用所需函数，最后把简短答案写入 `/workspace/answer.md`。答案可能是数值、基因名、SMILES、InChIKey、排序或小表格。题目自带附件时，文件位于 `/workspace/inputs/`；其他来源需要检索。

工具并没有逐个包装成 agent 的专用接口。Biomni 作为普通 Python 库存在，agent 要自己找到函数、阅读参数说明、编写调用代码，也可以使用自写 Python。论文测量的是通用编码系统在科学环境中的工作表现，没有训练一个新的药物模型。

## 数据构建与覆盖范围

任务由药物科学家和生物医学研究者编写，另一个专家复核修改。随后进行 BenchGuard 自动审计和可解性检查：前者检查问题、答案及歧义，后者向模型提供专家记录的步骤，确认它能够在给定方法后执行到预期结果。资深标注者或领域作者根据结果修订，无法修复的任务剔除，最后由独立质量团队确认。[论文 §2.2、图 2](https://static.scale.com/uploads/6691558a94899f2f65a87a75/DrugDiscoveryBench.pdf)

题目依托真实结构、专利、论文或数据库记录。论文没有给出全部候选题目的数量、逐轮淘汰比例，或独立专家之间完整的标注一致性统计，因此不能把最终 82 题解释成某个已知总体的随机样本。

两种分类分别描述研究能力和所在工作阶段，每个轴的计数各自合计 82：

| 能力类别 | 任务数 | 主要工作 |
| --- | ---: | --- |
| 结构推理 | 19 | 从真实结构读取电荷、氢键、配位或分子标识 |
| 数据库筛选 | 14 | 跨数据库连接、筛选并返回目标或化合物 |
| 专利挖掘 | 13 | 提取专利或论文中的表格，应用阈值和排序规则 |
| 靶点识别与遗传学 | 12 | 根据变异、表达和关联证据筛选基因 |
| 化学信息学 | 10 | 识别分子，计算描述符或结构表示 |
| 分子生物学 | 7 | 序列、构建体和相关计算 |
| 构效关系与亲和力排序 | 7 | 比较相关分子的结合特征 |

| 工作阶段 | 任务数 |
| --- | ---: |
| 靶点识别与验证 | 14 |
| 命中化合物识别 | 16 |
| 命中到先导、构效关系分析 | 34 |
| 先导优化 | 10 |
| 邻近生物医学工作 | 8 |

表 1 报告共有 920 个评分项，每题平均 11.2 个、中位数 9 个；结果项平均 4.7 个、过程项平均 6.6 个。两项平均数已四舍五入，直接相加会得到 11.3，不应据此改动总数。答案形式有 31 种，其中 8 题要求表格。结构与化学相关工作占比较大，七类任务数量也不相等，整体平均自然更受大类影响。[论文表 1–2、附录 B](https://static.scale.com/uploads/6691558a94899f2f65a87a75/DrugDiscoveryBench.pdf)

本次下载并检查了公开 Preview 的全部 82 条记录，七类计数与论文一致，任务 ID 与 GitHub 的 82 个目录完全对应。完整答案和 rubric 需要访问许可，公开仓库中的这三类字段为空；因此 920 个评分项是论文报告值，本次没有用受限原始文件重新计数。

## 环境提供了哪些资源

论文的 Scale-Biomni 环境改编自 Stanford SNAP 的开源 Biomni，报告提供 22 个领域的 226 个函数、76 个数据文件和 117 个预装科学软件包。资源包括结构解析、序列操作、化学计算以及 PubChem、UniProt、ChEMBL、Open Targets 等查询入口。

团队修复了依赖冲突与工具实现，替换部分受许可限制的查询客户端，加入图像和 PDF 查看功能，并支持提示缓存及多个模型后端。统一说明还让 agent 阅读通用 `know_how` 工作流。因此后面的专家提示实验增加的是**该题专门的步骤**，不是从“完全没有任何操作指南”变为“第一次获得指南”。[论文 §3、附录 C](https://static.scale.com/uploads/6691558a94899f2f65a87a75/DrugDiscoveryBench.pdf)

论文表 9 给出三个容器层级：

| 镜像 | 下载 / 磁盘占用，约 GB | 数据访问 |
| --- | --- | --- |
| lightweight | 6 / 22 | 保留必要数据文件，数据库查询主要访问实时 API |
| core | 37 / 210 | 加入约 21 个本地数据库，覆盖约 74% 的评测数据库查询调用 |
| full | 136 / 570 | 再加入 PubChem、PubMed、AlphaFold、Open Targets，覆盖约 99.7% |

这些比例的分母是实际评测中的数据库 `query_*` 调用，不是任务覆盖率、数据库内容完整度或全部网络请求。论文实验用 **full**，每次运行配置 2 个 CPU、8 GB 内存并允许联网；公开任务默认用 **lightweight**。将镜像固定并不自动固定每一次外部检索：未被本地副本覆盖的请求仍可随数据库更新发生变化。时间敏感任务在问题中给出日期，但检索结果是否仍符合该日期，需要另行核查。

## 结果分、通过率与三次尝试

结果 rubric 的每个条件具有带符号权重，范围为 −30 至 +30。令 $z_{ij}=1$ 表示第 $i$ 次运行满足第 $j$ 个条件，$w_j$ 为权重，正权重构成可获得分数的分母。按照公开评分代码展开：

$$
S_i=100\max\left(0,\frac{\sum_jw_jz_{ij}}{\sum_{j:w_j>0}w_j}\right).
$$

正项成立得分，负项描述的错误发生时扣分，最低截为零。“met”只是条件发生，不表示该条件一定是好事。**说明算例：**两个正项为 +30、+20，只满足第一项，同时触发 −10 的错误，结果是 $(30-10)/50=40\%$。本次用公开纯评分函数离线核验了这个算例，没有调用 judge。

主榜要求结果分达到 100 才通过。设 $N=82$，每题运行 $K=3$ 次，结果分为 $S_{ir}$，则：

$$
\mathrm{PassRate}=\frac{100}{NK}\sum_{i=1}^{N}\sum_{r=1}^{K}\mathbf1[S_{ir}=100],
\qquad
\mathrm{MeanOutcome}=\frac1{NK}\sum_{i,r}S_{ir}.
$$

前者不给部分正确分，后者保留部分进展。三次取平均，不是 best-of-three，也不是三次里至少一次成功便把该题算成功。29 个配置按设计对应 $29\times82\times3=7,134$ 次任务执行；这个数是设计规模的乘积，不包含额外重试、专家提示与判分调用。

拒答、超时或缺失答案计零，不从总体分母剔除。论文允许暂时性网络故障重试，agent 时限为 120 分钟。论文默认结果 judge 为 GPT-5.4，读取最终答案和专家 rubric；在随机选取的 200 份回答上，与 Sonnet 4.6、Gemini 3.5 Flash 的二元标签一致性为 $\kappa=1$。这只支持该子集的通过判定一致，不能证明全部加权分数、过程判定或科学参考答案都没有误差。[论文 §4–5](https://static.scale.com/uploads/6691558a94899f2f65a87a75/DrugDiscoveryBench.pdf)

## 固定论文版本的主要结果

下表依据附录图 7。为使比较可读，分别保留主要配置和有直接对照的设置；数值均为三次运行的平均通过率。

| 模型 | 框架 | 推理设置 | 通过率 % |
| --- | --- | --- | ---: |
| GPT-5.5 | mini-SWE-agent | xhigh | 51.6 |
| Gemini 3.5 Flash | Gemini CLI | low / high，分别运行 | 均为 50.0 |
| Gemini 3.5 Flash | mini-SWE-agent | xhigh | 48.8 |
| Claude Opus 4.8 | mini-SWE-agent | max | 46.8 |
| Claude Opus 4.8 | Claude Code | max | 45.1 |
| GPT-5.5 | Pi | xhigh | 44.5 |
| GPT-5.5 | Codex | xhigh | 43.9 |
| Gemini 3.1 Pro | Gemini CLI | high | 41.9 |
| GPT-5.5 | OpenCode | xhigh | 40.6 |
| GLM 5.2 | OpenCode | xhigh | 37.8 |
| GLM 5.2 | mini-SWE-agent | xhigh | 36.2 |
| Kimi K2.7 Code | mini-SWE-agent | xhigh | 35.3 |
| DeepSeek V4 Pro | mini-SWE-agent | xhigh | 31.7 |
| Claude Sonnet 4.6 | mini-SWE-agent | max | 31.3 |
| Qwen 3.7 Max | mini-SWE-agent | xhigh | 29.3 |
| GPT-5.2 | Codex | xhigh | 29.3 |
| Claude Opus 4.6 | Claude Code | max | 27.7 |
| MiniMax M3 | mini-SWE-agent | xhigh | 23.2 |

图 8 固定 mini-SWE-agent 后，GPT-5.5、Gemini 3.5 Flash、Opus 4.8 依次为 51.6%、48.8%、46.8%。这比每个模型选择最好框架更接近固定接口的比较，但不同模型的推理档位仍不是相等 token 预算。图中有误差棒，PDF 没有给出足够明确的统一定义和逐轮结果供本次重算；本文不把它们改称置信区间，也不将接近的点差直接写成统计显著优势。

每类任务最好的模型并不相同。例如结构推理中 Gemini 平均解出 13/19 题；数据库筛选中 GPT 平均解出约 7.3/14 题；专利挖掘中 Opus 平均约 8.7/13 题。这些是三次运行平均后的解题数，所以可以有小数。每类只有 7–19 题，且图 6 的个别平均百分数与图 7 有约 0.1 的差异，不适合据细小差距建立稳定的专科排名。[论文图 6–8](https://static.scale.com/uploads/6691558a94899f2f65a87a75/DrugDiscoveryBench.pdf)

## 推理投入和框架对照

固定原生框架时，GPT-5.5 的 low、medium、xhigh 通过率为 27.6%、39.8%、43.9%，首尾增加 **16.3 个百分点**；Opus 4.8 的 low、medium、max 为 29.3%、33.3%、45.1%，增加 **15.8 个百分点**。论文引言概括为约 18 点，按图 7 的具体显示值重算应使用上述差值。

图 4 的纵轴却是**平均结果分**，不是通过率。它显示增加推理投入时部分得分也提高。Gemini CLI 的 low 与 high 通过率都是 50.0%，但结果分略升，输出 token 约增 13%。因此不能把图 4 的单调上升写成三个家族的通过率都严格单调增加。

框架比较也需要保留原文差异：图 5 的 GPT-5.5 原生框架柱为 45.1%，而正文 §5.1 和完整图 7 是 Codex 43.9%。采用图 7，mini-SWE-agent 比 Codex 高 7.7 点；采用图 5，则是 6.5 点。没有逐次记录说明二者为何不同，本文不擅自修成同一个数字。

Kimi 从 OpenCode 24.0% 到 mini-SWE-agent 35.3%，增加 11.3 点，按 82 题折算约 **9.3 道题**；正文称平均多解 12 题，与显示百分数不一致。GLM 从 Pi 24.4% 到 OpenCode 37.8%，约多解 11.0 题；换成 mini-SWE-agent 36.2% 则约多解 9.7 题。另外 Kimi 的 OpenCode 标为 max，其他框架标为 xhigh，Gemini 也跨 default、high、xhigh，不能声称所有对照只改变了框架且精确保持推理设置不变。

论文成本图报告平均每题 API 费用，而图 4 使用平均输出 token。两者不是同一指标，输出 token 也不是精确的总计算量。论文称 GPT-5.5 最佳框架约需每题 2.8 美元；此为当时模型和接口下的报告值，不是当前报价。Opus 在部分题上拒答，零分与较短运行会同时降低得分、费用和 token 平均值，不能把低成本一律解释成更高效率。[论文 §5.2–5.5、图 1、4、5、7](https://static.scale.com/uploads/6691558a94899f2f65a87a75/DrugDiscoveryBench.pdf)

## 226 条失败轨迹的统计范围

失败分析使用六个模型在原生框架、最高推理档位下的每模型—任务一次运行，挑出 226 条有意义的失败轨迹。每条只分配一个根因，判断顺序是检索、约束、领域推理、推导计算、最终答案失误。类别互斥来自这个标注规则，不代表实际轨迹只能有一个问题。

| 根因 | 失败条数 | 占 226 条的比例 |
| --- | ---: | ---: |
| 领域推理 | 122 | 54.0% |
| 推导计算 | 42 | 18.6% |
| 检索 | 37 | 16.4% |
| 约束丢失 | 17 | 7.5% |
| 最终答案失误 | 8 | 3.5% |

本次重算比例与表 3 一致。分母不是全部 82 题、全部 7,134 次设计运行或所有模型的失败总量。论文没有提供这批根因标签的独立复标一致性，因此“领域推理占 54%”应限定为作者分析的这批轨迹。[论文 §6、表 3–4](https://static.scale.com/uploads/6691558a94899f2f65a87a75/DrugDiscoveryBench.pdf)

### 取到了数据，却回答了另一个对象

论文的配体电荷案例区分化学组分字典里的参考分子和具体结构记录中的表示。Opus 使用参考字典得到中性，而 GPT 检查论文指定的沉积结构中逐原子电荷，得到参考答案 −1。这个例子说明首先要确认问题要求的是哪一种表示；论文案例本身不构成对真实溶液中质子化状态的重新测定。

HDAC6 排序案例中，参考顺序是 `C > B > A > D`。两个 Gemini 设置给出该顺序；GPT-5.5 和 Opus 给出 `C > B > D > A`，结果分均为 56.2，因不足 100 而未通过。作者认为部分模型改用从头对接，未充分使用已给定的实验结构；该诊断限定于这道题，不能推广为分子对接普遍无效。[论文 §6.1、表 5](https://static.scale.com/uploads/6691558a94899f2f65a87a75/DrugDiscoveryBench.pdf)

附录 D 的另外十个案例覆盖全部五类错误。例如同一盐桥在计算中应按基团计一个，却在汇总时按两个原子重复计数；检索到了六个指定化合物，却额外添加两行；完整过程得到正确药名，却漏掉输出要求中的结构字符串。这些案例把领域对象、计算单位和最终交付要求分开，不宜都归为“模型不会使用工具”。

### 检索污染已经在实验中出现

黑色素瘤标记任务需要一直保留疾病范围。部分失败系统在后续步骤改为统计某个基因与所有疾病有关的变异，因而返回错误候选。论文还报告 Gemini 3.5 Flash 从之前公开的 Scale 分析页面取得答案，自己执行的分析却不支持该答案。表 6 排除了这条案例展示；原文没有完整说明该次运行是否以及如何从所有汇总成绩中移除，本文不声称主榜已经完成全面去污染。

发布环境因此默认关闭厂商原生网页工具，转而使用提供的 `search_web`，并阻止直接访问部分 Scale 域名。官方实现文档明确指出，应用层代理不能覆盖所有网络路径，厂商服务端搜索结果也可能绕过容器侧过滤。这些措施降低直接获取已发布答案的机会，不证明搜索或训练污染为零。[论文 §5.5 脚注、表 6；网络控制说明](https://github.com/scaleapi/DrugDiscoveryBench/blob/d58c703841abbad0ba1cc439488e15fbbeae3bd2/docs/egress-hardening.md)

## 专家步骤提示的恢复实验

每位任务作者保存自己的解题过程和中间产物。团队再用模型将其整理成操作手册，去除中间答案，只保留步骤及工具，使受测系统仍需自己查询、解析和计算。

不加提示时，至少一个设置或尝试解出了 76/82 题。团队只针对剩下六题，向 Opus 4.8、GPT-5.5、Gemini 3.5 Flash 的原生框架提供操作手册。新增四题被至少一个系统完全通过，合并达到 80/82；另有一题接近通过，一题仍未通过。换算为覆盖率约为 92.7% 到 97.6%，但这不是任何单个模型的通过率从 92.7% 升至 97.6%。

这个小规模条件实验说明，部分未完成任务在得到方法后可以执行。它没有证明所有原失败都只来自规划，也没有把规划知识与领域知识彻底分离：告诉系统该查哪个数据库、用哪种表示，本身就提供了领域信息。论文没有完整披露六题中每个模型的逐次成绩和与无提示同预算的配对重试结果，因而不能排除额外尝试机会的影响。[论文 §7](https://static.scale.com/uploads/6691558a94899f2f65a87a75/DrugDiscoveryBench.pdf)

## 当前网页与固定 PDF 分开阅读

2026 年 9 月 13 日的官方榜单已经列出 GPT 6 Astra、GPT 5.6 Sol、Opus 5 等后续设置，它们不属于本文的 12 模型、29 配置实验。网页正文同时出现 12 与 16 设置的描述，提示恢复也保留“64 题无提示、76 题加提示”的旧口径，与 PDF 的 76→80 不同。GPT-5.5 / Codex 网页为 45.1%，PDF 图 7 为 43.9%。

这些差异说明网页更新并未让所有说明同步，不能据此推断模型进步幅度或擅自给 PDF 加上一个新版实验结果。本文主结果固定使用所读 PDF；当前网页只作为独立的更新入口。[实时榜单](https://labs.scale.com/leaderboard/drugdiscoverybench)

## 公开代码核查与复现边界

本次固定官方 GitHub 提交 **`d58c703841abbad0ba1cc439488e15fbbeae3bd2`**。公开 Preview 数据固定 **`c1efe5e7120f37734ae04d68ee17a6d7dbaa6e48`**。完整 gated 数据的元信息版本为 `10cbbbb5da6f0fa46a6567c7cae0cbb3baa6c7cc`，本次只查看公开说明与元信息，没有接受访问条件或读取其受限 `tasks.jsonl`。[固定代码](https://github.com/scaleapi/DrugDiscoveryBench/tree/d58c703841abbad0ba1cc439488e15fbbeae3bd2) [公开 Preview](https://huggingface.co/datasets/ScaleAI/DrugDiscoveryBench-Preview/tree/c1efe5e7120f37734ae04d68ee17a6d7dbaa6e48) [完整数据说明](https://huggingface.co/datasets/ScaleAI/DrugDiscoveryBench)

82 个任务的 judge 源码哈希完全相同，所有公开答案和 rubric 均为空。直接运行未填充的任务会得到零分，这反映缺少评分材料，不能当作模型失败。`populate_rubrics.py` 按任务 ID 填充答案、结果项和过程项，但默认下载未固定 revision；复现应另外记录实际数据提交和文件哈希。

### 论文设置与当前执行配置的差异

逐项检查 82 份 `task.toml` 后，全部 agent 超时仍为 **7,200 秒**。README 与模板中写的 45 分钟并不代表实际任务设置。76 题 verifier 为 600 秒，另外 6 题为 1,800 秒；后六题通过 Dockerfile 构建并复制附件，其他任务直接指定镜像。两种路径的基础镜像都是 lightweight，均不同于论文实验的 full。

代码把主字段 `reward["score"]` 写为 **0–1 的结果分**，而 README 某处称 0–100；百分制另存为 `outcome_pct`。取 `score` 的平均值会得到平均结果分的缩放版，只有统计其是否等于 1 才对应论文通过率，不能直接把 Harbor 默认平均奖励称为通过率。

论文默认 judge 是 GPT-5.4；当前 task 配置的回退值为 `gpt-4o`，单独运行 judge 文件的回退值为 `claude-sonnet-4-6`，包装脚本则要求显式设置 `JUDGE_MODEL`。必须指定所用版本，不能直接使用不同入口的默认值还声称复现同一个 judge。

### 数值、过程和错误处理

公开 judge 提示允许轻微数值舍入误差，举例包括约 0.1% 相对误差；标识符、整数计数和分类值仍要求精确匹配。这是发给 LLM 的判分指令，不是另一个确定性数值检查器。

结果与过程分别评分，一边失败不阻止另一边写出结果。结果 judge 重试仍失败时，代码写 `outcome_judge_failed` 并将主分数置零；缺答案、缺 rubric、评审服务失败可能都得到零分，却是不同原因，必须查看 `grades_detail.json` 和错误标志。论文说暂时性故障会重试，本次没有取得历史日志验证重试与最终分母的实际处理。

过程轨迹超过 500,000 字符才分块，目标约 300,000 字符，按任一块判定条件 met 即整体 met 合并。部分块失败时可用成功块继续产生过程分。`test.sh` 只尝试几个日志路径，找不到轨迹就跳过过程评分；有 rubric 文件不等于已经获得完整过程分。上述阈值以字符计，不是 token。

### 一次可核对的复现需要保留的内容

应先取得允许访问的 rubric 文件，并记录其版本；确认镜像层级和 digest、数据库快照、82 题配置、模型版本与推理档位，再按相同三次尝试协议执行。主机要求 Harbor 0.13.1、Docker 和合适的 Python；发布镜像说明记录 Claude Code 2.1.190、Codex 0.122.0、Gemini CLI 0.46.0，但 README 并未给出论文六种框架所有历史运行的完整版本矩阵。

包装脚本通过自定义适配器优先复用镜像内已有 CLI，避免每次安装最新版本；绕过脚本可能改变安装行为。网页工具默认被限制后，搜索还依赖 Brave 凭据，缺少它会改变任务能力。容器内部工具、数据库实现及大型镜像未全部包含在这个 Git 仓库里，本文没有下载 136 GB 镜像或实际验证 226 个函数与 117 个软件包。README 的另一处写 17 个领域，也不能据它直接替换论文的 22 域统计。

本次完成的是全文与附录阅读、关键图表视觉核查、公开任务和 Preview 计数、同一 judge 的完整静态检查，以及不联网的纯评分算例。没有运行模型、付费 judge、数据库查询或受限数据评分。公开代码采用 MIT，完整数据页面标示 CC BY 4.0 并附访问条件，镜像中第三方软件与数据另有各自许可。

## 这项评测覆盖的研究范围

DrugDiscoveryBench 覆盖的是早期研究中可核查的计算与信息处理环节。它不验证新生成分子的实验活性，不覆盖完整药代、毒理、制剂、临床和监管流程，也没有测量真实研发项目的时间或成功率提升。

对于单一值或标识符，答案较容易核对；构效关系和亲和力排序则依赖实验选择、质子化假设及专家解释。最终正确答案也可能通过薄弱过程甚至检索已公开答案得到。结合公开数据、过程 rubric、来源记录与版本控制，才能解释一次高分究竟证明了哪些能力。[论文 §8、附录 B–D](https://static.scale.com/uploads/6691558a94899f2f65a87a75/DrugDiscoveryBench.pdf)

## 原始资料

- [完整研究论文，27 页 PDF](https://static.scale.com/uploads/6691558a94899f2f65a87a75/DrugDiscoveryBench.pdf)
- [Scale 官方发布，2026-06-30](https://scale.com/blog/drugdiscoverybench)
- [官方代码固定提交](https://github.com/scaleapi/DrugDiscoveryBench/tree/d58c703841abbad0ba1cc439488e15fbbeae3bd2)
- [开放任务 Preview](https://huggingface.co/datasets/ScaleAI/DrugDiscoveryBench-Preview)
- [完整答案与评分项的数据说明](https://huggingface.co/datasets/ScaleAI/DrugDiscoveryBench)
- [持续更新的官方榜单](https://labs.scale.com/leaderboard/drugdiscoverybench)

资料核对截至 2026 年 9 月 13 日。论文报告值、本文重算值和当前代码配置已分别标明。
