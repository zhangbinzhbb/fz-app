<template>
  <div class="platStaticsFinished has-comment">
    <headerx :cat-title="catTitle"/>
    <div class="comment-content no-comment">
      <div v-for="(item,index) in list" :key="index" class="statics-item">
        <div class="section">
          <img src="@/assets/images/platform/logo.jpg">
          <div class="content">
            <!-- <h2>{{ item.enterName || '--' }}</h2> -->
            <p class="t t1">
              <span class="label">填报人</span>
              <span class="value">{{ item.name || '--' }}</span>
            </p>
            <p class="t t2">
              <span class="label">出资主体</span>
              <span class="value">{{ item.investName || '--' }}</span>
            </p>
          </div>
        </div>
        <div class="section-menu">
          <div class="section-menu-1">
            <p class="label">推送时间</p>
            <p class="value">{{ '--' }}</p>
          </div>
          <div class="section-menu-1">
            <p class="label">填写时间</p>
            <p v-if="item.finishedTime==='-'" class="value">{{ '--' }}</p>
            <p v-else class="value">{{ item.finishedTime | timeN }}</p>
          </div>
          <div class="section-menu-1">
            <p class="label">截止时间</p>
            <p class="value">{{ item.endTime || '--' }}</p>
          </div>
        </div>
      </div>
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
.platStaticsFinished{
  .statics-item{
    padding: 40px;
    background-color: #fff;
    &+.statics-item{
      margin-top: 18px;
    }
    .section{
      display: flex;
      align-items: center;
      img{
        width:160px;
        height:133px;
      }
      .content{
        padding-left: 40px;
        h2{
          font-size:28px;
          font-weight:500;
          color:rgba(76,76,76,1);
        }
        .t{
          display: flex;
          .label{
            width: 134px;
            font-size:26px;
            font-weight:500;
            color:rgba(158,158,157,1);
          }
          .value{
            font-size:26px;
            font-weight:500;
            color:rgba(76,76,76,1);
          }
        }
        .t1{
          padding-top: 46px;
        }
        .t2{
          padding-top: 14px;
        }
      }
    }
    .section-menu{
      padding-top: 60px;
      display: flex;
      .section-menu-1{
        flex: 1;
        text-align: center;
        position: relative;
        &+.section-menu-1{
          &::after{
            content: '';
            position: absolute;
            top: 10px;
            left: 0;
            width:2px;
            height:40px;
            background:rgba(215,215,215,1);
          }
        }
        .label{
          font-size:26px;
          font-weight:500;
          color:rgba(158,158,157,1);
        }
        .value{
          padding-top: 10px;
          font-size:28px;
          font-weight:500;
          color:rgba(76,76,76,1);
        }
      }
    }
  }
}
</style>
