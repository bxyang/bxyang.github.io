---
title: "AbeT 精读：用随输入变化的温度识别陌生图像"
company: "scale-ai"
date: "2024-01-22"
dateLabel: "2024-01-22 · 本文按 2025-04 修订版"
kind: "论文"
description: "展开余弦分类头、学习温度与能量消融，核查分类、分割和检测实验，以及错分样本机制与公开代码的复现差异。"
readingStatus: "deep-read"
paperVersion: "arXiv:2401.12129v3，2025-04-14，22 页"
reviewed: "2026-09-13"
---

[← Scale AI](/companies/scale-ai) · [全部工作](/research)

# AbeT 精读：用随输入变化的温度识别陌生图像

只学过猫、狗等有限类别的分类器，遇到一张陌生纹理图时，仍会从已有类别里选一个答案。softmax 最大概率很高，也不意味着输入属于它学过的类别。AbeT 修改分类器的最后一部分：用余弦相似度产生类别分数，让网络为每个输入预测一个温度，再由调整后的分数计算分布外检测信号。

方法只用分布内数据训练，在 CIFAR 分类、街景分割和目标检测中给出实验。它也有明确的失败情况：当训练中的错分样本减少时，某些设置下检测能力会明显下降。论文最醒目的分类降幅来自不同数据集上的不同组合方案，不能当成单独使用 AbeT 的统一收益。

## 论文版本与作者关系

| 项目 | 信息 |
| --- | --- |
| 原文 | *Out-of-Distribution Detection & Applications With Ablated Learned Temperature Energy* |
| 作者与首页机构 | Will LeVine（Microsoft）、Benjamin Pikus（Advex AI）、Jacob Phillips（Andreessen Horowitz）、Berk Norman（Anduril）、Fernando Amat（Google）、Sean Hendryx（Scale AI） |
| 公司参与 | Sean Hendryx 以 Scale AI 署名参与的合作研究；并非全体作者来自 Scale |
| 首次公开 | 2024 年 1 月 22 日 |
| 阅读版本 | arXiv v3，2025 年 4 月 14 日，22 页，含附录 A—G |
| 论文首页标注 | NeurIPS 2024 的 Workshop on Bayesian Decision-making and Uncertainty |
| 本地文件 | `research/papers/scale-ai/abet.pdf` |

arXiv 作者条目将 Fernando 的姓名列为 Fernando Amat Gil，PDF 首页简写为 Fernando Amat。这里的 workshop 信息按所读 PDF 登记，不把它写成 NeurIPS 主会论文，也不将代码 README 提到的 ICML 投稿过程当作录用记录。[论文与版本历史](https://arxiv.org/abs/2401.12129v3)

## 任务是发现未知类别输入

论文将训练类别范围内的数据称为 ID（in-distribution），将类别不在该范围内的数据称为 OOD（out-of-distribution）。分类任务每张图得到一个陌生程度分数；分割任务每个像素得到一个分数；目标检测则为预测框计算分数。（§2、附录 E）

例如，分类器只训练识别十类物体，输入却是一张材料纹理。它仍可输出十类之一，但检测器应提示这个判断超出了已知类别范围。这是说明示例。实验主要考察语义类别不同的数据，不能据此认为已验证了所有光照变化、图像压缩、对抗攻击或真实上线漂移。

以最大 softmax 概率为依据的方法，比较的是已知类别之间的相对优势。Energy 方法使用 log-sum-exp 汇总类别分数，保留部分会被 softmax 归一化消除的信息；GODIN 则让温度随输入变化。AbeT 结合后二者，并从能量公式中删去外部的温度因子。（§2—3）

## 从图像到温度，再到检测分数

### 余弦分类头

记输入为 $x$，倒数第二层特征为 $h(x)\in\mathbb R^d$，第 $c$ 类的权重向量为 $w_c$，类别总数为 $C$。AbeT 使用：

$$
g_c(x)=\frac{w_c^\top h(x)}{\|w_c\|_2\,\|h(x)\|_2},
\qquad c=1,\ldots,C.
$$

与普通的 $w_c^\top h(x)+b_c$ 不同，它去掉偏置，并把特征和权重的长度归一化，类别分数主要反映方向的相似程度。理想公式中 $g_c\in[-1,1]$。代码在归一化分母中加了小量，避免零范数问题。（§2.3、附录 A.3）

### 每个输入一个温度

温度头与类别头读取同一份特征。它由线性层、BatchNorm 和 sigmoid 组成：

$$
T(x)=\sigma\!\left(\operatorname{BN}(a^\top h(x)+b)\right),
\qquad 0<T(x)<1.
$$

然后计算供分类训练使用的 logits 和概率：

$$
z_c(x)=\frac{g_c(x)}{T(x)},
\qquad
p(c\mid x)=\frac{\exp z_c(x)}{\sum_{j=1}^C\exp z_j(x)}.
$$

训练损失仍是正确类别 $y$ 的交叉熵 $\mathcal L=-\log p(y\mid x)$。温度头通过这条计算链与骨干共同更新，没有额外的“这张图是否 OOD”监督标签，也没有单独训练一个检测分类器。（附录 A.1）

对固定的 $g_c$，同一个正温度不会改变类别的 argmax；温度较小会放大类别差距。但模型在训练中同时改变特征与类别权重，不能据此声称换上温度头再训练后，所有分类预测都不变。

### 删除能量公式外面的温度

固定温度的能量分数通常写为：

$$
E_T(x)=-T\log\sum_{c=1}^C\exp\!\left(\frac{g_c(x)}T\right).
$$

把温度换成 $T(x)$ 后，若仍保留外部乘数，得到 $-T(x)\log\sum_c\exp z_c(x)$。AbeT 删除这个外部因子：

$$
S_{\rm AbeT}(x)=-\log\sum_{c=1}^C\exp z_c(x).
$$

论文把被删去的项称为 Forefront Temperature Constant。它相对类别求和是共同因子，但随输入变化，并不是跨样本的常数。因此删去它可能改变样本之间的排序，而不只是把所有分数乘同一个比例。（§3，式 1 及其后的 AbeT 定义、图 1）

一个自拟的两类计算例子可以说明这种差别：保持 $g=(0.8,0.2)$，只把温度从 0.5 改成 0.1。

| 温度 | 调整后 logits | AbeT 分数 | 保留外部温度的能量 |
| --- | --- | ---: | ---: |
| 0.5 | (1.6, 0.4) | 约 −1.863 | 约 −0.932 |
| 0.1 | (8, 2) | 约 −8.002 | 约 −0.800 |

AbeT 放大了小温度对应的大负分数，外部温度则会抵消这种变化。这里没有把两行当作真实 ID/OOD 样本，只演示公式的作用。实际温度能否区分未知输入，要由训练和实验验证。

按论文符号，分数越大通常越像 OOD，ID 分数往往更负。它不是概率，也不保证所有 OOD 分数都接近零。实现应使用稳定的 `logsumexp`；直接先 `exp` 再求和，在温度很小时可能溢出。

## 分类实验的设置与指标

| ID 数据与骨干 | 训练设置 | OOD 测试 |
| --- | --- | --- |
| CIFAR-10 / CIFAR-100，ResNet-20 | 50,000 张训练、10,000 张测试；200 epochs，batch 64 | Textures、SVHN、LSUN Crop、Places365 |
| ImageNet-1k，ResNetv2-101 | 40 epochs，batch 512 | 与 ImageNet 类别不重叠的 iNaturalist、SUN、Places365 子集，以及 Textures |
| ImageNet-1k，DenseNet-121 | 补充架构实验；ID top-1 为 72.51% | 同一组四种 OOD 来源 |

分类骨干从头训练。初始学习率 0.1；CIFAR 在第 100、150、180 epoch 后乘 0.1，ImageNet 在第 20、30 epoch 后乘 0.1，不用提前停止或挑选验证最优 checkpoint。公开分类代码使用 SGD、momentum 0.9、默认 weight decay $10^{-4}$。CIFAR 使用裁剪、水平翻转和 TrivialAugmentWide，ImageNet 使用 torchvision 风格增强。（附录 B.1、F.2.1；代码 `main.py`）

论文约定 CIFAR 的 SVHN 使用 26,032 张测试图，Textures 使用完整 5,640 张，LSUN Crop 和 Places365 各 10,000 张。ImageNet 的 iNaturalist、SUN、Places365 各取 10,000 张，类别选择清单见附录 F.1.1。仓库数据加载器与这些约定并非完全一致，后文会单列。

分类代码以 **ID 为正类**：固定接受 95% 的 ID 样本时，FPR@95 是仍被接受的 OOD 样本比例，越低越好。按本文负能量记号，阈值 $\tau$ 可写为：

$$
\Pr_{\rm ID}(S\le\tau)\ge0.95,
\qquad
\mathrm{FPR@95}=\Pr_{\rm OOD}(S\le\tau).
$$

实际代码使用相反符号的正 log-sum-exp，等价地让大分数代表 ID。AUROC 衡量跨阈值的区分能力，越高越好。表中的误差项来自**四个 OOD 数据集之间的标准差**，不是重复训练的标准误或置信区间。（附录 C.1；代码 `calc_tnr`、`calc_auroc`）

## 分类结果要区分单独使用与组合使用

下表摘取论文表 1，单位均为百分数。每格写“FPR@95 / AUROC”，分别越低、越高越好；为便于比较，这里只列均值。

| 方法 | CIFAR-10 | CIFAR-100 | ImageNet-1k |
| --- | ---: | ---: | ---: |
| 固定温度 Energy | 39.7 / 92.5 | 70.5 / 78.0 | 71.0 / 82.7 |
| GODIN | 26.8 / 94.2 | 47.0 / 90.7 | 52.7 / 83.9 |
| Energy + ASH | 20.0 / 95.4 | 37.6 / 89.6 | 16.7 / 96.5 |
| LINe | 14.71 / 96.99 | 35.67 / 88.67 | 20.7 / 95.03 |
| AbeT | 12.5 / 97.8 | 31.1 / 94.0 | 40.0 / 91.8 |
| AbeT + ReAct | 12.2 / 97.8 | 26.2 / 94.1 | 38.1 / 92.2 |
| AbeT + DICE | 11.6 / 97.9 | 31.3 / 94.3 | 30.7 / 93.2 |
| AbeT + ASH | 10.9 / 97.9 | 30.6 / 94.4 | 3.7 / 99.0 |

ReAct 对过大的特征激活做截断，DICE 按贡献筛选连接，ASH 对激活进行整形。这些组合改变了额外环节；AbeT 的温度消融与组合方法的收益不能混为一谈。

单独 AbeT 的 ImageNet FPR@95 为 40.0，明显高于 Energy + ASH 的 16.7。该任务达到 3.7 的是 **AbeT + ASH**。此外，表中 LINe 的 CIFAR 结果使用 DenseNet，ImageNet 的 LINe、Energy + ReAct、Energy + DICE 使用 ResNet-50，是作者引用的其他架构结果；不能把所有行描述为同一骨干的严格受控比较。（表 1 脚注）

摘要的 43.43% 可以从表 1 展示的最优均值重算出来：

| 数据集 | 采用的比较 | 相对 FPR 降幅 |
| --- | --- | ---: |
| CIFAR-10 | LINe 14.71 → AbeT + ASH 10.9 | 25.90% |
| CIFAR-100 | LINe 35.67 → AbeT + ReAct 26.2 | 26.55% |
| ImageNet | Energy + ASH 16.7 → AbeT + ASH 3.7 | 77.84% |

每行计算 $(\mathrm{旧值}-\mathrm{新值})/\mathrm{旧值}$，三行再等权平均得到约 43.43%。这是基于公开表格对摘要数字的复算，不是三个任务都减少 43.43 个百分点，也不是同一种独立 AbeT 设置的平均收益。

## 消融与错分样本的机制证据

### 外部温度因子的消融

论文表 8 保留相同方法框架，对比删与不删外部温度：

| ID 数据 | 保留外部温度 FPR@95 | 删除后 FPR@95 | 相对下降 |
| --- | ---: | ---: | ---: |
| CIFAR-10 | 17.56 | 12.51 | 28.76% |
| CIFAR-100 | 76.08 | 31.19 | 59.00% |
| ImageNet | 57.75 | 43.42 | 24.81% |

注意表 8 的 ImageNet AbeT 为 **43.42 / 91.89**，表 1、表 5 和表 7 则是 **40.00 / 91.80**。原文没有解释二者差别，本页分别按各自实验表引用，不用 40.00 替换消融表的 43.42 来重新计算降幅。

余弦头也不是可忽略的实现细节。表 9 在 CIFAR-10 + Textures 上，把内积头换成余弦头，FPR 从 42.60 降到 15.31，AUROC 从 91.97 升到 97.17；另外三种 OOD 数据上方向相同。它说明训练后的分类头选择与结果相关，不能把整套提升归于删除一个乘数。

输入梯度扰动没有继续改善整体结果：附录 C.2.4 的 ImageNet 平均 FPR 为 41.83，较无扰动的 40.00 更高；AUROC 为 91.34。图 4 中，Places365 的小扰动有局部收益，另三组总体变差。AbeT 主方法因此不需要测试时反向传播。

### 错分的 ID 样本与 OOD 的关系

作者提出：训练中的错分 ID 样本让网络学到降低置信度的温度变化，部分 OOD 样本又位于相近的特征区域，因此在没有显式 OOD 训练数据时，也可能出现有用的检测信号。这是机制假设，论文用以下观测支持它。（附录 D、图 5）

首先，在未做 t-SNE 降维的特征空间里，为每个 Places365 OOD 样本找最近的 CIFAR-10 ID 测试样本。这批邻居的分类准确率为 76.42%，低于全部 ID 样本的 91.89%。其次，错分 ID 样本的 AbeT 分数均值更接近零：论文给出的 99% 置信区间为 $-20.88\pm0.57$，正确样本为 $-33.29\pm0.93$。

这些统计表明相关性，不证明陌生输入必然接近错误样本，也不证明温度已经学习了一个真实的数据密度函数。图 5 的 t-SNE 展示用于辅助理解，不能把二维图上的距离直接当成原始特征空间的距离。

### 方法失效的实验

表 2 将 CIFAR-10 测试样本拆成正确与错误两组。AbeT 区分“正确 ID 与 OOD”的 FPR 为 11.02，区分“错分 ID 与 OOD”的 FPR 为 38.78。也就是说，它更容易把模型本来就难以识别的 ID 样本与 OOD 混淆；其他几种被测方法也有类似现象。

更明显的反例来自 MNIST 训练、Textures 测试：

| epoch | 训练准确率 | OOD AUROC |
| --- | ---: | ---: |
| 1 | 48.56% | 37.32% |
| 3 | 88.25% | 95.50% |
| 6 | 95.95% | 79.63% |
| 7 | 97.28% | 38.73% |
| 8 | 98.20% | 7.89% |

分类训练继续改善，OOD 排序却恶化到接近反向。该实验支持作者关于“错分训练样本过少时可能失效”的解释，但仍不是控制所有其他训练变化后的因果证明。（附录 A.4，表 3）

## 语义分割：把同一结构放到每个像素

分割使用 DeepLabv3+、WideResNet38 骨干，在每个像素的最后特征上放置余弦类别头和温度头。先在 Mapillary 上预训练，再在 Cityscapes 上微调；两者都被视作 ID 数据。因此，原摘要的“不需要多阶段训练”不能理解成整篇所有实验只有一个训练阶段：这里有明确的预训练和微调，只是没有额外的 OOD 专项训练阶段。（附录 E.1、F.2.2）

Mapillary 阶段最多 175 epochs、初始学习率 0.02，达到约 0.5 mIoU 后转 Cityscapes；后者最多 175 epochs、初始学习率 0.001，以约 0.8 的验证 mIoU 作为完成条件。使用类别均衡采样、边界相关损失、同步 BatchNorm 和半精度，报告 batch 8、8 张 T4。这里不把 batch 8 擅自扩成每卡 8，也不将分割的选模方式混同于分类的固定末轮 checkpoint。

下表来自表 11，FPR 越低越好，其余指标越高越好。分割以 **OOD 像素为正类**，FPR@95 表示检出约 95% 异常像素时，正常像素被报为异常的比例；不能套用分类的 ID 正类解释。

| 方法 | ID mIoU | LostAndFound FPR / AUPRC / AUROC | RoadAnomaly FPR / AUPRC / AUROC |
| --- | ---: | ---: | ---: |
| Entropy | 81.39 | 35.47 / 46.01 / 93.42 | 65.26 / 16.89 / 68.24 |
| MSP | 81.39 | 31.80 / 27.49 / 91.98 | 56.28 / 15.24 / 65.96 |
| Max Logit | 81.39 | 15.56 / 65.45 / 94.52 | 70.48 / 18.98 / 72.78 |
| AbeT | 80.56 | 3.42 / 68.35 / 99.09 | 53.50 / 31.12 / 81.55 |
| PEBAL，额外使用 OOD 数据 | 80.00 | 0.81 / 78.29 / 99.76 | 44.58 / 45.10 / 87.63 |

AbeT 的 ID mIoU 较上列普通基线低 0.83 点。PEBAL 的 OOD 指标更高，但它使用额外 OOD 数据，作者将其作为背景参照，未放进同训练条件的竞争比较。不能省去这个条件后声称 AbeT 超过全部方法。

摘要的分割 FPR 平均下降 41.48%，来自 LostAndFound 的 15.56→3.42 与 RoadAnomaly 的 56.28→53.50，分别相对下降 78.02% 和 4.94% 后取平均。AUPRC 平均增加 34.20%，对应 65.45→68.35 与 18.98→31.12 的相对变化。不同数据和指标选用的最优基线不同，并非同一个基线模型在所有指标上都提高这么多。

评测通过 100 个直方图区间近似汇总像素分数，以减少内存消耗。公开代码将 AbeT 变换为 $1-\operatorname{LSE}(z)/C$；这是一种用于分箱的分数缩放，并不从数学上保证任意 logits 都落在 $[0,1]$。复现实验应检查溢出、超范围值、忽略标签和分箱细节。RoadAnomaly 只有 60 张图，像素很多不等于独立场景很多。（附录 F.1.2、F.2.2）

## 目标检测：为候选框计算陌生程度

检测模型为 Faster R-CNN、ResNet-50，骨干在 ImageNet 上预训练，再用 PASCAL VOC 的已知类别训练；OOD 来自去除类别重叠后的 COCO 数据。余弦头和温度头接在框分类特征后，逐框计算分数。公开配置使用 batch 4、学习率 0.02，在 12,000 和 16,000 steps 衰减，最多 18,000 steps；论文报告单张 V100，并保留验证损失最优模型。（附录 E.2、F.2.3）

| 方法 | ID AP ↑ | FPR@95 ↓ | AUROC ↑ | AUPRC ↑ |
| --- | ---: | ---: | ---: | ---: |
| 原始基线 | 40.2 | 91.47 | 60.65 | 88.69 |
| VOS | 40.5 | 88.67 | 60.46 | 88.49 |
| AbeT | 41.2 | 88.81 | 65.34 | 91.76 |

这是表 12 的原始数字。相对 VOS，AbeT 的 AUROC 增加 4.88 个百分点、ID AP 增加 0.7 点，但 FPR 高 0.14 点，未在每项指标上都更好。分类式检测脚本以 ID 框为正类，AUPRC 也是 ID 正类口径；它与上一节异常像素的 AUPRC 不宜直接比较。

摘要写“检测 AUROC 增加 5.15%”，无法由表 12 的基线或 VOS 数字直接得到：相对原始基线是 4.69 个百分点、约 7.73% 相对增长；相对 VOS 是 4.88 个百分点、约 8.07%。本页保留可核对的表格，未补猜摘要采用了哪个未列出的版本。

代码的 `voc_coco_eval.py` 对存储的框 logits 排除最后一列背景类，再计算分数。因此复现不能把背景 logit 一并纳入求和，也不能只凭该表断言已经完成开放世界的新类别识别：实验评估的是对未知框的检测信号。

## 固定代码版本后的复现检查

本次检查论文直接链接的[官方代码快照](https://github.com/anonymousoodauthor/abet/tree/5d0ffbf0c7e3c9062534d4243efff7c23661c41a)，提交为 `5d0ffbf0c7e3c9062534d4243efff7c23661c41a`。根目录提供分类实现，`segmentation` 提供训练与像素评测，`object-detection` 提供 detectron2 路径。README 链接了训练权重，但本次未下载大模型权重或执行推理。

分类环境文件固定 Python 3.8、PyTorch 1.11.0、torchvision 0.12.0、NumPy 1.23.3。以下是根据公开入口整理的 CIFAR-10 命令，需要先准备环境、数据和对应权重；本次没有运行这些训练或评测命令：

```bash
# 训练学习温度的模型；默认不是 baseline
python main.py --architecture resnet20 --in-dataset CIFAR10 \
  --out-dataset SVHN --save-model-path models/cifar10_learned_temperature.pth \
  --epochs 200 --batch-size 64 --inference-mode ablated_energy

# 只执行已训练模型的评测
python main.py --architecture resnet20 --in-dataset CIFAR10 \
  --out-dataset SVHN --load-model-path models/cifar10_learned_temperature.pth \
  --no-train --inference-mode ablated_energy
```

运行前应明确处理这些具体差异：

- **数据拆分**：`main.py` 构造 SVHN 与 DTD 时均未传 `split`。torchvision 0.12 两者默认都是 `train`；前者不对应论文的完整 SVHN test，后者不对应完整 5,640 张纹理。若重建论文设置，应显式选择 SVHN test，并按同一 partition 合并 DTD 的 train、val、test，同时记录修改。[SVHN 参数](https://docs.pytorch.org/vision/0.12/generated/torchvision.datasets.SVHN.html)、[DTD 参数](https://docs.pytorch.org/vision/0.12/generated/torchvision.datasets.DTD.html)
- **ImageNet 参数与路径**：解析器使用 `Imagenet`，代码目录为 `data/Imagenet/ILSVRC/Data/CLS-LOC/...`，README 则写 `ImageNet`。默认仍是 200 epochs、batch 64；要遵循论文，需要显式传 `--epochs 40 --batch-size 512`，并确认验证集目录适合 `ImageFolder`。
- **分数方向与稳定性**：分类实现返回正 log-sum-exp，再以 ID 为正类评分，与正文负能量符号相反但可保持等价。其直接 `log(exp(logits).sum())` 可改写成数学等价的稳定 `logsumexp`，变更应记录，不能说原脚本已做了数值稳定处理。
- **基线分支**：`BaselineClassificationNet` 给 `InnerClassificationHead` 多传了一个位置参数，与构造函数签名不符。静态检查即可识别该路径的问题；不能只运行 AbeT 后就声称全部对照均可直接复现。
- **温度参数量**：附录 A.5 称温度只增加 64 个参数；代码的 64 维线性层含偏置，再加 BatchNorm 的两个可学习参数，温度头应为 $64+1+2=67$ 个可学习参数，另有运行统计量。数量仍小，但不是代码支持的 64。
- **分割和检测入口**：分割 README 的 `--temperature_model leaned` 有拼写问题，应与实际 `learned` 分支一致；检测需要 VOC/COCO 的处理后标注 JSON、配置和权重路径，不能只下载整套 COCO 后就视为重建了 OOD 子集。

论文附录还存在未解释的表格差异：表 7 的 ImageNet MSP 平均 FPR 为 76.96，表 1 为 63.9；表 6 的 ReAct 一格直接印成 561.75，超出百分率范围。这里没有自行猜改原数，也没有把这些条目作为方法优劣的依据。需要精确对齐各表时，应先取得作者的逐样本分数、checkpoint 和运行配置。

本次核查覆盖完整 22 页、方法公式、关键图表和三种任务的公开代码入口，另外重算了文中百分比与参数量。没有运行训练、推理或重新生成论文指标，以上属于原文与代码静态核对，尚未复现。

## 证据覆盖的范围

AbeT 说明，余弦分类头、输入相关温度和能量分数可以在已测试的视觉任务中形成 OOD 信号。模型仍依赖训练形成的特征结构，错分 ID 与陌生输入之间的关系也有局限；MNIST 反例表明分类训练更充分并不保证检测更好。

论文未报告语言模型或视觉语言模型上的同等结果，这些被列为后续方向。因此将它收录在 Scale 研究时间线时，应把它理解为合作开展的视觉模型可靠性研究，不把该方法描述成已经验证的大模型数据筛选产品。

## 原始资料

- [AbeT v3 全文与附录](https://arxiv.org/pdf/2401.12129v3)
- [arXiv 版本记录](https://arxiv.org/abs/2401.12129)
- [官方代码固定版本](https://github.com/anonymousoodauthor/abet/tree/5d0ffbf0c7e3c9062534d4243efff7c23661c41a)
- [分类实现](https://github.com/anonymousoodauthor/abet/blob/5d0ffbf0c7e3c9062534d4243efff7c23661c41a/main.py)
- [分割说明](https://github.com/anonymousoodauthor/abet/blob/5d0ffbf0c7e3c9062534d4243efff7c23661c41a/segmentation/README.md)
- [检测说明](https://github.com/anonymousoodauthor/abet/blob/5d0ffbf0c7e3c9062534d4243efff7c23661c41a/object-detection/README.md)

资料核对截至 2026 年 9 月 13 日。
