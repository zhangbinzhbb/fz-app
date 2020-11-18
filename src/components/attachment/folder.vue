<template>
  <div class="has-comment" style="height:100%">
    <headerx :cat-title="catTitle" />
    <div class="comment-content no-comment">
      <div class="fd-folder-contanier fd-gray-bg" style="height:100%;">
        <form class="yh-search fd-gray-bg" action @submit.prevent="search">
          <img src="@/assets/images/icon/search-img.png" class="search-img">
          <input
            ref="searchInput"
            v-model="keyWord"
            type="search"
            placeholder="搜索"
          >
        </form>
        <div class="fd-folder-content fd-white-bg" style="height:100%;">
          <div v-for="(item,index) in list" :key="index" class="fd-folder-item" @click="next(item)">
            <img
              v-if="item.fileType=='dic'"
              src="@/assets/images/file/comment-Shape.png"
              alt
              class="fd-folder-item-png"
            >
            <img v-else :src="'@/assets/images/file/comment-'+item.fileType+'.png'" alt class="fd-folder-item-png">
            <div class="fd-folder-item-title">
              {{ item.itemName||item.attaFileName }}
            </div>
          </div>
          <loading-box v-model="showLoading"/>
          <blank v-if="!isLoading&&list&&list.length==0 && !showLoading"/>
        </div>
        <org-chart-popup ref="rightPopupOrgChart" :id="sid" :obj="subObj"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AttacFolder',
  components: {
    'org-chart-popup': () => import('./orgChartItem')
  },
  props: {
    groupId: {
      type: [String, Number],
      default: null
    },
    projObject: {
      type: [String, Number],
      default: null
    },
    projOrFundId: {
      type: [String, Number],
      default: null
    },
    type: {
      type: [String, Number],
      default: null // 附件分类（1企业2基金3子基金4平台）
    },
    from: {
      type: String,
      default: null
    },
    catTitle: [String]
  },
  data() {
    return {
      isLoading: false,
      list: [],
      getFolder: false,
      keyWord: '',
      query: this.$route.query,
      folder: {},
      sid: '',
      subObj: null,
      showLoading: true
    }
  },
  watch: {},
  created() {
    if (!this.from) {
      this.getAttaItemList()
    } else {
      this.getFileList()
    }
  },
  methods: {
    // 获取最外层文件夹
    getAttaItemList() {
      const groupId = this.groupId
      const objectId = this.projObject
      const itemType = this.type
      const projOrFundId = this.projOrFundId
      if (this.getFolder) {
        return
      }
      let url = 'attaItemListForProject'
      if (itemType == 2 || itemType == 3 || itemType == 4) {
        url = 'attaItemList'// 母基金/子基金文件接口
      }
      this.$axios.get(
        url,
        {
          groupId,
          objectId,
          itemType,
          projOrFundId
        },
        res => {
          this.getFolder = true
          const data = res.data
          const arr = JSON.parse(JSON.stringify(data))
          this.storage.set('tree-file-data', arr)
          if (res.data.length) {
            this.folder = data[0]
            this.getFileList(this.folder.itemId)
          } else {
            this.showLoading = false
          }
        }
      )
    },
    getFileList(nodeId, cb) {
      this.showLoading = true
      const params = this.$route.query
      const length = 1000
      const currPage = 1
      const keyWord = this.keyWord
      const objectId = this.projObject
      const groupId = this.groupId
      const fundId = this.folder.projectOrFundId || params.id
      const itemType = this.type
      nodeId = nodeId || this.folder.itemId || params.nodeId
      let url = ''
      if (itemType == 2 || itemType == 3 || itemType == 4) {
        url = '/fileList'// 子基金文件接口
      } else {
        url = '/fileListForProject'
      }
      this.$axios.get(
        url,
        {
          length,
          currPage,
          nodeId,
          objectId,
          groupId,
          fundId,
          keyWord,
          itemType
        },
        res => {
          this.showLoading = false
          if (this.$route.name !== 'presentation') {
            // 对返回数据进行排序
            const compare = property => {
              return function(obj1, obj2) {
                var value1 = obj1[property]
                var value2 = obj2[property]
                return value1 - value2 // 升序
              }
            }
            const sortObj = res.data.sort(compare('attaId'))
            res.data = sortObj
          }
          if (cb) {
            cb(res.data)
            return
          }
          this.isLoading = false
          this.list = res.data
        },
        err => {
          this.isLoading = false
        }
      )
    },
    search() {
      this.$refs.searchInput.blur()
      this.getFileList()
    },
    next(item) {
      if (item.fileType === 'dic') {
        this.getFileList(item.attaId, res => {
          if (res.length) {
            this.sid = item.attaId
            // 存obj
            const keyWord = this.keyWord
            const objectId = this.projObject
            const groupId = this.groupId
            const itemType = this.type
            const projOrFundId = this.folder.projectOrFundId || this.query.projectOrFundId
            const title = item.attaFileName
            this.subObj = {
              keyWord,
              objectId,
              groupId,
              itemType,
              projOrFundId,
              title
            }
            this.$refs.rightPopupOrgChart.showPopup()
            return
          } else {
            this.Toast('该文件为空')
          }
        })
      } else {
        this.downLoadFiles(
          null,
          null,
          item.attaFileName,
          item.fileId,
          // item.fileSource === 'EI' ? 'downloadEI' : 'downloadFileOA'
          item.fileSource === 'EI' ? 'loadEI' : 'loadFileOA'
        )
        // 下载
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.fd-gray-bg{
  background:rgba(248,248,248,1);
}
.fd-white-bg{
  background:rgba(255,255,255,1);
}
.fd-folder-contanier{
  .fd-folder-content{
    .fd-folder-item{
      display: flex;
      align-items: center;
      &+.fd-folder-item{
        .fd-folder-item-title{
           border-top: 2px solid #F0F0F0;
        }
      }
      .fd-folder-item-png{
        width: 42px;
        height: 50px;
        padding: 0 36px 0 40px;
      }
      .fd-folder-item-title{
        font-size:28px;
        font-weight:500;
        color:rgba(76,76,76,1);
        padding: 25px 0 24px;
        width: 100%;
      }
    }
  }
}
</style>
