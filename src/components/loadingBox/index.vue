<template>
  <div class="overlay-loading-box">
    <van-overlay :show="popupVisible">
      <div class="wrapper">
        <van-loading v-if="type==='1'" type="spinner" color="#4c4c4c"/>
        <div v-else class="loadingBox">
          <img
            :src="require('@/assets/images/loading/success.png')"
            alt=""
          >
          <p>{{ tip }}</p>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: '1'
    },
    tip: {
      type: String,
      default: '保存成功'
    }
  },
  data() {
    return {}
  },
  computed: {
    popupVisible: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('update:show', val)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.overlay-loading-box{
  .van-overlay {
    background-color: rgba(0, 0, 0, 0.2);
    z-index: 9999 !important;
  }
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
}

.loadingBox{
  width:230px;
  height:230px;
  background:rgba(255,255,255,1);
  display: flex;
  flex-direction: column;
  justify-content: center;
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
