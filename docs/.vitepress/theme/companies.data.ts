import { createContentLoader } from 'vitepress'

export interface Company {
  title: string
  url: string
  category: string
  founded: string
  site: string
  order: number
  summary: string
}

const CATEGORY_ORDER = ['专家数据', '平台与工具', 'RL 环境', '其他']

export default createContentLoader('companies/*.md', {
  transform(raw): Company[] {
    return raw
      .filter((p) => p.frontmatter.title)
      .map((p) => ({
        title: p.frontmatter.title as string,
        url: p.url,
        category: (p.frontmatter.category ?? '其他') as string,
        founded: String(p.frontmatter.founded ?? ''),
        site: (p.frontmatter.site ?? '') as string,
        order: Number(p.frontmatter.order ?? 99),
        summary: (p.frontmatter.summary ?? '') as string
      }))
      .sort((a, b) => {
        const ca = CATEGORY_ORDER.indexOf(a.category)
        const cb = CATEGORY_ORDER.indexOf(b.category)
        if (ca !== cb) return (ca < 0 ? 99 : ca) - (cb < 0 ? 99 : cb)
        return a.order - b.order
      })
  }
})
