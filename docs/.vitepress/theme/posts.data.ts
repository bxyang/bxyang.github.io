import { createContentLoader } from 'vitepress'

function toDate(v: unknown): string {
  if (v instanceof Date) return v.toISOString().slice(0, 10)
  return String(v ?? '').slice(0, 10)
}

export default createContentLoader('posts/*.md', {
  transform(raw) {
    return raw
      .filter((p) => p.frontmatter.title && p.frontmatter.date)
      .map((p) => ({
        title: p.frontmatter.title as string,
        url: p.url,
        date: toDate(p.frontmatter.date),
        tags: (p.frontmatter.tags ?? []) as string[],
        description: (p.frontmatter.description ?? '') as string
      }))
      .sort((a, b) => (a.date < b.date ? 1 : -1))
  }
})
