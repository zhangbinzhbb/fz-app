<template>
  <div class="fd-upload">
    <slot>
      <div class="fd-upload-box">
        <div class="fd-upload-def clear-fix">
          <span class="upload-title">{{ placeholder }}</span>
          <van-uploader :after-read="fileChanged" :multiple="multiple" accept="*">
            <img src="@/assets/images/upload.png" alt class="upload-img">
          </van-uploader>
        </div>
      </div>

      <div class="fd-upload-files">
        <a
          v-for="(file,index) in files"
          :key="index"
          class="fd-file-link"
          href="javascript:void(0)">
          <span class="file-test">
            <img :src="require('@/assets/images/file/comment-'+ (file.fileType || file.FILE_TYPE )+'.png')" alt="">
            <span> {{ file.fileOldName || file.FILE_OLD_NAME }}</span>
          </span>
          <van-icon name="delete" class="vant-del-scope" @click.stop="deleteFile(index)"/>
        </a>
      </div>
    </slot>
  </div>
</template>
<script type="text/ecmascript-6">
const COMPONENT_NAME = 'fd-upload'
const EVENT_INPUT = 'input'
export default {
  name: COMPONENT_NAME,
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    },
    multiple: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: '上传附件'
    },
    uploadUrl: {
      type: String,
      default: '/fileAction/uploadEI.do'
    }
  },
  data() {
    return {
      files: this.value
    }
  },
  watch: {
    value(newVal) {
      this.files = newVal
    },
    files(newFiles) {
      this.$emit(EVENT_INPUT, newFiles)
    }
  },
  methods: {
    fileChanged(files) {
      this.updateFiles(files)
    },
    updateFiles(files, uploadUrl) {
      uploadUrl = this.uploadUrl
      const update = file => {
        this.$axios.postFile(uploadUrl, file.file, res => {
          if (res.statue === '0') {
            this.files.push(res.dataContent[0])
            return
          }
          this.Toast(res.msg)
        })
      }
      // files
      if (files.length) {
        files.map(file => {
          update(file)
        })
      } else {
        update(files)
      }
    },
    deleteFile(index) {
      this.files.splice(index, 1)
    }
  }
}
</script>

<style lang="scss">
.fd-upload{
  .fd-upload-def{
    display: flex;
    justify-content: space-between;
    .upload-title{
      font-size:28px;
      font-weight:500;
      color: #9e9e9d;
    }
    // .van-uploader__input-wrapper{
    //   margin-top: -30px;
    // }
    .upload-img{
      width: 31px;
      height: 28px;
      // margin-top: -20px;
      display: inline-block;
      padding: 10px 0 10px 10px;
    }
  }
  .fd-upload-files{
    // padding-top: 30px;
    display: flex;
    flex-direction: column;
    .fd-file-link{
      font-size:28px;
      font-weight:500;
      color:rgba(76,76,76,1);
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 10px 0;
      .file-test{
        display: flex;
        align-items: center;
        img{
          width: 42px;
          height: 50px;
          margin-right: 15px;
        }
        span{
          display: block;
          width: 500px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          text-align: left;
        }
      }

      .vant-del-scope{
        font-size: 38px;
        color:rgba(182,0,5,1);
        padding: 10px 0 10px 10px;
      }
      // &+.fd-file-link{
      //   padding-top: 25px;
      // }
    }
  }
}
</style>
