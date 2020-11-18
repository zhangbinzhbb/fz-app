<template>
  <div class="has-comment">
    <headerx :cat-title="detail?detail.fundName:'基金详情'" />
    <div class="comment-content no-comment">
      <div v-if="detail">
        <div class="fund">
          <div class="item-33">
            ¥{{ detail.planAmountDisplay }}
            <span>亿元</span>
            <div class="label">基金规模</div>
          </div>
          <div class="item-33">
            ¥{{ detail.currentAmountDisplay }}
            <span>亿元</span>
            <div class="label">当前认缴规模</div>
          </div>
          <div class="item-33">
            ¥{{ detail.raiseAmountDisplay }}
            <span>亿元</span>
            <div class="label">当前实缴规模</div>
          </div>
        </div>
        <div class="plat-contain">
          <div v-for="(item,index) in urlList" :key="index" class="item" @click="clickFunc(item)">
            <img :src="require('@/assets/images/platform/'+item.img+'.png')" alt="">
            <div class="text">{{ item.name }}</div>
          </div>
        </div>
      </div>
      <blank v-else/>
    </div>
    <loading-box v-model="showLoading"/>
  </div>
</template>
<script>
export default {
  data() {
    return {
      urlList: [
        {
          name: '工商信息',
          img: 'gongshangxinxi',
          url: 'projectDetailBusiness' // 'bizInfo'
        },
        {
          name: '基本信息',
          img: 'renyuanjiegou',
          url: 'basicInfo' // 3.5
        }, {
          name: '认缴信息',
          img: 'iconMoney',
          url: 'fundsPayment'// 3.6
        }, {
          name: '管理团队',
          img: 'iconIm',
          url: 'fundsTeam'
        }, {
          name: '投资信息',
          img: 'touzifukuan',
          url: 'fundsInv'// 3.6
        }, {
          name: '定期估值',
          img: 'guanlijijin',
          url: 'fundsEvalue' // 3.12
        }, {
          name: '基金业绩',
          img: 'tongjitianbao',
          url: 'fundsAchieve'// 3.8
        }, {
          name: '定期报告',
          img: 'jinyingjihua',
          url: 'fundsReport'// 3.10
        },
        // {
        //   name: '基金事项决策',
        //   img: 'touzijuece',
        //   url: 'fundsContract' // 3.7
        // },
        {
          name: '会议纪要',
          img: 'iconInfo',
          url: 'fundsMeetingRecordList'
        }, {
          name: '邮件往来',
          img: 'zhongyaoshixiang',
          url: 'fundsEmail'
        }, {
          name: '文件库',
          img: 'wenjianku',
          url: 'fundsFolder'
        }],
      funId: this.$route.query.id,
      type: this.$route.query.type || '',
      detail: {},
      showLoading: true
    }
  },
  created() {
    const type = this.type
    const funId = this.funId
    if (type === 'fund') {
      this.$axios.get('/fundInfoListByUserId', {
        fundId: funId,
        keyWord: '',
        currPage: 1,
        length: 10
      }, res => {
        this.showLoading = false
        this.storage.set('fundDetail', res.data[0])
        this.detail = res.data[0]
      })
      return
    }

    this.showLoading = false
    this.getDetail()
  },
  methods: {
    getDetail() {
      const fundDetail = this.storage.get('fundDetail')
      if (fundDetail) {
        this.detail = fundDetail
      }
    },
    clickFunc(item) {
      if (item.url === 'projectDetailBusiness') {
        this.$router.push({ path: item.url, query: { projObject: this.detail.enteId }})
        return
      }
      if (item.url === 'fundsMeetingRecordList') {
        this.$router.push({ path: item.url, query: { id: this.$route.query.id, enteId: this.detail.enteId }})
        return
      }
      this.$router.push({ path: item.url, query: this.$route.query })
    }
  }
}
</script>
<style scoped lang="scss">
.fund{
  background: white;
  text-align: center;
  padding: 30px 0;
  .item-33{
    font-size:46px;
    font-weight:bold;
    color:rgba(248,141,38,1);
    line-height:67px;
    text-align: center;
    width: 30%;
    display: inline-block;
    span{
      font-size:26px;
    }
    .label{
      font-size:24px;
      font-weight:500;
      color:rgba(158,158,157,1);
      line-height:33px;
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
// .list-item{
//   margin-top: 20px;
//   background: white;
//   position: relative;
//   img{
//     width: 102px;
//   }
//   .list{
//     position: absolute;
//     right: 0;
//     top: 0;
//     padding-left: 130px;
//     width: 100%;
//     box-sizing: border-box;
//     .item{
//       font-size:28px;
//       font-weight:500;
//       color:rgba(76,76,76,1);
//       line-height:40px;
//       height: 98px;
//       line-height: 99px;
//       border-bottom: 2px solid #e8e8e8;
//       &:last-child{
//         border-bottom: 0;
//       }
//     }
//     i{
//       float: right;
//       margin-top: 36px;
//       margin-right: 30px;
//       font-size:28px;
//       color:rgba(188,195,210,1);
//     }
//   }
// }
</style>
