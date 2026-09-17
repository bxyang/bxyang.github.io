#!/usr/bin/env python3
"""Render the Agent Eval resource index from reviewed, dated source records."""
import json
from collections import defaultdict
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / 'research/agent-eval/resources.json'


def render():
    catalog = json.loads(CATALOG.read_text())
    cutoff = date.fromisoformat(catalog['updated'])
    since = date.fromisoformat(catalog['since'])
    items = catalog['resources']
    seen = set()
    groups = defaultdict(list)
    for item in items:
        published = date.fromisoformat(item['date'])
        assert since <= published <= cutoff, item
        assert item['url'].startswith('https://'), item
        assert item['url'].rstrip('/') not in seen, item['url']
        seen.add(item['url'].rstrip('/'))
        for field in ('title', 'organization', 'kind', 'summary', 'date_evidence', 'verified_on'):
            assert item.get(field), (item['url'], field)
        monday = published - timedelta(days=published.weekday())
        groups[monday].append(item)

    def entry(item):
        note = f" **日期说明：**{item['note']}" if item.get('note') else ''
        return (f"- **{item['date'][5:]} · {item['organization']} · {item['kind']}** — "
                f"[{item['title']}]({item['url']})\n\n"
                f"  {item['summary']}{note}\n")

    for year in range(since.year, cutoff.year + 1):
        entries = [i for i in items if date.fromisoformat(i['date']).year == year]
        if not entries:
            continue
        lines = [f'---\ntitle: "Agent Eval 周报 · {year} 资料索引"\ndescription: "按发布周整理工业界 Agent 评测博客、访谈和方案。"\n---\n',
                 '[← Agent Eval 周报](/agent-eval)\n',
                 f'# {year} 年 Agent Eval 资料索引\n',
                 f'截至 **{cutoff.isoformat()}**，收录 **{len(entries)} 条**资料。按原始发布周归档，周一至周日，最新在前。当前周只统计至检索日。\n',
                 '关注工业界对大模型 Agent 的任务完成、工具调用、多轮交互、运行环境和生产质量的评测。每条提供原文入口和内容提要；访谈、演讲整理与产品方案分别标注。\n',
                 '这是持续补充的检索索引，不代表全网无遗漏。未收录的周不表示当周没有相关发布。除单独注明外，日期采用原文首发日期；旧文更新、转载及不同语言版本不重复计入。\n']
        for monday in sorted(groups, reverse=True):
            week_items = [i for i in groups[monday] if date.fromisoformat(i['date']).year == year]
            if not week_items:
                continue
            iso_year, week, _ = monday.isocalendar()
            sunday = monday + timedelta(days=6)
            lines.append(f'## W{week:02d} · {monday:%m.%d}—{sunday:%m.%d} {{#week-{iso_year}-{week:02d}}}\n')
            for item in sorted(week_items, key=lambda x: (x['date'], x['organization'], x['title']), reverse=True):
                lines.append(entry(item))
        empty = []
        start = max(since, date(year, 1, 1))
        end = min(cutoff, date(year, 12, 31))
        monday = start - timedelta(days=start.weekday())
        while monday <= end:
            if not any(date.fromisoformat(i['date']).year == year for i in groups.get(monday, [])):
                empty.append(f"W{monday.isocalendar().week:02d}（{monday:%m.%d}—{monday + timedelta(days=6):%m.%d}）")
            monday += timedelta(days=7)
        lines += ['## 本轮未收录资料的周\n', '、'.join(empty) + '。后续检索发现遗漏时，补回原始发布周。\n']
        dest = ROOT / f'docs/agent-eval/{year}.md'
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text('\n'.join(lines))

    latest = sorted(items, key=lambda x: (x['date'], x['organization']), reverse=True)[:6]
    index = ['---\ntitle: "Agent Eval 周报"\ndescription: "工业界大模型 Agent 评测的博客、访谈与工程方案，按周整理。"\n---\n',
             '# Agent Eval 周报\n',
             '跟踪工业界如何评估大模型 Agent：从任务和评分标准，到多轮交互、运行环境、线上监控与失败分析。收集公司技术博客、从业者访谈、公开演讲及可执行的评测方案。\n',
             f'最近检索：**{cutoff.isoformat()}** · 累计 **{len(items)} 条**资料。每周补充，按原始发布周归档，最新在前。\n',
             '## 按年查看\n']
    for year in sorted({date.fromisoformat(i['date']).year for i in items}, reverse=True):
        n = sum(date.fromisoformat(i['date']).year == year for i in items)
        index.append(f'- [{year} 年周列表 · {n} 条资料](/agent-eval/{year})\n')
    index.append('## 最近收录\n')
    index.extend(entry(i) for i in latest)
    index += ['## 收录方式\n',
              '优先采用原作者、公司技术团队或活动主办方发布的资料。正文说明具体评测方法、工程经验或任务设计；单纯模型发布、泛化产品宣传和工具排行榜不作为周报主体。由公司参与的研究，只在有相关官方博客或方案说明时列入，论文介绍继续放在[公司研究](/companies)。\n',
              '访谈按节目上线日归档，活动整理按文章发布日期归档。未观看视频时，只概括可核实的官方文字内容，并明确材料类型。每条简介用于判断是否值得阅读，不代替原文。\n',
              '## 长期参考\n',
              '以下是持续更新或首发早于 2026 年的资料，不混入 2026 年新发布列表。\n',
              '- [Google Cloud：Agent 轨迹与最终响应评测](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/evaluation-agents) — 持续更新的官方文档。\n',
              '- [MLflow：运行 Agent 评测](https://mlflow.org/docs/latest/genai/eval-monitor/running-evaluation/agents/) — 持续更新的官方文档。\n',
              '- [Confident AI：Agent 评测指标](https://www.confident-ai.com/blog/llm-agent-evaluation-complete-guide) — 首发于 2025 年，2026 年更新。\n',
              '- [Galileo：Agent 评测方法](https://galileo.ai/blog/ai-agent-evaluation) — 首发于 2025 年，2026 年更新。\n']
    (ROOT / 'docs/agent-eval.md').write_text('\n'.join(index))
    print(f'Rendered {len(items)} resources in {len(groups)} publication weeks.')


if __name__ == '__main__':
    render()
