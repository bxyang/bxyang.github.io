


# 因果推断简介： Yule-simpson's Paradox
https://cosx.org/2012/03/causality1-simpson-paradox/

因果推断：casual inference.
高斯研究天文学的时候提出最大似然和最小二乘的思想。Pearson提出了“相关系数” (correlation coefficient).因此后世的研究，大多是关于“相关关系”的理论。关于“因果关系”的统计理论非常稀少。

Yule—Simpson's Paradox:
$$\frac{a}{b} < \frac{c}{d}, \frac{a'}{b'} < \frac{c'}{d'}, \frac{a+a'}{b+b'} > \frac{c+c'}{d+d'}$$


$X$和$Y$在边缘上正相关，但是给定另外一个变量Z后，在Z的每一个水平上，$X$和$Y$都负相关。

UC Berkeley 的著名统计学家 Peter Bickel 教授 1975 年在 Science 上发表文章，报告了 Berkeley 研究生院男女录取率的差异。他发现，总体上，男性的录取率高于女性，然而按照专业分层后，女性的录取率却高于男性 (Bickel 等 1975)。在流行病学的教科书 (如 Rothman 等 2008) 中，都会讲到“混杂偏倚”（confounding bias），其实就是 Yule-Simpson’s Paradox，书中列举了很多流行病学的实际例子。


# 因果推断简介：Rubin Causal Model(RCM)和随机化试验
个体的因果作用不可识别，但是可以识别总体的平均因果作用(Average Casual Effect; ACE)
$$ACE(Z\rightarrow Y) = E\{Y_i(1) – Y_i(0)\}$$

随机化试验对于平均因果作用的识别起着至关重要的作用。

# 因果推断简介：观察性研究，可忽略性和倾向得分

https://cosx.org/2012/04/causality4-observational-study-ignorability-and-propensity-score/

有人提到了哲学（史）上的休谟问题（我的转述）：人类是否能从有限的经验中得到因果律？这的确是一个问题，这个问题最后促使德国哲学家康德为调和英国经验派（休谟）和大陆理性派（莱布尼兹 - 沃尔夫）而写了巨著《纯粹理性批判》。其实，如果一个人是绝对的怀疑论者（如休谟），他可能怀疑一切，甚至包括因果律，所以，康德的理论也不能完全 “解决” 休谟问题。怀疑论者是无法反驳的，他们的问题也是无法回答的。他们存在的价值是为现行一切理论起到警示作用。一般来说，统计学家不会从过度哲学的角度谈论问题。从前面的说明中可以看出，统计中所谓的 “因果” 是 “某种” 意义的 “因果”，即统计学只讨论 “原因的结果”，而不讨论 “结果的原因”。前者是可以用数据证明或者证伪的；后者是属于科学研究所探索的。用科学哲学家卡尔 · 波普的话来说，科学知识的积累是 “猜想与反驳” 的过程：“猜想”结果的原因，再 “证伪” 原因的结果；如此循环即科学。

# 关于因果性的资料：
## 因果推断简介：
https://cosx.org/2012/03/causality1-simpson-paradox/

https://cosx.org/2012/03/causality2-rcm

https://cosx.org/2012/03/causality3-fisher-and-neyman/

https://cosx.org/2012/04/causality4-observational-study-ignorability-and-propensity-score/

https://cosx.org/2012/10/causality5-causal-diagram

https://cosx.org/2013/08/causality6-instrumental-variable

https://cosx.org/2013/09/causality7-lord-paradox

https://cosx.org/2013/09/casuality8-smoke-and-lung-cancer

## 图灵奖得主Judea Pearl的技术报告：传统机器学习尚处于因果层级底层，达成完备AI的7个工具
中文翻译版：https://zhuanlan.zhihu.com/p/39615988

英文：http://link.zhihu.com/?target=http%3A//ftp.cs.ucla.edu/pub/stat_ser/r481.pdf

## 因果分析方法简介
https://www.jiqizhixin.com/articles/2016-11-01-3
