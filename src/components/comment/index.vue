<template>
  <div>
    <!--评论开始-->
    <div v-if="amount > 0">
      <div class="new-comment">
        <div v-for="(comment, index) in data.length" :key="index" class="tool-list">
          <div class="comment-item">
            <a class="tool-xt" @click="avaClick(data[index])">
              <img
                v-if="data[index].FILE_PATH || data[index].filePath"
                :src="data[index].FILE_PATH || data[index].filePath"
                :style="{ background: data[index].COLOR || data[index].color }"
                alt
                class="avator"
              >
              <div
                v-else
                :style="{ background: data[index].COLOR || data[index].color }"
                class="avator"
              >
                <span v-if="data[index].USER_NAME">
                  {{
                    data[index].USER_NAME.charAt(data[index].USER_NAME.length - 1)
                  }}
                </span>
                <span v-if="data[index].name">
                  {{
                    data[index].name.charAt(data[index].name.length - 1)
                  }}
                </span>
              </div>
            </a>
            <div class="tool-con">
              <div class="tool-con-lv1">
                <p>
                  {{ data[index].USER_NAME || data[index].name }}
                  <img v-if="data[index].commentSource == '1' || data[index].COMMENT_SOURCE == '1'" class="phone-com" src="@/assets/images/icon/slep-tel.png" alt="">
                  <img v-else class="phone-compu" src="@/assets/images/icon/slep-computer.png" alt="">
                </p>
                <i>
                  <span>
                    <!--      isImg适配知识分享模块删除 图标              -->
                    <img
                      v-if="data[index].isDelete == 1 && (data[index].isImg == undefined || data[index].isImg == null)"
                      src="@/assets/images/icon/trash.png"
                      alt="123"
                      class="vant-del"
                      @click="deleteComment(index)"
                    >
                    <img
                      v-if="data[index].isDelete == 1 && data[index].isImg"
                      src="@/assets/images/icon/deletknoeledge.png"
                      alt="123"
                      class="vant-del"
                      @click="deleteComment(index)"
                    >
                  </span>
                </i>
                <div>{{ data[index].TICKLING_TIME || data[index].commentDt }}</div>
              </div>
            </div>
          </div>
          <p class="tool-con-p1">{{ data[index].TICKLING_CONTENT || data[index].content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommentItem',
  props: {
    // 评论数据
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 评论总数
    amount: {
      type: [String, Number],
      default: () => {
        return null
      }
    }
  },
  data() {
    return {
      comment: {}
    }
  },
  created() {
  },
  methods: {
    deleteComment(index) {
      this.data[index].index = index
      this.$emit('delete-comment', this.data[index])
    },
    avaClick(item) {
      XWalkFunction.startChatPrivate(item.createLoginName)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!-- lang="scss" 表示使用sass 语法 -->
<style scoped lang="scss">
.line-grey {
  height: 20px;
  background: #f5f5f5;
}
/*评论*/
.new-comment {
  background: #fff;
  width: 100%;
  margin-top: 0px !important;
  margin-bottom: 10px !important;
  .new-comment-title {
    padding: 20px 22px;
    .p1 {
      font-size: 28px;
      color: #000;
    }
    .p2 {
      font-size: 22px;
      color: #000;
      i {
        font-size: 28px;
        color: rgb(192, 24, 24);
        font-style: normal;
      }
    }
  }
  .tool-list {
    width: 100%;
    border-bottom: 1.5px solid rgb(221, 219, 219);
    background-color: #fff;
    padding: 30px 40px;
    overflow: hidden;
    position: relative;
    box-sizing: border-box;
    .tool-xt {
      display: block;
      width: 66px;
      height: 66px;
      display: inline-block;
      border-radius: 50%;
      position: absolute;
      top: 30px;
      left: 40px;
      .avator {
        width: 66px;
        height: 66px;
        border-radius: 100%;
        box-sizing: border-box;
        font-size: 28px;
        text-align: center;
        line-height: 66px;
        color: white;
        object-fit: cover;
      }
    }
    .comment-item{
      .tool-con {
        height: 66px;
        text-align: left;
        font-size: 18px;
        padding-left: 80px;
        letter-spacing: 1px;
        .tool-con-lv1 {
          width: 100%;
          line-height: 33px;
          position: relative;
          p {
            font-size: 28px;
            color: #4c4c4c;
            .phone-com{
              width:15px;
              height:24px;
            }
            .phone-compu{
              width:21px;
              height:19px;
            }
          }
          i{
            position: absolute;
            right: 0;
            top: 0;
            span{
              display: inline-block;
              position: relative;
              &:nth-of-type(1){
                .line{
                  color: #BCC3D2;
                  margin: 0 15px;
                  font-size: 20px;
                  line-height: 33px;
                  font-style: normal;
                }
                img{
                  height: 33px;
                }
              }
              .comNum{
                position: absolute;
                top: -15px;
                right: -25px;
                color: #BCC3D2;
                font-size: 16px;
                font-style: normal;
              }
            }
            img{
              height: 30px;
              width: auto;
              vertical-align: bottom;
            }
          }
          div {
            font-size: 22px;
            color: #8E8D8C;
          }
        }
      }
    }
    .tool-con-p1 {
      font-size: 24px;
      text-align: left;
      margin-top: 20px;
      word-break: break-all;
      color: #4c4c4c;
      line-height:39px;
      font-family:PingFangSC-Regular,PingFang SC;
    }
  }
}
.vant-del {
  padding-left: 0;
  width: auto;
  position: unset;
}
</style>
