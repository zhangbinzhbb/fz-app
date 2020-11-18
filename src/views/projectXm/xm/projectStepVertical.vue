<template>
  <div class="fd-steps-content">
    <div v-if="stepList.length" class="fd-steps fd-steps--vertical">
      <div class="fd-steps__items">
        <div v-for="(item,index) in stepList" :key="index" class="fd-hairline fd-step fd-step--vertical fd-step--process">
          <div class="fd-step__title" style="color: rgb(7, 193, 96);">
            <h3>
              <span>{{ item.nodeName }}</span>
              <span>{{ item.createTime }}</span>
            </h3>
            <p>
              <span>{{ item.commandMessage }}</span>
              <span>{{ item.assigneeName }} </span>
            </p>
            <!-- <p>{{ item.taskComment }}</p> -->
          </div>
          <div class="fd-step__circle-container">
            <img v-if="index===0" src="@/assets/images/slep/slep.png" alt="" srcset="">
            <img v-if="item.isApp==='0'&& index!==0" src="@/assets/images/slep/slep-computer.png" alt="" srcset="">
            <img v-if="item.isApp==='1'&& index!==0" src="@/assets/images/slep/slep-tel.png" alt="" srcset="">
          </div>
          <div :style="{backgroundImage:'url('+require('@/assets/images/slep/dottot.png')+')'}" class="fd-step__line"/>
        </div>
      </div>
    </div>
    <div v-else class="empty-title">暂无数据</div>
  </div>
</template>

<script>
export default {
  props: {
    stepList: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.empty-title{
  font-weight:500;
   font-size:24px;
}
.fd-steps-content {
  background-color: #fff;
  padding: 49px 40px 40px 40px;
  .fd-steps--vertical {
    padding: 0 0 0 32px;
  }
  .fd-steps {
    background-color: #fff;
  }
  .fd-step--vertical {
    display: block;
    float: none;
  }
  .fd-step {
    position: relative;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    color: #969799;
    font-size: 14px;
    padding-bottom: 32px;
    &:last-child{
      .fd-step__line{
        width: 0;
      }
    }
  }
  .fd-step__title{
    padding-left:18px;
    h3{
      display: flex;
      justify-content: space-between;
      span{
        font-weight:500;
        &:first-child{
          font-size:28px;
          color:rgba(76,76,76,1);
        }
        &:last-child{
          font-size:24px;
          color:rgba(153,153,152,1);
        }
      }
    }
    p{
      font-size:24px;
      font-weight:500;
      color:rgba(153,153,152,1);
      padding-top: 14px;
      display: flex;
      justify-content: space-between;
    }
  }
  .fd-step--vertical:first-child::before {
    position: absolute;
    top: 0;
    left: -15px;
    z-index: 1;
    width: 1px;
    height: 20px;
    background-color: #fff;
    content: '';
  }
  .fd-step--vertical{
    .fd-step__line {
      top: 16px;
      left: -15px;
      width:3px;
      height: 100%;
      position: absolute;
      background-size: 100% 100%;
      background-repeat: repeat-y;
    }
    .fd-step__circle-container {
      position: absolute;
      top: 19px;
      left: -15px;
      z-index: 2;
      font-size: 12px;
      line-height: 1;
      -webkit-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
      img{
        width: 38px;
        height: 38px;
      }
    }
  }
  .fd-step--vertical:not(:last-child)::after {
    border-bottom-width: 1px;
  }
  // [class*='fd-hairline']::after {
  //   position: absolute;
  //   box-sizing: border-box;
  //   content: ' ';
  //   pointer-events: none;
  //   top: -50%;
  //   right: -50%;
  //   bottom: -50%;
  //   left: -50%;
  //   border: 0 solid #ebedf0;
  //   -webkit-transform: scale(0.5);
  //   transform: scale(0.5);
  // }
}
</style>
