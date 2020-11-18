<template>
  <div class="newsarticle has-comment ac-detail">
    <headerx :cat-title="catTitle">
      <template slot="right">
        <span class="yh-add-more" @click.once="addComment()">
          <span>发布</span>
        </span>
      </template>
    </headerx>
    <div class="textContent">
      <textarea
        v-model.trim="comment.content"
        rows="8"
        class="comment-textarea"
        @focus="focus"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      catTitle: '发表评论',
      comment: {}
    }
  },
  created() {},
  methods: {
    addComment() {
      this.comment.content = this.emoji2Str(this.comment.content)
      if (!this.comment.content || this.comment.content == '') {
        this.Toast('请输入发送内容！')
        return
      }
      this.$axios.post(
        '/InformationAction/addInformationTick.do',
        {
          msgId: this.$route.query.msgId,
          TickContent: this.comment.content
        },
        res => {
          this.comment.content = ''
          this.Toast('评论成功！')
          history.go(-1)
        }
      )
    },
    focus() {

    }
  }
}
</script>

<style lang="scss">
.textContent{
  padding: 40px;
  background: #fff;
}
.comment-textarea {
  width: 100%;
  font-size: 24px;
  padding: 10px;
  box-sizing: border-box;
  resize: none;
  border-radius:4px;
  border:2px solid rgba(240,240,240,1);
}
.submit-btn {
  display: block;
  width: 573px;
  height: 91px;
  background: rgba(183, 0, 7, 1);
  border-radius: 5px 5px 5px 5px;
  color: white;
  font-size: 36px;
  margin: 20px auto 0 auto;
}
</style>
