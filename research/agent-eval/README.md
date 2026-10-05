# Agent Eval 周报维护

`resources.json` 是人工核查后的资料目录，`scripts/render_agent_eval.py` 生成站点入口与年度周列表。不要直接编辑生成页。

## 每周流程

1. 搜索上一完整周的新内容，并回看近一个月以补充迟收录的资料。先读已有 URL，避免重复。
2. 覆盖公司工程博客、原作者博客、官方基准发布、工具方案、访谈及活动主办方文字整理。优先检索 Anthropic、OpenAI、AWS、Google Cloud、Microsoft、NVIDIA、Salesforce、IBM Research、Hugging Face、Scale、Cursor、Sierra、LangChain、Langfuse、Braintrust、Arize、MLflow、LangWatch、Galileo、Confident AI、Patronus，以及 Hamel Husain、Shreya Shankar 等从业者。补搜中文公司技术团队的一手来源；社区托管域名不等于公司官方署名。
3. 阅读原页面，核实日期、机构、内容相关性和实际方法。网页正文、明确的 Published 标签和 Article 的 datePublished 可作为证据；不要用搜索引擎抓取日、网页构建日、dateModified 或 URL 中的日期替代首发日期。存在差异时填写 note。
4. 每条写一段简洁中性中文提要。分清 Agent 评测、单轮模型评测、训练方法和泛可观测性。只有与 Agent 评测有明确联系的内容才进入周列表。
5. 保留原文链接和日期证据。访谈不假装听过，只有活动简介时标为活动介绍；文字整理注明出处。发布日期不明的资料暂不归周。老文实质更新另记更新，不把它变成新文章。使用 ISO 周、周一至周日，并由脚本计算。
6. 更新 updated，执行 `python3 scripts/render_agent_eval.py`，构建站点并检查新增链接和日期。只提交本模块变化，push 后检查 GitHub Pages 工作流及线上页面。
7. 本地目录不是 Git 仓库。发布仓库为 git@github.com:bxyang/bxyang.github.io.git，master 分支。使用干净的独立 checkout，先 pull --ff-only，确认远端已有变更，再复制本次明确修改的文件；临时 checkout 不存在时重新 clone。不可覆盖用户的其他变更。

## 首次检索：2026-09-17

检索范围为 2026-01-01 至 2026-09-17。通过站点定向搜索、官方博客目录和原页面交叉核查，整理首轮资料；不宣称全网穷尽。原始发现记录及抓取文本保留在本地 research/agent-eval-2026，不随网站发布。

主要检查发现：

- Latent Space 的 Codex Max 访谈首发 2025-12-26、John Yang 的 Code Evals 访谈首发 2025-12-31；搜索结果显示的 2026 更新时间不用于本年归档。
- Galileo 的 ai-agent-evaluation 与 evaluating-ai-agentic-systems、Confident AI 的 llm-agent-evaluation-complete-guide 与 definitive-ai-agent-evaluation-guide 均有 2025 年首发、2026 年修改的情况，未纳入新发布周列表。
- Langfuse 的 steal-our-eval-setup URL 含 07-16，正文标 07-22；采用正文日期。
- Scale Labs 新站外层网页元数据包含 09-17 构建日期，但文章正文与内部 Article 对象提供原始首发日期；采用文章日期。
- Confident AI 的 human-in-the-loop 文章正文显示 06-15，article:published_time 为 06-13，modified_time 为 06-15；采用首发 06-13 并公开说明。
- Google Cloud 的 evaluate-agent-performance 页面存在 07-10 与按时区显示 07-11 的差异，同属 W28；按 datePublished 07-10 收录并说明。
- 纯论文、模型排行榜、转载、无公司关系的云社区用户帖子、泛产品发布没有机械计入。暂未核实到足够明确的中文公司官方技术文章，后续继续扩展，不用社区文章冒充厂商实践。

网页首发证据能证明归档日期，不能证明整篇现有正文在首发日就已完全相同。列表概述的是检索时可读的版本。

## 每周检索：2026-09-30（9 月 28 日触发）

本轮覆盖上一完整周 2026-09-21—09-27（W39），并回查 08-28—09-27。新增 8 条：W39 四条，补漏 W38 三条、W36 一条。检索覆盖主要模型公司、云厂商、评测工具团队、研究者与中文厂商来源；这是可核实资料的增补，不代表全网穷尽。

- LangChain Jev 集成正文日期为 09-21，不采用转载中的 09-22。与已有 09-20 实验博客分开，前者介绍产品接入，后者报告小规模实验。
- Arize 两篇文章正文仅显示月份，通过官方 WordPress REST API 的 date 确认：远程评测教程 09-24，失败发现方案 09-17。后者搜索结果的相对日期不用于归周。
- Braintrust 工作坊问答依据已发布文字收录，未观看视频。IBM Research 文章核实了组织署名，非一般社区用户投稿。
- Braintrust 09-21 的 Jev 实验比较 LLM-AggreFact 与 JudgeBench 的单轮判断，未作为端到端 Agent 评测新增。09-24 Nitro 主要是查询基础设施，未单列。
- Arize 月度更新等候选没有取得明确日级首发证据，暂不归周。Google Cloud 09-29 的沙箱文章晚于本轮目标周，留待下一轮。旧文的九月更新不按新发布处理。

## 每周检索：2026-10-05

覆盖上一完整周 2026-09-28—10-04（W40），回查 09-05—10-04。新增 9 条：W40 七条，补漏 W39、W38 各一条，累计 115 条。不宣称全网穷尽。

- 核查 Anthropic、Google Cloud、NVIDIA、LangChain、Multiverse Computing、Arize 与从业者一手正文，并检索主要模型公司、云厂商、评测工具及中文技术团队来源。
- Arize 三篇正文仅显示月份，采用官方 WordPress REST API 的 date，并公开说明。Hamel 与 Shreya 问答首发 09-19、修改 09-21，归入 W38，未观看其中引用的视频。
- Google Cloud 数据衡量沙箱启动效率；LangChain 是线上 A/B 实验；Arize 缓存比较同时改变模型与服务商，费用为估算。提要保留测量范围。
- Anthropic 原始方法与 Arize 工程接入分别收录；Multiverse Computing 已核实组织署名，收录博客而非单独增加论文。
- 持续更新的 Arize Agent Evaluation 指南、旧 AWS Agent EvalKit 文章和泛可观测性更新未作为当周新资料。未核实到足够明确的新增中文公司文章，未用社区转载替代。
