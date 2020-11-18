<template>
  <div v-if="timeObj" class="room-list">
    <h2>{{ timeObj.title }}</h2>
    <div class="room-box">
      <ul :class="{'isBackgroundColor':num%2 !==0}" class="meeting-room-time-list" >
        <li v-for="(item,index) in time" :key="index" class="time-tag">{{ item.label }}</li>
      </ul>
      <div v-for="(item,index) in timeObj.list" :key="index" :style="{'top':item.top + '%','height':item.h +'%'}" class="room-select-list" >
        <div class="center-title">
          <span>{{ item.name }}</span>
          <span class="br">|</span>
          <span>{{ item.name1 }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixins from './mixins/index'
export default {
  mixins: [mixins],
  props: {
    timeObj: {
      type: Object,
      default: () => {}
    },
    num: [String, Number]
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.room-active{
  font-weight:bold;
  color:rgba(182,0,5,1) !important;
  border-left: 4px solid rgba(182,0,5,1);
  background:rgba(253,241,241,1)!important;
}
.isBackgroundColor{
  .time-tag{
    background-color: #f8f8f8!important;
  }
}
.room-list{
  box-sizing: border-box;
  overflow: hidden;
  h2{
    font-size:28px;
    font-weight:500;
    color:rgba(76,76,76,1);
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80px;
    line-height: normal;
    padding: 0 5px;
    box-sizing: border-box;
    text-align: center;

    overflow:hidden;
    text-overflow:ellipsis;
    display:-webkit-box;
    -webkit-box-orient:vertical;
    -webkit-line-clamp:2;
  }
  .room-box{
    position: relative;
    .meeting-room-time-list{
      border-right: 2px solid rgba(233,233,233,1);
      .time-tag{
        font-size:28px;
        font-weight:500;
        color:#fff;
        height: 90px;
        line-height: 90px;
        text-align: center;
        background:#fff;
        box-sizing: border-box;
        &:first-child{
          border-top: 1px solid rgba(233,233,233,1);
        }
        &:last-child{
          border-top: 1px solid rgba(233,233,233,1);
        }
        &+li{
          border-top: 1px solid rgba(233,233,233,1);
        }
      }
    }
    .room-select-list{
      position: absolute;
      width: 100%;
      background:rgba(253,241,241,1);
      display: flex;
      align-items: center;
      justify-content: center;
      border-left: 4px solid #B60005;
      .center-title{
        font-size:28px;
        font-weight:bold;
        color:rgba(182,0,5,1);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .br{
          padding:2px 0;
        }
      }
    }
  }
}
</style>

