// 实现EbookReader，EbookMenu,EbookTtitle组件中重复代码的复用
// mixin实现组件之间代码的复用,对mapGetters, mapActions实现集合
import { mapGetters, mapActions } from 'vuex'
import { themeList, addCss, removeAllCss } from './book'
export const ebookMixin = {
  computed: {
    // 将mapGetters做映射（原getters代码放在getters.js文件里）：放computed里
    ...mapGetters([
      'fileName',
      'menuVisible',
      'settingVisible',
      'defaultFontSize',
      'defaultFontFamily',
      'fontFamilyVisible',
      'defaultTheme',
      'bookAvailable',
      'progress',
      'section',
      'isPaginating',
      'currentBook',
      'navigation',
      'cover',
      'metadata',
      'paginate',
      'pagelist',
      'offsetY',
      'isBookmark'
    ]),
    themeList() { // 把themeList放在这里则在不同组件下都可以引用它
      return themeList(this) // themeList(...)方法在utils下的book.js文件里（静态资源的保存
    }
  },
  methods: {
    // 将mapActions做映射（原actions代码放在action.js文件里）：放methods里
    ...mapActions([
      'setFileName',
      'setMenuVisible',
      'setSettingVisible',
      'setDefaultFontSize',
      'setDefaultFontFamily',
      'setFontFamilyVisible',
      'setDefaultTheme',
      'setBookAvailable',
      'setProgress',
      'setSection',
      'setIsPaginating',
      'setCurrentBook',
      'setNavigation',
      'setCover',
      'setMetadata',
      'setPaginate',
      'setPagelist',
      'setOffsetY',
      'setIsBookmark'
    ]),
    // 修改全局主题样式【这个方法在初始化全局主题样式和切换主题时都会被用到，所以存入mixin中  实现复用
    initGlobalStyle() {
      removeAllCss()
      switch (this.defaultTheme) {
        case 'Default':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`) // 引入全局样式方法（动态添加link标签）
          break
        case 'Eye':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`)
          break
        case 'Gold':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`)
          break
        case 'Night':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`)
          break
        default: // 可指定默认样式
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`) // 引入全局样式方法（动态添加link标签）
          break
      }
    }
  }
}
