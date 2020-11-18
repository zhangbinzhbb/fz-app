<template>
  <div class="has-comment project-home-assess">
    <headerx :cat-title="catTitle">
      <template slot="right">
        <img src="@/assets/images/icon/add.png" alt="" srcset="" @click="$router.push({path: '/projectHomeProcessNew2'})">
      </template>
    </headerx>
    <div class="comment-content no-comment" style="background: #fff;">
      <div class="block" style="height:100%;">
        <progre/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    progre: () => import('@/components/project/processList')
  },
  data() {
    return {
      catTitle: '项目进展',
      model: null
    }
  },
  created() {
    this.model = this.storage.get('businessObj') || {}
    const name = this.model.enName ? this.model.enName : this.model.projObjectName
    this.catTitle = name
  },
  methods: {}
}
</script>

