<template>
  <div>
    <van-popup v-model="popupVisible" :overlay-style="overlayStyle" class="more-mint-popup">
      <div class="hide" @click="popupVisible=false">
        <div class="more-content" @click.stop="notHide()">
          <slot/>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: 'More',
  props: {},
  data() {
    return {
      popupVisible: false,
      routeName: '',
      overlayStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
      }
    }
  },
  watch: {
    '$route.name'(val) {
      this.popupVisible = false
    },
    popupVisible(val) {}
  },
  created() {
    this.routeName = this.$route.name
  },
  activated() {},
  methods: {
    notHide() {},
    showToggle() {
      this.popupVisible = !this.popupVisible
    }
  }
}
</script>

<style lang="scss">
.more-mint-popup {
  height: 100%;
  width: 100%;
  background: none;
  .hide {
    width: 100%;
    height: 100%;
  }
  .more-content {
    position: absolute;
    background: #fff;
    right: 25px;
    border-radius: 8px;
    &:before {
      width: 0;
      height: 0;
      border-width: 0 25px 25px;
      border-style: solid;
      border-color: transparent transparent #fff; /*透明 透明  灰*/
      margin: 30px auto;
      content: '';
      display: inline-block;
      position: absolute;
      top: -50px;
      right: 10px;
    }
    .item {
      margin: 0 auto;
      color: #000;
      height: auto;
      font-size: 30px;
      position: relative;
      padding: 35px 35px 0 35px;
      &:nth-last-of-type(1){
        padding-bottom: 25px;
      }
      img {
        width: 43px;
        height: 37px;
        vertical-align: middle;
        position: relative;
        top: -4px;
      }
      &:last-child {
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
      }
    }
  }
}
</style>
