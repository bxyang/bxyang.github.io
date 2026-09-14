---
title: "Archipelago：APEX-Agents 的环境、执行器与评分链"
company: "mercor"
date: "2026-01-20"
dateLabel: "2026-01-20"
kind: "开源工具"
description: "拆解专业任务从环境快照、MCP 工具调用到产物评分的运行流程，并区分公开示例与论文实验配置。"
reviewed: "2026-09-12"
---

[← Mercor](/companies/mercor) · [全部工作](/research) · [APEX-Agents 论文介绍](/companies/mercor/apex-agents)

# Archipelago：APEX-Agents 的环境、执行器与评分链

Archipelago 是 Mercor 随 APEX-Agents 开放的执行与评测基础设施。它把项目文件装进环境，让 agent 通过统一的工具接口完成任务，再比较执行前后的状态、找到指定交付物并评分。论文中的 480 道任务是基准内容，Archipelago 则负责运行这些内容；二者对应同一篇 *APEX–Agents* 论文，并非两篇独立论文。本页介绍基础设施，论文结果与数据制作见 [APEX-Agents 论文介绍](/companies/mercor/apex-agents)。

| 项目 | 信息 |
| --- | --- |
| 发布关系 | 2026 年 1 月 20 日随 APEX-Agents 首次公开 |
| 公司参与 | Mercor 开发和开放；论文附录 A 描述系统构成 |
| 对应论文 | [APEX–Agents，阅读版本 v3，2026 年 2 月 23 日](https://arxiv.org/abs/2601.14242v3) |
| 核对代码 | [固定提交 bcacc2d1e99aa917bbe7f6f663c1551dc6ec7400](https://github.com/Mercor-Intelligence/archipelago/tree/bcacc2d1e99aa917bbe7f6f663c1551dc6ec7400)，2026 年 9 月 12 日 |
| 代码许可 | Apache 2.0；数据访问和使用另按数据卡声明 |

## 三个组件沿着任务顺序连接

**Environment 管理工作状态。** 环境以容器运行，通过 Model Context Protocol（MCP，模型上下文协议）网关暴露应用工具。文件与应用数据分别放在 `/filesystem` 和 `/.apps_data`。任务开始时填入初始资料，运行结束后导出快照。文件系统操作、表格读取、文档编辑等由各 MCP server 提供，环境网关统一转发请求。[论文附录 A、官方 README]

**Agents runner 执行模型循环。** 它获取模型和 agent 配置，准备环境，连接工具网关，执行所选 agent 实现，并保存状态和轨迹。注册表允许替换执行策略；APEX-Agents 论文使用 ReAct toolbelt，交替推理与操作，按需发现和添加工具。

**Grading 检查最终产物。** 它比较初始与最终状态，定位新增、修改等变化，提取文件内容和必要的视觉材料，然后按各项 verifier 的要求评判。这个分工允许研究者在相同环境中更换模型，或在相同产物上检查评分配置；它本身不保证所有不同配置的分数可直接比较。[官方系统说明](https://github.com/Mercor-Intelligence/archipelago/blob/bcacc2d1e99aa917bbe7f6f663c1551dc6ec7400/README.md)

以一个修改财务模型的任务为例：环境提供工作簿和邮件说明；agent 找到模型、读取工作表、计算并写回指定单元格；评分器从最终快照定位修改后的工作簿并核对条件。模型最后说“已完成”不替代文件中的修改，评分器也不能只根据这句话判断任务成功。

## 环境状态与工具配置

官方环境 API 包括以下入口。它们属于执行基础设施接口，并不是要求语言模型直接调用的用户工作流。

| 接口 | 作用 |
| --- | --- |
| `/health` | 检查环境服务是否就绪 |
| `/apps` | 装载或更新 MCP server 配置 |
| `/mcp/` | 为 agent 暴露统一工具接口 |
| `/data/populate` | 向环境填入文件及应用数据 |
| `/data/snapshot` | 导出当前状态快照 |
| `/data/snapshot/s3` | 将快照上传对象存储并返回地址 |

当前 Hugging Face 示例先下载世界压缩包，再把该任务独有的输入文件覆盖到对应目录。这一顺序让同一世界中的多个任务复用共同资料，同时保留题目自己的输入。重复运行应从同一初始状态开始，不能让前一次生成的表格或答案进入下一次的环境。[示例 `main.py`](https://github.com/Mercor-Intelligence/archipelago/blob/bcacc2d1e99aa917bbe7f6f663c1551dc6ec7400/examples/hugging_face_task/main.py)

示例默认配置九种常规应用：日历、聊天、代码、表格、文件系统、邮件、PDF、演示文稿和文档。论文两个投行世界还使用额外金融数据应用，因此“九种服务已启动”并不等于所有 480 道题的额外依赖都已经就绪。

容器与快照提供隔离和重置机制；本文没有执行安全测试，也不把这两个机制等同于已证明的完整安全边界。

## ReAct toolbelt 的结束条件和上下文处理

与一次性给出所有工具不同，toolbelt 先暴露发现、查看和管理工具的元工具，模型按需要将具体工具加入当前集合；另有任务规划工具管理待办。论文的执行策略在上下文达到窗口的 70% 时压缩较早的内容，保留最近十条消息。[论文附录 D]

固定版本的 `resum.py` 中可核对到 `TRIGGER_FRACTION = 0.70` 与 `KEEP_RECENT_MESSAGES = 10`。主循环必须接收到明确的最终提交才能进入完成状态；步数耗尽会失败，墙钟超时另有错误状态。当前代码还检查未完成的待办，避免在待办仍开放时接受最终提交。这些是所读代码版本的行为，不能不经核对地回填成二月实验的全部实现细节。[ReAct 源码](https://github.com/Mercor-Intelligence/archipelago/tree/bcacc2d1e99aa917bbe7f6f663c1551dc6ec7400/agents/runner/agents/react_toolbelt_agent)

模型一次调用可以使用多个工具，因此“步骤数”和“工具调用数”不是同一个预算。论文每题上限是 250 步，累计 token 则会多次包含重发的历史，不能只根据最终答案长度估算运行资源。

## 示例分数与论文完整通过率

公开框架支持多种评分方法。当前 HF 示例在 `scoring_config.json` 中选择 `template`，其逻辑是各 verifier 分数的算术平均；没有结果时返回 0，存在评分错误时抛出异常。假设四项二元条件满足三项，示例分数是 0.75；APEX-Agents 论文的完整通过指示量是 0，因为还有一个必要条件没有满足。[评分实现](https://github.com/Mercor-Intelligence/archipelago/blob/bcacc2d1e99aa917bbe7f6f663c1551dc6ec7400/grading/runner/scoring_methods/template/main.py)

因此复现时至少需要保留三个层次：每项评分、每次完整通过与否、每题八次的汇总。论文 Pass@1 是每题八次的完整通过比例再按题平均，不能直接平均示例的部分分数。更多推导和例子见 [论文页的评分部分](/companies/mercor/apex-agents)。

当前示例只对 `status == completed` 的轨迹继续评分，失败或错误状态会跳过。论文把步数耗尽计作失败；若自行收集结果时只统计有 `grades.json` 的目录，就会漏掉一部分失败运行。批量实验需要保存所有尝试的状态，并为评分错误单独记录重试或未决原因，不能悄悄缩小分母。

## 公开示例不等于论文的固定实验配方

| 配置 | 论文 v3 | 核对的 HF 示例 |
| --- | --- | --- |
| 模型 | 八个参评模型，见论文表 9 | `vertex_ai/gemini-3.1-pro-preview` |
| 最大步骤 | 250 | `agent_config.json` 指定 50 |
| 墙钟限制 | 主文主要报告步骤上限 | 示例 timeout 为 3,600 秒 |
| judge | Gemini 3 Flash，Low | `vertex_ai/gemini-2.5-flash`，额外参数 null |
| 重复次数 | 每题八次 | 单题执行入口 |
| 系统提示 | 附录 D.2 | 示例另构造一份提示 |
| 数据快照 | 论文实验版本 | 下载调用未指定 `revision` |

这张表记录的是不同时间点的配置，不证明较新代码有缺陷。它说明运行仓库默认命令得到的是当前示例结果，不能未经调整就标作论文复现。

项目当前要求 Docker、Python 3.13、uv，以及对应模型和解析服务的访问配置。Hugging Face 数据目前需要登录并同意访问条件。本文未取得该 gated 数据、没有批量读取题目文件，也没有运行付费评测；核查限于论文、公开数据卡和源码。

获得数据权限并完成配置后，官方单题入口为：

```bash
cd archipelago/examples/hugging_face_task
./run.sh task_9ba58a6197114140877a1df1754d2993
```

这个默认示例要求修改 BBDC/TVPG 并购模型。运行产物放在 `output/<task_id>/`，包括 `trajectory.json`、`final_snapshot.zip`、各项评分和实际使用的配置。为了保存八次独立实验，应给运行产物另外分配唯一目录或 run ID。脚本启动时会停止并清理该 Compose 环境的卷，因此应使用专门的实验部署。[官方示例说明与代码](https://github.com/Mercor-Intelligence/archipelago/tree/bcacc2d1e99aa917bbe7f6f663c1551dc6ec7400/examples/hugging_face_task)

完整复现还需要固定数据版本、恢复论文参数、准备全部应用、明确错误重试策略，并用所有运行结果重算指标与置信区间。框架名和模型名相同，只覆盖了这些条件中的一部分。

## 来源与核查范围

本页是同一论文的基础设施配套说明，不另计一篇论文介绍。已核对论文附录 A、D，固定代码的环境和组件说明、HF 示例、ReAct 主循环与摘要常量、示例评分配置及函数。尚未实际启动整套环境或验证榜单结果。

- [APEX-Agents 论文 v3](https://arxiv.org/pdf/2601.14242v3)
- [Archipelago 固定提交](https://github.com/Mercor-Intelligence/archipelago/tree/bcacc2d1e99aa917bbe7f6f663c1551dc6ec7400)
- [官方数据与访问条件](https://huggingface.co/datasets/mercor/apex-agents)
- [APEX-Agents 论文介绍](/companies/mercor/apex-agents)
