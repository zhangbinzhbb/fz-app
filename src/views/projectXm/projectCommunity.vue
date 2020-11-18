<template>
  <div class="has-comment project-community">
    <headerx cat-title="关联社群"/>
    <div class="comment-content no-comment">
      <div class="block">
        <div v-for="(item,index) in LIST" :key="index" class="block-item" @click="toClick(item)">
          <div class="block-item-left">
            <img v-if="item.portraitUrl" :src="item.portraitUrl" alt="">
            <span v-else>{{ item.name | formatNames }}</span>
          </div>
          <div class="block-item-right" >
            <p class="t1">
              <span class="t1-name">{{ item.name }}</span>
              <span class="t1-time">{{ item.create_dt }}</span>
            </p>
            <p class="t2">
              <span>{{ item.memberCount }}人</span>
              <span>{{ item.createUser.name }}</span>
            </p>
          </div>
        </div>
        <blank v-if="LIST.length==0"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  filters: {
    formatNames(name) {
      if (!name) return
      const aa = name.substring(0, 1)
      return aa
    }
  },
  data() {
    return {
      LIST: [],
      model: null
    }
  },
  created() {
    this.model = this.storage.get('businessObj') || {}

    const id = this.model.projObject
    const projtypeval = 1
    const inveid = this.model.inveId
    const ptid = this.model.groupId
    this.getList(id, projtypeval, inveid, ptid)
  },
  methods: {
    getList(id, projtypeval, inveid, ptid) {
      const URL = '/imAction/relGroupList.do'
      this.$axios.get(
        URL,
        {
          id,
          projtypeval,
          inveid,
          ptid
        },
        res => {
          this.LIST = res.dataContent
        }
      )
    },
    toClick(item) {
      const groupName = item.name
      const groupId = item.uid + ''
      XWalkFunction.startChatGroup(groupName, groupId)
    }
  }
}
</script>

<style lang="scss" scoped>
.project-community{
  background-color: #fff;
  .block{
    height: 100%;
  }
  .block-item{
    display: flex;
    background-color: #fff;
    padding: 31px 0 0 40px;
    font-size: 34px;
    &+.block-item{
      border-top: 1px solid #f8f8f8;
    }
    .block-item-left{
      img{
        width:94px;
        height:94px;
        border-radius:47px;
      }
      span{
        width:94px;
        height:94px;
        background:rgba(247,180,37,1);
        border-radius:47px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size:30px;
        font-weight:500;
        color:rgba(255,255,255,1);
      }
    }
    .block-item-right{
      width: calc(100% - 94px);
      padding: 6px 40px 20px 20px;
      border-bottom: 2px solid #F5F5F5;
      box-sizing: border-box;
      .t1{
        display: flex;
        justify-content: space-between;
        .t1-name{
          font-size:32px;
          font-weight:400;
          color:rgba(38,38,38,1);
        }
        .t1-time{
          font-size:28px;
          font-weight:500;
          color:rgba(153,153,152,1);
        }
      }
      .t2{
        font-size:24px;
        font-weight:400;
        color:rgba(106,106,106,1);
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        padding-top: 15px;
      }
    }
  }
}
</style>
