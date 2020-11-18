<template>
  <div class="has-comment">
    <headerx :cat-title="catTitle">
      <template slot="right"/>
    </headerx>
    <div class="comment-content no-comment">
      <div v-for="(item,index) in LIST" :key="index" class="item">
        <div class="tit">
          <span class="tit-left van-ellipsis">{{ item.applyName }}</span>
          <div>
            <span class="fd-tit-right-tag">{{ item.applicantName }}</span>
            <span class="fd-tit-right-tag">{{ item.applyTime }}</span>
          </div>
        </div>
        <div class="label p">内容：</div>
        <div v-if="item.sealContent.length>66 && !item.isCheck" class="p">
          {{ item.sealContent | contentFilter }}...<span class="expand-btn" @click="expandChange(item,index)">展开</span>
        </div>
        <div v-else class="p">
          {{ item.sealContent }} <span v-if="item.sealContent.length>66" class="expand-btn" @click="expandChange(item,index)">收起</span>
        </div>
        <div v-if="item.fileLists.length" class="file-con">
          <attachment :data="item.fileLists"/>
        </div>
      </div>
      <blank v-if="LIST.length==0&&!showLoading"/>
      <loading-box v-model="showLoading"/>
    </div>
  </div>
</template>
<script>

export default {
  components: {
    attachment: () => import('@/components/attachment/index')
  },
  data() {
    return {
      LIST: [],
      model: null,
      catTitle: '上市公司公告',
      showLoading: true
    }
  },
  created() {
    this.model = this.storage.get('businessObj') || {}
    const name = this.model.enName ? this.model.enName : this.model.projObjectName
    this.catTitle = name

    const projectObject = this.model.projObject
    const inveId = this.model.inveId
    const groupId = this.model.groupId

    this.getList(projectObject, inveId, groupId)
  },
  methods: {
    expandChange(item, index) {
      const check = !item.isCheck
      this.$set(this.LIST[index], 'isCheck', check)
    },
    // 上市公司
    getList(projectObject, inveId, groupId) {
      this.showLoading = true
      const URL = '/founderOaApplySealList'
      this.$axios.get(
        URL,
        {
          pageSize: 1000,
          currPage: 1,
          projectObject,
          inveId,
          groupId
        },
        res => {
          this.showLoading = false
          const data = res.data
          data.map(item => {
            item.isCheck = false
          })
          this.LIST = data
        }
      )
    }
  }
}
</script>
<style scoped lang="scss">
.expand-btn{
  font-size:28px;
  font-weight:500;
  color:rgba(74,144,226,1);
}
.item{
  background: white;
  font-size:28px;
  font-weight:500;
  color:rgba(76,76,76,1);
  padding:20px 40px;
  margin-bottom: 20px;
  .tit  {
    font-size:28px;
    font-weight:500;
    color:rgba(76,76,76,1);
    line-height:70px;
    display: flex;
    justify-content: space-between;
    .tit-left{
      width: 60%;
    }
  }
  .p-flex{
    display: flex;
    span{
      &:nth-child(1){
        padding-right: 60px;
      }
    }
  }
  .p{
    padding: 10px 0;
    line-height: 48px;
  }
  .label{
    font-size:28px;
    font-weight:500;
    color:rgba(158,158,157,1);
    em{
      color: #4c4c4c;
      font-style: normal;
    }
  }
  .blue{
    color: #4A90E2;
  }
  .file-con{
    border-top: 2px solid #e8e8e8;
    margin-top: 20px;
  }
}
</style>
