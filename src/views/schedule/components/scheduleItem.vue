<template>
  <div>
    <div v-for="(item,index) in list" :key="index" class="schedule-son2">
      <div class="schedule-son-lv2">
        <p v-if="active==2" class="myschedule-img-tx">
          <img v-if="item.facePath" :src="item.UserId==userInfo.userId?userInfo.facePath:item.facePath" alt="" class="avator" @click.stop="avaClick(item)">
          <span v-else :style="{background:item.COLOR||item.color||'#F98BB8'}" class="avator" @click.stop="avaClick(item)">
            <i v-if="item.UserId==userInfo.userId">
              {{ userInfo.name&&userInfo.name.charAt(userInfo.name.length-1) }}
            </i>
            <i v-else>
              {{ item.UserName&&item.UserName.charAt(item.UserName.length-1) }}
            </i>
          </span>
          <span class="name">{{ item.UserId==userInfo.userId?userInfo.name:item.UserName }}</span>
        </p>
        <ul :class="{'box-padding':active==2}" class="schedule-son-ul" >
          <li v-for="(schedule,idx) in item.SubList" :key="idx" @click="goDetail(schedule)">
            <div class="schedule-tag-content">
              <span class="title van-multi-ellipsis--l2">{{ schedule.title }}</span>
              <div v-if="active==='1'">
                <span v-if="schedule.meetingFocusMode === '0'" class="tag">全员可见</span>
                <span v-else-if="schedule.meetingFocusMode === '1'" class="tag">本公司可见</span>
                <span v-else-if="schedule.meetingFocusMode === '2'" class="tag">自己可见</span>
              </div>
            </div>
            <p class="firstP show-title">
              <van-icon name="underway-o" class="floatLeft"/>
              <em>{{ schedule.start }} — {{ schedule.end }}</em>
            </p>
            <!-- <div class="img-conter">
              <img v-if="(idx + 3) % 3 === 0" src="@/assets/images/icon/redDot.png" alt="">
              <img v-else-if="(idx + 2) % 3 === 0" src="@/assets/images/icon/grayDot.png" alt="">
              <img v-else src="@/assets/images/icon/blueDot.png" alt="">
            </div> -->
            <div class="img-conter">
              <img src="@/assets/images/icon/redDot.png" alt="">
            </div>
            <p class="show-title">
              <van-icon name="location-o" class="floatLeft"/>
              <em>{{ schedule.location || '--' }}</em>
            </p>
          </li>
        </ul>
      </div>
      <div v-if="active==='2'" class="schedule-border-bottom"/>
    </div>
    <div v-if="list.length==0 && flag" class="noInfo">
      暂无数据
    </div>
    <!-- <div>
        <img :src="baseConfig.domain+'static/images/wsj.png'" alt="">
      </div> -->
  </div>
  </div>
</template>

<script>
export default {
  name: 'ScheduleItem',
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    },
    date: {
      type: Date,
      default: null
    },
    type: {
      type: String,
      default: null
    },
    flag: {
      type: Number,
      default: null
    },
    active: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      userInfo: this.storage.get('yh-user')
    }
  },
  methods: {
    avaClick(item) {
      XWalkFunction.startChatPrivate(item.createLoginName)
    },
    goDetail(schedule) {
      const id = schedule.id
      if (this.active === '2') { // 关注日程
        this.$router.push({ path: '/scheduleFollowDetail', query: { id }})
      } else { // 我的日程
        this.$router.push({
          path: '/scheduleDetail',
          query: { id: schedule.id }
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.schedule-border-bottom{
  height:2px;
  width: 88%;
  background: #F0F0F0;
  margin: 0 40px;
}
.schedule-son {
  width: 100%;
  margin: 0 auto 30px auto;
  overflow: hidden;
  .myschedule-img-tx {
    padding: 0 0 0 40px;
    overflow: hidden;
    .name {
      float: left;
      height:87px;
      font-size:32px;
      font-weight:bold;
      color:rgba(76,76,76,1);
      line-height:87px;
      vertical-align: middle;
      margin-left: 20px;
    }
    .avator {
      width: 87px;
      height: 87px;
      border-radius: 100%;
      object-fit: cover;
      display: inline-block;
      float: left;
      vertical-align: middle;
      i {
        display: inline-block;
        width: 100%;
        height: 100%;
        font-size: 28px;
        text-align: center;
        line-height: 87px;
        color: white;
        font-style: normal;
      }
    }
  }
  p {
    color: #000;
    span {
      font-size: 48px;
    }
    em {
      font-size: 20px;
      font-style: normal;
    }
  }
  .fr {
    font-size: 26px;
    margin-top: 24px;
  }
  .schedule-son-lv2 {
    overflow: hidden;
    // float: left;
    width: 100%;
    padding-bottom: 0px;
    background-color: #fff;
    position: relative;
    ul {
      overflow: hidden;
      li {
        position: relative;
        text-align: left;
        font-size: 26px;
        width: 100%;
        padding-left: 68px;
        padding-right: 40px;
        overflow: hidden;
        margin-bottom: 20px;
        box-sizing: border-box;
        .show-title {
          color: rgba(153, 153, 152, 1);
          height: 44px;
          line-height: 44px;
          font-size: 24px;
        }
        .img-conter {
          position: absolute;
          left: 28px;
          top: 0px;
          width: 30px;
          height: 33px;
          z-index: 99;
          padding-top: 2px;
          background-color: #fff;
        }
        img {
          width: 26px;
          height: 26px;
          margin-top: 3px;
        }
      }
    }
  }
}
.schedule-son2 {
  width: 100%;
  margin: 0 auto 30px auto;
  overflow: hidden;
  .myschedule-img-tx {
    padding: 0 0 0 40px;
    overflow: hidden;
    .name {
      float: left;
      height:87px;
      font-size:32px;
      font-weight:bold;
      color:rgba(76,76,76,1);
      line-height:87px;
      vertical-align: middle;
      margin-left: 20px;
    }
    .avator {
      width: 87px;
      height: 87px;
      border-radius: 100%;
      object-fit: cover;
      display: inline-block;
      float: left;
      vertical-align: middle;
      i {
        display: inline-block;
        width: 100%;
        height: 100%;
        font-size: 28px;
        text-align: center;
        line-height: 87px;
        color: white;
        font-style: normal;
      }
    }
  }
  p {
    color: #000;
    span {
      font-size: 48px;
    }
    em {
      font-size: 24px;
      font-style: normal;
    }
  }
  .fr {
    font-size: 26px;
    margin-top: 24px;
  }
  .schedule-son-lv2 {
    overflow: hidden;
    width: 100%;
    padding-bottom: 0px;
    background-color: #fff;
    position: relative;
    ul {
      overflow: hidden;
      li {
        position: relative;
        text-align: left;
        font-size: 26px;
        width: 100%;
        overflow: hidden;
        padding: 0 40px 20px 68px;
        box-sizing: border-box;
        &:before {
          content: "";
          position: absolute;
          left: 40px;
          top: 40px;
          height: 100%;
          width: 2px;
          background: #e5e5e5;
          z-index: 1;
        }
        &:last-child:before {
          width: 0;
        }
        .schedule-tag-content{
          display: flex;
          justify-content: space-between;
        }
        .title {
          width: 440px;
          font-size: 28px;
          font-weight: 500;
          color: rgba(76,76,76,1);
          vertical-align: middle;
        }
        .tag {
          color: #B60005;
          border-radius: 4px;
          line-height: 36px;
          height: 36px;
          font-size: 24px;
          padding: 0px 8px;
          background:rgba(182,0,5,0.08);
        }
        .show-title {
          color: rgba(153, 153, 152, 1);
          font-weight:500;
          font-size: 24px;
          display: flex;
          align-items: center;
          em{
            padding-top: 4px;
            padding-left: 5px;
            font-style: normal;
          }
          i{
            vertical-align: middle;
          }
        }
        .firstP {
          margin-top: 11px;
        }
        .floatLeft {
          line-height: 40px;
          font-size: 24px!important;
          vertical-align: middle;
        }
        .img-conter {
          position: absolute;
          left: 28px;
          top: 0px;
          width: 30px;
          height: 33px;
          z-index: 99;
          background-color: #fff;
        }
        img {
          width: 28px;
          height: 28px;
          padding-top: 8px;
        }
      }
    }
  }
}
.box-padding{
  margin-left: 40px;
}
.schedule-son-ul {
  margin-top: 25px;
  height: auto;
  overflow: hidden;
  position: relative;
}
// .schedule-son-ul:before {
//   content: "";
//   position: absolute;
//   left: 40px;
//   height: 100%;
//   width: 2px;
//   background: #e5e5e5;
//   z-index: 1;
// }
.noInfo {
  width: 100%;
  height:40px;
  background: #fff;
  padding: 10px 0;
  font-size: 23px;
  color: rgba(188, 195, 210, 1);
  text-align: center;
  img {
    display: block;
    margin: 0 auto;
    width: 150px;
    padding-top: 40px;
  }
  .des {
    position: relative;
    top:-70px;
    background: white;
    text-align: center;
    font-size: 28px;
    color: #999;
    padding: 20px;
  }
}
</style>
