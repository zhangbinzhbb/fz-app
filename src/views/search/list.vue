<template>
  <div class="search-content">
    <div class="search-list">
      <div v-for="(item,index) in searchFilte" :key="index" class="searchItem">
        <h2 v-if="listArr[index].length">{{ item.title }}</h2>
        <div>
          <div
            v-for="(citem,sindex) in listArr[index]"
            :key="sindex"
            class="titletop"
            @click="routerClick(citem)"
          >
            <p>{{ citem.name }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Object,
      default: () => {}
    },
    title: {
      type: String,
      default: ''
    }
    // keyName:{
    //   type:String,
    //   default:""
    // }
  },
  data() {
    return {
      filterList: [],
      listArr: [],
      searchFilte: [
        { title: '项目名称', keyName: 'projectinfo' },
        { title: '基金名称', keyName: 'fundinfo' },
        { title: '子基金', keyName: 'fundprojinfo' },
        { title: '平台', keyName: 'platforminfo' }
      ],
      lists: [
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
      ]
    }
  },
  computed: {},
  watch: {
    list(val) {
      this.filterListKey()
    }
  },
  created() {
    this.filterListKey()
  },
  methods: {
    async routerClick(citem) {
      const model = citem.content
      // 判断类型
      if (citem.STYPE === 'projectinfo') { // 跳转到项目（企业详情）
        // 九宫格
        this.lists.map((sitem, index) => {
          if (model.groupId !== '4' && sitem.name === '上市公司公告') {
            this.lists.splice(index, 1)
          }
        })
        const gridData = JSON.parse(JSON.stringify(this.lists))
        this.storage.set('gridData', gridData)
        const data = {
          currPage: 1,
          pageSize: 1,
          groupId: model.groupId,
          inveId: model.inveId,
          memberId: '',
          myOrAll: 'all',
          projObject: model.projObject
        }

        const obj = await this.getListViewIdMy(data)
        if (obj.length === 0) return

        const dataObj = JSON.parse(JSON.stringify(obj[0]))
        this.storage.set('businessObj', dataObj)
        this.$router.push({ path: '/projectDetail' })
      }
      if (citem.STYPE === 'fundinfo') {
        this.$axios.get('/fundInfoListByUserId', {
          fundId: citem.PROJ_ID,
          keyWord: '',
          currPage: 1,
          length: 10
        }, res => {
          this.storage.set('fundDetail', res.data[0])
          this.$router.push({ path: '/fund', query: { id: citem.PROJ_ID }})
        })
      }
      if (citem.STYPE === 'fundprojinfo') {
        this.$router.replace({
          path: '/subfund',
          query: { id: citem.PROJ_ID }
        })
      }
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
    },
    filterListKey() {
      const reverseList = this.list
      const arr1 = []
      const arr2 = []
      const arr3 = []
      const arr4 = []
      if (reverseList.projList) {
        reverseList.projList.forEach(element => {
          arr1.unshift({
            STYPE: 'projectinfo',
            name: element.projObjectName,
            content: element
          })
        })
      }
      for (let i = 0; i < reverseList.otherList.length; i++) {
        if (reverseList.otherList[i].STYPE.indexOf('fundinfo') > -1) {
          reverseList.otherList[i].name = reverseList.otherList[i].PROJ_NAME
          arr2.unshift(reverseList.otherList[i])
        }
        if (reverseList.otherList[i].STYPE.indexOf('fundprojinfo') > -1) {
          reverseList.otherList[i].name = reverseList.otherList[i].PROJ_NAME
          arr3.unshift(reverseList.otherList[i])
        }
        if (reverseList.otherList[i].STYPE.indexOf('platforminfo') > -1) {
          reverseList.otherList[i].name = reverseList.otherList[i].PROJ_NAME
          arr4.unshift(reverseList.otherList[i])
        }
      }
      this.listArr = [arr1, arr2, arr3, arr4]
      // console.log('this.listArr', this.listArr)
    }
  }
}
</script>

<style scoped lang="scss">
.searchlist {
  margin-top: 30px;
  .search-list {
    h2 {
      font-size: 36px;
      padding-left: 15px;
    }
    .titletop {
      background-color: #fff;
      width: 90%;
      margin: 15px auto;
      border-bottom: 2px solid #dfdfdf;
      padding: 25px 15px;
      p {
        width: 100%;
        font-size: 26px;
        text-align: left;
        color: #222222;
        margin-bottom: 20px;
        word-wrap: break-word;
      }
      span {
        font-size: 20px;
        font-family: MicrosoftYaHei;
        font-weight: 400;
        color: rgba(136, 136, 136, 1);
        display: block;
        text-align: left;
        word-wrap: break-word;
      }
    }
  }
}
</style>
