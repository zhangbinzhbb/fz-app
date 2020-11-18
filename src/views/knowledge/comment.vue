<template>
  <div>
    <headerx :catTitle="catTitle" :isWhite="true">
      <template slot="right">
        <span class="yh-add-more" @click.once="addComment()">
          <!-- <img src="./fabu.png" alt> -->
          <!-- <img src="./fabuo.svg" alt class="picture"> -->
          <span>发布</span>
        </span>
      </template>
    </headerx>
    <div id="commontBody" class="comment-content">
      <!-- <div style="height:20px"></div> -->
      <textarea
        rows="8"
        class="yh-add-more"
        id="textArea"
        ref="vantInput"
        type="text"
        v-model="comment.commentHtml"
        @focus="focus"
        @blur="blur"
      ></textarea>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      catTitle: '发表评论',
      comment: { commentHtml: '' }
    }
  },
  created () {},
  methods: {
    focus () {
      this.bfscrolltop = document.body.clientHeight
      // document.getElementsByClassName('comment-content')[0].clientHeight = this.bfscrolltop
      // this.interval = setInterval(() => {
      document.body.scrollTop = document.body.scrollHeight
      // }, 100)
    },
    blur () {
      // clearInterval(this.interval)
      setTimeout(() => {
        document.body.scrollTop = this.bfscrolltop
      }, 600)
    },
    addComment () {
      this.comment.commentHtml = this.emoji2Str(this.comment.commentHtml)
      console.log('this.comment=======', this.comment.commentHtml)
      if (!this.comment.commentHtml || this.comment.commentHtml === '') {
        this.Toast('请输入发送内容！')
        return
      }

      this.$axios.post(
        '/integralDetailedAction/comment.do',
        {
          knowledgeId: this.$route.query.knowledgeId,
          content: this.comment.commentHtml
        },
        res => {
          this.comment.commentHtml = ''
          this.Toast('评论成功！')
          history.go(-1)
        }
      )
    }
  }
}
</script>

<style lang="scss">
  #commontBody {
    // width: 100%;
    // height: 100%;
    // overflow: hidden;
    padding: 40px;
    background: #fff;
    #textArea {
      width: 100%;
      font-size: 24px;
      padding: 10px;
      box-sizing: border-box;
      resize: none;
      border-radius:4px;
      border:2px solid rgba(240,240,240,1);
    }
  }
  .picture {
    vertical-align: middle;
  }
</style>
