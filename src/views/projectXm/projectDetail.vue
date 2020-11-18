<template>
  <div class="has-comment project-home-detail">
    <headerx :cat-title="catTitle"/>
    <div v-if="!showLoading" class="comment-content no-comment">
      <div v-if="noData.length">
        <div class="header">
          <span v-if="model.inveName" class="tag-s">{{ model.inveName }}</span>
          <div>
            <ul class="header-grid">
              <li v-if="model.projStatus==='-'">
                <p class="money"> <span>￥{{ model.rmbIntendedAmountJC|amountFilter }}</span>万元</p>
                <p class="name">累计决策金额</p>
              </li>
              <li v-else>
                <p class="money"><span>￥{{ model.allRequestMoney|amountFilter }}</span>万元</p>
                <p class="name">累计出资金额</p>
              </li>
              <li>
                <p class="money"><span>{{ model.projStatus==='14'?'0':model.shareRatio?model.shareRatio:'-' }}</span></p>
                <p class="name">最新占比</p>
              </li>
            </ul>
          </div>
        </div>
        <div class="menu-list">
          <div class="fd-grid-contanier">
            <div class="plat-contain">
              <div v-for="(item,index) in list" :key="index" class="item" @click="goToRouter(item)">
                <img :src="require('@/assets/images/platform/'+item.img+'.png')" alt="">
                <div class="text">{{ item.name }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <blank v-else/>
    </div>
    <loading-box v-model="showLoading"/>
  </div>
</template>

<script>
// 累计出资金额（或累计决策金额）【如果为状态为决策，则显示决策金额，如果为出资之后，则显示为出资金额】
// 最新占比（没有出资有合同签定，取合同协议，如果出资则取定期更新,如果是全部退出则为0）
// 5、15 为决策
// 11 为出资
export default {
  components: {
    'grid-item': () => import('./components/gridItem')
  },
  filters: {
    amountFilter(value) {
      if (!value) return
      const index = value.indexOf('万元')
      const n = value.substr(0, index)
      const vv = Math.pow(10, 2) // 保留2位小数，四舍五入
      const result = Math.round(n * vv) / vv
      // const result = n
      return result
    }
  },
  data() {
    return {
      model: {
        inveName: ''
      },
      catTitle: '',
      // 扫项目和基金二维码跳转到项目企业维度详情
      type: this.$route.query.type || '',
      groupId: this.$route.query.groupId || '',
      inveId: this.$route.query.inveId || '',
      projObject: this.$route.query.projObject || '',
      listArray: [
        { name: '工商信息', img: 'gongshangxinxi', url: 'projectDetailBusiness' },
        { name: '基本信息', img: 'renyuanjiegou', url: 'projectBasicInfo' },
        { name: '更新记录', img: 'jinyingjihua', url: 'projectChangeRecord' },
        { name: '投资信息', img: 'guanlijijin', url: 'projectProgress' },
        { name: '项目进展', img: 'tongjitianbao', url: 'projectXmProgress' },
        { name: '后续融资', img: 'wenjianku', url: 'projectFinancing' },
        { name: '定期报告', img: 'touzijuece', url: 'projectAssess' },
        { name: '人事财务', img: 'zhongyaoshixiang', url: 'projectMoney' },
        { name: '合同签署', img: 'touzifukuan', url: 'projectContract' },
        { name: '重要事项', img: 'zhongyaoshixiang', url: 'projectImportant' },
        { name: '上市公司公告', img: 'touzifukuan', url: 'projectList' },
        { name: '现金流', img: 'touzifukuan', url: 'projectCash' },
        { name: '邮件往来', img: 'touzifukuan', url: 'projectEmail' },
        { name: '文件库', img: 'wenjianku', url: 'projectFile' },
        { name: '关联社群', img: 'touzifukuan', url: 'projectCommunity' }
      ],
      noData: [],
      noDataFlag: false,
      list: [],
      defaultList: [],
      showLoading: true,
      pageInfo: {
        params: {
          currPage: 1,
          pageSize: 1000,
          groupId: '',
          inveId: '',
          keyword: '',
          myOrAll: 'all',
          projDateStatus: '',
          projStatus: '',
          projObject: '',
          projStartTime: '',
          projEndTime: ''
        },
        list: [],
        postType: 'postJson',
        postUrl: '/projectPC/listViewIdMy'
      }
    }
  },
  created() {
    const type = this.type
    if (type === 'project') {
      this.toGetDetail()
      return
    }
    this.noData = [1]
    // header - 从上个页面带过来的数据
    this.model = this.storage.get('businessObj') || {}
    const name = this.model.enName ? this.model.enName : this.model.projObjectName
    this.catTitle = name

    this.model = this.storage.get('businessObj') || {}
    this.list = this.storage.get('gridData') || []
    const projectObject = this.model.projObject
    const inveId = this.model.inveId
    const groupId = this.model.groupId

    this.pageInfo.params.groupId = groupId
    this.pageInfo.params.inveId = inveId
    this.pageInfo.params.projObject = projectObject

    const gridList = this.storage.get('gridList') || []
    if (gridList.length) {
      this.defaultList = gridList
      this.showLoading = false
      return
    }
    this.getList(true)
  },
  methods: {
    async toGetDetail() {
      const groupId = this.groupId
      const inveId = this.inveId
      const projObject = this.projObject
      // 九宫格
      this.listArray.map((item, index) => {
        if (groupId !== '4' && item.name === '上市公司公告') {
          this.listArray.splice(index, 1)
        }
      })
      const gridData = JSON.parse(JSON.stringify(this.listArray))
      this.storage.set('gridData', gridData)
      this.list = gridData

      const data = {
        currPage: 1,
        pageSize: 1,
        groupId: groupId,
        inveId: inveId,
        memberId: '',
        myOrAll: 'all',
        projObject: projObject
      }
      const obj = await this.getListViewIdMy(data)
      this.showLoading = false
      if (obj.length === 0) {
        this.catTitle = '项目详情'
        this.noDataFlag = true
        return
      }
      this.noData = obj
      const dataObj = JSON.parse(JSON.stringify(obj[0]))
      this.storage.set('businessObj', dataObj)
      this.model = obj[0]
      const name = this.model.enName ? this.model.enName : this.model.projObjectName
      this.catTitle = name
    },
    goToRouter(item) {
      if (item.name === '投资信息') {
        const data = this.defaultList
        if (data.length === 1) {
          const dataObj = JSON.parse(JSON.stringify(data[0]))
          this.storage.set('groupObj', dataObj)
          this.$router.push({ path: '/projectXmDetail' })
          return
        }
        this.$router.push({ path: '/projectProgress' })
        return
      }
      this.$router.push({ path: item.url })
    },
    getList(isFirst) {
      this.showLoading = true
      this.$axios.pageData(
        this,
        isFirst,
        res => {
          this.showLoading = false
          this.defaultList = res.list
          const dataList = JSON.parse(JSON.stringify(res.list))
          this.storage.set('gridList', dataList)
        }
      )
    },
    getListViewIdMy(params) {
      return new Promise((resolve, reject) => {
        const URL = '/projectPC/listViewIdMyEnterpriaseForApp'
        this.$axios.postJson(
          URL,
          params,
          res => {
            resolve(res.data)
          },
          error => {}
        )
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.project-home-detail{
  .header{
    background-color: #fff;
    position: relative;
    .tag{
      padding: 7px 20px;
      background:rgba(182,0,5,0.1);
      font-size:26px;
      font-weight:500;
      color:rgba(182,0,5,1);
      position: absolute;
      top:34px;
      left: 0;
    }
    .tag-s{
      text-align: center;
      width: 100%;
      display: inline-block;
      padding: 40px 0 20px;
      font-size:34px;
      font-weight:500;
    }
    .header-grid{
      display: flex;
      padding: 0px 60px 29px;
      li{
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        .money{
          font-size:24px;
          font-weight:500;
          color:rgba(248,141,38,1);
          height:56px;
          line-height:67px;
          span{
            font-size:40px;
            font-weight:bold;
          }
        }
        .name{
          padding-top: 5px;
          font-size:24px;
          font-weight:500;
          color:rgba(158,158,157,1);
        }
      }
    }
  }
  .menu-list{
    background-color: #fff;
    margin-top: 18px;
    margin-bottom: 100px;
  }
}
.fd-grid-contanier{
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
}
</style>

