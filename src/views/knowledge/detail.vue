<template>
  <div id="outputId" class="detail-content has-comment">
    <headerx cat-title="知识分享详情"/>
    <!-- <p style="color:red">修改0</p> -->
    <div
      v-infinite-scroll="loadMore"
      class="comment-content"
      infinite-scroll-disabled="pageInfo.isLoading"
      infinite-scroll-distance="10"
      infinite-scroll-immediate-check="false"
    >
      <div class="new-details">
        <div class="personal-center">
          <div class="titletop">
            <p>{{ detail.knowledgeTitle }}</p>
            <span class="time">{{ detail.releaseBy }}<span>{{ detail.releaseDt }}</span> </span>
            <div class="new-com-detail">
              <img src="@/assets/images/news/view1.png">
              <span>{{ detail.viewCount }}</span>
              <img src="@/assets/images/news/msg2.png">
              <span>{{ detail.commentCount }}</span>
              <img v-if="iscollectImg<1" src="@/assets/images/icon/stars.png" @click="collect">
              <img v-else src="@/assets/images/news/stars_cur.png" @click="collect">
              <!--              <span>{{detail.collectCount}}</span>-->
              <span :class="{'collectColor': iscollectImg==1}">{{ iscollectcount }}</span>

              <img v-if="isclickImg<1" src="@/assets/images/icon/zan.png" @click="zan">
              <img v-else src="@/assets/images/news/zan_cur.png" @click="zan">
              <span :class="{'collectColor': isclickImg==1}">{{ detail.clickCount }}</span>
            </div>
          </div>
          <p :class="{'border-bottom':detail.fileList.length>0}" class="content" v-html="detail.content"/>
          <attachment :is-show-line="false" :data="detail.fileList" page="knowledge"/>
        </div>
      </div>
      <div class="comment-title">
        <span class="com-text">
          <img src="@/assets/images/icon/pinglun.png">
          <span>评论</span>
        </span>
        <span class="projectCom" @click="turnToComment">
          <span class="write-comment">
            <img src="@/assets/images/icon/write-comment.png">
          </span>
        </span>
      </div>
      <comment
        :data="commentList"
        :amount="detail.commentCount"
        :has-comment="false"
        @delete-comment="deleteComment"
      />
      <div v-if="commentList.length===0" style="height:54%;">
        <div style="height:100%;">
          <blank/>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
export default {
  components: {
    comment: () => import('@/components/comment/index'),
    attachment: () => import('@/components/attachment/index')
  },
  data() {
    return {
      show: false,
      detail: {},
      comment: {},
      commentList: [],
      iscollectcount: 0,
      iscollectImg: 0,
      isclickImg: 0,
      apiInfo: {
        deleteComment: 'knowlwdgeCommentAction/delete.do'
      },
      pageInfo: {
        params: {
          IS_PAGE: true,
          curPage: 2,
          pageSize: 15,
          knowledgeId: this.$route.query.id
        },
        list: [],
        postUrl: '/knowlwdgeCommentAction/search.do'
      }
    }
  },
  created() {
    this.getDetail()
  },
  activated() {},
  methods: {
    turnToComment() {
      // this.storage.set("msgDetail",this.detail);
      this.$router.push({
        path: 'knowledgeComment',
        query: {
          knowledgeId: this.$route.query.id
        }
      })
    },
    showCommont() {
      this.show = true
    },
    getDetail() {
      this.$axios.get(
        '/knowledgeInfoAction/detail.do',
        { knowledgeId: this.$route.query.id },
        res => {
          this.detail = res.dataContent
          this.commentList = res.dataContent.commentList
          this.iscollectcount = res.dataContent.collectCount
          this.iscollectImg = res.dataFooter.isCollect
          this.isclickImg = res.dataFooter.isClick
          this.$set(this.detail, 'isCollect', res.dataFooter.isCollect)
          this.$set(this.detail, 'isClick', res.dataFooter.isClick)
          this.getIsImg(this.commentList)
        }
      )
    },
    getCommentList() {
      if (
        this.pageInfo.isLoading ||
        !this.detail.commentList ||
        this.detail.commentList.length == 0 ||
        this.pageInfo.isAll
      ) {
        return
      }
      const request = () => {
        this.pageInfo.isLoading = true
        this.$axios.post(this.pageInfo.postUrl, this.pageInfo.params, res => {
          if (res.dataContent.length < this.pageInfo.params.pageSize) {
            this.pageInfo.isAll = true
          } else {
            this.pageInfo.params.curPage++
          }
          this.pageInfo.isLoading = false
          this.detail.commentList = this.detail.commentList.concat(
            res.dataContent
          )
        })
      }
      request()
    },
    getIsImg(commentList) {
      console.log(commentList)
      commentList.map((item, index) => {
        console.log(item)
        // eslint-disable-next-line eqeqeq
        if (commentList[index].isDelete == 1) {
          this.$set(commentList[index], 'isImg', true)
        } else {
          this.$set(commentList[index], 'isImg', false)
        }
      })
    },
    deleteComment(comment) {
      this.$axios.post(
        '/knowlwdgeCommentAction/delete.do',
        { commentId: comment.commentId },
        res => {
          this.Toast('删除成功！')
          this.detail.commentList.splice(comment.index, 1)
          this.detail.commentCount--
          this.storage.set('refresh-ki-list', true)
          this.getDetail()
        }
      )
    },
    addComment() {
      this.comment.content = this.emoji2Str(this.comment.content)
      // console.log(!this.comment.content)
      if (!this.comment.content || this.comment.content === '') {
        this.Toast('请输入发送内容！')
        return
      }
      this.$axios.post(
        '/integralDetailedAction/comment.do',
        {
          knowledgeId: this.$route.query.id,
          content: this.comment.content
        },
        res => {
          this.comment.content = ''
          this.Toast('评论成功！')
          this.storage.set('refresh-ki-list', true)
          this.getDetail()
        }
      )
    },
    collect() {
      this.$axios.post(
        '/integralDetailedAction/collect.do',
        { knowledgeId: this.$route.query.id },
        res => {
          this.$set(this.detail, 'isCollect', res.isCollect)
          if (res.isCollect == 1) {
            this.iscollectImg = 1
            // this.getDetail()
            this.iscollectcount++
            this.Toast('收藏成功！')
          } else {
            this.iscollectImg = 0
            this.iscollectcount--
            this.Toast('取消收藏成功！')
          }
          this.storage.set('refresh-ki-list', true)
          // console.log('isCollect', this.detail.isCollect)
        }
      )
    },
    zan() {
      this.$axios.post(
        '/integralDetailedAction/click.do',
        { knowledgeId: this.$route.query.id },
        res => {
          this.getDetail()
          this.storage.set('refresh-ki-list', true)
        }
      )
    },
    loadMore() {
      this.getCommentList()
    },
    focus() {
      // // 原方法
      this.bfscrolltop = document.body.scrollTop
      // // this.interval = setInterval(() => {
      document.body.scrollTop = document.body.scrollHeight
      // // }, 100)
    },
    blur() {
      // 原方法
      document.body.scrollTop = this.bfscrolltop
    }
  }
}
</script>
<style scoped lang="scss">
  .new-details{
    box-shadow:0px 2px 8px 0px rgba(0,0,0,0.1);
    margin-bottom: 18px;
    padding: 40px;
    background: #fff;
  }
  .detail-content {
    background: white;
  }

  .personal-center {
    position: relative;
    background: #fff;
    .titletop {
      width: 100%;
      margin: 0 auto;
      font-size: 28px;
      .time {
        line-height: 44px;
        margin-bottom: 12px;
        font-size:24px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(142,141,140,1);
        span{
          margin-left:13px;
          display: inline-block;
        }
      }
      p {
        width: 100%;
        text-align: left;
        color: #4C4C4C;
        font-size: 32px;
        box-sizing: border-box;
        word-break: break-all;
        line-height: 40px;
        font-family:PingFangSC-Medium,PingFang SC;
        font-weight:500;
        color:rgba(76,76,76,1);
      }
      span {
        font-weight: 400;
        display: block;
        text-align: left;
        font-size: 22px;
        line-height:44px;
        color: #8E8D8C;
      }
      span.collectColor{
        color:#F7B425!important;
      }
      div {
        font-size:22px;
        color:#BCC3D2;
        line-height:44px;
        text-align: left;
        img {
          /*width: auto!important;*/
          /*max-height: 24px !important;*/
          vertical-align: middle;
          margin-left: 26px;
          &:nth-of-type(1),&:nth-of-type(2){
            /*margin-left: 0;*/
            width:34px;
            height:24px;
          }
          &:nth-of-type(1){
            margin-left: 0;
          }
          &:nth-of-type(3){
            width:30px;
            height:28px;
          }
          &:nth-of-type(4){
            width:27px;
            height:27px;
          }

        }
        span{
          vertical-align: middle;
        }
      }
      .new-com-detail{
        height: 44px;
        line-height: 44px;
        span{
          color: #BCC3D2;
          display: inline-block;
          margin-left:7px;
        }
      }
    }
    .content {
      width: 100%;
      font-weight: 400;
      text-align: left;
      background: white;
      box-sizing: border-box;
      padding: 10px 0 20px;
      font-size: 26px;
      line-height: 50px;
      color: #4c4c4c;
      img {
        width: 100%;
      }
    }
    .content.border-bottom{
      border-bottom: 2px solid #F0F0F0;
    }
    .titleimg {
      width: 250px;
      height: 48px;
      margin-top: 50px;
      img {
        height: 90%;
        float: left;
        margin-left: 20px;
      }
      span {
        font-size: 38px;
        float: left;
        margin-left: 15px;
        line-height: 50px;
      }
    }
    /deep/ .content2 {
      width: 94%;
      margin: 0 auto;
      font-size: 26px!important;
      color: rgba(0, 138, 245, 1);
      font-weight: 400;
      line-height: 46px;
      text-align: left;
      margin-top: 20px;
    }
  }
  .comment {
    // position: fixed;
    // bottom: 0;
    // left: 0;
    // width: 640px;
    // height: 90px;
    display: inline-block;
    width: 260px;
    height: 60px;
    // background: rgba(250, 250, 250, 1);
    // border-top: 2px solid #fdfdfd;
    box-sizing: border-box;
    margin-left: 60px;
    padding-left: 40px;
    // input {
    //   padding-left: 20px;
    //   width: 325px;
    //   height: 57px;
    //   box-sizing: border-box;
    //   background: #fefefe;
    //   border: 2px solid rgba(232, 232, 232, 1);
    //   border-radius: 5px 5px 5px 5px;
    //   font-size: 26px;
    //   float: left;
    //   margin-top: 16px;
    //   margin-left: 20px;
    //   line-height: 57px;
    // }
    .img1 {
      // width: 51px;
      // height: 51px;
      width: 40px;
      height: 40px;
      float: left;
      margin-left: 30px;
      // margin-top: 18px;
      margin-top: 3px;
    }
  }
  .comment-title {
    display: block;
    width: 100%;
    font-size: 28px;
    background-color: #FDF1F1;
    padding: 20px 40px;
    overflow: hidden;
    box-sizing: border-box;
    .com-text{
      float: left;
      line-height: 49px;
      img{
        width: 22px;
        vertical-align: middle;
      }
      span{
        vertical-align: middle;
      }
    }
    .write-comment{
      float: right;
      width: 49px;
      height: 49px;
      display: inline-block;
    }
  }
</style>
