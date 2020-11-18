<template>
  <div class="has-comment">
    <headerx cat-title="文件库">
      <!-- <template slot="right">
        <span class="yh-add-more" @click="$router.push({path:''})">批量下载</span>
      </template> -->
    </headerx>
    <div class="comment-content no-comment">
      <folder ref="folder" from="page"/>
    </div>
  </div>
</template>

<script>
// 此页面未用到
export default {
  components: {
    folder: () => import('@/components/attachment/folder')
  },
  data() {
    return {
    }
  }
}
</script>
