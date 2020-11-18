<template>
  <div v-if="showBlank" class="yh-blank">
    <img src="@/assets/images/icon/blank.png" alt="">
  </div>
</template>

<script>
export default {
  name: 'Blank',
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      showBlank: false
    }
  },
  created() {
    this.setTime()
  },
  methods: {
    setTime() {
      const _this = this
      setTimeout(function() {
        _this.showBlank = true
      }, 500)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!-- lang="scss" 表示使用sass 语法 -->
<style scoped lang="scss">
.yh-blank {
  width: 100%;
  text-align: center;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  img {
    width: 303px;
  }
}
</style>
