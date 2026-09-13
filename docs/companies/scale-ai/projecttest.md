---
title: "MultiFileTest（原 ProjectTest）：跨文件单元测试生成与错误修复"
company: "scale-ai"
date: "2025-02-10"
dateLabel: "2025-02-10"
kind: "合作论文与基准"
description: "从跨文件代码输入、测试执行与覆盖率，到人工修复和模型自修复，精读 MultiFileTest，并核对正式论文与公开数据的数量及统计差异。"
reviewed: "2026-09-13"
readingStatus: "deep-read"
paperVersion: "Findings of ACL 2026 正式版，2026-07；对照 arXiv:2502.06556v5，2026-04-07"
---

[← Scale AI](/companies/scale-ai) · [全部工作](/research)

# MultiFileTest（原 ProjectTest）：跨文件单元测试生成与错误修复

给一个函数生成测试时，模型通常可以在同一段代码里找到参数和返回值。换成跨文件项目，测试还需要正确导入模块、构造依赖对象、模拟用户输入，并让测试框架真正收集和执行用例。MultiFileTest 把这些环节放进同一次评价：先检查原始生成，再分别观察人工修复基础错误、模型依据错误日志自行修复后的结果。实验显示，修正少量执行问题可以大幅改变覆盖率和模型排名；模型自修复也可能删减测试，使原本较好的结果退步。[正式论文，§3–5](https://aclanthology.org/2026.findings-acl.1403.pdf)

## 1. ProjectTest 与 MultiFileTest 是同一工作的不同版本

| 项目 | 核对结果 |
| --- | --- |
| 原始题名 | ProjectTest: A Project-level Unit Test Generation Benchmark and Impact of Error Fixing Mechanisms |
| 正式题名 | MultiFileTest: A Multi-File-Level LLM Unit Test Generation Benchmark and Impact of Error Fixing Mechanisms |
| 作者 | Yibo Wang、Congying Xia、Wenting Zhao、Jiangshu Du、Chunyu Miao、Zhongfen Deng、Philip S. Yu、Chen Xing |
| 首次公开 | 2025-02-10，arXiv v1 |
| 本地预印本 | arXiv v5，2026-04-07，21 页，已经采用 MultiFileTest 名称 |
| 正式发表 | Findings of ACL 2026，2026 年 7 月，28151–28172 页，共 22 页 |
| 公司参与 | Chen Xing 署名 Scale AI；其他作者来自伊利诺伊大学芝加哥分校、Salesforce Research，或以独立研究者身份参与 |
| 阅读范围 | v5 与正式版全文、参考文献、附录 A–I；以正式版为主 |

旧页面名称和 PDF 标题的差异来自更名，不是两篇独立论文。GitHub 仓库仍使用 `ProjectTest`，正式版首页则指向 Hugging Face 的 `MultiFileTest`。本页保留原 URL 和首发日期，但采用正式题名。v1 的九模型介绍也不能继续用来概括加入 GPT-5 Mini、Gemini 3.0 Pro 后的十一模型版本。[v1 记录](https://arxiv.org/abs/2502.06556v1)、[版本历史](https://arxiv.org/abs/2502.06556)、[正式发表记录](https://aclanthology.org/2026.findings-acl.1403/)

正式版还增加了 §5.6 的四项目 Cursor Agent 案例，修正了覆盖率符号和部分模型名称。主要实验表 2–4 与 v5 的数值相同。以下不会把新增案例算进原来的主实验。

## 2. 输入是完整的小型跨文件项目

论文图 2 的例子包含 `stock.py`、`structure.py` 和 `validate.py`：`Stock` 继承 `Structure`，后者又使用验证相关组件。测试若只照着 `Stock` 的表面接口生成，却引用了错误模块路径，可能在收集测试时就终止，尚未执行任何断言。这是论文用来说明跨文件依赖的实际示意结构。[图 2、§3.3](https://aclanthology.org/2026.findings-acl.1403.pdf)

作者从 GitHub 选择 Python、Java、JavaScript 项目。筛选要求包括多个源文件、文件间存在依赖、规模适合一次放进模型上下文，以及可公开使用的许可或作者授权。大仓库中的一些子项目被单独提取，再修改包名、目录或导入路径，使其能独立运行。

预处理还会检查语法，并把跨多行的语句合并，以调整行覆盖率的统计单位。因而这里评测的是整理后的项目快照，并非把原始仓库原封不动交给模型。模型直接看到完整项目代码，没有检索、逐文件工具探索或项目级规划器。[§3.1、附录 A](https://aclanthology.org/2026.findings-acl.1403.pdf)

### 论文宣称的 60 项，与公开的 59 项需要分开

正文写每种语言 20 项、总计 60 项。本次对公开仓库、处理后的提示 JSON，以及正式版链接的数据集逐项计数，得到以下结果。

| 语言 | 正文宣称 | 当前公开项目数 | 正式表 1 平均文件数 | 正式表 1 平均 LOC |
| --- | ---: | ---: | ---: | ---: |
| Python | 20 | 20 | 6.10 | 654.60 |
| Java | 20 | **19** | 4.79 | 292.26 |
| JavaScript | 20 | 20 | 4.00 | 558.05 |
| 合计 | 60 | **59** | — | — |

这不只是下载时少了一条。正式版附录表 17 本身只列出 19 个 Java 项目，其平均文件数和 LOC 与公开 19 项的重算一致。主表的 Java 可执行率却仍主要以 5 个百分点递增，不能直接用当前 19 项推导那些实验分数。原实验究竟使用了哪个完整项目列表，公开材料没有充分解释。[表 1、17](https://aclanthology.org/2026.findings-acl.1403.pdf)、[固定版本数据](https://huggingface.co/datasets/yibowang214/MultiFileTest/tree/d30c2388317f57ea8c8421c63d82adc1f1cf0fe0)

规模约束也有例外：正文要求少于 1,600 行，但表 18 和公开数据都将 JavaScript 的 `convex` 标为 1,878 行。因此适合把它描述为以较小项目为主，不能声称全部严格满足该上限。

这些项目并非 60 个独立来源的仓库。例如多个牌类游戏来自同一上游项目，若干 Java 示例也来自同一代码集合。Stars 和 forks 是上游来源的统计，不是对测试质量的人工评分。公开代码可能出现在模型训练资料中，论文没有提供逐项目污染排查或未公开保留集；Hugging Face 的 `train` 分区名称也不意味着本文训练了模型。[附录表 16–18](https://aclanthology.org/2026.findings-acl.1403.pdf)

## 3. 四个指标分别衡量能运行、能通过与覆盖范围

### 可执行率的单位是项目

设项目集合为 $X$，能够编译或启动执行其测试套件的项目集合为 $X_{\rm er}$：

$$
ER=\frac{|X_{\rm er}|}{|X|}.
$$

一套测试可以执行，但仍有多个断言失败，所以 ER 不等于所有测试通过率。按论文设定，若套件存在阻止整体执行的错误，该项目的正确率和覆盖率计为零。[§3.2](https://aclanthology.org/2026.findings-acl.1403.pdf)

### 正确率先在每个项目内部计算

对项目 $x$，生成测试集合为 $T_x$，其中正确的测试为 $T_x^{\rm cor}$：

$$
CR_x=\frac{|T_x^{\rm cor}|}{|T_x|}.
$$

这里的依据是测试执行结果：模型写下的预期值是否与被测代码实际行为吻合。它不等于测试发现真实缺陷的能力，也不保证每条通过的测试都有足够强的断言。附录表 7 统计了包含预期值与实际值比较的测试比例，但有比较语句本身仍不能证明断言有效；例如部分模型、语言组合只有 85%–89%，不是所有组合都超过 95%。[§3.2、表 7](https://aclanthology.org/2026.findings-acl.1403.pdf)

主表的 CR 与平均正确测试数除以平均测试数也不相同。Python 的 GPT-4 Turbo 为 CR 47%，而平均数列给出 $6.15/12.60\approx48.8\%$。因此不能用这两列相除来替代论文的项目内比例。正文未完整写出所有跨项目聚合细节、空测试集和缺失报告的处理，复现时需要保留逐项目记录。

以一个自拟示例说明分母差别：两项目分别生成 2 条、10 条测试，各通过 1 条、9 条。两项目 CR 的等权平均是 $(50\%+90\%)/2=70\%$，汇总全部测试则是 $10/12=83.3\%$。两者回答不同的问题。

### 行覆盖与分支覆盖不要求断言正确

$$
LC_x=\frac{\text{被执行的源代码行数}}{\text{纳入统计的源代码行数}},
\qquad
BC_x=\frac{\text{被执行的分支数}}{\text{纳入统计的分支数}}.
$$

测试先执行一段业务逻辑、最后断言失败，仍可能产生覆盖。因此某些模型的 CR 很低而覆盖率不为零，并不矛盾。覆盖率也不是缺陷检出率，本文没有用系统性的变异测试或已知真实缺陷集合来替代这一差别。[§3.2](https://aclanthology.org/2026.findings-acl.1403.pdf)

## 4. 原始生成、人工修复和自修复的操作不同

| 条件 | 输入与动作 | 允许发生的变化 |
| --- | --- | --- |
| 原始生成 | 完整项目加语言相关提示，一次生成测试 | 从模型回复提取测试代码 |
| 人工修复 | 软件工程或程序分析方向的计算机博士生检查错误 | 按协议修复不能执行的错误和连锁错误，目标是保留原测试意图 |
| 模型自修复 | 原始对话、生成测试、框架错误日志，再请求同一模型修复 | 主实验仅追加一轮；可以重写测试，不只修复基础错误 |

原始提示要求为项目各文件生成测试，并提到可执行性、正确结果和尽可能高的覆盖率。Python 另强调包结构和导入路径，Java 强调正确使用 mock，也就是用测试替身模拟依赖或交互。[附录 B、图 6–9](https://aclanthology.org/2026.findings-acl.1403.pdf)

人工修复区分两种情况。**执行错误**会阻止测试启动，例如导入路径不对导致 pytest 无法收集用例；**连锁错误**是执行期间一个根因影响多个测试，例如漏掉 `numpy` 导入，或者没有模拟标准输入而使 Java 测试挂起。仅剩下的预期值不符、虚构属性等错误，则保留用于测量测试正确性。[§3.3、附录 E、I](https://aclanthology.org/2026.findings-acl.1403.pdf)

### 人工协议的目标与具体规则存在差别

作者强调不改变测试逻辑和断言，表 3 也沿用了原始生成的测试数量。但附录规则同时允许在找不到导入对象、无法访问私有元素、错误使用 mock 时删除相关代码行，以及删除不完整生成片段。这意味着“最小机械修改”是协议目标，不能仅凭描述就断言每个样本的全部逻辑、断言内容均严格不变。公开材料没有提供可逐项核对全部修复的完整差异清单。[附录 I、表 19–25](https://aclanthology.org/2026.findings-acl.1403.pdf)

协议要求每次修改后重新执行、检查新错误、确认修改范围和记录位置。它不是可直接运行的通用修复程序：例如 Java 的公开类与文件名不一致，被表 21 概括为添加 package 声明，这并不普遍解决该错误；表 22 对输入挂起仅写 `Continue`，也不足以重建具体 mock。Python 每项目平均修改行数按模型为 1.80–5.85，但这个统计不覆盖全部语言，也没有直接测量人工耗时。[表 10、21–22](https://aclanthology.org/2026.findings-acl.1403.pdf)

### 自修复仍受到上下文预算影响

模型自修复时，作者优先保留系统提示、原始生成测试、错误反馈和修复请求，最后才保留最初的生成请求，至少留出约 2,000 tokens 的输出空间。源码也实现了截短旧请求的策略，因此跨文件源代码可能在自修复时不再完整可见。把主实验限制为一轮减少了长对话积累，却没有完全消除上下文截断的影响。模型失败可能同时涉及修复能力与输入缺失，论文没有通过等长上下文对照将二者完全分开。[§3.3、附录 D.3](https://aclanthology.org/2026.findings-acl.1403.pdf)、[公开自修复实现](https://github.com/YiboWANG214/ProjectTest/blob/a893144b017c44e9a042d605a04baa447f525433/generation/self_fix/generate_py_tests_open_self_fix.py)

## 5. 模型、运行设置和原始结果

主实验比较七个闭源模型：GPT-4 Turbo、GPT-3.5 Turbo、OpenAI o1、GPT-5 Mini、Gemini 2.0 Flash Experimental、Gemini 3.0 Pro、Claude 3.5 Sonnet；另有 CodeQwen1.5-7B-Chat、DeepSeek-Coder-6.7B-Instruct、Code Llama 7B Instruct、CodeGemma 7B IT。这里是论文相应版本的模型集合，不是当前全部模型的排名。[§4、表 6](https://aclanthology.org/2026.findings-acl.1403.pdf)

论文设定为零样本提示、温度 0，报告使用 8 张 NVIDIA A100；这是运行开源模型的实验资源描述，没有进行任务微调。Python 使用 pytest，Java 使用 JUnit 和 JaCoCo，JavaScript 使用 Jest。论文没有提供完整总 token 消耗、API 费用或统一计算预算，也没有固定所有闭源模型的 API 快照。v5 对 Claude 标注了 `20241022`，其他名称不能自行补成精确版本。

下表摘录表 2 的原始生成结果，各单元依次为 **CR / ER / LC / BC**，单位均为百分数。

| 模型 | Python | Java | JavaScript |
| --- | --- | --- | --- |
| GPT-4 Turbo | 47 / 65 / 40 / 36 | 21 / 35 / 15 / 12 | 67 / 75 / 56 / 46 |
| GPT-3.5 Turbo | 37 / 60 / 38 / 34 | 13 / 25 / 8 / 7 | 51 / 65 / 37 / 28 |
| OpenAI o1 | 60 / 65 / 56 / 54 | 41 / 60 / 44 / 35 | **87 / 95 / 87 / 75** |
| GPT-5 Mini | 53 / 60 / 51 / 50 | 55 / 70 / 47 / 44 | 73 / 90 / 81 / 67 |
| Gemini 2.0 Flash | 46 / 65 / 42 / 39 | 19 / 30 / 14 / 12 | 59 / 70 / 64 / 61 |
| Gemini 3.0 Pro | **77 / 85 / 76 / 73** | **62 / 80 / 58 / 51** | 68 / 70 / 68 / 66 |
| Claude 3.5 Sonnet | 64 / 70 / 51 / 47 | 53 / 75 / 47 / 33 | 65 / 80 / 59 / 53 |
| CodeQwen1.5 | 24 / 65 / 43 / 40 | 0 / 0 / 0 / 0 | 23 / 35 / 25 / 20 |
| DeepSeek-Coder | 37 / 70 / 39 / 35 | 8 / 20 / 5 / 5 | 62 / 85 / 50 / 35 |
| CodeLlama | 16 / 60 / 41 / 37 | 0 / 0 / 0 / 0 | 26 / 85 / 20 / 14 |
| CodeGemma | 13 / 50 / 31 / 28 | 0 / 0 / 0 / 0 | 29 / 55 / 28 / 21 |

Gemini 3.0 Pro 在 Python、Java 的四指标领先，o1 则在 JavaScript 领先。Java 中三个开源模型没有生成可执行套件，后续正确率和覆盖率因此都为零。这些结果支持基础执行问题是重要限制；Java 的语法、库、项目内容和测试环境同时不同，不能仅据跨语言比较把差异全部归因于语法严格程度。[表 2、§5.1](https://aclanthology.org/2026.findings-acl.1403.pdf)

测试数量也不直接代表质量。JavaScript 的 CodeLlama 每项目平均生成 48.75 条测试，行覆盖率只有 20%；o1 平均 39.40 条，却达到 87%。这不证明更少的测试必然更好，而是说明数量需要结合执行、断言和覆盖一并看。

## 6. 修复带来的增益与退步

以下把表 2–4 的几个组合并排，指标次序仍为 CR / ER / LC / BC。

| 模型与语言 | 原始生成 | 人工修复 | 单轮自修复 |
| --- | --- | --- | --- |
| Gemini 3.0 Pro／Python | 77 / 85 / 76 / 73 | 90 / 100 / 91 / 88 | 91 / 95 / 87 / 85 |
| Claude 3.5 Sonnet／Python | 64 / 70 / 51 / 47 | 92 / 100 / 74 / 70 | 86 / 90 / 67 / 63 |
| GPT-5 Mini／Python | 53 / 60 / 51 / 50 | 83 / 100 / 83 / 80 | 66 / 70 / 61 / 59 |
| CodeQwen1.5／Java | 0 / 0 / 0 / 0 | 60 / 100 / 42 / 31 | 5 / 5 / 0 / 0 |
| OpenAI o1／JavaScript | 87 / 95 / 87 / 75 | 91 / 100 / 92 / 79 | 54 / 65 / 47 / 38 |
| CodeQwen1.5／JavaScript | 23 / 35 / 25 / 20 | 32 / 100 / 35 / 27 | 55 / 95 / 66 / 52 |

人工修复后的 ER 在表 3 全部为 100%，这是修复流程达到的状态，不能当作模型原始生成能力。CodeQwen1.5 的 Java 结果说明，不能执行的套件里可能仍包含有用测试思路；修好运行障碍之后才能观察到它们的覆盖与正确性。

自修复则允许改变测试数量和内容。o1 的 JavaScript 平均测试数从 39.40 降到 20.30，ER 从 95% 降至 65%，LC 从 87% 降至 47%，即下降 40 个百分点。CodeQwen1.5 的 JavaScript 却相反：平均测试数从 8.45 增至 26.10，作者观察到部分最初没有生成测试的回复，在错误反馈后开始生成测试。因此人工修复并不是自修复的理论上界，两种操作的约束本来就不同。[§5.2–5.3、表 3–4](https://aclanthology.org/2026.findings-acl.1403.pdf)

表 3 括号是相对原始生成的百分点变化，表 4 括号则是相对人工修复，不能混读为相对原始生成。个别括号还有算术不一致：GPT-5 Mini 的 Python LC 从 51 到 83，应增加 32 个百分点，表 3 却写 +27；BC 从 50 到 80，应为 +30，原表写 +26。本页采用可以直接核算的绝对数值。

### 只修执行错误的消融

表 13 先只修执行错误，再与表 3 的“执行错误加连锁错误”比较。Python 的 CodeQwen1.5 从 CR 40%、LC 65% 到 CR 46%、LC 70%；JavaScript 的 CodeLlama 从 CR 28%、LC 20% 到 CR 62%、LC 44%。这些组合显示单一运行期根因会牵连多个测试。[附录 D.2、表 13](https://aclanthology.org/2026.findings-acl.1403.pdf)

但不能声称多修一类错误后所有覆盖率都单调增加。Java 的 CodeQwen1.5 在两张表中的 LC 反而从 49% 到 42%；GPT-4 Turbo 从 42% 到 40%。原文注释称需要用户交互时覆盖率可能不适用，但没有完整说明缺失报告的聚合分母及其变化。没有逐项目记录，不能把这些下降直接解释为修复损害了代码覆盖。

## 7. 独占覆盖的计算及其边界

论文还统计每条测试独有的覆盖。结合公开 `unique_contribution.py`，设某项目第 $i$ 条测试执行的源代码行集合为 $L_i$，统计分母为项目行数 $N$：

$$
U=\frac{\sum_i\left|L_i\setminus\bigcup_{j\ne i}L_j\right|}{N}.
$$

也就是计算只被恰好一条测试执行的行，占项目统计行数的比例。它不是“非冗余测试数量占比”，也没有直接除以测试条数。[§5.4、附录 G](https://aclanthology.org/2026.findings-acl.1403.pdf)、[固定版本实现](https://github.com/YiboWANG214/ProjectTest/blob/a893144b017c44e9a042d605a04baa447f525433/generation/others/unique_contribution.py)

例如一个自拟的十行项目，测试 A 覆盖第 1、2、3 行，测试 B 覆盖第 3、4 行。总覆盖为 40%，独占覆盖为 $(2+1)/10=30\%$。再加一条与 A 完全重复的测试，独占覆盖会降到 10%，但原来的四行仍被覆盖。这说明该指标对重复覆盖敏感；同一行上的不同输入和不同断言也可能有价值，不能仅据独占覆盖判断测试是否应被删除。

表 5 仅针对 Python。o1 的独占覆盖为 6.75%，GPT-5 Mini 为 15.10%，Gemini 3.0 Pro 为 17.05%。其中 Gemini 的平均测试数列写 21.50，与表 2 的测试数 27.45 不同，恰好等于表 2 的平均正确测试数，不能据这一列做精确的测试效率比较。[表 5](https://aclanthology.org/2026.findings-acl.1403.pdf)

公开脚本仅实现 Python，使用 `unittest` 发现 `*_test.py` 中的测试，再分别运行 coverage。分母来自一个手写项目行数表；脚本默认路径为 Gemini 的 `original_fix` 目录，而预处理 notebook 也用这个目录名存放提取后的代码；仅凭路径名称不能确认是否对应表 5 的原始条件。恢复论文结果需要确认测试发现范围、源文件范围、条件目录和跨项目聚合，不能直接把默认输出当作主表复现。

## 8. 提示、轮数与其他方法的对照

### 提示中的每一句不一定都提高指标

附录表 12 使用 GPT-4 Turbo，比较 Python 提示的不同组成。以下摘录原始生成条件。

| 提示条件 | CR | ER | LC | BC |
| --- | ---: | ---: | ---: | ---: |
| 完整提示 | 47 | 65 | 40 | 36 |
| 去掉正确性要求 | 33 | 65 | 42 | 38 |
| 去掉可执行性要求 | 35 | 63 | 41 | 38 |
| 去掉覆盖要求 | 43 | 75 | 46 | 42 |
| 去掉语言特定要求 | 47 | 75 | 53 | 49 |
| 改为注释形式 | 41 | 65 | 45 | 41 |

正确性要求与较高 CR 同时出现，但完整提示没有在所有指标领先。去掉语言特定要求后 CR 仍是 47%，LC 却从 40% 到 53%；因此不能把这条要求概括为已证明提高全部能力。人工修复条件下，去掉正确性要求的 CR 76% 还略高于完整提示的 74%。这些是特定模型、特定集合的对照，没有相应置信区间。表中 ER 63% 也不符合单次 20 项二值平均的 5 个百分点步长，具体汇总方式未充分说明。[附录 D.1、表 12](https://aclanthology.org/2026.findings-acl.1403.pdf)

### 多轮修复和 Agent 案例规模较小

GPT-3.5 Turbo 在十个 Python 项目上的第一、二、三轮修复，ER 分别为 60%、70%、80%，LC 为 36%、45%、49%，CR 为 31%、32%、34%。第二轮到第三轮覆盖增量缩小，但仍有提升。这不足以证明第三轮已收敛，也不能推出多轮修复没有必要。[表 14](https://aclanthology.org/2026.findings-acl.1403.pdf)

正式版新增的 Cursor Agent + GPT-5 Mini 案例包含 `bankingApplication`、`libraryManagement`、`doudizhu`、`stock3`。第一个项目十轮修复后仍因 mock 问题无法执行，其余三个生成了可执行但仍有错误的测试。这是四个选定项目的案例观察，没有全基准的统一覆盖率、预算或重复实验，不能称为 Agent 在该基准上的 75% 成功率。[正式版 §5.6](https://aclanthology.org/2026.findings-acl.1403.pdf)

### EvoSuite 与 HITS 提供另一种参照

Java 上，表 11 报告 EvoSuite 的 LC / BC 为 55 / 57，o1 原始生成是 44 / 35，自修复是 58 / 54。自修复在行覆盖上略高，在分支覆盖上略低，不能概括为全面超过 EvoSuite。

使用 GPT-3.5 Turbo 的 HITS 为 CR / ER / LC / BC = 75 / 80 / 41 / 29；同模型原始生成是 13 / 25 / 8 / 7。HITS 使用方法切分及迭代调试，改动不只一次错误反馈。论文没有完整对齐各方法的调用次数和运行时间，所以这些结果用于比较最终效果，不能解释成相同预算下的收益。[附录 C.4、表 11](https://aclanthology.org/2026.findings-acl.1403.pdf)

## 9. 重复实验与统计表的可复核范围

附录表 8 只重复了 GPT-3.5 Turbo 的 Python 原始生成三次：CR 为 37%、34%、37%；ER 为 60%、65%、65%；LC 为 38%、40%、39%。这说明该设置中的三次波动幅度较小，不代表十一模型、三语言、三条件都完成重复实验。

该表的方差和标准差不能统一按一种分母还原。例如 ER 的三个显示值对应总体方差约 0.000556、样本方差约 0.000833，原表却写 0.0003；其标准差 0.0236 接近总体标准差。本页保留三次原始数值，不将不一致的方差列当作精确误差估计。[表 8](https://aclanthology.org/2026.findings-acl.1403.pdf)

表 9 另以模型层面的 CR 做条件对照，报告显著性和 Cohen's $d$。v5 的文字说九个模型，正式版改成十一个，但表中的均值并未与新版主表同步。例如按表 2 十一模型重算，Python、Java、JavaScript 原始 CR 均值约为 43.09%、24.73%、55.45%，表 9 却仍为 38.2%、17.2%、52.1%；后面三个数字恰好对应去掉 GPT-5 Mini 和 Gemini 3.0 Pro 后的九模型均值。人工修复列还存在其他不能仅由舍入解释的差异。[附录 C.2、表 9](https://aclanthology.org/2026.findings-acl.1403.pdf)

因此可以引用“作者报告了显著性检验”，但不能据此声称正式版十一模型的全部比较已经按同一套数据复核通过。测试模型也不是独立随机抽取的项目样本；模型级检验不能替代逐项目重复实验或人工修复者之间的一致性评价。

## 10. 公开代码与复现需要补齐的环节

本次静态核对的 GitHub 提交是 `a893144b017c44e9a042d605a04baa447f525433`，正式数据快照是 `d30c2388317f57ea8c8421c63d82adc1f1cf0fe0`。已读取三语言全部公开数据记录、预处理 notebook、提示 JSON、生成及自修复脚本、测试执行脚本和独占覆盖实现；没有运行模型、项目测试或完整实验。

| 阶段 | 公开入口 | 需要注意的事项 |
| --- | --- | --- |
| 项目准备 | `dataset/`、`data_preprocess.ipynb`、`ProjectTest/*/original_prompt.json` | 当前只有 59 项；部分路径和包名经过预处理，新旧数据应固定快照 |
| 原始生成 | `generation/vanilla/` | 老脚本和模型路由不能自动视为新版所有模型的实验配置 |
| 自修复 | `generation/self_fix/` | 需要原始回复和错误日志；上下文截断顺序会改变可见代码 |
| 执行评价 | `generation/others/run_all_*.py`、`pytest/`、`javatest/`、`jstest/` | 路径包含固定模型前缀和条件后缀，需要先对齐目录 |
| 独占覆盖 | `generation/others/unique_contribution.py` | Python 特定实现、手写分母、默认条件目录待核；缺少完整主表聚合 |

有两处实现会直接影响复现解释。第一，README 对应的 `my_test.sh` 使用 `-t -1`；GPT 生成脚本在这个分支没有显式传入 `temperature`，有限 token 分支才传入温度。即使传了 seed 42，也不能保证此默认入口实现论文所说的温度 0。[生成代码](https://github.com/YiboWANG214/ProjectTest/blob/a893144b017c44e9a042d605a04baa447f525433/generation/vanilla/generate_tests_gpt.py)

第二，Python 和 Java 执行脚本使用 `subprocess.run` 捕获输出，但没有 `check=True`、没有超时，并主要保存标准输出；其中的 `CalledProcessError` 捕获不会自动处理非零退出码。这不证明作者把失败算成成功，却说明复现者需要另外保存退出状态、标准错误并解析测试报告，不能把“脚本返回了文本”当作可执行通过。[Python 执行代码](https://github.com/YiboWANG214/ProjectTest/blob/a893144b017c44e9a042d605a04baa447f525433/generation/others/run_all_py.py)、[Java 执行代码](https://github.com/YiboWANG214/ProjectTest/blob/a893144b017c44e9a042d605a04baa447f525433/generation/others/run_all_java.py)

依赖说明列出 Java 17.0.13、Maven 3.6.3，Python 多数库未固定版本，JavaScript 提供 Jest/Babel 配置与 lock 文件。重建实验还需要完整生成记录、人工修复差异、原实验项目清单、各指标聚合程序及新版 API 标识。公开数据卡标 MIT，而论文附录列有 GPL、CC-BY-SA 和作者授权等来源；数据卡标签不能替代各项目自身的许可说明。[仓库说明](https://github.com/YiboWANG214/ProjectTest/tree/a893144b017c44e9a042d605a04baa447f525433)、[正式数据](https://huggingface.co/datasets/yibowang214/MultiFileTest)

本研究最直接覆盖的是较小、一次可输入的跨文件测试生成，以及错误反馈如何改变执行结果。它没有系统验证生产规模仓库、长上下文检索、持续 Agent 调试、真实缺陷检出或测试维护成本。阅读时将可执行率、正确率、覆盖率及修复条件分开，才能判断分数变化究竟来自新增测试能力，还是原有测试终于运行起来。

## 参考资料

1. Wang 等：[MultiFileTest，Findings of ACL 2026 正式论文](https://aclanthology.org/2026.findings-acl.1403.pdf)，正文 §1–6、附录 A–I、表 1–25。
2. [ProjectTest 首发版本](https://arxiv.org/abs/2502.06556v1)、[MultiFileTest v5](https://arxiv.org/pdf/2502.06556v5)，用于核对更名、模型集合与正式版差异。
3. [作者 GitHub 仓库固定提交](https://github.com/YiboWANG214/ProjectTest/tree/a893144b017c44e9a042d605a04baa447f525433)，代码、提示及项目文件。
4. [作者正式数据固定快照](https://huggingface.co/datasets/yibowang214/MultiFileTest/tree/d30c2388317f57ea8c8421c63d82adc1f1cf0fe0)，三语言 JSONL，共 59 条。
