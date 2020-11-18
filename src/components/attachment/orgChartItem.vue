<template>
  <mt-popup
    v-model="popupVisible"
    :class="{'folder-mySchedule-android':isAndroid12,'folder-mySchedule-ios12':isIos12,'folder-mySchedule-ios':isIos}"
    :style="{ width: '100%',height:'100%'}"
    position="right"
    class="menu yh-content has-comment"
  >
    <headerx :cat-title="title" style="z-index: 20000!important" class="common-tree-select" page-type="back" @closeBack="closeBtn" />
    <div class="comment-content no-comment fd-gray-bg">
      <div
        v-for="(item,index) in treeData"
        :key="index"
        :class="{'fd-folder-ios12':isIos12,'fd-folder-ios':isIos,'fd-folder-android':isAndroid12}"
        class="fd-folder-item fd-white-bg"
        @click="toRouter(item)">
        <img
          v-if="item.fileType=='dic'"
          src="@/assets/images/file/comment-Shape.png"
          alt
          class="fd-folder-item-png"
        >
        <img v-else :src="require('@/assets/images/file/comment-'+item.fileType+'.png')" alt class="fd-folder-item-png">
        <div class="fd-folder-item-title">
          {{ item.itemName || item.attaFileName }}
        </div>
      </div>
    </div>
  </mt-popup>
  <!-- <van-popup
    v-model="popupVisible"
    :overlay="false"
    :class="{'folder-mySchedule-android':isAndroid12,'folder-mySchedule-ios12':isIos12,'folder-mySchedule-ios':isIos}"
    :style="{ width: '100%',height:'100%'}"
    position="right"
    class="menu yh-content has-comment">
    <headerx :cat-title="title" style="z-index: 20000!important" class="common-tree-select" page-type="back" @closeBack="closeBtn" />
    <div class="comment-content no-comment fd-gray-bg">
      <div
        v-for="(item,index) in treeData"
        :key="index"
        :class="{'fd-folder-ios12':isIos12,'fd-folder-ios':isIos,'fd-folder-android':isAndroid12}"
        class="fd-folder-item fd-white-bg"
        @click="toRouter(item)">
        <img
          v-if="item.fileType=='dic'"
          src="@/assets/images/file/comment-Shape.png"
          alt
          class="fd-folder-item-png"
        >
        <img v-else :src="require('@/assets/images/file/comment-'+item.fileType+'.png')" alt class="fd-folder-item-png">
        <div class="fd-folder-item-title">
          {{ item.itemName || item.attaFileName }}
        </div>
      </div>
    </div>
  </van-popup> -->
</template>
<script>
export default {
  props: {
    id: {
      type: String,
      default: null
    },
    obj: {
      type: Object,
      dafault: () => {
        return {}
      }
    }
  },
  data() {
    return {
      title: '',
      treeData: [],
      popupVisible: false,
      uid: this.id,
      selectArrId: []
    }
  },
  watch: {
    popupVisible(val) {
      this.uid = this.id
      this.selectArrId.length === 0 ? this.selectArrId.push(this.id) : this.selectArrId = []
      this.init()
    }
  },
  methods: {
    showPopup() { // 打开弹出层
      this.popupVisible = true
    },
    closePopup(val) { // 关闭弹出层
      this.popupVisible = false
      this.$emit('select-change-org')
    },
    init() {
      const id = this.uid
      this.title = this.obj.title
      this.getFileList(id)
    },
    toRouter(item) {
      if (item.fileType === 'dic') {
        this.getFileList(item.attaId, res => {
          if (res.length) {
            this.uid = item.attaId
            this.selectArrId.push(item.attaId)
            this.treeData = res
          } else {
            this.Toast('该文件为空')
          }
        })
        return
      }
      // 附件下载
      this.downLoadFiles(
        null,
        null,
        item.attaFileName,
        item.fileId,
        item.fileSource === 'EI' ? 'loadEI' : 'loadFileOA'
      )
      this.selectArrId.push('-1')
    },
    closeBtn() {
      const len = this.selectArrId.length
      if (len > 1) {
        this.uid = this.selectArrId[len - 2]
        this.selectArrId.splice(len - 1, 1)
        this.getFileList(this.uid, res => {
          if (res.length) {
            this.treeData = res
          }
        })
        return
      }
      this.closePopup()
    },
    getFileList(nodeId, cb) {
      const params = this.$route.query
      const length = 1000
      const currPage = 1
      const keyWord = this.obj.keyWord
      const objectId = this.obj.objectId
      const groupId = this.obj.groupId
      const fundId = this.obj.projectOrFundId || params.id
      const itemType = this.obj.itemType
      let url = ''
      if (itemType === '3' || itemType === '2') {
        url = '/fileList' // 子基金文件接口
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
          keyWord,
          fundId,
          itemType
        },
        res => {
          if (cb) {
            cb(res.data)
            return
          }
          this.treeData = res.data
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
 /*ios双头部冲突  */
.common-tree-select{
  position: fixed;
  .close-btn{
    position: absolute;
    top: 10px;
    right:5px;
    font-size: 43px;
  }
}
.fd-gray-bg{
  background:rgba(248,248,248,1);
}
.fd-white-bg{
  background:rgba(255,255,255,1);
}
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
</style>
