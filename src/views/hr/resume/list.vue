<template>
  <div class="has-comment">
    <headerx :cat-title="catTitle">
      <template slot="right">
        <!--        <span class="yh-add-more" @click="$router.push({path:'/jobsNew'})">新增</span>-->
        <span class="yh-add-more" @click="openSearchMore">
          <img
            src="@/assets/images/icon/filter.png"
            alt="分类搜索"
            class="classify-search-more"
          >
        </span>
        <span class="yh-add-more" @click="$router.push({path:'/resumeNew'})">
          <img
            src="@/assets/images/icon/add.png"
            alt="分类搜索"
            class="classify-search-add"
          >
        </span>
      </template>
    </headerx>
    <div class="comment-content no-comment">
      <!--提交按钮-->
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <div
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="pageInfo.isLoading"
          infinite-scroll-distance="10"
          infinite-scroll-immediate-check="false"
        >
          <form class="yh-search" action @submit.prevent="search">
            <input
              ref="searchInput"
              v-model="pageInfo.params.keyword"
              type="search"
              placeholder="输入姓名/手机号/推荐岗位/毕业院校/专业/标签"
            >
            <van-icon name="search" class="searIcon" :style="{backgroundImage:'url('+require('@/assets/images/icon/search-img.png')+')'}"/>
          </form>
          <!--tags-->
          <tags
            :list="selectList"
            :filter-list="filterList"
            key-code="label"
            @del-item="searchConfirm"
          />

          <div
            v-for="(item, index) in pageInfo.list"
            :key="index"
            @click="
              $router.push({ path: '/resumeDetail', query: { id: item.resumeId } })
            "
          >
            <div class="tar-lv2-son">
              <p class="tar-lv2-son-title tital1">
                {{ item.userName }}
                <span class="status">{{ item.resumeStatus }}</span>
              </p>
              <p class="tar-lv2-son-title tital1 jobName">
                <span :style="{backgroundImage:'url('+require('@/assets/images/icon/resume_job.png')+')'}">{{ item.jobName }}</span>
                <span :style="{backgroundImage:'url('+require('@/assets/images/icon/resume_tel.png')+')'}">{{ item.telephone }}</span>
              </p>
              <p class="tar-lv2-son-title tital1 jobName">
                <span class="graduate">毕业院校<span>{{ item.graduateSchool }}</span></span>
                <span class="graduate">学历<span>{{ item.highestDegree }}</span></span>
              </p>
              <p class="tar-lv2-son-title tital1 jobName">
                <span class="graduate labelTable"><span>{{ item.lableTable }}</span></span>
              </p>
            </div>
          </div>
          <!--<blank v-if="!showBlank"></blank>-->
        </div>
      </van-pull-refresh>
      <blank v-if="!pageInfo.isLoading && pageInfo.list && pageInfo.list.length == 0"/>
      <bottom v-if="!pageInfo.isLoading && isLoadAll && pageInfo.list.length > 2"/>
    </div>
    <search-filter
      ref="rightPopup"
      :filter-list="filterList"
      class="filter-list"
      @confirm="searchConfirm"
      @reset="searchReset"
    />
  </div>
</template>

<script>
import Tags from '@/components/tags'
import { filterArr } from '@/utils/common.js'
export default {
  components: {
    'search-filter': () => import('@/components/rightPopup/half'),
    Tags
  },
  data() {
    return {
      isLoading: false,
      catTitle: '简历管理',
      isShow: false,
      isShow1: false,
      isShow2: false,
      showBlank: true,
      pageInfo: {
        params: {
          IS_PAGE: true,
          curPage: 1,
          pageSize: 10,
          keyword: ''
          // resumeStatus: 1,

        },
        list: [],
        postType: 'postJson',
        postUrl: '/resumeManagement/list'
      },
      filterList: [
        {
          name: '简历来源',
          subList: [],
          labelName: 'label',
          labelId: 'value'
        },
        {
          name: '标签',
          subList: [],
          labelName: 'label',
          labelId: 'value'
        },
        {
          name: '简历状态',
          subList: [],
          labelName: 'label',
          labelId: 'value'
        },
        {
          name: '最高学历',
          subList: [],
          labelName: 'label',
          labelId: 'value'
        }
      ],
      selectList: []
    }
  },
  created() {
    this.getList(true)
    this.getFilterList()
  },
  activated() {
    if (this.storage.get('refresh-resume-list')) {
      this.getList(true)
      this.storage.get('refresh-resume-list')
      this.storage.remove('refresh-resume-list')
    }
  },
  methods: {
    newCompanyList(oldList, newList) {
      oldList.map((item, index) => {
        newList.push(item)
        if (item.children.length > 0) {
          this.newCompanyList(item.children, newList)
        }
      })
      return newList
    },
    showToggle() {
      this.isShow = !this.isShow
      if (this.isShow === true) {
        this.isShow1 = false
        this.isShow2 = false
      }
    },
    showToggle1() {
      this.isShow1 = !this.isShow1
      if (this.isShow1 === true) {
        this.isShow = false
        this.isShow2 = false
      }
    },
    showToggle2() {
      this.isShow2 = !this.isShow2
      if (this.isShow2 === true) {
        this.isShow = false
        this.isShow1 = false
      }
    },
    getFilterList() {
      // 简历来源
      this.$axios.get(
        '/commonTCode/getCodeByParentId.do',
        {
          parentId: '2605'
        },
        res => {
          this.filterList[0].subList = res.data.options
        }
      )
      // this.$axios.get('/appGroup/showOrganization', {}, res => {
      //   this.filterList[0].subList = res.dataContent
      //   let arr = []
      //   this.newCompanyList(res.data.treeData, arr)
      //   this.filterList[0].subList = arr
      // })
      //    标签
      this.$axios.get(
        '/commonTCode/getCodeByParentId.do',
        {
          parentId: '2606'
        },
        res => {
          this.filterList[1].subList = res.data.options
        }
      )
      // 简历状态
      this.$axios.get(
        '/commonTCode/getCodeByParentId.do',
        {
          parentId: '2601'
        },
        res => {
          this.filterList[2].subList = res.data.options
        }
      )
      //    最高学历
      this.$axios.get(
        '/commonTCode/getCodeByParentId.do',
        {
          parentId: '2604'
        },
        res => {
          this.filterList[3].subList = res.data.options
        }
      )
    },
    openSearchMore() {
      this.$refs.rightPopup.showPopup()
    },
    searchConfirm() {
      const getChecked = (list, keyWord) => {
        const arr = []
        list.map(item => {
          if (item.isChecked) {
            arr.push(item[keyWord])
          }
        })
        return arr.join()
      }
      this.filterList.map(item => {
        item.checkIds = getChecked(item.subList, item.labelId)
        item.checkName = getChecked(item.subList, item.labelName)
      })

      // tags-select-fiter
      this.selectList = Array.from(new Set(filterArr(this.filterList)))

      this.pageInfo.params.resumeSource = this.filterList[0].checkIds
      this.pageInfo.params.labelTables = this.filterList[1].checkName
      this.pageInfo.params.resumeStatus = this.filterList[2].checkIds
      this.pageInfo.params.highestDegree = this.filterList[3].checkIds
      var allCheckName =
        this.filterList[0].checkName +
        ',' +
        this.filterList[1].checkName +
        ',' +
        this.filterList[2].checkName +
        ',' +
        this.filterList[3].checkName

      this.labelsList = allCheckName.split(',')

      this.getList(true)
    },
    searchReset() {
      this.selectList = []
      this.pageInfo.params.resumeSource = ''
      this.pageInfo.params.labelTables = ''
      this.pageInfo.params.resumeStatus = ''
      this.pageInfo.params.highestDegree = ''
      this.labelsList = []
      this.getList(true)
    },
    search() {
      this.$refs.searchInput.blur()
      this.getList(true)
    },
    getList(isFirst) {
      this.$axios.pageData(
        this,
        isFirst,
        res => {
          this.isLoading = false
          // console.log('++++++++++++++' + this.pageInfo.list)
          if (this.pageInfo.list.length > 0) {
            this.showBlank = true
          } else {
            this.showBlank = false
          }
        },
        err => {
          this.isLoading = false
        }
      )
    },
    loadMore() {
      this.getList(false)
    },
    onRefresh() {
      this.getList(true)
    }
  }
}
</script>

<style scoped lang="scss">
  .right-icon{
    margin-right:25px!important;
    .classify-search-more {
      width: 44px;
      margin-right:25px;
    }
    .classify-search-add {
      width: 39px;
      margin-bottom:5px
    }
  }
.labelsShow {
  text-align: left;
  background: #fff;
  border-bottom: 2px solid#dfdcdc;
  padding: 0 0 10px 8px;
  span {
    color: rgba(183, 0, 7, 1);
    border: 1px solid rgba(183, 0, 7, 1);
    font-size: 25px;
    padding: 10px;
    margin: 5px;
    display: inline-block;
    margin-right: 10px;
    /*font-weight: lighter;*/
  }
}
.approval-form {
  width: 573px;
  height: 91px;
  background: rgba(183, 0, 7, 1);
  border-radius: 5px 5px 5px 5px;
  color: white;
  font-size: 36px;
  margin-top: 20px;
}
.titaltop {
  text-align: center;
  color: #000;
  font-size: 32px;
  padding: 26px;
  background: #fff;
}
.buttop {
  padding: 20px 0;
  text-align: center;
  font-size: 24px;
  background: #fff;
  .iconbut {
    transform: rotate(90deg);
    font-size: 22px;
    line-height: 24px;
    width: 50px;
  }
}
.butcon {
  border-left: 2px solid#ccc;
  border-right: 2px solid#ccc;
  box-sizing: border-box;
}
.butcontent {
  width: 94.5%;
  position: fixed;
  background: #fff;
  padding: 20px 18px 20px 18px;
  border-top: 2px solid#dfdcdc;
  border-bottom: 2px solid #dfdcdc;
  z-index: 100;
  .butbox {
    .but {
      font-size: 24px;
      padding: 7px 20px;
      border-radius: 10px;
      box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2),
        0 6px 20px 0 rgba(0, 0, 0, 0.19);
      float: left;
      margin: 0 10px 25px 12px;
    }
  }
}
.tar-lv2-son {
  overflow: hidden;
  // padding: 34px;
  padding: 20px 40px;
  background-color: #fff;
  border-bottom: 18px solid #F8F8F8;
  .tital1 {
    font-size:28px;
    font-family:PingFangSC-Semibold,PingFang SC;
    font-weight:600;
    color:rgba(76,76,76,1);
    line-height:45px;
    display: flex;
    justify-content: space-between;
    padding-bottom:20px;
    span.status{
      margin:0;
      font-size:24px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(237,125,17,1);
      line-height:40px;
      padding:3px 8px;
      background:rgba(248,141,38,0.14);
    }
  }
  p {
    text-align: left;
    font-size: 26px;
    color: rgba(68, 68, 68, 1);
    line-height: 45px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;

  }
  .jobName{
    width: 106%;
    /*margin-bottom:15px;*/
    span{
      width:50%;
      font-size:26px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(76,76,76,1);
      background-size:29px 30px;
      background-repeat: no-repeat;
      padding-left:43px;
      line-height: 30px;
      margin:0px;

    }
    span.graduate{
      padding-left:0;
      font-size:24px;
      font-family:PingFangSC-Medium,PingFang SC;
      font-weight:500;
      color:rgba(158,158,157,1);
      line-height:33px;
      height:auto;
      span{
        display: block;
        padding-left: 0;
        font-size:26px;
        font-family:PingFangSC-Medium,PingFang SC;
        font-weight:500;
        color:rgba(76,76,76,1);
        line-height:40px;
        margin-top:7px;
        margin-bottom:0px;
        width: 80%;
        height: auto;
      }
    }
    span.labelTable{
      width: 93%;
      span{
        width:100%;
      }
    }

  }
  .jobName:last-child{
    padding-bottom: 0;
    margin-bottom: 0;
    margin-top:-10px;
  }
  img {
    /*position: absolute;*/
    /*right: 22px;*/
    /*top: 36px;*/
    /*float: right;*/
    /*width: 128px;*/
    /*height: 115px;*/
    /*border-radius: 10px;*/
  }
  span {
    font-size: 21px;
    color: #888888;
    // margin: 25px 22px 0px 0;
    margin: 25px 0px 0px 0px;
    z-index: 50px;
    .box {
      width: 25px;
      height: 25px;
      /*background: rgba(183, 0, 7, 1);*/
      float: left;
      margin-right: 15px;
    }
  }
  #time {
    display: block;
    text-align: left;
    margin-top: 7px;
  }
}
  .yh-search {
    overflow: visible!important;
    position: relative;
    padding:30px;
    margin-bottom: 0;
    input {
      text-align: left!important;
      padding-left: 86px;
      margin:0;
      height:68px;
    }
    .searIcon {
      position: absolute;
      top: 42px;
      left: 49px;
      background-repeat: no-repeat;
      font-size: .426667rem;
      width: 45.5px;
      height: 45.5px;
      background-size: 100% 100%;
      &::before{
        content:""
      }
    }
  }
</style>
