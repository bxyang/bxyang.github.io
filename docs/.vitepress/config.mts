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
      { text: '公司研究', link: '/companies' },
      { text: '标签', link: '/tags' },
      { text: '归档', link: '/archive/gfs.md' },
      { text: '关于', link: '/about' }
    ],

    sidebar: {
      '/companies': [
        { text: '概览', link: '/companies' },
        { text: '论文、基准与产品', link: '/research' },
        {
          text: '专家数据',
          collapsed: false,
          items: [
            { text: 'Surge AI', link: '/companies/surge-ai' },
            { text: 'Mercor', link: '/companies/mercor' },
            { text: 'Handshake AI', link: '/companies/handshake-ai' },
            { text: 'Turing', link: '/companies/turing' },
            { text: 'micro1', link: '/companies/micro1' },
            { text: 'Invisible Technologies', link: '/companies/invisible' }
          ]
        },
        {
          text: '平台与工具',
          collapsed: false,
          items: [
            { text: 'Scale AI', link: '/companies/scale-ai' },
            { text: 'Labelbox', link: '/companies/labelbox' },
            { text: 'Snorkel AI', link: '/companies/snorkel-ai' },
            { text: 'Encord', link: '/companies/encord' }
          ]
        },
        {
          text: 'RL 环境',
          collapsed: false,
          items: [
            { text: 'Prime Intellect', link: '/companies/prime-intellect' },
            { text: 'Mechanize', link: '/companies/mechanize' },
            { text: 'Bespoke Labs', link: '/companies/bespoke-labs' },
            { text: 'Patronus AI', link: '/companies/patronus-ai' },
            { text: 'Fleet AI', link: '/companies/fleet-ai' },
            { text: 'Andon Labs', link: '/companies/andon-labs' }
          ]
        }
      ]
    },

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
