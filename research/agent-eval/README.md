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
