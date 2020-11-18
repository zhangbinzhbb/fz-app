<template>
  <div class="attachment-box">
    <div v-for="(item,index) in list" :key="index" class="fd-folder-item">
      <img
        v-if="item.fileType=='dic'"
        src="@/assets/images/file/comment-Shape.png"
        alt
        class="fd-folder-item-png"
      >
      <img v-else :src="require('@/assets/images/file/comment-'+item.fileType+'.png')" alt class="fd-folder-item-png">
      <div class="fd-folder-item-title">
        {{ item.fileOldName }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.attachment-box{
  padding: 30px 0 40px;
}
.fd-folder-item{
  display: flex;
  align-items: center;
  &+.fd-folder-item{
    padding-top: 15px;
  }
  .fd-folder-item-png{
    width: 42px;
    height: 50px;
    padding-right: 15px;
  }
}
</style>

