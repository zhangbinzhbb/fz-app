<template>
  <div class="menu-item-contanier">
    <img src="@/assets/images/projectXm/gongshang@2x.png" alt="">
    <div class="menu-item-content">
      <span>{{ field.label }}</span>
      <van-icon name="arrow" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    field: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-item-contanier{
  background-color: #fff;
  display: flex;
  align-items: center;
  img{
    width: 36px;
    height: 41px;
    padding:0 38px 0 41px;
  }
  .menu-item-content{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30px 41px 28px 0;
    border-bottom: 1px solid #F0F0F0;
    span{
      font-size:28px;
      font-weight:500;
      color:rgba(76,76,76,1);
    }
    i{
      font-size: 28px;
    }
  }
}
</style>
