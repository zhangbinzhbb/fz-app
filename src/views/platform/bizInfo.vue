
/*
 * @Author: Wendy
 * @Date: 2019-12-4 08:23:33
 * @Last Modified by: Wendy
 * @Last Modified time: 2019-12-4 08:23:33
 * 待确定：-字段未找到对应字段名，他关联企业完成，part2股东发起人，part4变更记录，part5分支机构无
 */
<template>
  <div id="Knowledge" class="newsarticle has-comment">
    <headerx :cat-title="platName"/>
    <div class="comment-content no-comment">
      <div class="tabs-con-globle tabs-con">
        <span
          v-for="(item,index) in ['工商信息','对外投资']"
          :class="{'active':selectTab==index}"
          :key="index"
          class="tab-item"
          @click="changeTab(index)"
        >{{ item }}</span>
      </div>
      <block v-if="selectTab==0">
        <!-- part1 -->
        <div class="sub-title">
          <img src="@/assets/images/icon/pinglun.png">
          登记信息
          <van-icon :name="article.part1?'arrow-up':'arrow-down'" class="arrow-icon" @click="toggle('part1')"/>
        </div>
        <div v-if="article.part1" class="reg-info">
          <div class="tit">
            <div class="avator">
              <avator :data="{NAME:entInfoDetail.operName}" :params="avatorParams"/>
            </div>
            <div class="person">
              法人代表
              <div class="name">{{ entInfoDetail.operName }}</div>
            </div>
          <!-- <div class="right">
            他关联-家企业
            <span class="arrow">→</span>
          </div> -->
          </div>
          <div class="colums">
            <span class="item">
              成立日期
              <p class="btm">{{ entInfoDetail.startDate }}</p>
            </span>
            <span class="item">
              登记状态
              <p class="btm">{{ entInfoDetail.status }}</p>
            </span>
            <span class="item">
              注册资本
              <p class="btm">{{ entInfoDetail.registCapi }}</p>
            </span>
            <span class="item">
              实缴资本
              <p class="btm">-</p>
            </span>
            <span class="item">
              企业类型
              <p class="btm">-</p>
            </span>
            <span class="item">
              参保人数
              <p class="btm">-</p>
            </span>
            <div class="border"/>
            <span class="item">
              统一社会信用代码
              <p class="btm">{{ entInfoDetail.creditCode }}</p>
            </span>
            <span class="item">
              进出口企业代码
              <p class="btm">-</p>
            </span>
            <span class="item">
              工商注册号
              <p class="btm">-</p>
            </span>
            <span class="item">
              组织机构代码
              <p class="btm">{{ entInfoDetail.orgCode }}</p>
            </span>
            <div class="border"/>
            <span class="item item-block">
              英文名
              <p class="btm">{{ entInfoDetail.enName }}</p>
            </span>
            <span class="item item-block">
              曾用名
              <p class="btm">-</p>
            </span>
            <span class="item item-block">
              所属行业
              <p class="btm">-</p>
            </span>
            <div class="border"/>
            <span class="item item-block">
              经营范围
              <p class="btm">{{ entInfoDetail.scope }}</p>
            </span>
            <span class="item item-block">
              经营方式
              <p class="btm">-</p>
            </span>
            <span class="item item-block">
              公司地址
              <p class="btm blue">{{ entInfoDetail.addressDetails }}</p>
            </span>
            <div class="border"/>
            <span class="item item-block">
              营业期限
              <p class="btm">-</p>
            </span>
            <span class="item item-block">
              核准日期
              <p class="btm">{{ entInfoDetail.checkDate }}</p>
            </span>
            <span class="item item-block">
              登记机关
              <p class="btm">{{ entInfoDetail.belongOrg }}</p>
            </span>
          </div>
        </div>
        <!-- part2 -->
        <div class="sub-title">
          <img src="@/assets/images/icon/pinglun.png">
          股东（发起人）2
          <van-icon :name="article.part2?'arrow-up':'arrow-down'" class="arrow-icon" @click="toggle('part2')"/>
        </div>
        <div v-if="article.part2" class="reg-info">
          <div v-for="(item,index) in [1,2,3,4]" :key="index">
            <div class="share-tit">
              <img src="@/assets/images/icon/pinglun.png" alt="">
              <div class="name">
                <div>苏州工业园区经济发展有限公司</div>
                <span class="tag">大股东</span>
              </div>
              <div class="right">
                股权结构
                <span class="arrow">→</span>
              </div>
            </div>

            <div class="colums">
              <span class="item">
                成立日期
                <p class="btm">2006.04.11</p>
              </span>
              <span class="item">
                登记状态
                <p class="btm">存续</p>
              </span>
              <span class="item">
                注册资本
                <p class="btm">625万元人民币</p>
              </span>
              <span class="item">
                实缴资本
                <p class="btm">500万元人民币</p>
              </span>
              <div class="border" style="margin-bottom:0"/>
            </div>
          </div>
        </div>
        <!-- part3 -->
        <div class="sub-title">
          <img src="@/assets/images/icon/pinglun.png">
          主要人员  {{ mainPersonList.length>0?mainPersonList.length:'无' }}
          <van-icon :name="article.part3?'arrow-up':'arrow-down'" class="arrow-icon" @click="toggle('part3')"/>
        </div>
        <div v-if="article.part3" class="reg-info">
          <div v-for="(item,index) in mainPersonList" :key="index" class="person-item">
            <div class="avator">
              <avator :data="item" :params="avatorParams"/>
            </div>
            <div class="des">
              {{ item.type }}
              <div class="sub">{{ item.NAME }}</div>
            </div>
            <div class="right">
              他关联-家企业
              <span class="arrow">→</span>
            </div>
          </div>
        </div>
        <!-- part4 -->
        <div class="sub-title">
          <img src="@/assets/images/icon/pinglun.png">
          变更记录  8
          <van-icon :name="article.part4?'arrow-up':'arrow-down'" class="arrow-icon" @click="toggle('part4')"/>
        </div>
        <div v-if="article.part4" class="reg-info">
          <div v-for="(item,index) in ['01','02','03','04']" :key="index">
            <div class="share-tit change-tit">
              <span class="index">{{ item }}</span>
              <div class="name">
                <div>负责人变更(法定代表人、负责人、首席代表、合伙事务执行人等变更)</div>
                <span class="tag">带有<span class="red">*</span>标志的为法定代表人</span>
              </div>
              <div class="right date">
                2015-11-11
              </div>
            </div>
            <div class="colums change-colums">
              <span class="item">
                变更前
                <p class="btm blue" >林向红</p>
              </span>
              <span class="item">
                变更后
                <p class="btm blue">刘澄伟<span class="red">*</span></p>
              </span>
            </div>
          </div>

        </div>
        <!-- part5 -->
        <div class="sub-title">
          <img src="@/assets/images/icon/pinglun.png">
          分支机构  无
          <van-icon :name="article.part5?'arrow-up':'arrow-down'" class="arrow-icon" @click="toggle('part5')"/>
        </div>
        <div v-if="article.part5" class="reg-info">
          -
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
                {{ item.name }}
              </div>
              <div class="colums">
                <div class="item">
                  法人代表
                  <div class="btm">宋来君</div>
                </div>
                <div class="item">
                  注册资本
                  <div class="btm">500万元人民币</div>
                </div>
                <div class="item">
                  投资数额
                  <div class="btm">-</div>
                </div>
                <div class="item">
                  投资比例
                  <div class="btm">-</div>
                </div>
              </div>

            </div>
        </div></van-pull-refresh>
        <blank v-if="!pageInfo.isLoading&&pageInfo.list&&pageInfo.list.length==0"/>
        <bottom v-if="!pageInfo.isLoading&&isLoadAll&&pageInfo.list.length!=0"/>
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
      selectTab: 0,
      entInfoDetail: {},
      mainPersonList: [],
      detail: {},
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
          length: 1000,
          pageSize: 10,
          curPage: 1,
          currPage: 1,
          entId: this.$route.query.entId, // entId：企业ID
          projOrFundId: this.$route.query.pkId,
          groupId: this.$route.query.groupId,
          pkId: this.$route.query.pkId
        },
        list: [],
        postType: 'get',
        postUrl: '/EntInvestmentList'
      }
    }
  },
  created() {
    this.getDetail()
    this.getList(true)
  },
  activated() {

  },
  methods: {
    loadMore() {
      this.getList(false)
    },
    onRefresh() {
      // this.Toast('刷新成功')
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
    getDetail() {
      this.$axios.get(`/platformInfo/platInfoDetail/${this.platFormId}`, null, res => {
        this.detail = res.data.model
        if (this.detail.president) {
          this.mainPersonList.push({ type: '董事长', NAME: this.detail.president })
        }
        this.getMainPerson('director', '董事')
        this.getMainPerson('supervisor', '监事')
      })
      this.$axios.get(`/entBaseInfo/entInfoDetail/${this.platFormId}`, null, res => {
        this.entInfoDetail = res.data.model
      })
    },
    getList(isFirst) {
      this.$axios.pageData(this, isFirst, res => {})
    }
  }
}
</script>
<style scoped lang="scss">
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
.avator{
  width: 94px;
  height: 94px;
  display: inline-block;
  margin-right: 30px;
}
.reg-info{
  background: white;
  margin-bottom: 20px;
  padding-bottom: 10px;
  position: relative;
  margin-bottom: 20px;

  .tit{
    padding: 40px 40px 10px 40px;
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
      width: 350px;
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
    .name{
      width: 430px;
       .tag{
         color: #A5A5A5;
         background: none;
         padding: 0;
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
    .name{
      color:rgba(49,149,252,1);
      line-height:40px;
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
    margin-top: 20px;
    .item{
      background:rgba(248,248,248,1);
      padding: 18px;
      box-sizing: border-box;
      margin-bottom: 20px;
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
    border-bottom: 2px solid #F0F0F0;
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
