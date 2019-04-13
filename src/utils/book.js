// 将静态变量放在这里面进行统一管理;如字号数组，字体数组
export const FONT_SIZE_LIST = [
  { fontSize: 12 },
  { fontSize: 14 },
  { fontSize: 16 },
  { fontSize: 18 },
  { fontSize: 20 },
  { fontSize: 22 },
  { fontSize: 24 }
]

export const FONT_FAMILY = [
  { font: 'Default' },
  { font: 'Cabin' },
  { font: 'Days One' },
  { font: 'Montserrat' },
  { font: 'Tangerine' }
]

// 主题列表
export function themeList(vue) {
  return [
    {
      alias: vue.$t('book.themeDefault'), // // alias:传入vue实例，利用vue实例的国际化
      name: 'Default', // name是存入ebookjs的名称 【name用于传入后续theme的register方法的第一个参数】
      style: { // style是主题的样式  【style用于传入后续theme的register方法的第二个参数】】
        body: { // // 样式是作用在body上的
          'color': '#4c5059',
          'background': '#cecece'
        }
      }
    },
    {
      alias: vue.$t('book.themeGold'),
      name: 'Gold',
      style: {
        body: {
          'color': '#5c5b56',
          'background': '#c6c2b6'
        }
      }
    },
    { // 护眼模式
      alias: vue.$t('book.themeEye'),
      name: 'Eye',
      style: {
        body: {
          'color': '#404c42',
          'background': '#a9c1a9'
        }
      }
    },
    { // 夜间模式
      alias: vue.$t('book.themeNight'),
      name: 'Night',
      style: {
        body: {
          'color': '#cecece',
          'background': '#000000'
        }
      }
    }
  ]
}

// 添加全局样式 通过动态往html的head部分添加link标签，由href引入
export function addCss(href) {
  const link = document.createElement('link') // 创建link标签并设置其相关属性
  link.setAttribute('rel', 'stylesheet')
  link.setAttribute('type', 'text/css')
  link.setAttribute('href', href)
  document.getElementsByTagName('head')[0].appendChild(link) // 将创建的css文件的link标签添加到html页面中
}

export function removeCss(href) {
  const links = document.getElementsByTagName('link')
  for (let i = links.length; i >= 0; i--) {
    const link = links[i]
    if (link && link.getAttribute('href') && link.getAttribute('href') === href) {
      // 若link标签存在以及其href属性等于传入的href则执行下面代码
      link.parentNode.removeChild(link) // 删除该标签
    }
  }
}

// 可在修改全局样式方法里先调用该方法，去除所有link标签，以防多次切换主题后，html的head部分有多个被创建了的link标签
export function removeAllCss() {
  removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
  removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`)
  removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`)
  removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`)
  // removeCss('http://book.youbaobao.xyz/book/res/theme/theme_default.css')
  // removeCss('http://book.youbaobao.xyz/book/res/theme/theme_eye.css')
  // removeCss('http://book.youbaobao.xyz/book/res/theme/theme_gold.css')
  // removeCss('http://book.youbaobao.xyz/book/res/theme/theme_night.css')
}
