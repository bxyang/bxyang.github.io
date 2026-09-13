---
title: "INTELLECT-1 精读：在不断变化的全球 GPU 集群上训练 100 亿参数模型"
company: "prime-intellect"
date: "2024-11-29"
dateLabel: "2024-11-29 模型发布；12-02 arXiv 首发"
kind: "模型与技术报告"
description: "详解 1T token 训练的数据配比、分层 DiLoCo、8 位通信、节点恢复、计算利用率及后训练结果，并核对历史代码与模型版本。"
reviewed: "2026-09-13"
readingStatus: "deep-read"
paperVersion: "arXiv:2412.01152v1，2024-12-02，19 页"
---

[← Prime Intellect](/companies/prime-intellect) · [全部工作](/research)

# INTELLECT-1 精读：在不断变化的全球 GPU 集群上训练 100 亿参数模型

INTELLECT-1 的训练节点来自不同地区的算力贡献者。节点之间只有普通互联网连接，还会在训练期间加入、退出或故障。项目将一个约 100 亿参数语言模型从头训练到一万亿 token：每个节点先在八张 H100 内部完成 100 次本地优化，再与其他节点交换压缩后的参数变化。全球部署的通信等待约占一个计算与同步周期的 17%，实际运行也遇到过需要从检查点恢复的集体掉线。报告既提供了训练完成和模型能力的证据，也记录了通信、容错与后训练中的具体限制。[技术报告 §2–3](https://arxiv.org/pdf/2412.01152v1)

## 这次工作与所读版本

原文为 *INTELLECT-1 Technical Report*。模型于 2024 年 11 月 29 日发布，arXiv v1 于 12 月 2 日首次提交。更早的 10 月 11 日文章宣布启动训练；报告称实际预训练在 10 月 10 日至 11 月 22 日之间进行，累计约 42 天。这些日期分别对应训练、公告、模型发布和论文公开，不能合并成同一个事件。[发布文章](https://www.primeintellect.ai/blog/intellect-1-release) · [arXiv 记录](https://arxiv.org/abs/2412.01152v1)

作者中，Sami Jaghouar、Jack Min Ong、Manveer Basra、Fares Obeid、Jannik Straube、Michael Keiblinger、Johannes Hagemann 署名 Prime Intellect；Elie Bakouch 署名 Hugging Face；Lucas Atkins、Maziyar Panahi、Charles Goddard 署名 Arcee AI；Max Ryabinin 署名 Together AI。Prime Intellect 负责训练框架及协作训练，报告还明确使用 Arcee 的后训练工具。30 位算力贡献者包括公司和个人，不能全部称为“30 家公司”，更不等于有 30 个节点始终同时在线。（首页、§3.5、致谢）

本次完整阅读 19 页 v1，包括系统实现、训练分析、后训练、评测、讨论、致谢、参考文献和附录 A。算法前作与早期实现已在 [OpenDiLoCo 精读](/companies/prime-intellect/opendiloco) 介绍；本页重点是 10B 训练中的新系统与实际运行。

官方历史链接 `PrimeIntellect-ai/prime` 如今指向 CLI 与 SDK 项目。论文对应的训练代码现位于 **`prime-diloco`**。本次选取论文首发前最近的公开提交 `92fa6576202cdb2592f2ab4f3fc3c44a89ee426f`，提交时间为 2024 年 11 月 29 日。它适合核对发布期实现，但不是论文声明的全部生产运行版本。[固定训练代码](https://github.com/PrimeIntellect-ai/prime-diloco/tree/92fa6576202cdb2592f2ab4f3fc3c44a89ee426f)

## 训练节点、模型与 batch 的单位

一次本地训练由一个八张 H100 的节点完成。整个过程中有 30 位独立算力贡献者参与，节点最多同时有 14 个，即 112 张 H100；报告又以最多八处数据中心、五个国家、三个洲描述地理分布。节点、数据中心、贡献者是不同统计单位。（摘要、§1、§3.1）

模型采用 Llama 3 架构，从头预训练。附录 A 说相对 Llama 3 8B 主要增加层数，公开模型配置可进一步核对：

| 参数 | INTELLECT-1 |
| --- | ---: |
| Transformer 层数 | 42 |
| 隐藏维度 | 4,096 |
| 前馈中间维度 | 14,336 |
| Query heads / KV heads | 32 / 8 |
| 词表 | 128,256 |
| 训练序列长度 | 8,192 |
| 每节点本地 batch | 128 条序列 |
| 每 GPU 微批次 | 1 条序列，发布期 10B 配置 |
| 内层 AdamW 学习率 | $7.5\times10^{-5}$ |
| AdamW 动量系数 | 0.9、0.95 |
| 权重衰减 | 0.1 |
| 预热 | 1,000 步 |
| 外层 Nesterov 学习率 / 动量 | 0.7 / 0.9 |
| 外层同步间隔 | 100 个本地优化步 |

附录的 `K/V size=8` 在模型配置中对应八个 KV heads，不是每个头只有八维。每节点 batch=128 已包含八张 GPU，因此每 GPU 微批次为 1 时，要累积 $128/8=16$ 个微批次才进行一次本地优化，不能再把 128 乘八作为本地 batch。

每个节点每次本地优化处理 $128\times8192=1,048,576$ 个训练位置；一个 100 步周期约 1.049 亿个位置。全局每步的数量还要乘**当时**参与的节点数。节点数量会变化，用最大 14 节点乘全部步数不能重算真实总 token。代码按当前 process group 大小累计 token，并注明随后未能参加同步的节点可能影响统计。（附录 A；`train.py`、`configs/10B`）

## 数据配比与训练后段的变化

预训练数据来自已有网页、代码和数学语料。报告中的混合池用 Llama 3 tokenizer 计数超过 6T token，实际训练预算为 1T。6T 是可用池规模，不能说模型把整个池训练了一遍。

| 数据源 | 常规阶段权重 | 退火阶段权重 |
| --- | ---: | ---: |
| FineWeb-Edu | 55% | 80% |
| FineWeb | 10% | 10% |
| StackV1-popular | 20% | 10% |
| DCLM-baseline | 10% | 0% |
| OpenWebMath | 5% | 0% |

为减少原始分片内相关样本连续出现，作者从 12 个流式迭代器随机采样、打乱后重新分片。公开的 Prime Intellect FineWeb-Edu 数据卡说明它是预先打乱的版本；StackV1-popular 卡片列出 JavaScript、Python、C、C++、SQL、CUDA。这不是作者重新制作的专家标注数据集。（表 1）

发布期 `InterleaveDataset` 按上述权重随机选择一个数据源，再取一条文本。因文本长度不同，这些**采样权重不能未经重计就当成精确的训练 token 占比**。代码还会在各自文件读完后循环读取，因此也不能从 1T 预算反推一万亿个唯一 token。

数据装配使用序列打包而非给每篇文档补齐到 8,192。每条文本经 tokenizer 编码后追加 EOS，形成偏移一位的输入与目标，多个片段组成固定长序列。所读版本在当前长序列装满时，会丢弃该文档剩余部分，而不是把剩余内容接到下一条；精确重现数据顺序时需要保留这个实现细节。打包数据也记录文档片段长度，供模型的打包注意力路径使用。（`data.py`）

退火约从第 74,700 步开始。减少代码和数学、增加教育网页的同时，学习率也下降。作者解释图 6 的损失短暂上升，是因为新配比提高了原本损失更高的文本占比，而不是训练突然不稳定。由于数据分布与学习率同时变化，这张曲线不能作为“单独改变数据配比”或“单独退火”的消融。（§3.4，图 6）

报告没有给出完整逐条训练清单、五套数据间去重结果或每个评测集的污染审计。公开来源与权重有助于重建语料，但不足以证明每一条评测题都未进入训练。

## 优化目标与学习率

### 交叉熵之外还有 max-z-loss

代码使用下一 token 交叉熵，加一个限制最大 logit 的辅助损失。设有效目标位置集合为 $V$，总位置数为 $M$，位置 $t$ 的词表 logits 为 $z_{t,v}$，则对应所读实现：

$$
\mathcal L_{\mathrm{CE}}=-\frac1{|V|}\sum_{t\in V}\log p_\theta(x_t\mid x_{<t}),
$$

$$
\mathcal L_z=\frac{\lambda}{M}\sum_{t\in V}\left(\max_v z_{t,v}\right)^2,
\qquad \mathcal L=\mathcal L_{\mathrm{CE}}+\mathcal L_z,
\quad \lambda=2\times10^{-4}.
$$

这是对 `loss.py` 的展开：忽略位置先把最大 logit 置零，然后对全部位置求均值；交叉熵则用有效位置作分母。无忽略标签时两种位置数一致。这里惩罚的是**最大 logit 的平方**，不要替换成其他模型常见的 log-sum-exp 形式 z-loss。

训练日志把交叉熵与辅助项分开记录，`Perplexity` 是交叉熵的指数，不包含 max-z-loss。它来自训练 batch，不是单独固定验证集的困惑度。报告称辅助损失用于稳定训练，但没有给出关闭这一项、其余设置不变的对照结果。（§3.1、附录 A；`loss.py`、`train.py`）

### WSD 让稳定阶段长度可以延后决定

训练先预热，再保持学习率，最后下降。所读代码的 `wsd-sqrt` 调度可写为：

$$
\eta(s)=\eta_{\max}
\begin{cases}
s/S_w,&s<S_w,\\
1,&S_w\le s<S_a,\\
\max\left(0,1-\sqrt{\frac{s-S_a}{S_f-S_a}}\right),&s\ge S_a.
\end{cases}
$$

$s$ 是本地优化步，$S_w=1000$，冷却配置中 $S_a=74700$、$S_f=90400$。这是平方根形下降，不是余弦衰减，也不是线性下降。稳定阶段使团队可以依据持续收到的算力延长训练，接近结束时再确定退火配置。

常规配置把 `total_steps` 设为一个极大值；在这份代码里它是调度与停止用的**步数**，不是一万亿 token 的自动预算控制器。最后切换到 90,400 步冷却配置才得到明确终点。论文写“最后约 20% 的训练”，而配置中剩余步数为 15,700，约占总步数 17.4%；节点数变化使步数比例与 token 比例也不能直接等同。（§3.1、§3.4；`lr_scheduler.py`、两份 10B TOML）

## FSDP2 与 DiLoCo 分别同步哪些设备

每个节点内部，FSDP2 将模型参数、梯度与优化器状态分到八张 GPU，用 NVLink 等高速连接完成组内通信。节点之间，则让负责**相同模型分片**的 rank 建立独立通信组。例如各节点的 local rank 0 互相同步自己负责的分片，local rank 1 同步另一份，而不是每个 rank 都跨网发送完整模型。（§2.3，图 1）

外层仍使用 DiLoCo。第 $r$ 轮的共同起点为 $\theta_r$，worker $k$ 在本地 AdamW 更新 $H=100$ 步后到达 $\theta_{r,H}^{(k)}$，计算：

$$
\Delta_r=\frac1{K_r}\sum_{k=1}^{K_r}\left(\theta_r-\theta_{r,H}^{(k)}\right).
$$

$K_r$ 是该轮参与节点数。系统将这一参数差平均值作为伪梯度，从共同起点执行外层 Nesterov SGD，学习率 0.7、动量 0.9。它不是把每个本地梯度分别发到网络，也不是在各局部终点继续减一次平均差。（算法 1）

PRIME 把共同起点副本、伪梯度和外层优化器状态放到 CPU，外层更新完再把新分片复制回 GPU。这样避免为外层优化器额外常驻一整套 GPU 状态，但增加 CPU 内存与 CPU/GPU 复制；“无额外 GPU 显存开销”不等于没有系统资源成本。（§2.1；`diloco.py`）

这里的分层分片是相对 OpenDiLoCo 早期实现的重要变化：本次使用 FSDP2 / DTensor 真正管理组内分片，不应把早期实验的 `NO_SHARD` 约束套到 INTELLECT-1 上。

## 8 位传输与 100 步同步的通信量

FP32 每元素四字节，8 位索引每元素一字节；若每 100 步才同步一次，忽略码本与协议开销，和每步发送 FP32 张量相比，载荷比例约为：

$$
\frac{1}{100}\times\frac14=\frac1{400}.
$$

正文介绍通用方案时还使用 $H=500$，得到最多约 $500\times4=2000$ 倍；**INTELLECT-1 主训练实际选的是 100 步和约 400 倍**。两者不是互相冲突的同一次测量，也都不是训练墙钟时间加速比。（§1–3.1）

### 只在传输时量化，求和仍用 FP32

论文描述先计算张量均值 $\mu$ 和标准差 $\sigma$，在 $[\mu-6\sigma,\mu+6\sigma]$ 内划成 256 桶，再用每桶实际元素的平均值建立码本。发送的是桶索引与码本，接收方据此还原近似数值。

桶编号本身没有线性含义，所以不能把两个编号直接相加当作梯度相加。环形聚合在接收后查表、以 FP32 累加，需要转发时再量化；最终结果仍有量化误差，FP32 累加不能恢复已经丢失的信息。C++ 实现把编码、解码与收发流水线重叠，避免压缩计算成为新的等待来源。报告称量化速度比其 PyTorch 实现快 60 倍以上，但没有把这一局部性能数字测成端到端训练提速。（§2.2）

### 发布期代码与文字定义并不完全一致

所核对的 Python 参考函数和实际 C++ 内核都没有减去均值。C++ 先计算：

$$
s_0=\frac{\|x\|_2}{\sqrt{n-1}},\quad a=\frac{6s_0}{256},\quad
q_i=\operatorname{clip}\left(\operatorname{round}(x_i/a)+128,0,255\right).
$$

再以原始 $x_i$ 对同桶元素求平均建立码本。$s_0$ 只有在零均值条件下才对应通常的样本标准差；桶编号的未饱和范围近似围绕零的正负 $3s_0$，不是论文所写的均值加减 $6\sigma$。边缘桶的重建值仍由实际成员决定，并非固定截断值。

因此，论文的高层描述与这个发布期实现需要分别记录。源码没有给出整个 42 天各阶段的部署提交，本文不能据此断言原训练始终采用哪个范围，也不擅自把原文改写为与代码完全一致。8 位码本压缩这一框架成立，但精确复现应使用明确的内核快照。（`compression.py`、`C/csrc/compression.cpp`、`collectives.cpp`）

## 节点加入、掉线与检查点恢复

### 节点之间有弹性通信组，也有协调角色

ElasticDeviceMesh 将组内 FSDP 通信和组间弹性通信分开。组间 process group 可以随节点增减重新建立，组内仍维持各分片的训练。系统通过主键值存储、各 replica group 的 TCP store、心跳与通信重试来协调状态；“全球分布式”不意味着不存在主节点或控制角色。（§2.4）

论文说每两秒发心跳，六秒收不到就移除节点；正常退出发送 deathrattle，尽快让其他节点知道。固定代码默认仍是两秒一次，但超时是 **十秒**，可经环境变量改写。原文与默认值不能互相代替成已确认的生产配置。

当某个节点只在部分 replica group 中先被判死，各 rank 可能形成不同的节点视图和超时窗口。报告明确把这类同步问题列为未完全解决的边界，并没有声称节点任意故障都能无损继续。（§2.4.4–2.4.5）

### 主训练选用了会暂停的加入方式

新节点需要拿到模型、内外优化器等状态。报告比较两种方案：非阻塞方式让老节点继续训练，新节点跳过当前本地更新、用零伪梯度参加下一次外层同步；阻塞方式则让活跃节点等待传输完成。

作者实际采用较保守的**阻塞恢复**。非阻塞方案虽能运行，但新节点初期出现小幅损失尖峰；节点通常隔几天增加一次，传输检查点约需 30–60 分钟，因此团队接受暂停来减少状态不一致。历史 README 仍重点介绍非阻塞方案，`train.py` 的发送路径则显式传入 `blocking=True`。功能说明与本次主训练选择需要区分。（§2.4.2）

训练起初四个节点，后来最多十四个，图 5 显示在线数持续变化。报告特别记录过一次十二个节点同时丢掉四个，影响训练稳定，团队选择从检查点恢复。这个案例限定了“容错”的实际含义：不少加入退出可以处理，但不是从未重启，也不是任何比例的节点消失都不影响优化。（§3.3）

所读 `diloco.py` 默认对聚合重试三次；全部失败后，会退回本节点未聚合的伪梯度继续外层更新，而不是强制保证所有存活节点拿到相同的全局平均。此处是静态代码行为，报告没有给出这条回退实际触发了多少次。只靠最终损失曲线，无法恢复每轮通信故障的具体影响。

## 网络拓扑与实际利用率

训练节点通过 Tailscale / WireGuard VPN 相连，以满足 Gloo 的连通要求。各分片使用多条连接。网络带宽会随路由和拥塞变化，原本较好的环形顺序可能突然出现慢边。

论文给出一种优化目标：在每个节点恰好访问一次的环 $C$ 中，让最慢一条边的带宽尽可能大：

$$
C^*=\arg\max_{C\in\mathcal C}\min_{(u,v)\in C}w(u,v).
$$

$w(u,v)$ 为两节点间带宽，$\mathcal C$ 为所有 Hamiltonian cycles。它是最大化瓶颈，不是简单最小化地理距离。代码通过 `iperf` 测量，再调用 `toposolve` 选顺序；仅看到调用不等于独立证明求解器在每次部署中都达到这一目标的全局最优。（§2.5）

报告观察到 VPN 有时改善、也有时恶化吞吐，最终仍是跨洲通信的瓶颈之一。PCCL 被列为后续自建通信库的方向，不能把后来公开的 PCCL 能力当作 INTELLECT-1 已使用的实现。（§2.6）

### MFU 与计算时间占比是两种指标

表 2 的结果如下。38 分钟是 **100 个本地步合计**，不是单步耗时。

| 部署 | 100 步计算时间 | 同步时间中位数 | 计算时间占比 | MFU |
| --- | ---: | ---: | ---: | ---: |
| 无通信基线 | 38 分钟 | — | 100% | 43.3% |
| 美国 | 38 分钟 | 103 秒 | 95.7% | 41.4% |
| 美国与欧洲 | 38 分钟 | 382 秒 | 85.6% | 37.1% |
| 美国、欧洲、亚洲 | 38 分钟 | 469 秒 | 83.0% | 36.0% |

表中采用论文表 2 的数值。计算时间占比可近似由以下比例核对：

$$
U_{\mathrm{time}}=\frac{T_{\mathrm{local}}}{T_{\mathrm{local}}+T_{\mathrm{sync}}}.
$$

全球配置为 $2280/(2280+469)\approx82.94\%$，所以约 17% 时间用于这一同步阶段。MFU 则以模型计算吞吐相对于硬件理论 FLOPS 计算，不能说 H100 已达到 83% 的峰值算力。训练代码同时记录本地窗口 MFU 与包含外层周期的 `outer_mfu`，比较时要选择同一时间范围。

原文还有两处口径不一致：表 2 全球 MFU 为 36.0%，摘要和相邻正文为 36.2%；§3.1 另称全球同步约十分钟、通信占比仅 2%–10%，与表内中位数 469 秒及 83% 计算占比并不对应。即使用十分钟与 38 分钟相加，通信占比也约 20.8%。本文采用可重算的表 2，不把不同摘要数字拼接成一个精确计时结果。

图 3–4 都注明去掉第 5 百分位以下及第 95 百分位以上的样本，仍然显示跨洲分布更宽、右尾更长。因此图中并非全部最坏时延，也不能拿截尾分布代表故障恢复、节点加入暂停在内的完整 42 天利用率。报告另称 CPU 伪梯度与外层更新约 5–10 秒、保存检查点到磁盘约 60 秒，这些也不是零成本。（§3.2）

## 基础模型学到了什么

基础模型用 Language Model Evaluation Harness 评测八个基准。报告明确列出 MMLU 5-shot、HellaSwag 10-shot、ARC-Challenge 25-shot、GSM8K 5-shot、WinoGrande 5-shot；GPQA、TruthfulQA、BBH 未在该段完整列出子任务、指标变体和 few-shot 配置。本次未找到足以逐项还原所有结果的 harness 提交、命令和原始输出。（§3.6）

| 基准 | INTELLECT-1 Base | INTELLECT-1 Instruct |
| --- | ---: | ---: |
| MMLU | 37.50 | 49.89 |
| HellaSwag | 72.26 | 71.42 |
| ARC-Challenge | 52.13 | 54.52 |
| GPQA | 26.12 | 28.32 |
| GSM8K | 8.10 | 38.58 |
| TruthfulQA | 35.47 | 42.16 |
| WinoGrande | 65.82 | 未在表 4 报告 |
| BBH | 32.97 | 34.85 |
| IFEval | 未在表 3 报告 | 40.39 |

数字按论文表 3–4 的百分制得分保留。TruthfulQA、BBH、IFEval 等存在不同统计变体，不能在缺少配置时统一改称完全相同口径的单题准确率，也不能将九列简单平均为论文未报告的综合分数。

论文选择的对照包括 MPT-7B、Falcon-7B、Pythia-12B、Amber、LLaMA 与 LLaMA 2；它们规模约 7B–13B、预训练预算约 300B–2T token。INTELLECT-1 Base 的 MMLU 37.5 高于 LLaMA-7B 的 35.1，HellaSwag 72.26 却低于后者 78.19；LLaMA-13B 的 MMLU 为 46.9、ARC-C 为 56.14，也高于本模型。结果不是“全部超过同规模集中式模型”。

这些对照的架构、语料和训练时间不同，报告没有给同一 10B 模型、同一数据顺序和相同算力预算下的集中式预训练对照。因此表 3 支持分布式训练得到有一定通用能力的模型，但不能从中精确量化 DiLoCo 相对常规数据并行损失了多少质量。（表 3）

## SFT、DPO、蒸馏与合并共同形成 Instruct

完成全球预训练后，团队进行了多项后训练搜索，而不是对 Base 只运行一次 SFT：

- **16 次 SFT 实验**：每次约 1B–3.3B 训练 token；报告称最成功配置使用 2.4B token、三个 epoch。
- **8 次 DPO 实验**：使用不同数据组合进行偏好优化。
- **16 次模型合并**：通过 MergeKit 在候选模型之间组合结果；EvolKit 用于生成数据，DistillKit 用于蒸馏。

语料包括新发布的 EvolKit-75k、Llama-405B-Logits、The-Tomb；通用指令数据 open-perfectblend-fixed、Orca AgentInstruct、AutoIF；ToolACE、Synthia coder、M2Lingual、NuminaMath-TIR 等专项数据，以及四套 Tulu 3 persona 数据。这里列的是候选后训练材料，不是每份都以同样权重进入最终模型的已知配方。（§3.5）

因为 tokenizer 与 Llama 3 系列兼容，团队可以使用 Llama-3.1-405B 的 logits 蒸馏。公开 logits 数据卡也确认用于 INTELLECT-1，但原文没有提供最终温度、蒸馏损失权重、DPO 的 beta 与参考策略、所有混合权重、最优模型选择规则及最终 merge 配置。因此不宜套一组通用 DPO/KL 公式后宣称还原了这次训练。

报告称 ChatML 模板不显式加 BOS 时起始损失约 15，换成 Llama 3.1 模板后约 1.1。这个比较同时改变模板与 BOS，不能把下降全部归因于单独增加 BOS。实际使用时仍需遵循官方模型卡的 BOS 要求；固定 Instruct tokenizer 模板会在第一条消息前加入 BOS，而 Base 模型卡建议对话使用者改用 Instruct。（§3.5；官方模型卡）

后训练后 MMLU 增加 12.39 个百分点，GSM8K 增加 30.48 个百分点，但 HellaSwag 下降 0.84。没有逐阶段消融，不能把这些变化单独归功于 DPO、蒸馏或模型合并。Instruct 的 IFEval 为 40.39，仍低于表中 LLaMA2-7B-chat 的 45.80；同样不能说在所有指令遵循比较中领先。（表 4）

后训练也意味着 Instruct 的知识来源和计算预算不只有那次 1T 预训练。表中的 1T 是预训练 token 标签，不包含所有候选 SFT、DPO、教师 logits 和模型合并搜索成本。报告没有证明这些后训练也在同样的全球动态集群上完成。

## 公开版本与可复现范围

本次没有下载约 20 GB 的模型权重，也没有运行 GPU 训练、推理或评测。实际检查了论文、历史源码、模型配置与 tokenizer 模板、权重索引、数据卡与文件清单。

| 材料 | 固定版本与检查范围 |
| --- | --- |
| PRIME 训练框架 | [`92fa6576202cdb2592f2ab4f3fc3c44a89ee426f`](https://github.com/PrimeIntellect-ai/prime-diloco/tree/92fa6576202cdb2592f2ab4f3fc3c44a89ee426f)：发布期快照，训练、数据、损失、调度、DiLoCo、通信与压缩关键路径 |
| Base 模型 | [`3b8d48b5ce11ee9526495f1db9eb1644518bfce0`](https://huggingface.co/PrimeIntellect/INTELLECT-1/tree/3b8d48b5ce11ee9526495f1db9eb1644518bfce0)：模型卡、配置、tokenizer 配置及索引 |
| Instruct 模型 | [`14d9716e61324759fffd57b91d13db19765ca1c0`](https://huggingface.co/PrimeIntellect/INTELLECT-1-Instruct/tree/14d9716e61324759fffd57b91d13db19765ca1c0)：相同范围，另查聊天模板 |
| FineWeb-Edu | [`14efaa24d7dff8a745bf4918e415878546542346`](https://huggingface.co/datasets/PrimeIntellect/fineweb-edu/tree/14efaa24d7dff8a745bf4918e415878546542346) |
| FineWeb | [`f4e7b14b9b451057807937545f66eec20985856d`](https://huggingface.co/datasets/PrimeIntellect/fineweb/tree/f4e7b14b9b451057807937545f66eec20985856d) |
| StackV1-popular | [`79b9bbe4d5860327a20d556fab19b2ddbfbcab1e`](https://huggingface.co/datasets/PrimeIntellect/StackV1-popular/tree/79b9bbe4d5860327a20d556fab19b2ddbfbcab1e) |
| DCLM parquet | [`817d6752765f6a41261085171dd546b104f60626`](https://huggingface.co/datasets/mlfoundations/dclm-baseline-1.0-parquet/tree/817d6752765f6a41261085171dd546b104f60626) |
| OpenWebMath | [`fde8ef8de2300f5e778f56261843dab89f230815`](https://huggingface.co/datasets/open-web-math/open-web-math/tree/fde8ef8de2300f5e778f56261843dab89f230815) |

数据版本是核查当日快照，不能自动视为 2024 年逐文件训练清单。五套预训练数据的 API 均显示未 gated，但这不把各自数据许可证统一变成模型的 Apache 2.0。EvolKit-75k 与 Llama-405B-Logits 的元数据和卡片也可访问；本次访问 The-Tomb 返回 401，未取得内容，不能将后训练资料描述成已全部下载核验。

源码保留 `uv.lock`，项目配置要求 PyTorch 2.4.1、Transformers 至少 4.44.2、Datasets 至少 3.0.0，并有 Gloo 子模块和需要 JIT 编译的 C++ 内核。README 的旧 clone 地址不能原样当作当前入口，Flash Attention、CUDA、编译工具链、锁文件与子模块也需要一起准备。

实际训练入口为 `src/zeroband/train.py`，通过 `torchrun` 启动、以 `@configs/10B/H100.toml` 或冷却 TOML 传配置；节点间还要设置 `GLOBAL_ADDR`、`GLOBAL_PORT`、`GLOBAL_RANK`、`GLOBAL_UNIQUE_ID` 等协调参数。这是根据代码整理的入口，不是本次已运行的复现实验。示例配置引用 `/data/datasets/...` 和检查点目录，必须另行准备数据分片及恢复状态，不能一条命令就还原 42 天训练。

公开材料仍不足以重建全部生产事件：没有在本次检查中取得逐节点在线时间、每次重试或回退、训练版本切换、全量历史评测输出和后训练最终组合配方。论文没有报告固定条件多随机种子重复，也没有在 10B 主实验中分别关闭量化、弹性恢复、max-z-loss 或拓扑优化的质量与效率消融。报告的分布式训练成功、计时观察和能力对照，各自对应不同证据范围。

## 结论适用的范围

INTELLECT-1 证明的是在八卡 H100 节点、有限互联网带宽与动态算力参与下，完成一次 10B、1T token 训练的可行性。它没有验证消费级 GPU 混用、任意恶意节点提交更新、无限节点扩展或完全不依赖协调服务的训练，也没有测出相对同配方集中式训练的端到端成本优势。

报告第 4 节讨论了开放协作与激励网络的潜力，那是作者对未来组织方式的推论；本次实验直接记录的是通信压缩、训练进度、节点变化、模型评测与资源效率。将这几个层次分开，才能看清哪些技术已经运行过，哪些仍需要后续对照和规模实验。

## 原始资料

- [INTELLECT-1 技术报告 v1](https://arxiv.org/pdf/2412.01152v1)
- [2024 年 11 月模型发布](https://www.primeintellect.ai/blog/intellect-1-release)
- [2024 年 10 月训练启动公告](https://www.primeintellect.ai/blog/intellect-1)
- [历史训练框架 prime-diloco](https://github.com/PrimeIntellect-ai/prime-diloco)
- [Base 模型](https://huggingface.co/PrimeIntellect/INTELLECT-1) · [Instruct 模型](https://huggingface.co/PrimeIntellect/INTELLECT-1-Instruct)

资料核对截至 2026 年 9 月 13 日。正文与附录已完整阅读，关键图表和发布期实现已核对；未运行模型、训练或付费 API。
