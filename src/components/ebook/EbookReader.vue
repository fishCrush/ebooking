<!-- -->
<template>
    <div class="ebook-reader">
     <div id="read">
       <!--用来展示电子书-->
     </div>
    </div>
</template>

<script>
  import Epub from 'epubjs'
  import { ebookMixin } from '../../utils/mixin'
  import { getFontFamily, getFontSize, saveFontFamily, saveFontSize, getTheme, saveTheme } from '../../utils/localStorage' // 电子书渲染完后初始化字体时用到

  global.ePub = Epub
  export default {
    mixins: [ebookMixin],
    methods: {
      prevPage() {
        if (this.rendition) {
          this.rendition.prev()
          this.hideTitleAndMenu()
        }
      },
      nextPage() {
        if (this.rendition) {
          this.rendition.next()
          this.hideTitleAndMenu()
        }
      },
      toggleTitleAndMenu() {
        if (this.menuVisible) {
          this.setSettingVisible(-1)
          // 菜单栏隐藏的时候也一并隐藏设置面板：为了下次点开菜单栏的时候设置面板不会一起出现
          this.setFontFamilyVisible(false)
          // 菜单栏隐藏时字体家族面板也隐藏
        }
        this.setMenuVisible(!this.menuVisible)
      },
      hideTitleAndMenu() {
        // this.$store.dispatch('setMenuVisible', false)
        // 映射mapActions则可直接引用：
        this.setMenuVisible(false)
        this.setSettingVisible(-1)
        // 菜单栏隐藏的时候也一并隐藏设置面板：为了下次点开菜单栏的时候设置面板不会一起出现
        this.setFontFamilyVisible(false)
        // 菜单栏隐藏时字体家族面板也隐藏
      },
      // 初始化字号
      initFontSize() {
        let fontSize = getFontSize(this.fileName)
        if (!fontSize) {
          saveFontSize(this.fileName, this.defaultFontSize)
        } else {
          this.rendition.themes.fontSize(fontSize)
          this.setDefaultFontSize(fontSize)
        }
      },
      // 初始化字体样式函数
      initFontFamily() {
        // 从缓存取字体样式
        let font = getFontFamily(this.fileName) // getFontFamily方法源码在localStorage.js里})
        if (!font) {
          // 获取缓存的字体样式，若其不存在，则将字体样式设为默认的字体样式
          saveFontFamily(this.fileName, this.defaultFontFamily)
        } else {
          this.rendition.themes.font(font)
          // 若缓存中有字体样式，则将从缓存中取到的字体样式应用到当前阅读器的字体中
          this.setDefaultFontFamily(font)
          // 同时将该字体样式传入到vuex中的defaultFontFamily
        }
      },
      // 初始化主题样式
      initTheme() {
        // 缓存主题
        let defaultTheme = getTheme(this.fileName)
        if (!defaultTheme) {
          defaultTheme = this.themeList[0].name
          saveTheme(this.fileName, defaultTheme) // 主题缓存两个地方：1.初始化时 2. 切换主题时
        }
        this.setDefaultTheme(defaultTheme) // 将当前默认主题样式存到vuex
        // 在EbookReader中注册各个主题
        this.themeList.forEach(theme => {
          this.rendition.themes.register(theme.name, theme.style)
        })
        // 阅读器选择默认主题样式
          this.rendition.themes.select(defaultTheme) // 不是用this.defaultTheme，即不从vuex取，因为vuex是异步调用的
      },
      // 渲染电子书的初始化过程
      initRendition() {
        // console.log(this.book) // 做测试用，检测电子书是否成功获取到
        this.rendition = this.book.renderTo('read', {
          // 利用book的renderTo把书籍渲染出来;绑定的DOM是‘read’
          width: innerWidth,
          height: innerHeight,
          method: 'default'
          // 进行微信的兼容
        })
        // 渲染出电子书
        this.rendition.display().then(() => {
          // 渲染完电子书就进行字体大小和字体样式的初始化
          this.initTheme()
          this.initFontSize()
          this.initFontFamily()
          this.initGlobalStyle()
        })
        // 向阅读器所在dom注入字体文件【之前的css文件只是被引入了main.js文件，但是阅读器所在的dom其实是一个iframe]
        this.rendition.hooks.content.register(contents => { // 这是rendition的钩子函数
          // epubjs提供的内置方法addStylesheet 注意该方法需传入的是url,所以把这些css文家放到nginx服务器上以生成url
          // 且将ip地址中可能变换的部分写为环境变量VUE_APP_RES_URL，并通过process.env.来引用该变量
          // 【注：1.设的环境变量需以VUE_APP开头 2.写环境变量后需要重启项目】
          Promise.all([contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`)
          ]).then(() => {})
          // 利用addStylesheet返回的是一个promise对象，则可设置全部字体加载完后调用的函数
        })
      },
      // 初始化手势，实现翻页功能
      initGesture() {
        // 触摸开始
        this.rendition.on('touchstart', event => {
          // 利用rendition的on方法动态绑定事件到上，实现翻页功能
          // 开始触摸
          console.log(event)
          this.touchStartX = event.changedTouches[0].clientX
          this.touchStartTime = event.timeStamp
        })
        // 触摸结束
        this.rendition.on('touchend', event => {
          // 利用手势实现电子书的翻页
          const offsetX = event.changedTouches[0].clientX - this.touchStartX
          const time = event.timeStamp - this.touchStartTime
          console.log(offsetX, time)
          if (time < 500 && offsetX > 40) {
            this.prevPage()
          } else if (time < 500 && offsetX < -40) {
            this.nextPage()
          } else {
            this.toggleTitleAndMenu()
          }
          event.preventDefault()
          event.stopPropagation()
        })
      },
      // 利用epubjs解析渲染了电子书
      initEpub() {
        const url = process.env.VUE_APP_RES_URL + '/epub/' +
          this.fileName + '.epub'
        this.book = new Epub(url)
        this.setCurrentBook(this.book) // book对象已加入vuex的状态管理
        this.initRendition()
        this.initGesture()
        // 利用this.book下的钩子函数ready（会在电子书book解析完成后调ready函数）调一个异步方法，确保实现分页是在电子书解析完成后再进行
        this.book.ready.then(() => {
          // return this.book.locations.generate(750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16))
          return this.book.locations.generate(750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16))
        }).then(locations => {
          // console.log(locations)
          this.setBookAvailable(true)
          // setBookAvailable(true)的方法会把mixin中的bookAvailable置为true
          // 解析完电子书之后，然后设bookAvailable变为true后，才可进行分页功能和进度条相关功能
        })
        // 传入的参数是一个显示的文字数
        // 750是在屏幕宽为375px（与字数成正比）和字号为16px（与字数成反比）的情况下的一页的字体数
        // 只是一个简单的算法，不是精确的算法；可以实现进度百分比，但不能做到精确的定位
      }

    },
    // 利用动态路由的机制获取了nginx服务器中电子书的下载路径
    mounted() {
      // 获取路由
      this.setFileName((this.$route.params.fileName || '').split('|').join('/'))
        .then(() => {
        this.initEpub()
      })
      // console.log(`${baseUrl}${fileName}.epub`)
      // 使用nginx服务器的路径来下载电子书
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>
