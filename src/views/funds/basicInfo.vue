//基本信息字段和原型不一致
//内部结构样式是否固定为3人，多人时如何显示？
//现在没有v-echart了
<template>
  <div class="has-comment baseinfo">
    <headerx :cat-title="detailInfo.fundName"/>
    <div class="comment-content no-comment">
      <!-- part1 -->
      <div class="sub-title">
        <div>
          <img src="@/assets/images/fund/icon6@2x.png">
          基本信息
        </div>
        <van-icon :name="article.part1?'arrow-up':'arrow-down'" class="arrow-icon" @click="toggle('part1')"/>
      </div>
      <div v-if="article.part1" class="reg-info">
        <div class="item">
          <span class="label">基金全称</span>
          <div class="ctx">{{ detailInfo.regName || '--' }}</div>
        </div>
        <div class="item">
          <span class="label">基金简称</span>
          <div class="ctx">{{ detailInfo.fundName || '--' }}</div>
        </div>
        <div class="item">
          <span class="label">基金状态</span>
          <div class="ctx">{{ detailInfo.fundStsName || '--' }}</div>
        </div>
        <div class="item">
          <span class="label">基金性质</span>
          <div class="ctx">{{ detailInfo.platPropName || '--' }}</div>
        </div>
        <div class="item">
          <span class="label">基金管理人</span>
          <div class="ctx">{{ detailInfo.mcName || '--' }}</div>
        </div>
        <div class="item long-label">
          <span class="label">基金执行事务合伙人(委派代表)<br >/法定代表人</span>
          <div class="ctx">{{ detailInfo.executivePartnerName || '--' }}</div>
        </div>
        <div class="item">
          <span class="label">基金信息维护人</span>
          <div class="ctx">{{ detailInfo.maintenance || '--' }}</div>
        </div>
        <div class="item">
          <span class="label">财务维护人</span>
          <div class="ctx">{{ detailInfo.financeName || '--' }}</div>
        </div>
        <div class="item">
          <span class="label">联系人</span>
          <div class="ctx">{{ detailInfo.contact || '--' }}</div>
        </div>
        <div class="item">
          <span class="label">联系电话</span>
          <div class="ctx">{{ detailInfo.phoneNo || '--' }}</div>
        </div>
        <div class="item">
          <span class="label">中基协备案号</span>
          <div class="ctx">{{ detailInfo.fundRecordCode || '--' }}</div>
        </div>
        <div class="item">
          <span class="label">基金备案时间</span>
          <div class="ctx">{{ detailInfo.fundRecordTime || '--' }}</div>
        </div>
        <div class="item long-label">
          <span class="label">基金管理人备案编号</span>
          <div class="ctx">{{ detailInfo.fundManagerRecordCode || '--' }}</div>
        </div>
        <div class="item long-label">
          <span class="label">基金管理人备案时间</span>
          <div class="ctx">{{ detailInfo.fundManagerRecordTime || '--' }}</div>
        </div>
        <div class="item">
          <span class="label">拟最终关闭时间</span>
          <div class="ctx">{{ detailInfo.closeDt || '--' }}</div>
        </div>
        <div class="item">
          <span class="label">关键人士锁定</span>
          <div class="ctx">{{ detailInfo.keyPersonLock || '--' }}</div>
        </div>
        <div class="item">
          <span class="label">基金投资类型</span>
          <div class="ctx">{{ detailInfo.fundInvestType || '--' }}</div>
        </div>
        <div class="item">
          <span class="label">GP</span>
          <div class="ctx">{{ detailInfo.gp || '--' }}</div>
        </div>
        <div class="item long-label">
          <span class="label">元禾控股作为LP出资比例</span>
          <div class="ctx">{{ detailInfo.yhRatioAsLp || '--' }}<template v-if="detailInfo.yhRatioAsLp">%</template></div>
        </div>
        <div class="item long-label">
          <span class="label">基金实缴比例</span>
          <div class="ctx">
            <template v-if="detailInfo.rmbRaiseAmount && detailInfo.rmbCurrentAmount && parseFloat(detailInfo.rmbCurrentAmount) > 0">
              {{ (parseFloat(detailInfo.rmbRaiseAmount) / parseFloat(detailInfo.rmbCurrentAmount) *100).toFixed(2) }}%
            </template>
            <template v-else>--</template>
          </div>
        </div>
        <div class="item">
          <span class="label">基金出资进度</span>
          <div class="ctx">
            {{ detailInfo.lpRaiseRatio || '--' }}<template v-if="detailInfo.lpRaiseRatio">%</template></div>
        </div>
      </div>
      <!-- part2 -->
      <div class="sub-title">
        <div>
          <img src="@/assets/images/fund/icon1@2x.png">
          投资流程
        </div>
        <van-icon :name="article.part2?'arrow-up':'arrow-down'" class="arrow-icon" @click="toggle('part2')"/>
      </div>
      <div v-if="article.part2" class="reg-info">
        <div v-if="detailInfo.fundInvestType && detailInfo.fundInvestType.indexOf('项目')!==-1" class="item flexcol">
          <span class="label">项目投资流程</span>
          <div class="process">
            <div v-for="(item,key) in detailInfo.projFixflowImgList" :key="key" class="col">
              <img src="@/assets/images/fund/04.png" alt="" @click="viewFlowChart(item)">
              {{ item.remark | nameFilter }}
            </div>
          </div>
        </div>
        <div v-if="detailInfo.fundInvestType && detailInfo.fundInvestType.indexOf('子基金')!==-1" class="item flexcol">
          <span class="label">子基金投资流程</span>
          <div class="process">
            <div v-for="(item,key) in detailInfo.fundFixflowImgList" :key="key" class="col">
              <img src="@/assets/images/fund/04.png" alt="" @click="viewFlowChart(item)">
              {{ item.remark | nameFilter }}
            </div>
          </div>
        </div>
      </div>
      <!-- part3 -->
      <div class="sub-title">
        <div>
          <img src="@/assets/images/fund/icon2@2x.png">
          LPA信息
        </div>
        <van-icon :name="article.part3?'arrow-up':'arrow-down'" class="arrow-icon" @click="toggle('part3')"/>
      </div>
      <div v-if="article.part3" class="reg-info">
        <template v-if="detailInfo.fundInveDescModel">
          <div class="item column">
            <span class="label">管理费</span>
            <div class="ctx">
              <div v-if="detailInfo.fundInveDescModel.mgtFeeRate">管理费率{{ detailInfo.fundInveDescModel.mgtFeeRate }}%</div>
              <template v-if="detailInfo.fundInveDescModel.mgtFeeDesc">
                <div v-if="detailInfo.fundInveDescModel.mgtFeeDesc.length>66 && !openText1" class="ctx ctx-word-break">{{ detailInfo.fundInveDescModel.mgtFeeDesc | contentFilter }}...<span class="expand-btn" @click="openText1 = true">展开</span></div>
                <div v-else class="ctx ctx-word-break">{{ detailInfo.fundInveDescModel.mgtFeeDesc }} <span v-if="detailInfo.fundInveDescModel.mgtFeeDesc.length>66" class="expand-btn" @click="openText1 = false">收起</span></div>
              </template>
            </div>
          </div>
          <div class="item column">
            <span class="label">存续期</span>
            <div class="ctx">
              <div>投资期{{ detailInfo.fundInveDescModel.invePeriod ? detailInfo.fundInveDescModel.invePeriod : '--' }}年,
              回收期{{ detailInfo.fundInveDescModel.paybackPeriod ? detailInfo.fundInveDescModel.paybackPeriod : '--' }}年,
              延展期{{ detailInfo.fundInveDescModel.rollOver ? detailInfo.fundInveDescModel.rollOver : '--' }}年</div>
              <template v-if="detailInfo.fundInveDescModel.durationDesc">
                <div v-if="detailInfo.fundInveDescModel.durationDesc.length>66 && !openText2" class="ctx ctx-word-break">{{ detailInfo.fundInveDescModel.durationDesc | contentFilter }}...<span class="expand-btn" @click="openText2 = true">展开</span></div>
                <div v-else class="ctx ctx-word-break">{{ detailInfo.fundInveDescModel.durationDesc }} <span v-if="detailInfo.fundInveDescModel.durationDesc.length>66" class="expand-btn" @click="openText2 = false">收起</span></div>
              </template>
            </div>
          </div>
          <div class="item column">
            <span class="label">业绩报酬提取方式</span>
            <div class="ctx">
              <template v-if="detailInfo.fundInveDescModel.payMethod">
                <div v-if="detailInfo.fundInveDescModel.payMethod.length>66 && !openText3" class="ctx ctx-word-break">{{ detailInfo.fundInveDescModel.payMethod | contentFilter }}...<span class="expand-btn" @click="openText3 = true">展开</span></div>
                <div v-else class="ctx ctx-word-break">{{ detailInfo.fundInveDescModel.payMethod }} <span v-if="detailInfo.fundInveDescModel.payMethod.length>66" class="expand-btn" @click="openText3 = false">收起</span></div>
              </template>
            </div>
          </div>
          <div class="item column">
            <span class="label">收益分配方法</span>
            <div class="ctx">
              <div>门槛收益率{{ detailInfo.fundInveDescModel.hurdleRate ? detailInfo.fundInveDescModel.hurdleRate : '-' }}%,
              业绩报酬 {{ detailInfo.fundInveDescModel.performanceFee ? detailInfo.fundInveDescModel.performanceFee : '-' }}%</div>
              <template v-if="detailInfo.fundInveDescModel.incomeDistDesc">
                <div v-if="detailInfo.fundInveDescModel.incomeDistDesc.length>66 && !openText4" class="ctx ctx-word-break">{{ detailInfo.fundInveDescModel.incomeDistDesc | contentFilter }}...<span class="expand-btn" @click="openText4 = true">展开</span></div>
                <div v-else class="ctx ctx-word-break">{{ detailInfo.fundInveDescModel.incomeDistDesc }} <span v-if="detailInfo.fundInveDescModel.incomeDistDesc.length>66" class="expand-btn" @click="openText4 = false">收起</span></div>
              </template>
            </div>
          </div>
          <div class="item column">
            <span class="label">投资策略</span>
            <div class="ctx">
              <template v-if="detailInfo.fundInveDescModel.inveStrategy">
                <div v-if="detailInfo.fundInveDescModel.inveStrategy.length>66 && !openText5" class="ctx ctx-word-break">{{ detailInfo.fundInveDescModel.inveStrategy | contentFilter }}...<span class="expand-btn" @click="openText5 = true">展开</span></div>
                <div v-else class="ctx ctx-word-break">{{ detailInfo.fundInveDescModel.inveStrategy }} <span v-if="detailInfo.fundInveDescModel.inveStrategy.length>66" class="expand-btn" @click="openText5 = false">收起</span></div>
              </template>
            </div>
          </div>
        </template>
        <div class="item long-label">
          <span class="label">主要文件</span>
          <div v-if="fileList.length===0" class="ctx">--</div>
        </div>
        <div v-if="fileList.length>0" class="border"/>
        <div class="item" style="margin-top:-20px;margin-bottom:10px;">
          <div>
            <a
              v-for="(item,index) in fileList"
              :key="index"
              class="content2"
              href="javascript:void(0)"
              @click="$router.push({path: '/attachDetail', query: {src: item.url}})"
            >
              <div class="comment-file-img">
                <img :src="require('@/assets/images/file/comment-'+ getFileType(item.name) +'.png')" alt>
              </div>
              <span>{{ item.name }}</span>
            </a>
          </div>
        </div>
      </div>
      <!-- part5 -->
      <div class="sub-title">
        <div>
          <img src="@/assets/images/fund/icon3@2x.png">
          其他信息
        </div>
        <van-icon :name="article.part5?'arrow-up':'arrow-down'" class="arrow-icon" @click="toggle('part5')"/>
      </div>
      <div v-if="article.part5" class="reg-info">
        <div class="item">
          <span class="label">托管银行</span>
          <div class="ctx">{{ detailInfo.custodianBank || '--' }}</div>
        </div>
        <div class="item">
          <span class="label">托管银行账户</span>
          <div class="ctx">{{ detailInfo.custodianBankaccount || '--' }}</div>
        </div>
        <div class="item">
          <span class="label">审计机构</span>
          <div class="ctx">{{ detailInfo.auditOrgan || '--' }}</div>
        </div>
      </div>
      <!-- part4 -->
      <div class="sub-title">
        <div>
          <img src="@/assets/images/fund/icon11@2x.png">
          内部机构
        </div>
        <van-icon :name="article.part4?'arrow-up':'arrow-down'" class="arrow-icon" @click="toggle('part4')"/>
      </div>
      <div v-if="article.part4" class="person"><!--  && treeData[0].children[0].memberList[0].name -->
        <div v-if="treeData[0].children.length>0 && treeData[0].children[0].memberList[0].name" class="org-chart-contanier-wrap">
          <OrgChart v-for="(item,index) in treeData[0].children" :key="index" :data-obj="item"/>
          <p class="remark">
            注：<br>
            1.内部机构包括但不限于投资决策委员会，咨询委员会，联管会等<br>
            2.名称字体为蓝色且带蓝色*号的投委会是投资决策委员会<br>
            3.成员名称字体颜色为蓝色的为主席<br>
            4.成员名称前带*号的为元禾内部人员
          </p>

        </div>
        <div v-else class="remark">
          暂无内容
        </div>
        <!-- <ve-tree :data="chartData" :settings="chartSettings" height="3rem"/> -->
      </div>

    </div>
    <van-popup
      v-model="flowShow"
      :style="{ width: '100%',height:'100%' }"
      position="right"
      get-container="#app"
    >
      <flowChart v-if="flowShow" :chartid="chartId" @close="flowShow=false" />
    </van-popup>
  </div>
</template>
<script>

export default {
  components: {
    attachment: () => import('@/components/attachment/index'),
    OrgChart: () => import('./components/org-chart/OrgChart'),
    flowChart: () => import('./components/flowChart.vue')
  },
  filters: {
    nameFilter(val) {
      const arr = val.split('-')
      return arr[1]
    }
  },
  data() {
    return {
      funId: this.$route.query.id,
      detailInfo: {},
      treeData: [
        { children: [] }
      ],
      article: {
        part1: true,
        part2: true,
        part3: true,
        part4: true,
        part5: true
      },
      openText1: false,
      openText2: false,
      openText3: false,
      openText4: false,
      openText5: false,
      chartSettings: {
        seriesMap: {
          tree1: {
            orient: 'vertical',
            layout: 'orthogona', // 正交布局（水平布局）
            symbol: 'rect', // 矩形标记
            symbolSize: [88, 60] // 标记大小
            // label: {
            //   normal: {
            //     position: 'right',
            //     verticalAlign: 'middle',
            //     fontSize: 14,
            //     offset: [-86, 0], // 文本偏移量
            //     color: '#00173d',
            //     align: 'left'
            //   }
            // }
          }
        }
      },
      chartData: {
        columns: ['name', 'value'],
        rows: [
          {
            name: 'tree1',
            value: [{
              name: '李芳芳总裁',
              value: 1,
              children: [
                {
                  name: '王翔',
                  value: 2
                },
                {
                  name: '王翔',
                  value: 2
                },
                {
                  name: '王翔',
                  value: 2
                }
              ]
            }
            ]
          }
        ]
      },
      fileList: [],
      flowShow: false,
      chartId: ''
    }
  },
  computed: {
  },
  created() {
    this.getDetail()
    this.getTreeData()
  },
  methods: {
    getFileType(name) {
      return name.split('.')[1]
    },
    getDetail() {
      this.$axios.get(`/fundInfoDetail/${this.funId}`,
        null,
        res => {
          if (res.status === '0') {
            this.detailInfo = res.data.model
            this.getFile(res.data.model.descFile)
            this.getFile(res.data.model.fundManagerRecordAtta)
          }
        }
      )
    },
    getFile(DescFile) {
      this.$axios.get(`/attachController/getFileList`,
        { fieldToken: DescFile },
        res => {
          this.fileList = this.fileList.concat(res.data.fileList)
        })
    },
    getTreeData() {
      this.$axios.get(`/fundInvcomInfoByFundId`,
        { fundId: this.funId },
        res => {
          const data = res.data
          if (data.length > 0) {
            const filterArr = this.filterArray(data)
            this.$set(this.treeData[0], 'children', filterArr)
          } else {
            this.$set(this.treeData[0], 'children', [])
          }
        })
    },
    filterArray(arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].memberList === undefined) arr[i].memberList = []
        if (arr[i].name === null) arr[i].name = ''
        arr[i].children = arr[i].memberList
        if (arr[i].memberList.length > 0) {
          this.filterArray(arr[i].memberList)
        }
      }
      return arr
    },
    toggle(part) {
      this.article[part] = !this.article[part]
    },
    viewFlowChart(item) {
      this.chartId = item.processId
      this.flowShow = true
    }
  }
}
</script>
<style lang="scss">
 .baseinfo .yh-header-x{
  z-index: 0;
}
</style>

<style scoped lang="scss">

.sub-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-size: 28px;
  background-color: #FDF1F1;
  padding: 0px 40px;
  overflow: hidden;
  box-sizing: border-box;
  &>div{
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  img{
    width: 30px;
    vertical-align: middle;
    margin-right: 10px;
  }
  span{
    vertical-align: middle;
  }
  .arrow-icon{
    float:right;
    padding: 20px;
    padding-right: 0;
    margin-top: 10px;
  }
}
.reg-info{
  background: white;
  margin-bottom: 20px;
  padding: 20px 0 10px 0;
  .border{
    width: 670px;
    margin: 0 auto;
    border-bottom: 2px solid #F0F0F0;
    margin-bottom: 20px;
  }
  .item{
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    &.flexcol{
      flex-flow: column nowrap;
      justify-content: flex-start;
      .label{
        margin-bottom: 10px;
      }
    }
    .label{
      font-size:28px;
      font-weight:500;
      color:#9E9E9D;
      line-height:40px;
      vertical-align: top;
      display: inline-block;
      width: 240px;
    }
    .ctx{
      font-size:28px;
      font-weight:500;
      color:rgba(76,76,76,1);
      line-height:40px;
      display: inline-block;
      vertical-align: top;
      width: 400px;
      // background: yellow;
      text-align: right;
    }
    .ctx-word-break{
      word-break: break-all;
      white-space: pre-line;
    }
    &.column{
      flex-flow: column nowrap;

      .label{
        width: 100%;
      }
      .ctx{
        width: 100%;
        text-align: left;
      }
    }
    .expand-btn{
      color: #4a90e2;
      font-weight: 500;
      font-size: 28px;
    }
  }
  .long-label{
    .label{
      width: 450px;
    }
    .ctx{
      width: 200px;
    }
  }
}
.process{
  .col{
    width: 150px;
    display: inline-block;
    font-size:28px;
    color: #333;
    text-align: center;
    margin: 0 8px 20px 8px;
    font-size: 24px;
    img{
      width: 100%;
      height: 80px;
      margin-bottom: 10px;
    }
  }
}
.person{
  padding: 20px 40px;
  background: white;
  .remark{
    margin: 20px 0;
    font-size: 28px;
    color: #9e9e9d;
  }
}
.content2 {
  width: 100%;
  margin: 0 auto;
  font-size: 28px;
  color: rgba(0, 138, 245, 1);
  font-weight: 400;
  line-height: 50px;
  margin-top: 25px;
  text-align: left;
  display: block;
  span {
    color: #444;
    vertical-align: middle;
  }
  .comment-file-img{
    display: inline-block;
    margin-right: 15px;
  }
  img{
    height: 50px;
    width: auto;
    vertical-align: middle;
  }
}

</style>
