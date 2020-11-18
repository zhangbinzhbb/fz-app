<template>
  <div>
    <van-popup
      v-model="popupVisible"
      :close-on-click-overlay="false"
      class="popup"
    >
      <div class="loadingBox">
        <img
          :src=" loadType==='success' ?
            require('@/assets/images/loading/success.png') :
          require('@/assets/images/loading/process.gif')"
          alt=""
        >
        <p>{{ loadType==='success' ? successText : processText }}</p>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  props: {
    loadType: {
      type: String,
      default: 'none'
    },
    processText: {
      type: String,
      default: '保存中'
    },
    successText: {
      type: String,
      default: '保存成功'
    }
  },
  data() {
    return {}
  },
  computed: {
    popupVisible() {
      return this.loadType !== 'none'
    }
  },
  watch: {
    loadType(v) { // 如果还在当前页面需要手动关闭加载框
      if (v === 'success') {
        setTimeout(() => {
          this.$emit('hide')
        }, 1000)
      }
    }
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>
<style lang="scss" scoped>
.loadingBox{
  padding: 50px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  img{
    width: 66px;
    height: 66px;
  }
  p{
    margin-top: 20px;
    font-size: 24px;
  }
}
</style>
