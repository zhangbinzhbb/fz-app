<template>
  <div class="has-comment schedule-details">
    <headerx cat-title="日程详情" />
    <div v-if="model" class="schedule-detail-pages">
      <div class="header">
        <div class="pic">
          <img v-if="model.USER_FACE_PATH" :src="model.USER_FACE_PATH" alt="" srcset="">
          <span v-else class="people">{{ model.USER_NAME | formatName }}</span>
        </div>
        <p class="name">{{ model.USER_NAME }}</p>
        <p v-if="model.ISANGET==='1'" class="desc">（代理人：{{ model.ANGET_NAME }}）</p>
      </div>
      <div class="list-content mt-18">
        <div class="title">
          <p>{{ model.SCHEDULE_TITLE }}</p>
          <!-- <span v-if="model.MEETING_FOCUS_MODE === '0'" >全员可见</span>
          <span v-else-if="model.MEETING_FOCUS_MODE === '1'" >自己可见</span>
          <span v-else-if="model.MEETING_FOCUS_MODE === '2'" >本公司可见</span> -->
        </div>
        <p class="name">安排人：{{ model.ANGET_NAME }}</p>
        <p class="time">
          <van-icon name="clock-o" />  {{ model.START_TIME }} - {{ model.END_TIME }}
        </p>
        <p class="time">
          <van-icon name="location-o" />  {{ model.LOCATION || '--' }}
        </p>
      </div>
      <div v-if="model.SCHEDULE_CONTENT" class="desc mt-18">
        {{ model.SCHEDULE_CONTENT }}
      </div>
      <div class="user-list mt-18">
        <p class="title-top">
          <span>同步他人</span>
          <span>共{{ model.scheduleuserList.length }}人</span>
        </p>
        <div v-if="userList.length" class="user-ls-nav">
          <ul class="user-list-content">
            <li v-for="item in userList" :key="item.value" class="user-item">
              <div class="item-pic" >
                <img v-if="item.src" :src="item.src" alt="" srcset="">
                <span v-else>{{ item.label | formatName }}</span>
              </div>
              <span class="item-name van-ellipsis">{{ item.label }}</span>
            </li>
          </ul>
          <van-icon name="more-o" class="more-o" @click="$router.push({ path: '/scheduleUserList', query: { id } })"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      model: null,
      id: ''
    }
  },
  computed: {
    userList() {
      const list = this.model.scheduleuserList
      const arr = list.length > 5 ? list.slice(0, 5) : list
      const newList = arr.map(item => {
        return {
          label: item.NAME,
          value: item.ID,
          src: item.FACE_PATH
        }
      })
      return newList
    }
  },
  created() {
    this.id = this.$route.query.id
    this.getDetail(this.id)
  },
  methods: {
    getDetail(id) {
      if (id > 0) {
        this.$axios.post(
          '/agendaAction/agendaDetail.do',
          { AGENDA_ID: id },
          res => {
            this.model = res.dataContent
          }
        )
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.mt-18{
  margin-top: 18px;
}
.user-ls-nav{
  display: flex;
  justify-content: flex-end;
  .more-o{
    margin-top:20px;
    margin-left: 33px;
  }
}
.user-list-content{
  display: flex;
  justify-content: flex-end;
  padding-top: 20px;
  .user-item{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: 33px;
    .item-pic{
      width:68px;
      height:68px;
      background:rgba(255,255,255,1);
      border-radius:50%;
      box-shadow: 2px 2px 8px #ccc;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      img{
        width:60px;
        height:60px;
        border-radius:30px;
      }
      span{
        width:60px;
        height:60px;
        background:rgba(248,181,38,1);
        border-radius:47px;
        font-size:20px;
        font-weight:500;
        color:rgba(255,255,255,1);
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .item-name{
      width: 80px;
      height:33px;
      font-size:24px;
      font-weight:500;
      color:rgba(76,76,76,1);
      line-height:33px;
      padding-top: 12px;
    }
  }
}
.schedule-details{
  height: 100%;
  background:rgba(248,248,248,1);
  .schedule-detail-pages{
    .header{
      height:281px;
      background:rgba(255,255,255,1);
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .pic{
        span{
          width:112px;
          height:112px;
          border-radius:50%;
          background:rgba(248,181,38,1);
          font-size:30px;
          font-weight:500;
          color:rgba(255,255,255,1);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        img{
          width:112px;
          height:112px;
          border-radius:50%;
          display: block;
        }
      }
      .name{
        font-size:30px;
        font-weight:500;
        color:rgba(76,76,76,1);
        padding-top: 5px;
      }
      .desc{
        font-size:24px;
        font-weight:400;
        color:rgba(153,153,152,1);
      }
    }
    .list-content{
      background:rgba(255,255,255,1);
      padding: 40px;
      .title{
        font-size:28px;
        font-weight:500;
        color:rgba(76,76,76,1);
        display: flex;
        justify-content: space-between;
        p{
          width: 74%;
          overflow : hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        span{
          color: #B60005;
          border-radius: 4px;
          line-height: 36px;
          height: 36px;
          font-size: 24px;
          padding: 0px 8px;
          background:rgba(182,0,5,0.08);
        }
      }
      .name{
        font-size:24px;
        font-weight:400;
        color:rgba(76,76,76,1);
        line-height:33px;
        padding-top: 8px;
        padding-bottom: 30px;
      }
      .time{
        font-size:24px;
        font-weight:500;
        color:rgba(153,153,152,1);
        display: flex;
        align-items: center;
        height:44px;
        .van-icon{
          padding-right: 5px;
        }
      }
    }
    .desc{
      background:rgba(255,255,255,1);
      padding: 40px;
      font-size:28px;
      font-weight:500;
      color:rgba(76,76,76,1);
      line-height:40px;
    }
    .user-list{
      background:rgba(255,255,255,1);
      padding: 40px;
      .title-top{
        font-size:28px;
        font-weight:500;
        color:rgba(158,158,157,1);
        line-height:40px;
        display: flex;
        justify-content: space-between;
      }
    }
  }
}
</style>

