import DefaultTheme from 'vitepress/theme'
import './style.css'
import CompanyWorks from './CompanyWorks.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('CompanyWorks', CompanyWorks)
  }
}
