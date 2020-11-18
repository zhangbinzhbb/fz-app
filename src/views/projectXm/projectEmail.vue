<template>
  <div class="has-comment">
    <headerx :cat-title="catTitle">
      <template slot="right"/>
    </headerx>
    <div class="comment-content no-comment">
      <div v-for="(item,index) in LIST" :key="index" class="email-item" @click="toDetail(item)">
        <h2>
          <span class="h-left">
            <img src="@/assets/images/jibenxinxi@2x.png" alt="">
            <span class="van-ellipsis van-ellipsis-w">{{ item.title }}</span>
          </span>
          <van-icon
            name="arrow"
            class="arrow-icon h-right"
          />
        </h2>
        <div class="email-item-inner">
          <div class="item">
            <span class="label">发件人</span>
            <span class="value">{{ item.senderEmail }}</span>
          </div>
          <div class="item">
            <span class="label">收件人</span>
            <span class="value">{{ item.addresseeEmail }}</span>
          </div>
          <div class="item">
            <span class="label">时间</span>
            <span class="value">{{ item.emailDate }}</span>
          </div>
          <div v-if="item.fileLists.length" class="file-con">
            <attachment :data="item.fileLists"/>
          </div>
        </div>
        <div class="grey-item"/>
      </div>
      <blank v-if="LIST.length==0 && !showLoading"/>
      <loading-box v-model="showLoading"/>
    </div>
  </div>
</template>
<script>
export default {
  components: {
    attachment: () => import('@/components/attachment/index')
  },
  data() {
    return {
      LIST: [],
      model: null,
      catTitle: '邮件往来',
      showLoading: true
    }
  },
  async created() {
    this.model = this.storage.get('businessObj') || {}
    const name = this.model.enName ? this.model.enName : this.model.projObjectName
    this.catTitle = name

    const projObject = this.model.projObject
    const inveId = this.model.inveId
    const groupId = this.model.groupId
    const memberId = this.model.memberId

    const data = await this.getEntInfoDetail(projObject, inveId, groupId, memberId)
    const email = data.email || ''
    this.getList(email)
  },
  methods: {
    toDetail(item) {
      this.$router.push({ path: '/projectEmailDetail', query: { id: item.mailId }})
    },
    getEntInfoDetail(projectObject, inveId, groupId, memberId) {
      const url = '/entInfoDetail'
      return new Promise((resolve, reject) => {
        this.$axios.get(
          url,
          {
            projectObject: projectObject,
            inveId,
            groupIdS: groupId,
            memberId
          },
          res => {
            const model = res.data.model
            this.model = model
            resolve(model)
          }
        )
      })
    },
    // 邮件往来
    getList(email) {
      this.showLoading = true
      const URL = '/mailExchage'
      this.$axios.get(
        URL,
        {
          pageSize: 1000,
          currPage: 1,
          email
        },
        res => {
          this.LIST = res.data
          this.showLoading = false
        }
      )
    }
  }
}
</script>
<style scoped lang="scss">
.email-item{
  .grey-item{
    height: 10px;
    width: 100%;
    background-color: rgba(0,0,0,0.1);
  }
  background: white;
  font-size:32px;
  font-weight:600;
  color:rgba(76,76,76,1);
  h2{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 40px 26px;
    background:rgba(253,241,241,1);
    .h-left{
      font-size:30px;
      font-weight:500;
      color:rgba(76,76,76,1);
      display: flex;
      align-items: center;
      width: 90%;
      .van-ellipsis-w{
        width:580px;
        display: inline-block;
      }
      img{
        width: 22px;
        height: 22px;
        margin-right: 11px;
      }
    }
    .h-right{
      font-size: 14PX;
    }
  }
  .email-item-inner{
    padding: 40px;
  }
  .item{
    font-size:28px;
    font-weight:400;
    color:rgba(76,76,76,1);
    line-height:200%;
    display: flex;
    .label{
      color:rgba(158,158,157,1);
      width: 120px;
    }
    .value{
      width: calc(100% - 120px);
    }
  }
  .blue{
    color: #4A90E2 !important;
  }
  .border{
    border-top: 2px solid #e8e8e8;
  }
  .file-con{
    border-top: 2px solid #e8e8e8;
    margin-top: 20px;
  }
}
</style>
