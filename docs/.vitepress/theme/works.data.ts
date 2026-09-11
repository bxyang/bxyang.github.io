import { createContentLoader } from 'vitepress'

export interface Work {
  title: string
  url: string
  company: string
  date: string
  dateLabel: string
  kind: string
  description: string
}

export default createContentLoader('companies/*/*.md', {
  transform(pages): Work[] {
    return pages.filter(p => p.frontmatter.company && p.frontmatter.title).map(p => ({
      title: String(p.frontmatter.title),
      url: p.url,
      company: String(p.frontmatter.company),
      date: String(p.frontmatter.date ?? ''),
      dateLabel: String(p.frontmatter.dateLabel ?? p.frontmatter.date ?? '发布日期未披露'),
      kind: String(p.frontmatter.kind ?? '研究'),
      description: String(p.frontmatter.description ?? '')
    })).sort((a, b) => (a.date || '9999').localeCompare(b.date || '9999') || a.title.localeCompare(b.title))
  }
})
