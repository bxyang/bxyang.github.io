import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: '杨宝兴',
  description: '机器学习与分布式系统的读书笔记',
  cleanUrls: true,
  lastUpdated: true,

  srcExclude: ['public/**'],

  markdown: {
    math: true,
    lineNumbers: true
  },

  head: [
    ['link', { rel: 'icon', href: 'https://avatars.githubusercontent.com/u/4447765?v=4' }]
  ],

  themeConfig: {
    nav: [
      { text: '文章', link: '/posts' },
      { text: '标签', link: '/tags' },
      { text: '归档', link: '/archive/gfs.md' },
      { text: '关于', link: '/about' }
    ],

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索', buttonAriaLabel: '搜索' },
          modal: {
            noResultsText: '没有找到结果',
            resetButtonTitle: '清空',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' }
          }
        }
      }
    },

    outline: { level: [2, 3], label: '本页目录' },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/bxyang' },
      { icon: { svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>' }, link: 'mailto:yangbaoxing@gmail.com' }
    ],

    footer: {
      message: '基于 VitePress 构建',
      copyright: '© 杨宝兴 · 北京'
    },

    docFooter: { prev: '上一篇', next: '下一篇' },
    lastUpdated: { text: '最后更新于' },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色',
    darkModeSwitchTitle: '切换到深色',
    outlineTitle: '本页目录'
  }
})
