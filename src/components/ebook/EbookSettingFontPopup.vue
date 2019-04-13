<!--这是字体设置的弹窗;该组件加入到EbookMenu中-->
<!--主要包括两部分：上面的标题栏和下面的字体列表-->
<template>
  <transition name="popup-slide-up">
    <!--transition的过渡动画写到transition.scss中-->
    <div class="ebook-popup-list" v-show="fontFamilyVisible">
      <!--在EbookSettingFont中控制fontFamilyVisible的改变来决定字体样式面板是否显示-->
      <div class="ebook-popup-title">
        <div class="ebook-popup-title-icon" @click="hide">
          <!--// 点击向下的图标时字体样式面板进行隐藏-->
          <span class="icon-down2"></span>
        </div>
        <span class="ebook-popup-title-text">{{$t('book.selectFont')}}</span>
          <!--// 可通过$t()选国际化文化 selectFont在cn.js里的book对象下-->
      </div>
      <div class="ebook-popup-list-wrapper">
        <div class="ebook-popup-item" v-for="(item, index) in fontFamilyList"
             :key="index" @click="setFontFamily(item.font)">
          <!--通过v-for把字体列表渲染出来；每个列有点击事件：选中字体并改变电子书的字体-->
          <div class="ebook-popup-item-text"  :class="{'selected':isSelected(item)}">
            <!--通过类名的绑定与否改变点击时的样式-->
            {{item.font}}
          </div>
          <div class="ebook-popup-item-check"  v-if="isSelected(item)">
            <span class="icon-check"></span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import { FONT_FAMILY } from '../../utils/book'
  import { ebookMixin } from '../../utils/mixin'
  import { saveFontFamily } from '../../utils/localStorage'

  export default {
    mixins: [ebookMixin],
    data() {
      return {
        fontFamilyList: FONT_FAMILY
      }
    },
    methods: {
      setFontFamily(font) {
        this.setDefaultFontFamily(font)
        // 修改当前字体为选中的字体【只是修改store库的变量的状态值，并无改变当前阅读器的字体】
        saveFontFamily(this.fileName, font)
        // 将该字体缓存下来
        // this.currentBook.rendition.themes.font(font)
        // 修改电子书字体为选中的字体
        // 字体样式代码是在CSS文件中(styles文件夹里)，所以需要从main.js引入这些css文件
        // 而阅读器的dom是通过iframe实现的，故应将css文件注入该iframe
        // this.currentBook.rendition.themes.font(font)
        if (font === 'Default') {
          this.currentBook.rendition.themes.font('Times New Roman')
          // 真正改变当前阅读器的字体
        } else {
          this.currentBook.rendition.themes.font(font)
        }
      },
      isSelected(item) {
        return this.defaultFontFamily === item.font
      },
      hide() {
        this.setFontFamilyVisible(false)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  .ebook-popup-list{
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 300;
    background: white;
    //赋z-index值大一些：覆盖其他面板
    width: 100%;
    box-shadow: 0 px2rem(-4) px2rem(6) rgba(0, 0, 0, .15);
    .ebook-popup-title{
      position: relative;
      /*使得弹出页面的标题栏中的题目图标可以相对标题栏定位*/
      padding: px2rem(15);
      box-sizing: border-box;
      border-bottom: px2rem(1) solid #b8b9bb;
      // 标题文字居中
      text-align: center;
      @include center;
      .ebook-popup-title-icon{
        position: absolute;
        left: px2rem(15);
        top: 0;
        height: 100%;
        @include center;
        font-size: px2rem(16);
        font-weight: bold;
      }
      .ebook-popup-title-text{
        font-size: px2rem(14);
        font-weight: bold;
      }
    }
    .ebook-popup-list-wrapper{
      .ebook-popup-item{
        display: flex;
        .ebook-popup-item-text{
          flex: 1;
          text-align: left;
          font-size: px2rem(14);
          padding: px2rem(15);
          &.selected{
            color: #346cb9;
            font-weight: bold;
          }
        }
        .ebook-popup-item-check{
          flex: 1;
          text-align: right;
          font-size: px2rem(14);
          font-weight: bold;
          color: #346cb9;
          // 自己添加的字体勾选图标的右边距
          /*margin-right: px2rem(5px);*/
        }
      }
    }
  }
</style>
