<template>
  <div class="half">
    <van-popup
      v-model="popupVisible"
      :close-on-click-modal="closeOnClickModal"
      position="right"
      class="menu"
      lock-scroll="true"
    >
      <div class="yh-right-content">
        <div class="filter-content">
          123
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: 'HalfPopup',
  components: {},
  props: {
    filterList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      popupVisible: false,
      closeOnClickModal: true,
      groupIds: [],
      value: ''
    }
  },
  watch: {},
  created() {},
  activated() {},
  methods: {
    showPopup() {
      this.popupVisible = true
      // ios12页面的关系，打开子页面的时候与'has-comment'css样式冲突，打开右侧弹出页面，样式去掉，关闭右侧页面需要恢复（headerx组件中)
      // let content = document.getElementsByClassName('has-comment')
      const btmContent = document.getElementsByClassName('comment-content')
      btmContent[0].style.cssText = 'overflow-y:hidden !important'
      // content[0].classList.remove('has-comment')
    },
    closePopup() {
      this.popupVisible = false
      const btmContent = document.getElementsByClassName('comment-content')
      btmContent[0].style.cssText = 'overflow-y:scroll !important'
    },
    reset() {
      this.closePopup()
    },
    confirm() {
      this.closePopup()
      this.$emit('confirm')
    }
  }
}
</script>

<style lang="scss" scoped></style>
