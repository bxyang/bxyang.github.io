import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'bxyang',
  description: '路漫漫其修远兮，吾将上下而求索',
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
      { icon: 'github', link: 'https://github.com/bxyang' }
    ],

    footer: {
      message: '路漫漫其修远兮，吾将上下而求索',
      copyright: '© bxyang'
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
