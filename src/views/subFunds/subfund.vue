<template>
  <div class="has-comment">
    <headerx :cat-title="this.$route.query.projName || detail.projObjectName"/>
    <!--搜获-->
    <div class="comment-content no-comment">
      <div class="fund">
        <!--        <div class="item-33 item-100">-->
        <!--          {{ detail.currentRatio ||'&#45;&#45;' }}-->
        <!--          <span v-if="detail.currentRatio">%</span>-->
        <!--          <div class="label">最新占比</div>-->
        <!--        </div>-->
        <p v-if="detail['inveName'] || detail['projStatus']" class="item">
          <span :class="{'label':detail['inveName']}">{{ detail['inveName']||'' }}</span>
          <span :class="{'label':detail['projStatus']}">{{ detail['projStatus']||'' }}</span>
        </p>
        <div class="item-33">
          {{ filterMoneyY(subFundAmontDisplay) }}
          <span>亿元</span>
          <div class="label">子基金规模</div>
        </div>
        <div class="item-33">
          {{ filterMoneyY(currentAmountDisplay) }}
          <span>亿元</span>
          <div class="label">认缴金额</div>
        </div>
        <div v-if="checkPermission('50020100')" class="info-div">
          <p v-if="detail['inveName'] || detail['projStatus']" class="item">
<!--            <span :class="{'label':detail['inveName']}">{{ detail['inveName']||'' }}</span>-->
<!--            <span :class="{'label':detail['projStatus']}">{{ detail['projStatus']||'' }}</span>-->
          </p>
          <p v-for="(item,key) in topInfoForm" :key="key" class="item">
            {{ item.label }}
            <span v-if="key!=topInfoForm.length-1"> <span :class="{'label':detail[item.name]}">{{ detail[item.name]||'--' }}</span> </span>
            <span v-else>
              <span v-show="!showAll">
                {{ isToggleAll(true, showDesAll?detail[item.name+'Origin']:detail[item.name]) ||'--' }}
                <span
                  v-if="detail[item.name]&&detail[item.name].length>50"
                  class="active-money active-text"
                  @click="toggleAll"
                >
                  展开</span>
              </span>
              <span v-show="showAll">
                {{ showDesAll?detail[item.name+'Origin']:detail[item.name] ||'--' }}
                <span
                  v-if="detail[item.name]&&detail[item.name].length>50"
                  class="active-money active-text"
                  @click="toggleAll"
                >
                  收起</span>
              </span>
            </span>

            <span v-if="item.filter=='money'" class="active-money"> {{ detail[item.name]|formatMoney }} </span>
          </p>
        </div>
      </div>
      <div class="plat-contain">
        <div v-for="(item,index) in urlList" :key="index" class="item" @click="toUrl(item, index)">
          <img :src="require('@/assets/images/platform/'+item.img+'.png')" alt="">
          <div class="text">{{ item.name }}</div>
          <!--          <span class="num"> 1</span>-->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  filters: {
    formatter_RMB(v) {
      if (v) { return (v / 100000000).toFixed(2) }
      return v
    }
  },
  data() {
    return {
      showAll: false,
      subFundAmontDisplay: this.$route.query.subFundAmontDisplay,
      currentAmountDisplay: this.$route.query.currentAmountDisplay,
      detail: {},
      foudsId: this.$route.query.id,
      topInfoForm: [
        {
          label: '项目成员',
          name: 'memberName'
        },
        {
          label: '项目概况',
          name: 'projOverview'
        }
      ],
      urlList: [{
        name: '工商信息',
        img: 'gongshangxinxi',
        url: 'projectDetailBusiness'
      }, {
        name: '子基金投资',
        img: 'touzifukuan',
        url: 'subFundsInv'// 3.6
      }, {
        name: '现金流',
        img: 'guanlijijin',
        url: 'subfundCash' // 3.12
      }, {
        name: '文件库',
        img: 'wenjianku',
        url: 'subfundFiles'
      }],
      permission: ''
    }
  },
  computed: {
    checkPermission(key) {
      return function(key) {
        let result = false
        if (this.permission.indexOf(key) > -1) {
          result = true
        }
        return result
      }
    }
  },
  created() {
    this.getDetail()
    this.getPermission()
  },
  methods: {
    // 换算为亿
    filterMoneyY(value) {
      const k = 100000000
      let rmAndA = '￥'
      if (value.indexOf('人民币') != -1) {
        rmAndA = '￥'
      } else if (value.indexOf('美元') != -1) {
        rmAndA = '$'
      }
      if (value.indexOf('万元') != -1) {
        const value1 = parseFloat(value) * 10000
        value = ((value1 / k).toFixed(2))
      } else if (value.indexOf('亿元') != -1) {
        const value2 = parseFloat(value)
        value = ((value2).toFixed(2))
      }
      return rmAndA + value
    },
    toUrl(item, index) {
      if (index === 0) {
        this.$router.push({
          path: item.url, query: { projObject: this.detail.projObject }
        })
      } else {
        this.$router.push({
          path: item.url, query: this.$route.query
        })
      }
    },
    isToggleAll(status, content) {
      return (status, content) => {
        if (content && content.length > 50) {
          content = content.substring(0, 48) + '...'
        } else {
          content = '--'
        }
        return content
      }
    },
    toggleAll() {
      this.showAll = !this.showAll
    },
    getDetail() {
      this.$axios.get('/projInfoDetail/' + this.$route.query.id, null, res => {
        console.log(res)
        this.detail = res.data.model
        this.subFundAmontDisplay = res.data.model.subFundAmontDisplay
        this.currentAmountDisplay = res.data.model.currentAmountDisplay
        res.data.model.projStatus = this.getProjectStatus(
          res.data.model.projStatus
        )
      })
    },
    getPermission() {
      this.$axios.get(
        'appFuncPermissionList',
        { fatherid: 5002, projId: this.foudsId },
        res => {
          const arr = []
          res.data.map(item => {
            item.childList.map(value => {
              arr.push(value.id)
            })
          })
          this.permission = arr.join(',')
          this.getDetail()
        }
      )
    },
    getProjectStatus(val, type) {
      type = type || 'PROJECTSTATUS'
      const arr = this[type].split(',')
      let string
      arr.map((item, index) => {
        if (Number(val) === index) {
          string = item
        }
      })
      return string
    }
  }
}
</script>
<style scoped lang="scss">
.fund{
  background: white;
  text-align: center;
  padding: 30px 0;
  position: relative;
  padding-top: 60px;
  .item:nth-of-type(1){
    text-align: right;
    display: block;
    width: 100%;
    text-align: center;
    span{
      width:auto;
      font-size: 26px;
      display: inline-block;
      vertical-align: top;
    }
    span.label:first-child{
      padding: 7px 20px;
      /*background:rgba(182,0,5,0.1);*/
      font-size:34px;
      font-weight:500;
      /*color:#000 !important;*/
      margin-right: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    span.label:nth-of-type(2){
      padding: 7px 20px;
      color:rgba(182,0,5,1) !important;
      background:rgba(182,0,5,0.1);
      position: absolute;
      top:0;
      right:0
    }
  }
  .item-33{
    font-size:46px;
    font-weight:bold;
    color:rgba(248,141,38,1);
    line-height:67px;
    text-align: center;
    width: 47%;
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
  .item-100{
    width:100%
  }
  .info-div{
    padding:20px 6%;
    padding-top:0px;
    font-size:28px;
    font-family:PingFangSC-Medium,PingFang SC;
    font-weight:500;
    color: #888!important;
    line-height:40px;
    padding-bottom:0;
    text-align: left;
    position: initial;
    .item{
      padding-top:10px;
      display: flex;
      justify-content: space-between;
      color: #888;
      >span{
        width: 70%;
        text-align: right;
        span{
          color:rgba(76,76,76,1)!important;
        }
      }
    }
    .item:nth-of-type(2),.item:last-child{
      display: block;
      span{
        display: block;
        text-align: left;
        width:100%;
        word-break: break-word;
      }
      span.active-text{
        display: inline;
        color: #4a90e2!important;
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
.info-div p{
  padding-left:0;
  padding-right:0;
}
</style>
