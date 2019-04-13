<!--阅读进度条功能面板-->
<template>
  <transition name="slide-up">
    <div class="setting-wrapper" v-show="menuVisible && settingVisible === 2">
      <div class="setting-progress">
        <!--阅读时间-->
        <div class="read-time-wrapper">
          <span class="read-time-text">111</span>
          <span class="icon-forward"></span>
        </div>
        <!--进度条-->
        <div class="progress-wrapper">
          <!--跳转上一章-->
          <div class="progress-icon-wrapper" @click="preSection()">
            <span class="icon-back" ></span>
          </div>
          <!--进度条-->
          <input class="progress" type="range"
                 max="100"
                 min="0"
                 step="1"
                 @change="onProgressChange($event.target.value)"
                 @input="onProgressInput($event.target.value)"
                 :value="progress"
                 :disabled="!bookAvailable"
                 ref="progress">
          <!-- :disabled="!bookAvailable"：为了保证电子书还没渲染完成前不进行进度条功能的跳转；需先进行电子书的分页（EbookReader组件中）再使用进度条的功能-->
          <!--跳转下一章-->
          <div class="progress-icon-wrapper" @click="nextSection()">
            <span class="icon-forward" ></span>
          </div>
        </div>
        <!--阅读进度文本显示-->
        <div class="text-wrapper">
          <span>{{bookAvailable ? progress + '%' : '加载中...'}}</span>
          <!--//电子书解析之后显示加载中-->
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import { ebookMixin } from '../../utils/mixin'

  export default {
    mixins: [ebookMixin],
    methods: {
      // 拖动进度条松开后触发的事件：根据进度条数值跳转位置
      onProgressChange(progress) { // progress是进度条的数值：1-100
        this.setProgress(progress).then(() => {
          // 设置完vuex里的progress，再调用一下方法继续执行
          this.displayProgress()
          this.updateProgressBg()
        })
      },
      // 拖动进度条时触发的事件
      onProgressInput(progress) {
        // this.setProgress(progress)实现拖动的时候文本的进度条百分比也实时在变化，因为此处实时改变了vuex中的progress
        this.setProgress(progress).then(() => {
          this.updateProgressBg()
        })
        // this.setProgress(progress).then(() => { this.displayProgress() })
        // 后面的then方法实现了拖动进度条时阅读器内容也在实时变化【此功能可删除】
      },
      // 展示当前进度所在的页面
      displayProgress() {
        const cfi = this.currentBook.locations.cfiFromPercentage(this.progress / 100)
        // 利用book里的locations下的cfiFromPercentage方法（需传入小数）得到此处的cfi
        // console.log(cfi)
        this.currentBook.rendition.display(cfi)
        // 通过rendition下的display（）来渲染cfi
      },
      // 设置阅读条的左边（已阅读部分）背景色加深
      updateProgressBg() {
        this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`
        // this.$refs.progress是获取到rel:progress的dom（即本组件中的range）
      },
      preSection() {
        if (this.section > 0 && this.bookAvailable) {
          // 可以进项跳转上一章的要求：所在章节位置大于第一个，且电子书已解析完成[vuex里section的初始值设比0大，这样才会调用这个函数]
          this.setSection(this.section - 1).then(() => {
           this.displaySection()
          })
        }
      },
      nextSection() {
        // console.log(this.currentBook.spine)
        if (this.section < this.currentBook.spine.length - 1 && this.bookAvailable) {
          // book对象下有个spine的对象，其属性length代表的是子章节的数量
          this.setSection(this.section + 1).then(() => {
            this.displaySection()
          })
        }
      },
      displaySection() {
        const sectionInfo = this.currentBook.section(this.section) // 利用book对象的section方法，其可以接受章节数，直接跳转
        // console.log(sectionInfo) 利用此可观察到这是一个对象 里面有href属性
        // 实现章节的跳转：section对象的href属性值传入rendition的display方法
        if (sectionInfo && sectionInfo.href) {
          this.currentBook.rendition.display(sectionInfo.href)
        }
      }
    },
    updated() { // vue的钩子函数
      this.updateProgressBg()
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  .setting-wrapper {
    position: absolute;
    bottom: px2rem(48);
    left: 0;
    z-index: 160;
    width: 100%;
    height: px2rem(90);
    background: white;
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);
    .setting-progress {
      position: relative;
      width: 100%;
      height: 100%;
      .read-time-wrapper{ //阅读时间样式
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: px2rem(40);
        font-size: px2rem(12);
        @include center
      }
      .progress-wrapper {
        width: 100%;
        height: 100%;
        @include center;
        padding: 0 px2rem(15);
        box-sizing: border-box;
        .progress-icon-wrapper{ // 跳转上下章图标的样式
          font-size: px2rem(20);
        }
        .progress {
          width: 100%;
           -webkit-appearance: none;// -webkit-appearance会将webkit浏览器中的元素默认样式去除
          height: px2rem(2); // 进度条高度
          /*background: -webkit-linear-gradient(#999, #999) no-repeat, #ddd;*/
          /*background-size: 0 100%!important; // 加!important以免被全局主题样式里相关设定覆盖*/
          // 将进度条的样式控制交给滑块中的样式去操控；结合上面的 updateProgressBg() 完全交给js去控制
          margin: 0 px2rem(10);
          &:focus {
            outline: none;
          }
          &::-webkit-slider-thumb { // input type设为range时默认的滑块
             -webkit-appearance: none; // 去掉滑块原有的默认样式
            height: px2rem(20);
            width: px2rem(20);
            border-radius: 50%;
            background: white;
            box-shadow: 0 4px 4px 0 rgba(0, 0, 0, .15);
            border: px2rem(1) solid #ddd;
          }
        }
      }
      .text-wrapper {
        position: absolute;
        left: 0;
        bottom: px2rem(10);
        width: 100%;
        color: #333;
        font-size: px2rem(12);
        @include center;
      }
    }
  }
</style>

