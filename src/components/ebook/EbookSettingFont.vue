<!--设置面板里设置字体的组件-->
<template>
  <transition name="slide-up">
    <div class="setting-wrapper" v-show="menuVisible&&settingVisible === 0">
      <!--// 字体面板显示前提：菜单栏和设置面板都有-->
      <div class="setting-font-size" v-if="settingVisible === 0">
        <div class="preview" :style="{fontSize: fontSizeList[0].fontSize + 'px'}">A</div>
        <div class="select">
          <!-- 利用v-for循环渲染出多个字号选择条（中间的竖线加两边的横线）-->
          <div class="select-wrapper" v-for="(item, index) in fontSizeList" :key="index" @click="setFontSize(item.fontSize)">
            <div class="line"></div>
            <div class="point-wrapper">
              <div class="point" v-show="defaultFontSize === item.fontSize">
                <div class="small-point"></div>
              </div>
            </div>
            <div class="line"></div>
          </div>
        </div>
        <div class="preview" :style="{fontSize: fontSizeList[fontSizeList.length - 1].fontSize + 'px'}">A</div>
      </div>
      <div class="setting-font-family" @click="showFontFamilyPopup">
        <!--// 点击按钮的时候弹出弹出层-->
        <div class="setting-font-family-text-wrapper">
          <span class="setting-font-family-text">{{defaultFontFamily}}</span>
        </div>
        <div class="setting-font-family-icon-wrapper">
          <span class="icon-forward"></span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import { FONT_SIZE_LIST } from '../../utils/book'
  import { ebookMixin } from '../../utils/mixin'
  import { saveFontSize } from '../../utils/localStorage'

  export default {
    mixins: [ebookMixin],
    data () {
      return {
        fontSizeList: FONT_SIZE_LIST
      }
    },
    methods: {
      setFontSize(fontSize) {
        this.setDefaultFontSize(fontSize)
        saveFontSize(this.fileName, fontSize) // 将设置的字号存入缓存
        if (fontSize === 'Default') {
          this.currentBook.rendition.themes.font('Time New Roman')
          // 设置默认字体
        }
          this.currentBook.rendition.themes.fontSize(fontSize)
          // 由this.currentBook获取到电子书对象;实现解耦：无需通过上层的EbookReader去实现
          // 设置改变字体：利用book对象的rendition下的theme类的fontSize方法
        },
      showFontFamilyPopup() {
        this.setFontFamilyVisible(true)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  .setting-wrapper {
    position: absolute;
    // 采用绝对定位
    bottom: px2rem(48);
    // 离底部的距离应是菜单栏的高度48
    left: 0;
    z-index: 160;
    display: flex;
    flex-direction: column;
    // 设置面板设为flex,且朝向为竖直（因为字体字号面板和字体样式面板二者布局是上下的关系）
    width: 100%;
    height: px2rem(90);
    // 这是设置字体面板的高度90
    background: white;
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);
    .setting-font-size {
      display: flex;
      flex: 2;
      height: 100%;
      .preview {
        flex: 0 0 px2rem(40);
        @include center;
      }
      .select {
        display: flex;
        flex: 1;
        .select-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          // 让横线部分居中
          &:first-child {
            .line {
              &:first-child {
                border-top: none;
              }
            }
          }
          &:last-child {
            .line {
              &:last-child {
                border-top: none;
              }
            }
          }
          .line {
            flex: 1;
            // 横线宽度自适应
            height: 0;
            border-top: px2rem(1) solid #ccc;
            // 横线的高度为零，通过上边框实现横线
          }
          .point-wrapper {
            position: relative;
            flex: 0 0 0;
            // 原点的宽度为0
            width: 0;
            height: px2rem(7);
            border-left: px2rem(1) solid #ccc;
            // 利用左边框实现字号选择条上的竖线
            .point {
              position: absolute;
              top: px2rem(-8);
              left: px2rem(-10);
              width: px2rem(20);
              height: px2rem(20);
              border-radius: 50%;
              background: white;
              border: px2rem(1) solid #ccc;
              box-shadow: 0 px2rem(4) px2rem(4) rgba(0, 0, 0, .15);
              @include center;
              .small-point {
                width: px2rem(5);
                height: px2rem(5);
                background: black;
                border-radius: 50%;
              }
            }
          }
        }
      }
    }
    .setting-font-family{
      flex: 1;
      font-size: px2rem(14);
      @include center;
      // 字体字号的flex为2，字体样式的flex为1，总的为3；所以字体样式的占1/3
      .setting-font-family-text-wrapper{
        @include center;
      }
      .setting-font-family-icon-wrapper{
        @include center;
      }
    }
  }
</style>
