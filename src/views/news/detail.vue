<template>
  <div :style="{backgroundImage:'url('+require('@/assets/images/code/bg.png')+')'}" class="newsarticle has-comment ac-detail">
    <headerx :cat-title="catTitle"/>
    <div
      v-infinite-scroll="loadMore"
      class="comment-content"
      infinite-scroll-disabled="pageInfo.isLoading"
      infinite-scroll-distance="10"
      infinite-scroll-immediate-check="false"
    >
      <div class="new-details">
        <!--新闻主体开始-->
        <div class="new-con">
          <p>{{ detail.MESSAGE_TITLE }}</p>
          <div>
            <span>{{ detail.SENDER_NAME||detail.PUBLISHER }}</span>
            <span>{{ detail.START_TIME }}</span>
            <p v-if="type=='6' && detail.LABLE!=''" class="newsListLabel">
              <span v-for="(label, indexLabel) in labelArr" :key="indexLabel" >{{ label }}</span>
            </p>
          </div>
          <div class="new-com-detail">
            <img src="@/assets/images/news/view1.png">
            <span>{{ detail.ISTOTAL }}</span>
            <img v-if="type!=6" src="@/assets/images/news/msg2.png">
            <span v-if="type!=6">{{ detail.TICK_COUNT }}</span>
          </div>
        </div>
        <p v-if="detail.MESSAGE_CONTENT" :class="{'has-border':detail.fileList&&detail.fileList.length}" class="new-article" v-html="detail.MESSAGE_CONTENT"/>
        <attachment :data="detail.fileList" :is-show-line="false"/>
        <div v-if="type==6" class="article-6">【文章来源于网络，如不适合发布请联系管理员删除】
        </div>
      </div>
      <div v-if="type!='6'" class="comment-title">
        <span class="com-text">
          <!-- <van-icon class="comIcons" name="chat-o"></van-icon> -->
          <img src="@/assets/images/icon/pinglun.png">
          <span>评论</span>
        </span>
        <span class="projectCom" @click="turnToComment">
          <span class="write-comment">
            <img src="@/assets/images/icon/write-comment.png">
          </span>
        </span>
      </div>
      <comment v-if="type!='6'" :data="detail.TICK_LIST" :amount="detail.TICK_COUNT" @delete-comment="deleteComment"/>

      <div v-if="detail.TICK_LIST" style="height:68%;">
        <div v-if="detail.TICK_LIST.length===0" style="height:100%;">
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
      catTitle: '详情',
      detail: {},
      labelArr: [],
      comment: {},
      showProp: false,
      type: this.$route.query.type,
      pageInfo: {
        params: {
          IS_PAGE: true,
          curPage: 2,
          pageSize: 15,
          msgId: this.$route.query.id
        },
        isAll: false,
        list: [],
        postUrl: '/InformationAction/getTickList.do'
      }
    }
  },
  created() {
    this.getInformationDetail()
    this.clearReffer()
  },
  methods: {
    // 写评论
    turnToComment() {
      this.$router.push({
        path: 'infoComment',
        query: { msgId: this.$route.query.id }
      })
    },
    // 获取评论内容
    getInformationDetail() {
      let url = '/InformationAction/informationDetail.do'
      const detailId = this.$route.query.id
      this.pageInfo.params.pkId = ''
      if (this.type == '6') {
        url = '/InformationAction/informationFourDetail.do'
        this.pageInfo.params.pkId = detailId
        this.pageInfo.params.MSG_ID = ''
      }
      this.$axios.get(
        url,
        { MSG_ID: this.pageInfo.params.msgId, pkId: detailId },
        res => {
          const data = res.dataContent
          this.detail = res.dataContent
          if (data.LABLE !== '' && data.LABLE) {
            this.labelArr = data.LABLE.split(',')
          }
        }
      )
    },
    getCommentList() {
      if (this.type == '6') {
        return
      }
      /* if (this.pageInfo.isLoading || this.pageInfo.isAll) {
        return
      } */
      const request = () => {
        this.pageInfo.isLoading = true
        this.$axios.post(this.pageInfo.postUrl, this.pageInfo.params, res => {
          if (!res.dataContent.TICK_LIST) {
            return
          }
          if (
            res.dataContent.TICK_LIST.length < this.pageInfo.params.pageSize
          ) {
            this.pageInfo.isAll = true
          } else {
            this.pageInfo.params.curPage++
          }
          this.pageInfo.isLoading = false
          this.detail.TICK_LIST = this.detail.TICK_LIST || []
          this.detail.TICK_LIST = this.detail.TICK_LIST.concat(
            res.dataContent.TICK_LIST
          )
          console.log(res.dataContent)
        })
      }
      if (!this.pageInfo.isAll) {
        request()
      }
    },
    // 删除评论
    deleteComment(comment) {
      this.$axios.post(
        '/InformationAction/deleteInformationTick.do',
        { tickId: comment.ID, msgId: this.$route.query.id },
        res => {
          this.detail.TICK_LIST.splice(comment.index, 1)
          this.detail.TICK_COUNT--
          this.storage.set('refresh-ki-list', true)
          this.Toast('删除成功！')
        }
      )
    },
    loadMore() {
      this.getCommentList()
    },
    focus() {
      this.bfscrolltop = document.body.scrollTop
      document.body.scrollTop = document.body.scrollHeight
    },
    blur() {
      setTimeout(() => {
        document.body.scrollTop = this.bfscrolltop
      }, 500)
    }
  }
}
</script>

<style lang="scss">
.blank-empty{
  height: 40vh;
}
.new-details{
  box-shadow:none!important;
  margin-bottom: 18px;
  padding: 40px;
  background: transparent;
}
.newsarticle .new-con p{
  font-size:32px!important;
}
.line-grey{
  height: 0 !important;
}
/*新闻主体*/
.newsarticle {
  position: relative;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  .new-con {
    background: #fff;
    text-align: left;
    position: relative;
    p {
      color: #4C4C4C;
      font-size: 28px;
      box-sizing: border-box;
      word-break: break-all;
      line-height: 40px;
    }
    span {
      font-size: 22px;
      line-height:44px;
      color: #8E8D8C;
    }
    div {
      font-size:22px;
      color:#BCC3D2;
      line-height:44px;
      img {
        width: auto!important;
        height: 24px!important;
        vertical-align: middle;
        &:nth-of-type(2){
          margin-left: 26px;
        }
      }
      span{
        vertical-align: middle;
      }
    }
    .new-com-detail{
      span{
        color: #BCC3D2
      }
    }
  }
  .new-article {
    background: white;
    box-sizing: border-box;
    padding: 10px 0 20px;
    font-size: 26px;
    line-height: 50px;
    color: #4c4c4c;
    box-sizing: border-box;
    width: 100%;
    text-align: left;
    img {
      // width: 100%;
      object-fit: contain;
      object-position: 0 0;
      height: auto !important;
    }
    .attach{
      margin: 0 !important;
    }
    * {
      max-width: 100%;
    }
  }
  .sendButton {
    width: 18%;
    height: 57px;
    float: left;
    padding-left: 30px;
    padding-right: 20px;
    font-size: 28px;
    border-radius: 10px;
    // padding-top: 10px;
    color: crimson;
    box-sizing: border-box;
    -webkit-appearance: none;
    /* 方法2 */
    vertical-align: middle;
    line-height: 57px;
    background: transparent;
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
.has-border{
      border-bottom: 2px solid #F0F0F0;
}
p.newsListLabel{
  height:auto!important;
  width: 100%;
  span{
    line-height: inherit!important;
    padding:3px 8px;
    margin:0 10px 10px 0;
    display: inline-block;
  }
  span:nth-of-type(n+1){
    color:#03AA4A;
    background: rgba(58,204,120,0.23);
  }
  span:nth-of-type(n+2){
    color:#E89E00;
    background:rgba(248,187,57,0.23);
  }
  span:nth-of-type(n+3){
    color:#3195FC;
    background:rgba(49,149,252,0.23);
  }
}
/*.new-comment{*/
/*  background: rgba(255,255,255,0.7)!important;*/
/*}*/
/*.newsarticle .new-article,.new-comment,.new-details,.tool-list{*/
/*  background: rgba(255,255,255,0.6)!important;*/
/*}*/
  .comment-title{
    opacity: 0.7;
  }
  .article-6{
    line-height:32px;
    font-size:26px;
    color: #4c4c4c;
  }
</style>
