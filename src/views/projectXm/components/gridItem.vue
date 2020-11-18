<template>
  <div class="fd-grid-contanier">
    <div class="plat-contain">
      <div v-for="(item,index) in list" :key="index" class="item" @click="goToRouter(item)">
        <img :src="require('@/assets/images/platform/'+item.img+'.png')" alt="">
        <div class="text">{{ item.name }}</div>
      </div>
    </div>
    <loading-box v-model="showLoading"/>
  </div>
</template>

<script>
export default {
  props: {
    lists: {
      type: Array,
      default: () => {
        return []
      }
    },
    models: {
      type: Object,
      default: () => {
        return {}
      }
    },
    noData: {
      type: Boolean
    }
  },
  data() {
    return {
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
      },
      list: [],
      model: null,
      showLoading: true,
      defaultList: [],
      type: this.$route.query.type || ''
    }
  },
  watch: {
    noData(val) {
      console.log('val:', val)
      if (val) { this.showLoading = false }
    },
    models(obj) {
      const type = this.type
      if (type === 'project') {
        this.list = this.lists
        const projectObject = obj.projObject
        const inveId = obj.inveId
        const groupId = obj.groupId
        this.pageInfo.params.groupId = groupId
        this.pageInfo.params.inveId = inveId
        this.pageInfo.params.projObject = projectObject
        this.getList(true)
      }
    }
  },
  created() {
    const type = this.type
    if (type === 'project') return

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
    }
  }
}
</script>

<style lang="scss" scoped>
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
