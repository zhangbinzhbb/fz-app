<template>
  <div style="position:relative">
    <div v-if="data.length" :class="{'no-icon':params.iconHidden}" class="attach">
      <a
        v-for="(item,index) in (typeof(data)=='string'?[data]:data)"
        v-if="parseInt(item.fileSize)!=0"
        :key="index"
        class="content2"
        href="javascript:void(0)"
        @click.stop="downLoadFiles(null,item.FILE_PATH,item.FILE_OLD_NAME||item.fileName||item.fileOldName,item.FILE_ID||item.fileId,getDownloadUrl())"
      >
        <template v-if="item.fileOldName || item.fileName || item.FILE_OLD_NAME">
          <div class="comment-file-img">
            <img :src="require('@/assets/images/file/comment-'+getFileType(item)+'.png')" alt>
          </div>
          <span>{{ item.FILE_OLD_NAME||item.fileOldName||item.fileName | filterValue }}</span>
        </template>
      </a>
      <a v-else href="javascript:void(0)">--</a>
    </div>
    <div v-else>
      <a v-if="isShowLine" href="javascript:void(0)">--</a>
      <a v-else href="javascript:void(0)"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Attachment',
  filters: {
    filterValue: function(val) {
      if (val) {
        return val
      } else {
        return '--'
      }
    }
  },
  props: {
    data: {
      type: [Array, String],
      default: () => {
        return []
      }
    },
    page: {
      type: String,
      default: null
    },
    params: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 部分页面没有文件 不需要显示 --
    isShowLine: {
      type: Boolean,
      default: () => {
        return true
      }
    }
  },
  data() {
    return {
      comment: {}
    }
  },
  watch: {},
  created() {
    this.getDownloadUrl()
  },
  methods: {
    getFileType(file) {
      const fileImgList = ['doc', 'docx', 'exe', 'jpg', 'pdf', 'png', 'ppt', 'rar (2)', 'rar', 'Shape', 'txt', 'xls', 'xlsx', 'zip', 'ceb']
      let type = file.FILE_TYPE || file.fileType || 'default'
      // console.log('type', type)
      if (fileImgList.indexOf(type) <= -1) {
        type = 'default'
      }
      return type
    },
    getDownloadUrl() {
      const page = this.$route.name
      let url = 'loadFileOA'
      if (page === 'knowledgeDetail') {
        url = 'downloadKI'
      }

      if (
        page.indexOf('fund') > -1 ||
        page.indexOf('Foud') > -1 ||
        page.indexOf('project') > -1
      ) {
        url = 'downloadEI'
      }
      if (
        page === 'jobsNew' ||
        page === 'workFlowNew' ||
        page === 'resumeNew'
      ) {
        url = 'downloadBase'
      }
      return url
    },
    matchType(fileName) {
      // 后缀获取
      var suffix = ''
      // 获取类型结果
      var result = ''
      try {
        var flieArr = fileName.split('.')
        suffix = flieArr[flieArr.length - 1]
      } catch (err) {
        suffix = ''
      }
    }
  }
}
</script>

<style scoped lang="scss">
.no-file {
  position: absolute;
  // position: relative;
  top: -30px;
  left: 140px;
  color: #999;
}
.attach {
  background: white;
  // margin-top: -30px;
  // margin-top: 20px;
  .titleimg {
    width: 250px;
    height: 48px;
    // margin-top: 50px;
    background: white;
    img {
      height: 70%;
      float: left;
      margin-left: 20px;
      margin-top: 5px;
    }
    span {
      font-size: 30px;
      float: left;
      margin-left: 15px;
      line-height: 50px;
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
    display: flex;
    span {
      color: #444;
      vertical-align: middle;
      white-space:nowrap;
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
}
.no-icon {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  .content2 {
    margin-top: 0;
  }
}
.attach.no-icon{
  a{
    color:#444
  }
}
a{
  color:#444!important;
}
</style>
