<template>
  <div v-if="popupVisible">
    <mt-popup
      :class="{'sure-mySchedule-android':isAndroid12}"
      :style="{width:'100%', height: '100%'}"
      v-model="popupVisible"
      class="menu yh-content has-comment common-tree-select"
      position="right">
      <headerx :cat-title="catTitle" page-type="back" @closeBack="closeBackHandle">
        <template slot="right">
          <span class="yh-add-more sure-btn yh-tree-header" @click="closeBackHandle">
            确认 {{ sureList.length>0? '('+sureList.length + ')':'' }}
          </span>
        </template>
      </headerx>
      <div class="comment-content no-comment">
        <div :class="{'tree-mySchedule-ios12':isIos12}" class="tree-page">
          <div v-if="sureList.length" :class="{'tree-mySchedule-android':isAndroid12,'sure-mySchedule-ios12':isIos12, 'tree-mySchedule-ios':isIos}" class="sure-content">
            <ul class="content">
              <li v-for="(item,index) in sureList" :key="item.value">
                <div class="top" @click="delChange(item,index)">
                  <div v-if="item.src" class="img">
                    <img :src="item.src">
                  </div>
                  <div v-else class="icon-img">
                    {{ item.label | formatName }}
                  </div>
                  <img src="@/assets//images/org-delet.png" class="icon-del">
                </div>
                <p class="name van-ellipsis">{{ item.label }}</p>
              </li>
            </ul>
          </div>
          <div class="link-list">
            <form class="yh-search" action="" @submit.prevent="search">
              <img src="@/assets/images/icon/search-img.png" class="search-img">
              <input ref="searchInput" v-model="keyWord" type="search" placeholder="人员姓名">
            </form>
            <ul class="link-content">
              <li v-for="item in nav" :key="item.value" @click="toActive(item)">
                <span>{{ item.label }}</span>
                <van-icon v-if="active !== item.value" name="arrow"/>
                <van-icon v-else name="arrow-down"/>
              </li>
            </ul>
          </div>
          <div v-if="active==='3'" class="user-list">
            <listItem :list="regularList" title="按常选人员" @select-change="selectRegularChange"/>
          </div>

          <div v-if="active==='2'&&searchLists.length===0&&!emptyLoading" class="user-list">
            <listItem :list="userLists" title="按用户" @select-change="selectRegularChange"/>
          </div>
          <div v-if="active==='2'&&searchLists.length&&!emptyLoading" class="user-list">
            <h2>按用户</h2>
            <ul class="content">
              <li v-for="(item,index) in searchLists" :key="item.value" @click="searchSelectChange(item,index)">
                <div class="v-select-left">
                  <div v-if="item.src" class="img">
                    <img :src="item.src">
                  </div>
                  <div v-else class="icon-img">
                    {{ item.label | formatName }}
                  </div>
                </div>
                <div class="v-select-right">
                  <span class="name">{{ item.label }}</span>
                  <div class="input-box">
                    <img v-if="item.check" src="@/assets/images/check.png">
                    <span v-else/>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <blank v-if="emptyLoading"/>
        </div>
      </div>
      <orgChartPopup ref="rightPopupOrgChart" :id="sid" @select-change-org="selectChangeOrg"/>
    </mt-popup>
    <!-- <van-popup
      v-model="popupVisible"
      :overlay="false"
      :class="{'sure-mySchedule-android':isAndroid12}"
      :style="{ width: '100%', height: '100%' }"
      position="right"
      class="menu yh-content has-comment common-tree-select">
      <headerx :cat-title="catTitle" page-type="back" @closeBack="closeBackHandle">
        <template slot="right">
          <span class="yh-add-more sure-btn yh-tree-header" @click="closeBackHandle">
            确认 {{ sureList.length>0? '('+sureList.length + ')':'' }}
          </span>
        </template>
      </headerx>
      <div class="comment-content no-comment">
        <div :class="{'tree-mySchedule-ios12':isIos12}" class="tree-page">
          <div v-if="sureList.length" :class="{'tree-mySchedule-android':isAndroid12,'sure-mySchedule-ios12':isIos12, 'tree-mySchedule-ios':isIos}" class="sure-content">
            <ul class="content">
              <li v-for="(item,index) in sureList" :key="item.value">
                <div class="top" @click="delChange(item,index)">
                  <div v-if="item.src" class="img">
                    <img :src="item.src">
                  </div>
                  <div v-else class="icon-img">
                    {{ item.label | formatName }}
                  </div>
                  <img src="@/assets//images/org-delet.png" class="icon-del">
                </div>
                <p class="name van-ellipsis">{{ item.label }}</p>
              </li>
            </ul>
          </div>
          <div class="link-list">
            <form class="yh-search" action="" @submit.prevent="search">
              <img src="@/assets/images/icon/search-img.png" class="search-img">
              <input ref="searchInput" v-model="keyWord" type="search" placeholder="人员姓名/手机号/部门名称">
            </form>
            <ul class="link-content">
              <li v-for="item in nav" :key="item.value" @click="toActive(item)">
                <span>{{ item.label }}</span>
                <van-icon v-if="active !== item.value" name="arrow"/>
                <van-icon v-else name="arrow-down"/>
              </li>
            </ul>
          </div>
          <div v-if="active==='3'" class="user-list">
            <listItem :list="regularList" title="按常选人员" @select-change="selectRegularChange"/>
          </div>

          <div v-if="active==='2'&&searchLists.length===0&&!emptyLoading" class="user-list">
            <listItem :list="userLists" title="按用户" @select-change="selectRegularChange"/>
          </div>
          <div v-if="active==='2'&&searchLists.length&&!emptyLoading" class="user-list">
            <h2>按用户</h2>
            <ul class="content">
              <li v-for="(item,index) in searchLists" :key="item.value" @click="searchSelectChange(item,index)">
                <div class="v-select-left">
                  <div v-if="item.src" class="img">
                    <img :src="item.src">
                  </div>
                  <div v-else class="icon-img">
                    {{ item.label | formatName }}
                  </div>
                </div>
                <div class="v-select-right">
                  <span class="name">{{ item.label }}</span>
                  <div class="input-box">
                    <img v-if="item.check" src="@/assets/images/check.png">
                    <span v-else/>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <blank v-if="emptyLoading"/>
        </div>
      </div>
      <orgChartPopup ref="rightPopupOrgChart" :id="sid" @select-change-org="selectChangeOrg"/>
    </van-popup> -->
  </div>
</template>

<script>
import mixins from './mixins/index'
export default {
  components: {
    orgChartPopup: () => import('./orgChartItem'),
    listItem: () => import('./components/listItem')
  },
  mixins: [mixins],
  props: {
    catTitle: {
      type: String,
      default: null
    },
    defaultArray: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      nav: [
        {
          label: '按组织架构',
          value: '1'
        },
        {
          label: '按人员姓名',
          value: '2'
        },
        {
          label: '按常选人员',
          value: '3'
        }
      ],
      active: '3',
      sureList: [],
      offsetHeight: '',
      pageInfo: {
        params: {
          curPage: 1,
          pageSize: 10000,
          userId: '',
          searchId: '',
          ORGID: '',
          DEPTID: ''
        }
      },
      userLists: [],
      searchLists: [],
      keyWord: '',
      sid: '',
      popupVisible: false,
      regularList: [],
      emptyLoading: false
    }
  },
  created() {
    this.onRefresh()
  },
  methods: {
    showPopup() { // 打开弹出层
      this.popupVisible = true
      // 默认初始化
      this.sureList = JSON.parse(JSON.stringify(this.defaultArray))
      const arr = JSON.parse(JSON.stringify(this.sureList))
      this.storage.set('sure-list', arr)
      // 常选人员
      this.getFrequentlyUserList()
      this.getList()
    },
    closePopup(val) { // 关闭弹出层
      this.popupVisible = false
    },
    toRouter(item) {
      this.sid = item.id
      this.$refs.rightPopupOrgChart.showPopup()
    },
    search() {
      this.$refs.searchInput.blur()
      this.active = '2'
      this.pageInfo.params.searchId = this.keyWord
      this.getSearchList()
    },
    closeBackHandle() {
      this.closePopup()
      this.active = '3'
      this.keyWord = ''
      this.storage.remove('users-list')
      this.storage.remove('sure-list')
      this.$emit('select-change', this.sureList)

      if (this.sureList.length) {
        const userIds = []
        const userNames = []
        this.sureList.forEach(itme => {
          userIds.push(itme.value)
          userNames.push(itme.label)
        })
        this.getSaveSelectUser(userIds, userNames)
      }
    },
    getSaveSelectUser(userIds, userNames) {
      const str1 = userIds.join(',')
      const str2 = userNames.join(',')
      const URL = '/MyContactAction/saveSelectUser.do'
      this.$axios.get(
        URL, {
          userIds: str1,
          userNames: str2
        },
        res => {}
      )
    },
    selectChangeOrg() {
      this.active = '3'
      this.keyWord = ''
      const sureList = JSON.parse(localStorage.getItem('sure-list'))
      const userLists = JSON.parse(localStorage.getItem('users-list'))

      const regularList = this.regularList.map(item => {
        return {
          label: item.label,
          value: item.value,
          src: item.src,
          check: false
        }
      })

      // 组织人员选中后跳转到列表页
      sureList.forEach((a, i) => {
        regularList.forEach((b, j) => {
          if (a.value === b.value) {
            this.$set(regularList[j], 'check', true)
          }
        })
      })

      this.regularList = regularList

      if (userLists && userLists.length) {
        this.userLists = userLists
        this.sureList = sureList
        this.initList()
        return
      }
      this.getList()
    },
    getSearchList(type, name) {
      const params = this.pageInfo.params
      if (type === '1') {
        this.getOrgUserList(name)
        return
      }
      this.$axios.get(
        '/MyContactAction/myContactList.do', params,
        res => {
          const data = res.dataContent
          if (data.length === 0) {
            this.searchLists = []
            this.emptyLoading = true
            return
          }
          this.emptyLoading = false
          const arr = data.map(item => {
            return {
              label: item.NAME,
              value: item.ID + '',
              src: item.FILE_PATH,
              check: false
            }
          })

          // 判断已经选中的数据
          const sureList = JSON.parse(localStorage.getItem('sure-list'))
          if (sureList && sureList.length) {
            sureList.forEach((a, index) => {
              arr.forEach((b, sindex) => {
                if (a.value === b.value) {
                  this.$set(arr[sindex], 'check', true)
                }
              })
            })
          }
          this.searchLists = arr
        }
      )
    },
    getFrequentlyUserList() {
      const URL = '/MyContactAction/getFrequentlyUserList.do'
      this.$axios.get(
        URL,
        {},
        res => {
          const data = res.dataContent
          const arr = data.map(item => {
            return {
              label: item.USER_NAME,
              value: item.USER_ID,
              src: item.FILE_PATH,
              check: false
            }
          })

          const sureList = JSON.parse(localStorage.getItem('sure-list')) | []
          this.sureList = sureList || this.sureList
          if (this.sureList && this.sureList.length) {
            this.sureList.forEach((a, index) => {
              arr.forEach((b, sindex) => {
                if (a.value === b.value) {
                  this.$set(arr[sindex], 'check', true)
                }
              })
            })
          }
          this.regularList = arr
        }
      )
    },
    getList() {
      this.pageInfo.params.searchId = ''
      const params = this.pageInfo.params
      this.$axios.get(
        '/MyContactAction/myContactList.do', params,
        res => {
          const data = res.dataContent
          const arr = data.map(item => {
            return {
              label: item.NAME,
              value: item.ID + '',
              src: item.FILE_PATH,
              check: false
            }
          })
          this.searchLists = []
          // 删除之后checkbox取消选中
          const sureList = JSON.parse(localStorage.getItem('sure-list')) | []
          this.sureList = sureList || this.sureList
          if (this.sureList && this.sureList.length) {
            this.sureList.forEach((a, index) => {
              arr.forEach((b, sindex) => {
                if (a.value === b.value) {
                  this.$set(arr[sindex], 'check', true)
                }
              })
            })
          }
          const arr1 = JSON.parse(JSON.stringify(arr))
          this.userLists = arr
          this.searchLists = arr
          this.storage.set('users-list', arr1)
        }
      )
    },
    onRefresh() {
      const sureList = JSON.parse(localStorage.getItem('sure-list'))
      const userLists = JSON.parse(localStorage.getItem('users-list'))
      if (sureList) {
        this.userLists = userLists
        this.sureList = sureList
        this.initList()
        return
      }
      this.getList()
    },
    searchSelectChange(item, index) {
      const check = !item.check
      const value = item.value
      if (item.check) {
        this.sureList.forEach((item, i) => {
          if (item.value === value) {
            this.sureList.splice(i, 1)
          }
        })
      } else {
        this.sureList.push(item)
      }
      this.$set(this.searchLists[index], 'check', check)
      this.userLists.forEach((item, index) => {
        if (item.value === value) {
          this.$set(this.userLists[index], 'check', check)
        }
      })
      this.regularList.forEach((item, index) => {
        if (item.value === value) {
          this.$set(this.regularList[index], 'check', check)
        }
      })
      this.initList()
    },
    selectRegularChange(item, index) {
      const check = !item.check
      const value = item.value
      if (item.check) {
        this.sureList.forEach((item, i) => {
          if (item.value === value) {
            this.sureList.splice(i, 1)
          }
        })
      } else {
        this.sureList.push(item)
      }
      if (this.active === '2') { // 按人员选择
        this.$set(this.userLists[index], 'check', check)
        this.regularList.forEach((citem, sindex) => {
          if (citem.value === value) {
            this.$set(this.regularList[sindex], 'check', check)
          }
        })
      }

      if (this.active === '3') { // 按选人员选择
        this.$set(this.regularList[index], 'check', check)
        this.userLists.forEach((citem, sindex) => {
          if (citem.value === value) {
            this.$set(this.userLists[sindex], 'check', check)
          }
        })
      }

      this.initList()
    },
    selectChange(item, index) {
      const check = !item.check
      const value = item.value
      if (item.check) {
        this.sureList.forEach((item, i) => {
          if (item.value === value) {
            this.sureList.splice(i, 1)
          }
        })
      } else {
        this.sureList.push(item)
      }

      this.initList()
    },
    delChange(item, index) {
      const value = item.value
      this.userLists.forEach((LS, index) => {
        if (LS.value === value) this.$set(this.userLists[index], 'check', false)
      })
      this.sureList.forEach((LS, index) => {
        if (LS.value === value) this.sureList.splice(index, 1)
      })
      this.regularList.forEach((LS, index) => {
        if (LS.value === value) this.$set(this.regularList[index], 'check', false)
      })
      this.initList()
    },
    initList() {
      const sureList = this.sureList
      const userLists = this.userLists
      const arr = JSON.parse(JSON.stringify(sureList))
      const arr1 = JSON.parse(JSON.stringify(userLists))
      this.storage.set('users-list', arr1)
      this.storage.set('sure-list', arr)
    },
    toActive(item) {
      this.active = item.value
      if (item.value === '2') {
        const userLists = JSON.parse(localStorage.getItem('users-list'))
        if (userLists && userLists.length) {
          this.userLists = userLists
          this.searchLists = []
          this.keyWord = ''
          return
        }
        this.getList()
      }
      if (item.value === '1') {
        this.sid = this.treeData[0].id
        this.$refs.rightPopupOrgChart.showPopup()
      }
    }
  }
}
</script>

<style lang="scss">
.boxShadow{
  box-shadow:0px 4px 3px #ccc;
}
.common-tree-select{
  .sure-btn{
    font-size:30px;
    font-weight:500;
  }
  .tree-page{
    background:rgba(245,245,245,1);
    .sure-content{
      width: 100%;
      box-sizing: border-box;
      background-color: #fff;
      padding: 0px 40px 16px;
      .content{
        display: flex;
        flex-wrap: wrap;
        li{
          padding-right:30px;
          padding-top: 16px;
          &:nth-child(6n){
            padding-right:0px;
          }
          .name{
            height:30px;
            font-size:22px;
            font-weight:500;
            color:rgba(45,57,56,1);
            line-height:30px;
            text-align: center;
            padding-top: 8px;
            width: 85px;
          }
          .top{
             position: relative;
            .img{
              width:68px;
              height:68px;
              border-radius:34px;
            }
            img{
              width:100%;
              height:100%;
              border-radius:47px;
            }
            .icon-img{
              width:68px;
              height:68px;
              border-radius:34px;
              background:rgba(241,85,72,1);
              font-size:30px;
              font-weight:500;
              color:rgba(255,255,255,1);
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .icon-del{
              width: 34px;
              height: 34px;
              position: absolute;
              top:-5px;
              right:-5px;
            }
          }
        }
      }
    }
    .link-list{
      padding-top: 18px;
      .link-content{
        background-color: #fff;
        li{
          height: 99px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size:28px;
          font-weight:500;
          color:rgba(76,76,76,1);
          padding: 0 40px;
          &+li{
            border-top: 2px solid #F0F0F0;
          }
        }
      }
    }
    .user-list{
      padding: 29px 0 0;
      h2{
        font-size:24px;
        font-weight:500;
        height:33px;
        color:rgba(160,160,159,1);
        line-height:33px;
        padding-left: 40px;
        text-align: left;
      }
      .content{
        background-color: #fff;
        li{
          padding-left:40px;
          display:flex;
          align-items: center;
          height: 100px;
          .v-select-left{
            .img{
              width:68px;
              height:68px;
              border-radius:34px;
            }
            img{
              width:100%;
              height:100%;
              border-radius:34px;
            }
            .icon-img{
              width:68px;
              height:68px;
              border-radius:34px;
              background:rgba(241,85,72,1);
              font-size:30px;
              font-weight:500;
              color:rgba(255,255,255,1);
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
          .v-select-right{
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-right:40px;
            height: 100px;
            border-bottom: 2px solid rgba(245,245,245,1);
            box-sizing: border-box;
            .name{
              padding-left: 20px;
              font-size:30px;
              font-weight:400;
              color:rgba(45,57,56,1);
            }
            .input-box{
              width:36px;
              height:36px;
              display: flex;
              align-items: center;
              span{
                display: inline-block;
                width:36px;
                height:36px;
                border:2px solid rgba(188,195,210,1);
                box-sizing: border-box;
              }
              img{
                width: 100%;
                height: 100%;
              }
            }
          }
          &:last-child{
            .v-select-right{
              border-bottom:none;
            }
          }
        }
      }
    }
  }
}
.yh-search{
  position: relative;
  background: #fff;
}
.yh-search input{
  text-align: left;
  margin: 30px 0;
  // line-height: 68px;
  // height: 68px;
}
.yh-search .search-img{
  width: 40px;
  position: absolute;
  left: 50px;
  top: 50%;
  transform: translateY(-50%);
}
.org-chart-container1{
  padding-left: 40px;
  background-color: #fff;
  margin-top: 10px;
  .org-chart-node-children{
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size:28px;
    font-weight:500;
    color:rgba(76,76,76,1);
    height: 99px;
    // padding-right: 40px;
    .name{
      display: flex;
      align-items: center;
      img{
        width: 45px;
        height:50px;
        // padding-right: 10px;
      }
    }
    &+.org-chart-node-children{
      border-top: 2px solid #F0F0F0;
    }
  }
}
</style>
