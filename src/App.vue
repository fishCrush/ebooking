<template>
  <div id="app">
   <router-view></router-view>
  </div>
</template>
<script>
  export default {}
  // document.addEventListener('DomContentLoaded', () => {
  //   const html = document.querySelector('html')
  //   let fontSize = window.innerWidth
  //   let mfontSize = fontSize > 50 ? 50 : fontSize
  //   html.style.fontSize = mfontSize + 'px'
  //   console.log(html.style.fontSize)
  // })
  document.addEventListener('DOMContentLoaded', () => {
    const html = document.querySelector('html')
    let fontSize = window.innerWidth / 10
    fontSize = fontSize > 50 ? 50 : fontSize
    html.style.fontSize = fontSize + 'px'
  })
</script>
<style lang="scss" scoped>
  @import './assets/styles/global';
  .text{
   font-family: 'Days One',serif;
    font-size:   (20);
    color: red;
  }
  #app{
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

</style>
