<template>
  <div class="has-comment project-home-financing">
    <headerx :cat-title="catTitle"/>
    <div class="comment-content no-comment">
      <div class="record-inner">
        <div v-for="(item,index) in followupFinancingList" :key="index" class="record-item">
          <h2>
            <span>{{ item.roundsNum }}</span>
            <span class="time">单位:{{ item.financingAmount | filterCurrency }}</span>
          </h2>
          <div class="record-item-inner">
            <p class="t1"><span>{{ item.finishTime }}</span><span>{{ item.financingAmount | filterValue }}万元</span></p>
            <div class="card">
              <van-row v-for="(sitem,sindex) in item.financingInfoList" :key="sindex" class="card-block card-block-sub">
                <van-col span="12" class="card-label">{{ sitem.inveName }}  <span v-if=" sitem.isLead==='是'" class="tag">领投</span></van-col>
                <van-col span="12" class="card-value">{{ sitem.inveAmount | filterValue }}万元</van-col>
              </van-row>
            </div>
            <van-row class="t2">
              <van-col span="12" class="card-label">最新估值</van-col>
              <van-col span="12" class="card-value">{{ item.valuationAmount | filterValue }}万元</van-col>
            </van-row>
          </div>
        </div>
        <blank v-if="followupFinancingList.length==0 && !showLoading"/>
        <loading-box v-model="showLoading"/>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  filters: {
    filterValue(value) {
      if (!value) return
      const currency = ['人民币', '美元', '欧元', '港币', '日元']
      let values = ''
      currency.forEach((item, index) => {
        const indexOf = value.indexOf(item)
        if (indexOf > -1) {
          values = value.substring(0, indexOf)
        }
      })

      value = values.toString()
      return value.replace(/^(-?)(\d+)((\.\d+)?)$/, (s, s1, s2, s3) => {
        const rex = /\d{1,3}(?=(\d{3})+$)/g
        const result = s1 + s2.replace(rex, '$&,') + s3
        return result
      })
    },
    filterCurrency(value) {
      if (!value) return
      const currency = ['人民币', '美元', '欧元', '港币', '日元']
      let values = ''
      currency.forEach((item, index) => {
        const indexOf = value.indexOf(item)
        if (indexOf > -1) {
          values = item
        }
      })
      return values
    }
  },
  data() {
    return {
      followupFinancingList: [],
      model: null,
      catTitle: '后续融资',
      showLoading: true
    }
  },
  created() {
    this.model = this.storage.get('businessObj') || {}
    const name = this.model.enName ? this.model.enName : this.model.projObjectName
    this.catTitle = name

    const projObject = this.model.projObject
    const inveId = this.model.inveId
    this.getFollowupFinancingList(projObject, inveId)
  },
  methods: {
    // 后续融资
    getFollowupFinancingList(projObject, inveId) {
      this.showLoading = true
      const URL = '/followupFinancing/followupFinancingList'
      this.$axios.get(
        URL,
        {
          pageSize: 1000,
          currPage: 1,
          projObject,
          inveId
        },
        res => {
          this.followupFinancingList = res.data
          this.showLoading = false
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.project-home-financing{
  .record-inner{
    height: 100%;
    .record-item{
      h2{
        height:88px;
        line-height: 88px;
        background:rgba(253,241,241,1);
        font-size:32px;
        font-weight:600;
        color:rgba(76,76,76,1);
        padding: 0 40px;
        display: flex;
        justify-content: space-between;
        .time{
          font-size:28px;
          font-weight:400;
          color:rgba(158,158,157,1);
        }
      }
      .record-item-inner{
        padding: 40px;
        background-color: #fff;
        .t1{
          font-size:28px;
          font-weight:600;
          color:rgba(76,76,76,1);
          display: flex;
          justify-content: space-between;
          padding-bottom: 29px;
          border-bottom: 2px dotted #F0F0F0;
        }
      }
      .card{
        padding-top:28px;
        border-bottom: 1px solid #F0F0F0;
      }
      .card-block{
        padding-bottom: 18px;
      }
      .tag{
        font-size:24px;
        font-weight:400;
        color:rgba(237,125,17,1);
        background:rgba(248,141,38,0.14);
        padding: 2px 6px;
      }
      .card-label{
        font-size:28px;
        font-weight:400;
        color:rgba(158,158,157,1);
      }
      .card-value{
        font-size:28px;
        font-weight:400;
        color:rgba(76,76,76,1);
        text-align: right;
      }
      .t2{
        padding-top: 29px;
      }
    }
  }
}
</style>
