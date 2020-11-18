<template>
  <div class="has-comment project-home-record">
    <headerx :cat-title="catTitle"/>
    <div class="comment-content no-comment">
      <form class="yh-search" action @submit.prevent="search">
        <img src="@/assets/images/icon/search-img.png" class="search-img">
        <input
          ref="searchInput"
          v-model="keyword"
          type="search"
          placeholder="请输入标题关键字"
        >
      </form>
      <div class="record-inner">
        <div v-for="(item,index) in updataList" :key="index" class="record-item">
          <h2>
            <div class="t1">
              <span>{{ (index+1)>9?'':'0' }}{{ index+1 }}</span>
              {{ item.columRemark }}
            </div>
            <div class="t2 tags-l">
              <span class="tag">{{ item.createBy }}</span>
              <span class="tag">{{ item.createDt }}</span>
            </div>
          </h2>
          <div class="card">
            <div class="b">
              <p>变更前</p>
              <ul>
                <li v-if="item.contentOld">
                  <div v-if="item.contentOld.length>66 && !item.isCheck1" class="p">
                    {{ item.contentOld | contentFilter }}...<span class="expand-btn" @click.stop="expandChange1(item,index)">展开</span>
                  </div>
                  <div v-else class="p">
                    {{ item.contentOld }} <span v-if="item.contentOld.length>66" class="expand-btn" @click.stop="expandChange1(item,index)">收起</span>
                  </div>
                </li>
              </ul>
            </div>
            <div class="b">
              <p>变更后</p>
              <ul>
                <li v-if="item.content">
                  <div v-if="item.content.length>66 && !item.isCheck" class="p">
                    {{ item.content | contentFilter }}...<span class="expand-btn" @click.stop="expandChange(item,index)">展开</span>
                  </div>
                  <div v-else class="p">
                    {{ item.content }} <span v-if="item.content.length>66" class="expand-btn" @click.stop="expandChange(item,index)">收起</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <blank v-if="updataList.length===0&&!showLoading"/>
        <loading-box v-model="showLoading"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      model: '',
      catTitle: '',
      updataList: [],
      keyword: '',
      showLoading: true
    }
  },
  created() {
    this.model = this.storage.get('businessObj') || {}
    const name = this.model.enName ? this.model.enName : this.model.projObjectName
    this.catTitle = name

    const projObject = this.model.projObject
    const inveId = this.model.inveId
    this.getSelectListById(inveId, projObject)
  },
  methods: {
    expandChange(item, index) {
      const check = !item.isCheck
      this.$set(this.updataList[index], 'isCheck', check)
    },
    expandChange1(item, index) {
      const check = !item.isCheck1
      this.$set(this.updataList[index], 'isCheck1', check)
    },
    getSelectListById(investId, enterId) {
      this.showLoading = true
      const searchId = this.keyword
      const url = '/handleRecordAction/selectListById.do'
      this.$axios.get(
        url,
        {
          investId,
          enterId,
          searchId
        },
        res => {
          this.updataList = res.info
          this.showLoading = false
        }
      )
    },
    search() {
      this.$refs.searchInput.blur()
      const projObject = this.model.projObject
      const inveId = this.model.inveId
      this.getSelectListById(inveId, projObject)
    }
  }
}
</script>

<style lang="scss" scoped>
.project-home-record{
  .yh-search {
    background: #f8f8f8;
  }
  .expand-btn{
    font-size:28px;
    font-weight:500;
    color:#b60005;
  }
  .tags-l{
    display: flex;
    padding-top: 10px;
    span{
      padding: 5px 8px;
      font-size:22px;
      font-weight:400;
      color:rgba(49,149,252,1);
      background:rgba(49,149,252,0.23);
      &:nth-child(2){
        color:rgba(3,170,74,1);
        background:rgba(58,204,120,0.23);
      }
      &+span{
        margin-left: 14px;
      }
    }
  }
  .record-inner{
    background-color: #fff;
    padding: 40px;
    height: 100%;
    .record-item{
      &+.record-item{
        padding-top: 30px;
      }
      h2{
        display: flex;
        flex-direction: column;
        .t1{
          padding-bottom: 20px;
          span{
            width:40px;
            background:rgba(182,0,5,0.1);
            box-sizing: border-box;
            padding: 4px 6px;
          }
        }
        font-size:28px;
        font-weight:500;
        color:rgba(76,76,76,1);
      }
      .card{
        display: flex;
        padding-top: 30px;
        .b{
          flex: 1;
          background:rgba(248,248,248,1);
          padding: 20px;
          p{
            height:37px;
            font-size:26px;
            font-weight:400;
            color:rgba(76,76,76,1);
            line-height:37px;
          }
          ul{
            padding-top: 10px;
            li{
              line-height: 1.2;
              font-size:26px;
              font-weight:500;
              color:rgba(74,144,226,1);
              word-break:break-all
            }
          }
          &+.b{
            margin-left: 20px;
          }
        }
      }
    }
  }
}
</style>
