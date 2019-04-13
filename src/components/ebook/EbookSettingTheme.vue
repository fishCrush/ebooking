<template>
  <transition name="slide-up">
    <div class="setting-wrapper" v-show="menuVisible && settingVisible ===1 ">
       <!--// settingVisible ===1是因为在EbookMenu中定义了主题图标点击的时候主题设置面板显示 @click="showSetting(1)"  -->
      <!--而showSetting方法中又会改变settingVisible为对应showSetting传入的参数-->
      <div class="setting-theme">
        <div class="setting-theme-item" v-for="(item, index) in themeList" :key="index" @click="setTheme(index)">
          <div class="preview" :style="{background: item.style.body.background}" :class="{'selected': item.name ===
           defaultTheme}"></div>
          <div class="text" :class="{'selected': item.name === defaultTheme}">{{item.alias}}</div>
          <!--利用alias里的国际化（代码在book.js文件里）-->
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import { ebookMixin } from '../../utils/mixin' // 需要做混入
  import { saveTheme } from '../../utils/localStorage'
  export default {
    name: 'EbookSettingTheme',
    mixins: [ebookMixin],
    methods: {
      setTheme(index) {
        const theme = this.themeList[index] // 通过index获取当前选中主题
        // 先将选中的主题设为当前的默认主题样式  this.setDefaultTheme(theme.name) 设当前的默认主题样式为选中的主题
        // 然后再then异步调用，设阅读器的主题为当前的默认主题样式 .then(() => {this.currentBook.rendition.themes.select(this.defaultTheme)})
        this.setDefaultTheme(theme.name).then(() => {
          this.currentBook.rendition.themes.select(this.defaultTheme)
          this.initGlobalStyle()// 通过这个方法切换全局样式（initGlobalStyle方法代码在mixin.js中）
        })
        saveTheme(this.fileName, theme.name) // key!将主题存入缓存（为了再次刷新进行初始化时可从缓存里取存下的主题）
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
   @import "../../assets/styles/global"; // 注意@center是在global文件定义的 所以需要引入
  .setting-wrapper {
    position: absolute;
    bottom: px2rem(48);
    left: 0;
    z-index: 160;
    width: 100%;
    height: px2rem(90); // 主题设置面板高度为90
    background: white;
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);
  .setting-theme {
    height: 100%;
    display: flex;
  .setting-theme-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: px2rem(5);
    box-sizing: border-box;
  .preview {
    flex: 1;
    border: px2rem(1) solid #ccc;
    box-sizing: border-box;
    &.selected { // 设置主题预览框被选中时的阴影样式
      box-shadow: 0 px2rem(4) px2rem(6) rgba(0,0,0,.1);
    }
  }
  .text {
    flex: 0 0 px2rem(20);
    font-size: px2rem(14);
    color: #ccc;
    @include center;
    &.selected {
     color: #333;
   }
  }
  }
  }
  }

</style>
