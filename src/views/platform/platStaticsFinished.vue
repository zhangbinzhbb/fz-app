<template>
  <div class="platStaticsNotFinished has-comment">
    <headerx :cat-title="catTitle"/>
    <div class="comment-content no-comment">
      <div v-for="(item,index) in list" :key="index" class="statics-item">
        <div class="content">
          <van-row class="content-1">
            <van-col span="24">
              <p class="header-title">
                <span>{{ item.enterName || item.fundName || '--' }}</span>
                <span v-if="item.investName">{{ item.investName || '--' }}</span>
              </p>
            </van-col>
          </van-row>
          <van-row class="content-1">
            <van-col span="8">
              <p class="label">推送时间</p>
              <p class="value">{{ item.createDt || item.baseDate || '--' }}</p>
            </van-col>
            <van-col span="8">
              <p class="label">截止时间</p>
              <p v-if="item.endTime==='-'" class="value">{{ '--' }}</p>
              <p v-else class="value">{{ item.endTime || '--' }}</p>
            </van-col>
            <van-col span="8">
              <p class="label">填写时间</p>
              <p v-if="item.finishedTime==='-'" class="value">{{ '-' }}
                <span v-if="item.countDown&&item.countDown!=='-'" class="tag-time">{{ item.countDown || '--' }}</span>
              </p>
              <p v-else class="value">{{ item.finishedTime | timeN }}
                <span v-if="item.countDown&&item.countDown!=='-'" class="tag-time">{{ item.countDown || '--' }}</span>
              </p>
            </van-col>
          </van-row>
        </div>
      </div>
      <blank v-if="list.length==0"/>
    </div>
  </div>
</template>
<script>

export default {
  filters: {
    timeN(value) {
      if (!value) {
        return '--'
      }
      return value.split(' ')[0]
    }
  },
  data() {
    return {
      list: [],
      catTitle: '',
      name: this.$route.query.name || ''
    }
  },
  created() {
    this.catTitle = `${this.name}-已完成`
    this.getEiMyHandle()
  },
  methods: {
    getEiMyHandle() {
      const type = this.$route.query.type
      let URL = '/eiMyHandle/eiMyHandleDetailOperation'
      if (type === '2') {
        URL = '/eiPushFund/eiPushFundDetailOperation'
      }
      const keyword = this.name
      const sendMouth = ''
      const sendMouthStart = this.$route.query.time
      const sendMouthEnd = this.$route.query.time
      const groupId = this.$route.query.groupId
      const inveId = ''
      const isFinished = '1'
      const pageSize = 50
      const currPage = 1

      this.$axios.postJson(URL, {
        keyword,
        sendMouth,
        sendMouthStart,
        sendMouthEnd,
        groupId,
        inveId,
        isFinished,
        pageSize,
        currPage
      }, res => {
        this.list = res.data
      })
    }
  }
}
</script>
<style scoped lang="scss">
.platStaticsNotFinished{
  .header-title{
    font-size:24px;
    font-weight:500;
    color:rgba(76,76,76,1);
    display: flex;
    justify-content: space-between;
    span{
      &:first-child{
        width: 70%;
      }
    }
  }
  .statics-item{
    padding: 40px;
    background-color: #fff;
    &+.statics-item{
      margin-top: 18px;
    }
    h2{
      font-size:28px;
      font-weight:500;
      color:rgba(76,76,76,1);
    }
    .content{
      .content-1{
        &+.content-1{
          padding-top: 45px;
        }
      }
      .label{
        font-size:24px;
        font-weight:500;
        color:rgba(158,158,157,1);
      }
      .value{
        font-size:28px;
        font-weight:500;
        color:rgba(76,76,76,1);
        padding-top: 6px;
      }
      .value-time{
        display: flex;
        align-items: center;
      }
      .time{
        padding-right: 40px;
      }
      .t-img{
        width: 26px;
        height: 30px;
        padding-right: 10px;
      }
      .tag-time{
        padding: 0 5px;
        height:27px;
        line-height: 27px;
        background:rgba(182,0,5,1);
        border-radius:3px;
        font-size:19px;
        font-weight:bold;
        color:rgba(255,255,255,1);
      }
    }
  }
}
</style>
