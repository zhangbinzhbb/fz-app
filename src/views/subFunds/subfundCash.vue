<template>
  <div class="has-comment project-home-cash">
    <headerx :cat-title="model.projObjectName|| model.projName">
    </headerx>
    <div class="comment-content no-comment">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <div
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="pageInfo.isLoading"
          infinite-scroll-distance="10"
          infinite-scroll-immediate-check="false">
<!--          <div class="header">-->
<!--            <ul class="header-grid">-->
<!--              <li>-->
<!--&lt;!&ndash;                <p class="money"><span>￥{{ model.allRequestMoney | amountFilter }}</span>亿元</p>&ndash;&gt;-->
<!--                <p class="name">累计出资</p>-->
<!--              </li>-->
<!--              <li>-->
<!--&lt;!&ndash;                <p class="money"><span>￥{{ model.recoveryAmount | amountFilter }}</span>亿元</p>&ndash;&gt;-->
<!--                <p class="name">累计回收金额</p>-->
<!--              </li>-->
<!--            </ul>-->
<!--          </div>-->
          <div v-for="(item,index) in pageInfo.list" :key="index" class="cash-item">
            <div class="cash-item-top">
              <div class="cash-item-top-l">
                <span class="t1"> {{ item.companyName }}</span>
                <span class="t2">
                  <img v-if="item.recBillTypeName === '付款'" src="@/assets/images/jt-f.png" alt="">
                  <img v-if="item.recBillTypeName === '收款'" src="@/assets/images/jt-s.png" alt="">
                  <em>{{ catTitle }}</em>
                </span>
              </div>
              <div class="cash-item-top-r">
                <span class="time">{{ item.bizDate }}</span>
                <span class="money">{{ item.recBillTypeName }}</span>
              </div>
            </div>
            <div class="cash-content">
              <div class="cash-content-item">
                <p class="name">金额</p>
                <p class="money">{{ item.amt | formatMoney }} ({{ item.currencyName }})</p>
              </div>
              <div class="cash-content-item">
                <p class="name">折算人民币金额</p>
                <p class="money">{{ item.actuallocamt | formatMoney }}元</p>
              </div>
            </div>
            <div class="label p">备注：</div>
            <div v-if="item.remark">
              <div v-if="item.remark.length>66 && !item.isCheck" class="p">
                {{ item.remark | contentFilter }}...<span class="expand-btn" @click="expandChange(item,index)">展开</span>
              </div>
              <div v-else class="p">
                {{ item.remark }} <span v-if="item.remark.length>66" class="expand-btn" @click="expandChange(item,index)">收起</span>
              </div>
            </div>
            <div v-else>--</div>
          </div>
        </div>
      </van-pull-refresh>
      <blank v-if="!pageInfo.isLoading&&pageInfo.list&&pageInfo.list.length==0" style="margin-top:10px;"/>
      <bottom v-if="!pageInfo.isLoading&&isLoadAll&&pageInfo.list.length!=0&&pageInfo.list.length>3"/>
    </div>
  </div>
</template>
<script>
export default {
  filters: {
    contentFilter(content) {
      const title = content.length > 66 ? content.substring(0, 66) : content
      return title
    },
    amountFilter(value) {
      if (!value) return '0'
      const index = value.indexOf('万元')
      const n = value.substr(0, index)
      const vv = Math.pow(10, 2) // 保留2位小数，四舍五入
      const result = Math.round((n / 10000) * vv) / vv
      return result
    }
  },
  data () {
    return {
      foudsId: this.$route.query.id,
      detail: {},
      permission: '', //        50020100,50020101,50020201,50020202,50020203,50020204,50020301,50020303,50020501,50020502,50020503
      pageInfo: {
        params: {
          currPage: 1,
          pageSize: 5,
          projectObject: '',
          inveId: '',
          entId: ''
        },
        list: [],
        postType: 'get',
        postUrl: '/ledgerMagAppList'
      },
      model: null,
      isLoading: false
    }
  },
  computed: {
    checkPermission (key) {
      return function (key) {
        let result = false
        if (this.permission.indexOf(key) > -1) {
          result = true
        }
        return result
      }
    }
  },
  watch: {
  },
  created () {
    // this.getPermission()
    this.getDetail()
  },
  methods: {
    // 现金流
    getList(isFirst) {
      this.$axios.pageData(this, isFirst, res => {
        this.isLoading = false
      })
    },
    // 项目投资-详情
    getDetail () {
      let urlList = 'projInfoDetail' // 项目基本信息
      urlList = urlList + `/${this.foudsId}`
      this.$axios.get(
        urlList,
        {
          projId: this.foudsId,
          pageSize: 100,
          currPage: 1,
          projOrFundId: this.foudsId,
          itemType: 3
        },
        res => {
          console.log(res)
          // this.model = res.data.model
          this.$set(this, 'model', res.data.model || res.data)
          // const projectObject = '53472'
          // const inveId = '11708'
          const projectObject = res.data.model.projObject
          const inveId = res.data.model.inveId
          this.pageInfo.params.projectObject = projectObject
          this.pageInfo.params.inveId = inveId
          this.getList(true)
        }
      )
    },
    getPermission () {
      this.$axios.get(
        'appFuncPermissionList',
        { fatherid: 5002, projId: this.foudsId },
        res => {
          let arr = []
          res.data.map(item => {
            item.childList.map(value => {
              arr.push(value.id)
            })
          })
          this.permission = arr.join(',')
        }
      )
    },
    onRefresh() {
      this.getList(true)
    },
    loadMore() {
      this.getList(false)
    },
    expandChange(item, index) {
      const check = !item.isCheck
      this.$set(this.list[index], 'isCheck', check)
    }
  }
}
</script>
<style lang="scss" scoped>
  // 单行文本隐藏
  .text-overflow-row{
    width:500px;
    white-space: nowrap;/*强制在一行显示*/
    text-overflow:ellipsis;/*设置超出内容显示...*/
    overflow: hidden;/*一定不能少 超出的内容进行隐藏*/
  }
  .expand-btn{
    font-size:28px;
    font-weight:500;
    color:rgba(74,144,226,1);
  }
  .cash-item{
    background: white;
    font-size:28px;
    font-weight:500;
    color:rgba(76,76,76,1);
    padding:20px 40px;
    margin-top: 20px;
    .cash-item-top{
      display: flex;
      justify-content:space-between;
      .cash-item-top-l{
        display: flex;
        flex-direction: column;
        width:70%;
        .t1{
          font-size:28px;
          font-weight:500;
          color:rgba(76,76,76,1);
        }
        .t2{
          padding-top: 20px;
          img{
            width: 34px;
            height: 26px;
          }
          em{
            font-style: normal;
            padding-left:18px;
            font-size:24px;
            font-weight:600;
            color:rgba(153,153,152,1);
          }
        }
      }
      .cash-item-top-r{
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        .time{
          padding: 3px 0 8px;
        }
        .money{
          width:88px;
          height:39px;
          line-height: 39px;
          text-align: center;
          background:rgba(248,38,38,0.14);
          font-size:24px;
          font-weight:400;
          color:rgba(197,32,39,1);
        }
      }
    }
    .cash-content{
      display: flex;
      .cash-content-item{
        flex:1;
        text-align: center;
        padding: 49px 0 45px;
        .name{
          font-size:26px;
          font-weight:500;
          color:rgba(158,158,157,1);
        }
        .money{
          padding-top: 10px;
          font-size:28px;
          font-weight:500;
          color:rgba(76,76,76,1);
        }
      }
    }
    .label{
      font-size:28px;
      font-weight:500;
      color:rgba(158,158,157,1);
    }
    .blue{
      color: #4A90E2;
    }
    .file-con{
      border-top: 2px solid #e8e8e8;
      margin-top: 20px;
    }
  }
  .project-home-cash{
    .header{
      .header-grid{
        display: flex;
        background-color: #fff;
        padding: 40px 0;
        li{
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          .money{
            font-size:24px;
            font-weight:500;
            color:rgba(158,158,157,1);
            color:rgba(248,141,38,1);
            span{
              font-size:56px;
              font-weight:bold;
              padding-right: 10px;
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
  }
</style>
