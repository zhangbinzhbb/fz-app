<template>
  <div class="yh-bottom">
    <van-divider :hairline="false" :style="{ color: '#999', borderColor: '#e8e8e8', padding: '0 16px' }">我是有底线的</van-divider>
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
  created() {},
  methods: {}
}
</script>

<style lang="scss">
.yh-bottom{
  .van-divider{
    font-size: 24px;
  }
}
</style>

