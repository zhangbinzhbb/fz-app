<template>
  <div class="has-comment">
    <headerx :cat-title="catTitle"/>
    <div class="comment-content no-comment">
      <!-- 企业信息 -->
      <div class="sub-title">
        <img src="@/assets/images/icons/icon6@2x.png">
        企业信息
        <van-icon :name="article.part1?'arrow-up':'arrow-down'" class="arrow-icon" @click="toggle('part1')"/>
      </div>
      <div v-if="article.part1" class="reg-info">
        <div class="item item-column">
          <span class="label">主营业务</span>
          <div v-if="model.scope" style="width:100%;">
            <div v-if="model.scope.length>66 && !isCheck" class="ctx ctx-word-break">{{ model.scope | contentFilter }}...<span class="expand-btn" @click="isCheck = true">展开</span></div>
            <div v-else class="ctx ctx-word-break">{{ model.scope }} <span v-if="model.scope.length>66" class="expand-btn" @click="isCheck = false">收起</span></div>
          </div>
          <div v-else class="item-column-empty">--</div>
        </div>
        <div class="item item-column">
          <span class="label">企业简介</span>
          <div class="ctx">{{ model.companyProfile? model.companyProfile:'--' }}</div>
        </div>
        <div class="item item-column">
          <span class="label">运营情况</span>
          <div v-if="model.currentOperationSituation" style="width:100%;">
            <div v-if="model.currentOperationSituation.length>66 && !isCheck1" class="ctx ctx-word-break">{{ model.currentOperationSituation | contentFilter }}...<span class="expand-btn" @click="isCheck1 = true">展开</span> </div>
            <div v-else class="ctx ctx-word-break">{{ model.currentOperationSituation }} <span v-if="model.currentOperationSituation.length>66" class="expand-btn" @click="isCheck1 = false">收起</span></div>
          </div>
          <div v-else class="item-column-empty">
            --
          </div>
        </div>
        <div class="item item-column">
          <span class="label">未来前景及亮点</span>
          <div v-if="model.inveEvaluation" style="width:100%;">
            <div v-if="model.inveEvaluation.length>66 && !isCheck2" class="ctx ctx-word-break">{{ model.inveEvaluation | contentFilter }}...<span class="expand-btn" @click="isCheck2 = true">展开</span></div>
            <div v-else class="ctx ctx-word-break">{{ model.inveEvaluation }} <span v-if="model.inveEvaluation.length>66" class="expand-btn" @click="isCheck2 = false">收起</span></div>
          </div>
          <div v-else class="item-column-empty">
            --
          </div>
        </div>
        <div class="item">
          <span class="label">清科行业</span>
          <div class="ctx">{{ model.qkIndustryName? model.qkIndustryName:'--' }}</div>
        </div>
        <div class="item">
          <span class="label">七大行业</span>
          <div class="ctx">{{ model.sevenIndustryName? model.sevenIndustryName:'--' }}</div>
        </div>
      </div>
      <!-- 项目信息 -->
      <div class="sub-title">
        <img src="@/assets/images/icons/icon7@2x.png">
        项目信息
        <van-icon :name="article.part2?'arrow-up':'arrow-down'" class="arrow-icon" @click="toggle('part2')"/>
      </div>
      <div v-if="article.part2" class="reg-info">
        <div class="item">
          <span class="label">分管合伙人</span>
          <div class="ctx">{{ model.chargePartner? model.chargePartner:'--' }}</div>
        </div>
        <div class="item">
          <span class="label">项目经理</span>
          <div class="ctx">{{ model.mangerName? model.mangerName:'--' }}</div>
        </div>
        <div class="item">
          <span class="label">项目成员</span>
          <div class="ctx">{{ model.memberName? model.memberName:'--' }}</div>
        </div>
        <div class="item">
          <span class="label">自定义编号</span>
          <div class="ctx">{{ model.projNo? model.projNo:'--' }}</div>
        </div>
        <div class="item">
          <span class="label">主联系人</span>
          <div class="ctx">{{ model.custName? model.custName:'--' }}</div>
        </div>
        <div class="item">
          <span class="label">联系电话</span>
          <div class="ctx">{{ model.phoneNo? model.phoneNo:'--' }}</div>
        </div>
        <div class="item">
          <span class="label">项目状态</span>
          <div class="ctx">{{ group.projStatusName? group.projStatusName:'--' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      article: {
        part1: true,
        part2: true
      },
      model: null,
      catTitle: '',
      group: null,
      isCheck: false,
      isCheck1: false,
      isCheck2: false,
      isCheck3: false
    }
  },
  created() {
    const model = this.storage.get('businessObj') || {}
    this.group = model
    const name = model.enName ? model.enName : model.projObjectName
    this.catTitle = name

    const projObject = model.projObject
    const inveId = model.inveId
    const groupId = model.groupId
    const memberId = model.memberId
    this.getEntInfoDetail(projObject, inveId, groupId, memberId)
  },
  methods: {
    toggle(part) {
      this.article[part] = !this.article[part]
    },
    getEntInfoDetail(projectObject, inveId, groupId, memberId) {
      const url = '/entInfoDetail'
      this.$axios.get(
        url,
        {
          projectObject: projectObject,
          inveId,
          groupIdS: groupId,
          memberId
        },
        res => {
          this.model = res.data.model
        }
      )
    }
  }
}
</script>
<style scoped lang="scss">
.item-column-empty{
  font-size: 28px;
  font-weight: 500;
  color: rgba(76, 76, 76, 1);
  text-align: left;
  width: 100%;
}
.expand-btn{
  font-size:28px;
  font-weight:500;
  color:rgba(74,144,226,1);
}
.ctx-word-break{
  word-break: break-all;
  white-space: pre-line;
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
    padding: 10px 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
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

  }
  .item-column{
    display: flex;
    flex-direction:column;
    .label{
      text-align: left;
      width: 100%;
    }
    .ctx{
      width: 100%;
      text-align: left;
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
    width: 110px;
    display: inline-block;
    font-size:28px;
    color: #333;
    line-height: 200%;
    text-align: center;
    img{
      width: 80%;
      height: 80px;
      object-fit: cover;
    }
  }
}
.person{
  background: white;
  padding: 40px;
}
</style>
