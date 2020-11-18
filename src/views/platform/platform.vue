<template>
  <div id="Knowledge" class="newsarticle has-comment">
    <headerx :cat-title="platName"/>
    <div class="comment-content no-comment">
      <div class="basic">
        <div class="des">
          <img src="@/assets/images/platform/logo1.jpg">
          <p>
            <span v-if="detail.platTypeName" class="type">{{ detail.platTypeName }}</span>
            <span v-if="detail.rmbCurrentAmount && (detail.entId==='0' || detail.platType==='1')" class="number">{{ detail.rmbCurrentAmount | investAmountFilters }}</span>
          </p>
        </div>
        <div class="grid-list">
          <div class="grid-item">
            <span class="label">法定代表人</span>
            <span class="value">{{ entInfoDetail.operName || '--' }}</span>
          </div>
          <div class="grid-item">
            <span class="label">认缴资本</span>
            <span v-if="entInfoDetail.registAmount" class="value van-ellipsis">￥{{ entInfoDetail.registAmount | formatMoney }}元</span>
            <span v-else class="value van-ellipsis">--</span>
          </div>
          <div class="grid-item">
            <span class="label">成立日期</span>
            <span class="value">{{ entInfoDetail.startDate || '--' }}</span>
          </div>
        </div>
      </div>
      <div class="plat-contain">
        <div v-for="(item,index) in list" :key="index" class="item" @click="toRouter(item)">
          <img :src="require('@/assets/images/platform/'+item.img+'.png')" alt="">
          <div class="text">{{ item.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  filters: {
    investAmountFilters(value) {
      if (!value) {
        return '--'
      }
      const str = value.split(' ')
      return `￥${str[0]}${str[1]}`
    }
  },
  data() {
    return {
      platName: this.$route.query.platName,
      platFormId: this.$route.query.pkId,
      detail: {},
      entInfoDetail: {},
      list: []
    }
  },
  activated() {
    // 投资决策 、重要事项、投资付款，只有元禾控股平台有这三个功能
    const groupId = this.$route.query.groupId
    const list = [
      { name: '工商信息', img: 'gongshangxinxi', url: 'bizInfo' }, // 添加对外投资
      { name: '人员结构', img: 'renyuanjiegou', url: 'personStructure' },
      { name: '经营计划', img: 'jinyingjihua', url: 'bizPlan' },
      { name: '管理基金', img: 'guanlijijin', url: 'platFunds' },
      { name: '填报统计', img: 'tongjitianbao', url: 'platStatics' },
      { name: '合同签署', img: 'zhongyaoshixiang', url: 'bizContract' },
      { name: '文件库', img: 'wenjianku', url: 'platFiles' },
      { name: '投资决策', img: 'touzijuece', url: 'invDecision' },
      { name: '重要事项', img: 'zhongyaoshixiang', url: 'keyPoint' },
      { name: '投资付款', img: 'touzifukuan', url: 'invPay' }
    ]
    if (groupId !== '4') {
      list.forEach((item, index) => {
        if (item.name === '投资决策') {
          list.splice(index, 3)
        }
      })
    }
    this.list = list
  },
  methods: {
    getDetail() {
      this.$axios.get(`/platformInfo/platInfoDetail/${this.platFormId}`, null, res => {
        this.$nextTick(() => {
          this.detail = res.data.model
          console.log('this.detail:', this.detail)
        })
      })
      const Url = `/entBaseInfo/entInfoDetail/${this.platFormId}`
      this.$axios.get(Url, null, res => {
        const data = res.data
        const arr = Object.keys(data)
        if (arr.length === 0) {
          this.entInfoDetail = {
            operName: null,
            registAmount: null,
            startDate: null
          }
          return
        }
        this.entInfoDetail = res.data.model
      })
    },
    toRouter(item) {
      const pkId = this.$route.query.pkId
      const groupId = this.$route.query.groupId
      const groupName = this.$route.query.platName
      const entId = this.$route.query.entId
      if (item.name === '工商信息') {
        this.$router.push({ path: '/projectDetailBusiness', query: { projObject: this.platFormId }})
        return
      }
      if (item.name === '人员结构') {
        this.$router.push({ path: `/${item.url}`, query: { groupId }})
        return
      }
      if (item.name === '经营计划') {
        this.$router.push({ path: `/${item.url}`, query: { pkId, groupId, entId }})
        return
      }
      if (item.name === '管理基金') {
        this.$router.push({ path: `/${item.url}`, query: { pkId, groupId, entId }})
        return
      }
      if (item.name === '合同签署') {
        this.$router.push({ path: `/${item.url}`, query: { pkId, groupId }})
        return
      }
      if (item.name === '投资决策') {
        this.$router.push({ path: `/${item.url}`, query: { pkId, groupId }})
        return
      }
      if (item.name === '重要事项') {
        this.$router.push({ path: `/${item.url}`, query: { pkId, groupId }})
        return
      }
      if (item.name === '填报统计') {
        this.$router.push({ path: `/${item.url}`, query: { pkId, groupId, groupName }})
        return
      }
      if (item.name === '投资付款') {
        this.$router.push({ path: `/${item.url}`, query: { pkId, groupId }})
        return
      }
      if (item.name === '文件库') {
        this.$router.push({ path: `/${item.url}`, query: { pkId, groupId }})
        return
      }
      this.$router.push({ path: `/${item.url}` })
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name === 'platformList') {
        vm.platName = vm.$route.query.platName
        vm.platFormId = vm.$route.query.pkId
        vm.getDetail()
      }
    })
  }
}
</script>
<style scoped lang="scss">
.grid-list{
  display: flex;
  padding-top: 40px;
  .grid-item{
    width: 33.33%;
    display: flex;
    flex-direction: column;
    position: relative;
    box-sizing: border-box;
    padding: 0 10px;
    &+.grid-item{
      &::after{
        content: '';
        width:2px;
        height:30px;
        background:rgba(215,215,215,1);
        opacity:0.39;
        position: absolute;
        top: 21px;
      }
    }
    span{
      text-align: center;
    }
    .label{
      height:37px;
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
}
.basic{
  height:368px;
  background:rgba(255,255,255,1);
  position: relative;
  .des{
    padding-top: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    img{
      width: 238px;
      height: 74px;
    }
    .type{
      padding: 4px 10px;
      background:rgba(248,187,57,0.23);
      font-size:22px;
      font-weight:400;
      color:rgba(232,158,0,1);
    }
    .number{
      padding: 4px 10px;
      background:rgba(49, 149, 252, 0.23);
      font-size:22px;
      font-weight:400;
      color:#3195FC;
    }
  }
  .colums{
    font-size:26px;
    font-weight:500;
    color:rgba(158,158,157,1);
    line-height:37px;
    text-align: center;
    padding-top: 40px;
    .item{
      display: inline-block;
      width: 30%;
      position: relative;
      .btm{
        display: block;
        color: #4C4C4C;
        margin-top: 10px;
      }
      &:after{
        content:'|';
        position: absolute;
        top: 20px;
        right: 0;
        color: #D7D7D7;
      }
      &:last-child:after{
        content: none;
      }
    }
  }
}
.plat-contain{
  background: white;
  margin-top: 20px;
  .item{
    display: inline-block;
    width: 33%;
    position: relative;
    height: 182px;
    border-bottom: 2px solid #e8e8e8;
    text-align: center;
    padding-top: 30px;
    box-sizing: border-box;
    &:after{
      content:'';
      display: inline-block;
      height: 102px;
      border-right:2px solid #F0F0F0;
      position: absolute;
      right: 0;
      top: 40px;
    }
    &:nth-child(3n):after{
      content:none
    }
    img{
      width:37px;
      height:37px;
      margin: 10px;
    }
    .text{
      line-height:40px;
      font-size:28px;
      font-weight:500;
      color:rgba(76,76,76,1);
    }
    .num{
      position: absolute;
      top:20px;
      right: 20px;
      font-size:24px;
      font-weight:400;
      color:rgba(76,76,76,0.5);
    }
  }
}
</style>
