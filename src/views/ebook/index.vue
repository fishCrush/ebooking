<!--//父组件 阅读器入口文件-->
<!--需引入标题栏和菜单栏组件-->
<template>
  <div class="ebook">
    <ebook-title></ebook-title>
    <ebook-reader></ebook-reader>
    <ebook-menu></ebook-menu>
  </div>
</template>

<script>
  import EbookReader from '../../components/ebook/EbookReader'
  import EbookTitle from '../../components/ebook/EbookTitle'
  import EbookMenu from '../../components/ebook/EbookMenu'
  // 引入EbookReader,EbookTitle,EbookMenu组件
  export default {
    // 将引入的组件注册
    components: {
      EbookReader,
      EbookTitle,
      EbookMenu
    }

  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";
</style>
