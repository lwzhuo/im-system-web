<template>
  <div class="container">
    <div class="svg-container">
      <svg width="100%" height="100%" viewBox="0 0 32 32" version="1.1" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;"><path class="unknow-icon" d="M8 10c0-4.418 3.582-8 8-8s8 3.582 8 8c0 4.418-3.582 8-8 8s-8-3.582-8-8zM24 20h-16c-4.418 0-8 3.582-8 8v2h32v-2c0-4.418-3.582-8-8-8z"></path></svg>
    </div>
    <div class="unknow-text" v-if="text != null && text != ''">{{ text }}</div>
  </div>
</template>

<script>
export default {
  name: 'status-unknow-icon',
  props: ['text']
}
</script>

<style lang="scss" scoped>
.container {
  padding: 6px 0;
  .svg-container {
    height: 16px;
    width: 16px;
    line-height: 16px;    
    float: left;
    .unknow-icon {
      opacity: 1;
      fill: #629AD5;
    }
  }
  .unknow-text {
    margin: 1px;
    color: #74736D;
    font-size: 14px;
    line-height: 16px;
  }  
}
</style>