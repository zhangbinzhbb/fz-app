<template>
  <div id="Knowledge" class="newsarticle has-comment">
    <headerx :cat-title="catTitle==='工商信息详情'?detail1.enName:catTitle"/>
    <div class="comment-content no-comment">
      <div class="tabs-con-globle tabs-con">
        <span
          v-for="(item,index) in ['工商信息','股比信息']"
          :class="{'active':selectTab==index}"
          :key="index"
          class="tab-item"
          @click="changeTab(index)"
        >{{ item }}</span>
      </div>
      <block v-if="selectTab==0">
        <!-- 登记信息 -->
        <div class="sub-title">
          <img src="@/assets/images/business/icon1.png">
          登记信息
          <van-icon :name="article.part1?'arrow-up':'arrow-down'" class="arrow-icon" @click="toggle('part1')"/>
        </div>
        <div v-if="article.part1" class="reg-info">
          <div class="tit">
            <img v-if="(typeof detail1.iconBlob)==='string'" :src="(typeof detail1.iconBlob)==='string'?'data:image/jpeg;base64,'+ encodeURI(detail1.iconBlob) :imgs" class="avator-logo" alt="">
            <img v-if="(typeof detail1.iconBlob)==='object'" :src="(typeof detail1.iconBlob)==='object' && detail1.imageurl!=='' ? detail1.imageurl :imgs" class="avator-logo" alt="">
            <!-- <div class="avator">
              <avator :data="{NAME:detail1.operName}"/>
            </div> -->
            <div class="avator-person person">
              法人代表
              <div class="name">{{ detail1.operName || '--' }}</div>
            </div>
          </div>
          <div class="colums">
            <span class="item">
              <span class="colums-name">成立日期</span>
              <p class="btm">{{ detail1.startDate ?detail1.startDate:'--' }}</p>
            </span>
            <span class="item">
              <span class="colums-name">登记状态</span>
              <p class="btm">{{ detail1.status ?detail1.status:'--' }}</p>
            </span>
            <span class="item">
              <span class="colums-name">注册资本</span>
              <p class="btm">{{ detail1.registCapi ?detail1.registCapi:'--' }}</p>
            </span>
            <span class="item">
              <span class="colums-name">实缴资本</span>
              <p class="btm">{{ detail1.recCap ?detail1.recCap:'--' }}</p>
            </span>
            <span class="item">
              <span class="colums-name">企业类</span>
              <p class="btm">{{ detail1.econKind ?detail1.econKind:'--' }}</p>
            </span>
            <span class="item">
              <span class="colums-name">参保人数</span>
              <p class="btm">{{ detail1.insuredCount ?detail1.insuredCount:'--' }}</p>
            </span>
            <div class="border"/>
            <span class="item item-calc">
              统一社会信用代码
              <p class="btm">{{ detail1.creditCode ?detail1.creditCode:'--' }}</p>
            </span>
            <div class="border"/>
            <span class="item item-block">
              英文名
              <p class="btm">{{ detail1.enName ?detail1.enName:'--' }}</p>
            </span>
            <span class="item item-block">
              曾用名
              <p class="btm">--</p>
            </span>
            <span class="item item-block">
              所属行业
              <p class="btm">{{ detail1.qkIndustryName ?detail1.qkIndustryName:'--' }}</p>
            </span>
            <div class="border"/>
            <span class="item item-block">
              经营范围
              <!-- <p class="btm">{{ detail1.scope ?detail1.scope:'--' }}</p> -->
              <div v-if="detail1.scope" style="width:100%;">
                <div v-if="detail1.scope.length>66 && !isCheck" class="ctx ctx-word-break">{{ detail1.scope | contentFilter }}...<span class="expand-btn" @click="isCheck = true">展开</span></div>
                <div v-else class="ctx ctx-word-break">{{ detail1.scope }} <span v-if="detail1.scope.length>66" class="expand-btn" @click="isCheck = false">收起</span></div>
              </div>
              <div v-else class="item-column-empty">
                --
              </div>
            </span>
            <span class="item item-block">
              公司地址
              <p class="btm blue">{{ detail1.addressDetails ?detail1.addressDetails:'--' }}</p>
            </span>
            <div class="border"/>
            <span class="item item-block">
              营业期限
              <p class="btm">{{ detail1.termStart ?detail1.termStart:'--' }} - {{ detail1.termEnd ?detail1.termEnd:'--' }} </p>
            </span>
            <span class="item item-block">
              核准日期
              <p class="btm">{{ detail1.checkDate ?detail1.checkDate:'--' }}</p>
            </span>
            <span class="item item-block">
              登记机关
              <p class="btm">{{ detail1.belongOrg ?detail1.belongOrg:'--' }}</p>
            </span>
          </div>
        </div>
        <!-- 股东（发起人） -->
        <div class="sub-title">
          <img src="@/assets/images/business/icon2.png">
          股东(发起人)
          <van-icon :name="article.part2?'arrow-up':'arrow-down'" class="arrow-icon" @click="toggle('part2')"/>
        </div>
        <div v-if="article.part2" class="reg-info reg-info-gd">
          <div v-if="pageInfo.list.length">
            <div v-for="(item,index) in pageInfo.list" :key="index" class="gd-item">
              <div class="share-tit share-tit-flex">
                <div class="avator">
                  <avator :data="{NAME:item.stockName}" :first-flag= "true"/>
                </div>
                <span/>
                <div class="name">
                  <div>{{ item.stockName }}</div>
                  <span v-if="item.stockType" class="tag">{{ item.stockType }}</span>
                </div>
              </div>
              <div class="colums">
                <span class="item">
                  <span class="colums-name">持股比例</span>
                  <p class="btm">{{ item.stockPercent?item.stockPercent:'--' }}</p>
                </span>
                <span class="item">
                  <span class="colums-name">股东类型</span>
                  <p class="btm">{{ item.stockType?item.stockType:'--' }}</p>
                </span>
                <span class="item">
                  <span class="colums-name">认缴出资额</span>
                  <p class="btm">{{ item.shouldCapi | money }}万元</p>
                </span>
                <span class="item">
                  <span class="colums-name">认缴出资日期</span>
                  <p class="btm">{{ item.shouldDate?item.shouldDate:'--' }}</p>
                </span>
                <div class="border" style="margin-bottom:0"/>
              </div>
            </div>
          </div>
          <div v-else class="empy-block1">--</div>
        </div>
        <!-- 主要人员 -->
        <div class="sub-title">
          <img src="@/assets/images/business/icon3.png">
          主要人员
          <!-- {{ mainPersonList.length>0?mainPersonList.length:'无' }} -->
          <van-icon :name="article.part3?'arrow-up':'arrow-down'" class="arrow-icon" @click="toggle('part3')"/>
        </div>
        <div v-if="article.part3" class="reg-info reg-info-member">
          <!-- <div v-for="(item,index) in model.directorAppointVOList" :key="index" class="person-item">
            <div class="avator">
              <avator :data="item" :params="avatorParams"/>
            </div>
            <div class="des">
              {{ item.postType }}
              <div class="sub">{{ item.afterChangeName }}</div>
            </div>
          </div> -->
          <div class="person-item">
            --
          </div>
        </div>
        <!-- 变更记录 -->
        <div class="sub-title">
          <img src="@/assets/images/business/icon4.png">
          变更记录
          <van-icon :name="article.part4?'arrow-up':'arrow-down'" class="arrow-icon" @click="toggle('part4')"/>
        </div>
        <div v-if="article.part4" class="reg-info reg-info-updata">
          <div v-if="changeLogList.length">
            <div v-for="(item,index) in changeLogList" :key="index" class="reg-info-updata-div">
              <div class="share-tit change-tit">
                <span class="index">{{ (index+1)>9?'':'0' }}{{ index+1 }}</span>
                <div class="change-tit-left">
                  <span class="name1">{{ item.chgItem }}</span>
                  <span class="time">{{ item.chgDate }}</span>
                </div>
              </div>
              <div class="change-colums">
                <span class="change-colums-item">
                  变更前
                  <p class="btm blue" >{{ item.chgBeforeContent }}</p>
                </span>
                <span class="change-colums-item">
                  变更后
                  <p class="btm blue">{{ item.chgAfterContent }}</p>
                </span>
              </div>
            </div>
          </div>
          <div v-else class="empy-block">
            --
          </div>
        </div>
        <!-- 分支机构 -->
        <div class="sub-title">
          <img src="@/assets/images/business/icon5.png">
          分支机构
          <van-icon :name="article.part5?'arrow-up':'arrow-down'" class="arrow-icon" @click="toggle('part5')"/>
        </div>
        <div v-if="article.part5" class="reg-info reg-info-updata">
          <div v-if="branchList.length">
            <div v-for="(item,index) in branchList" :key="index" class="reg-info-updata-div">
              <p class="c-c-info">{{ item.orgName }}</p>
            </div>
          </div>
          <div class="empy-block">
            --
          </div>
        </div>
      </block>
      <block v-else>
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <div
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="pageInfo.isLoading"
            infinite-scroll-distance="10"
            infinite-scroll-immediate-check="false"
          >
            <div v-for="(item,index) in pageInfo.list" :key="index" class="inv-item reg-info">
              <div class="tit">
                {{ item.stockName }}
              </div>
              <div class="colums">
                <div class="item">
                  认缴出资额(万元)
                  <div class="btm">{{ item.shouldCapi }}</div>
                </div>
                <div class="item">
                  持股比例
                  <div class="btm">{{ item.stockPercent }}</div>
                </div>
              </div>
            </div>
        </div></van-pull-refresh>
        <blank v-if="!pageInfo.isLoading&&pageInfo.list&&pageInfo.list.length==0"/>
        <bottom v-if="!pageInfo.isLoading&&isLoadAll&&pageInfo.list.length!=0&&pageInfo.list.length>4"/>
      </block>
    </div>
  </div>
</template>
<script>
export default {
  components: {
    avator: () => import('@/components/avator/index')
  },
  data() {
    return {
      imgs: require('@/assets/images/businessLogo.png'),
      selectTab: 0,
      entInfoDetail: {},
      mainPersonList: [
        { type: '董事长', NAME: '宋来君' }
      ],
      detail: null,
      detail1: {
        operName: ''
      },
      platName: this.$route.query.platName,
      platFormId: this.$route.query.pkId,
      article: {
        part1: true,
        part2: true,
        part3: true,
        part4: true,
        part5: true
      },
      pageInfo: {
        params: {
          IS_PAGE: true,
          curPage: 1,
          currPage: 1,
          projectObject: 1
        },
        list: [],
        postType: 'get',
        postUrl: '/entOwnershipStructureInfo'
      },
      model: null,
      catTitle: '工商信息详情',
      changeLogList: [],
      branchList: [],
      isCheck: false
    }
  },
  created() {
    let projObject = ''
    if (this.$route.query.projObject) {
      projObject = this.$route.query.projObject
    } else {
      this.model = this.storage.get('businessObj') || {}
      const name = this.model.enName ? this.model.enName : this.model.projObjectName
      this.catTitle = name
      projObject = this.model.projObject
    }

    this.pageInfo.params.projectObject = projObject
    this.getEntInfoByIdApp(projObject)
    this.getChangeLogList(projObject)
    this.getBranchList(projObject)
    this.getList(true)
  },
  methods: {
    loadMore() {
      this.getList(false)
    },
    onRefresh() {
      this.getList(true)
    },
    changeTab(index) {
      this.selectTab = index
    },
    toggle(part) {
      this.article[part] = !this.article[part]
    },
    getMainPerson(attr, type) {
      const list = this.detail[attr] ? this.detail[attr].split(',') : null
      if (list) {
        list.map(item => {
          this.mainPersonList.push({ type: type, NAME: item })
        })
      }
    },
    getEntInfoByIdApp(projectObject) {
      const url = `/entBaseInfo/entInfoByIdApp/${projectObject}`
      this.$axios.get(
        url,
        {},
        res => {
          const data = res.data
          const arr = Object.keys(data)
          if (arr.length) {
            this.detail1 = res.data.model
          }
        }
      )
    },
    // 股东列表
    getList(isFirst) {
      this.$axios.pageData(this, isFirst, res => {
        this.isLoading = false
      })
    },
    getChangeLogList(enterpriseId) {
      const URL = '/changeLog/changeLogList'
      this.$axios.postJson(
        URL,
        {
          pageSize: 1000,
          currPage: 1,
          enterpriseId
        },
        res => {
          this.changeLogList = res.data
        }
      )
    },
    getBranchList(enterpriseId) {
      const URL = '/branch/branchList'
      this.$axios.postJson(
        URL,
        {
          pageSize: 1000,
          currPage: 1,
          enterpriseId
        },
        res => {
          this.branchList = res.data
        }
      )
    }
  }
}
</script>
<style scoped lang="scss">
.empy-block{
  padding-left: 40px;
  padding-bottom: 20px;
  font-size:24px;
  font-weight:500;
  color:rgba(158,158,157,1);
}
.empy-block1{
  padding: 20px 40px;
  font-size:24px;
  font-weight:500;
  color:rgba(158,158,157,1);
}
.c-c-info{
  color: #4C4C4C;
  font-size:28px;
  font-weight:500;
  padding: 0 40px;
}
.expand-btn{
  font-size:28px;
  font-weight:500;
  color:rgba(74,144,226,1);
}
.ctx-word-break{
  word-break: break-all;
  white-space: pre-line;
  color: #4C4C4C;
  font-size:28px;
  font-weight:500;
  padding-top: 10px;
}
.item-calc{
   width: calc(100% - 72px) !important;
}
.red{
  color: #D0021B;
}
.sub-title {
  display: block;
  width: 100%;
  font-size: 28px;
  background-color: #FDF1F1;
  padding: 0px 40px;
  overflow: hidden;
  box-sizing: border-box;
  line-height: 88px;
  img{
    width: 22px;
    vertical-align: middle;
  }
  span{
    vertical-align: middle;
  }
  .arrow-icon{
    float:right;
    margin-top: 30px;
  }
}
.border{
  width: 670px;
  border: 2px solid #F0F0F0;
  margin: 10px auto 40px auto;
}
.avator-person{
  margin-top: -20px;
  padding-left: 14px;
}
.avator-logo{
  width: 94px;
  height: 94px;
  border-radius: 47px;
}
.avator{
  width: 94px;
  height: 94px;
  display: inline-block;
  margin-right: 30px;
}
.reg-info-gj{
  padding: 40px 0 40px 40px!important;
  margin-bottom: 20px !important;
  p{
    font-size:28px;
    font-weight:500;
    color:rgba(74,144,226,1);
  }
}
.reg-info-member{
  .person-item{
    &+.person-item{
      border-top: 2px solid #F0F0F0;
    }
  }
}
.reg-info-updata{
  padding-top: 40px;
  .reg-info-updata-div{
    padding-bottom: 30px;
  }
}
.reg-info-gd{
  .gd-item{
    &:last-child{
      .colums{
        .border{
          border: 0;
        }
      }
    }
  }
}
.reg-info{
  background: white;
  margin-bottom: 20px;
  padding-bottom: 10px;
  position: relative;
  .tit{
    padding: 40px 40px 10px 40px;
    display: flex;
    align-items: center;
  }
  .share-tit-flex{
    display: flex;
    align-items: center;
  }
  .share-tit{
    padding: 40px 40px 10px 40px;
    img{
      width: 68px;
      height: 68px;
      vertical-align: top;
    }
    .name{
      display: inline-block;
      width:80%;
      font-size:28px;
      font-weight:500;
      color:rgba(76,76,76,1);
      line-height:40px;
      vertical-align: top;
    }
    .tag{
      background:rgba(245,166,35,0.15);
      font-size:24px;
      font-weight:500;
      color:rgba(245,166,35,1);
      line-height:33px;
      padding: 0 10px;
    }
    .date{
      color:rgba(76,76,76,1);
    }
    .index{
      width:40px;
      height:40px;
      display: inline-block;
      background:rgba(182,0,5,0.1);
      font-size:28px;
      font-weight:bold;
      color:rgba(182,0,5,1);
      line-height:32px;
      text-align: center;
      vertical-align: top;
    }
  }
  .change-tit{
    padding: 0 40px;
    display: flex;
    .change-tit-left{
      display: flex;
      justify-content: space-between;
      width: 100%;
      padding-left: 10px;
      span{
        font-size:28px;
        font-weight:500;
        color:rgba(76,76,76,1);
      }
    }

  }
  .person{
    font-size:24px;
    font-weight:500;
    color:rgba(158,158,157,1);
    line-height:33px;
    display: inline-block;
    position: relative;
    top: 16px;
    width: 86%;
    .name{
      color:rgba(49,149,252,1);
      line-height:40px;
      font-size:28px;
    }
  }
  .right{
    float: right;
    font-size:26px;
    font-weight:500;
    color:rgba(245,166,35,1);
    line-height:37px;
    .arrow{
      display: inline-block;
      width:24px;
      height:24px;
      border-radius:1px;
      border:2px solid rgba(248,181,38,1);
      line-height: 24px;
    }
  }
  .colums{
    text-align: center;
    margin-top: 30px;
    .item{
      display: inline-block;
      width: calc(50% - 50px);
      position: relative;
      font-size:24px;
      font-weight:500;
      color:rgba(158,158,157,1);
      line-height:33px;
      text-align: left;
      margin-bottom: 30px;
      vertical-align: top;
      padding-right: 20px;
      box-sizing: border-box;
      .btm{
        display: block;
        color: #4C4C4C;
        margin-top: 10px;
        font-size:28px;
        font-weight:500;
        color:rgba(76,76,76,1);
        line-height:40px;
      }
    }
    .blue{
      color:#3195fc !important;
    }
    .item-block{
      width: 100%;
      display: block;
      padding-left:40px;
      padding-right: 40px;
      box-sizing: border-box;
    }
  }
  .change-colums{
    margin-top: 30px;
    display: flex;
    justify-content: space-between;
    padding: 0 40px;
    .change-colums-item{
      background:rgba(248,248,248,1);
      box-sizing: border-box;
      width:325px;
      padding: 20px;
      box-sizing: border-box;
      font-size:26px;
      color:rgba(76,76,76,1);
      .blue{
        color:rgba(74,144,226,1);
        padding-top: 10px;
      }
    }
  }
  .person-item{
    width: 670px;
    margin: 0 auto;
    padding: 30px 0;
    font-size:24px;
    font-weight:500;
    color:rgba(158,158,157,1);
    line-height:33px;
    .des{
      display: inline-block;
      position: relative;
      top: 15px;
      .sub{
        font-size:28px;
        color:rgba(76,76,76,1);
        line-height: 40px;
      }
    }
  }

}
.tabs-con{
  margin-bottom: 20px;
  background: white;
}
.inv-item{
  font-size:28px;
  font-weight:500;
  color:rgba(76,76,76,1);
  line-height:40px;
}
</style>
