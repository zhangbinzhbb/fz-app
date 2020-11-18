<template>
  <div :class="{'ios-basic-form':!isAndroid12}" class="yh-basic-form comment-content no-comment yh-basic-form-common">
    <van-cell-group class="yh-vant-form">
      <div v-for="(item,index) in form" :key="index" class="input-cover-con">
        <div
          v-if="!(item.hidden||item.type=='slot'||item.type=='link'||item.type=='chooseNum'||item.type=='des')"
          class="colon"
        />
        <!-- 选择框遮挡点击事件 -->
        <div
          v-if="!item.slotIcon&&(item.isLink||item.element=='select'||item.element=='datePicker'||item.element=='timePicker'||item.element=='datetimePicker')"
          v-show="!item.hidden&&!item.disabled"
          class="input-cover"
          @click="iconShow(item,index)"
        />
        <!-- 选择框以及输入框 -->
        <van-field
          v-if="item.element!='other' && item.element!='switch'"
          v-show="!item.hidden"
          ref="vanInput"
          :placeholder="item.placeholder?item.placeholder:(item.element=='input'?'请输入':'请选择')"
          :label="item.label"
          v-model="data[item.name]"
          :checktypename="checkTypeName.name"
          :error-message="errorMsg.name"
          :type="item.type"
          :disabled="item.disabled"
          :maxlength="item.maxlength"
          :readonly="item.readonly||item.element!='input'"
          :required="item.required"
          :is-link="!item.slotIcon&&(item.isLink||item.element=='select'||item.element=='datePicker'||item.element=='timePicker'||item.element=='datetimePicker')"
          :autosize="autoSize"
          :class="{'no-height':item.type=='textarea'}"
          label-align="left"
          @click="iconShow(item,index)"
          @focus="focus"
          @blur="blur"
        >
          <img
            v-if="item.slotIcon"
            slot="icon"
            :src="baseConfig.domain+'static/images/metting_p.png'"
            alt
            class="slot-img"
          >
        </van-field>
        <!-- 选数量 -->
        <div v-if="item.type=='chooseNum'" v-show="!item.hidden" class="invall-num">
          <span :class="{'van-cell--required':item.required}" class="van-cell__title">{{ item.label }}</span>
          <div class="list">
            <div v-for="num in item.option" :key="num" class="checkList">
              <span
                :class="{'isChecked':data[item.name]==num}"
                class="check"
                @click="chooseNum(item.name,num)"
              >{{ num }}</span>
            </div>
          </div>
        </div>

        <!-- 单纯连接跳转页面 -->
        <div v-if="item.type=='link'" class="item-link" @click="rightPopupOpen(item,index)">{{ item.label }}</div>
        <!-- 分割线 -->
        <div v-if="item.type=='des'" class="item-link">{{ item.label }}</div>
        <!-- 单选控件-方框 -->
        <div
          v-if="item.type=='radio'||item.type=='radio-vant'||item.type=='switch'"
          v-show="!item.hidden"
          class="other-radio"
        >
          <span :class="{'van-cell--required':item.required}" class="van-cell__title">{{ item.label }}</span>
          <!-- 开关按钮 -->
          <div v-if="item.type=='switch'" class="switch-item">
            <van-switch v-model="data[item.name]" :active-value="1" inactive-value="0" active-color="#B60005" size="0.7rem"/>
          </div>
          <div v-if="item.type=='radio'&&item.multiple" class="remind-div" style="position:relative;right:-20px;padding-left:0">
            <p
              v-for="(option,optIdx) in item.options"
              :class="{'active':option.selected}"
              :key="optIdx"
              @click="setCheckBox(index,optIdx)"
            >{{ option[item.optionLabelName||'label'] }}</p>
          </div>
        </div>
        <!-- 选择人员 -->
        <div v-if="item.type=='person'" v-show="!item.hidden" class="other-radio person-icon">
          <span :class="{'van-cell--required':item.required}" class="van-cell__title">{{ item.label }}</span>
          <div v-if="!item.multiple" class="remind-div">
            <p
              v-for="(option,optIdx) in item.options"
              :class="{'active':data[item.name]==option[item.optionIdName||'id']}"
              :key="optIdx"
            >
              {{ option[item.optionLabelName||'label'] }}
              <van-icon name="close" class="clear-btn" @click="deletePerson(index,optIdx)"/>
            </p>
          </div>
          <!-- 选择人员 -->
          <div v-if="item.multiple" class="remind-div person-con test">
            <p
              v-for="(option,optIdx) in item.options"
              :class="{'active':option.selected}"
              :key="optIdx"
              class="person-item"
            >
              <span class="personSelect-img">
                <img v-if="option.src" :src="option.src" alt="">
                <em v-else>{{ option.label&&option.label.charAt(option.label.length-1) }}</em>
                {{ option.label }}
              </span>
              <!-- <em class="delete-people" @click="deletePeople(index,optIdx)">
                <van-icon name="cross" />
              </em> -->
            </p>
          </div>
          <img
            :src="baseConfig.domain+'static/images/metting_p.png'"
            alt
            class="slot-img"
            @click="routerTo(item,index)"
          >
        </div>

        <!-- 手输添加标签 -->
        <div v-if="item.type =='addInput'" class="other-radio">
          <span>{{ item.label }}</span>
          <div id="inputContent" class="remind-div">
            <div
              v-for="(option,optIdx) in item.options"
              :key="optIdx"
              class="input-add-item"
              style="padding-left:0"
            >
              <span @click="delInput(index,optIdx)">—</span>
              <input v-model.trim="option.label" type="text" class="add-name" maxlength="10">
            </div>
            <van-icon
              name="add-o"
              size="25px"
              color="#b70007"
              class="add-input"
              @click="addInput(index)"
            />
          </div>
        </div>
        <!-- 上传文件 -->
        <div v-if="item.type=='upload'" v-show="!item.hidden" class="other-radio">
          <span :class="{'van-cell--required':item.required}" class="van-cell__title">{{ item.label }}</span>
          <div class="remind-div floatRight-div">
            <van-uploader :after-read="fileChanged" accept="*" multiple>
              <img :src="baseConfig.domain+'static/images/scfj.png'" alt class="upload">
            </van-uploader>
          </div>
          <div v-for="(file,index) in data.uploadFiles" :key="index" class="uploaderFiles">
            <a class="file-link" href="javascript:void(0)">
              <img :src="fileTypeImg(file)" alt="">
              {{ file.fileOldName }}
              <van-icon name="delete" class="vant-del" @click.stop="deleteFile(index)"/>
            </a>
          </div>
        </div>
        <!-- 上传文件2 -->
        <div v-if="item.type=='upload2'" v-show="!item.hidden" class="other-radio">
          <span :class="{'van-cell--required':item.required}" class="van-cell__title">{{ item.label }}</span>
          <div class="remind-div floatRight-div">
            <van-uploader :after-read="fileChanged2" accept="*" multiple>
              <img :src="baseConfig.domain+'static/images/scfj.png'" alt class="upload">
            </van-uploader>
          </div>
          <div v-for="(file,index) in data.uploadFiles2" :key="index" class="uploaderFiles">
            <a class="file-link" href="javascript:void(0)">
              <img :src="fileTypeImg(file)" alt="">
              {{ file.fileOldName }}
              <van-icon name="delete" class="vant-del" @click.stop="deleteFile(index,'uploadFiles2')"/>
            </a>
          </div>
        </div>
        <!--错误信息提示-->
        <div v-if="item.type=='errorTips'">
          <div v-for="(v,k) in errorTips" :key="k" class="errorTips">{{ v.name }}</div>
        </div>
        <div v-if="item.type=='slot'">
          <slot :item="item" :index="index" name="item"/>
        </div>
      </div>
    </van-cell-group>
    <div class="">
      <van-button :loading="isLoading" class="btn-full btn-red" @click="submit">提交</van-button>
    </div>
    <van-popup v-model="datePicker.show" position="bottom">
      <van-datetime-picker
        v-if="datePicker.item&&!useCustomDatePicker"
        v-model="datePicker.value"
        :type="datePicker.item.element.slice(0,datePicker.item.element.length-6)"
        class="yh-datePicker"
        @confirm="popupConfirm()"
        @cancel="datePicker.show=false"
      />
      <van-picker
        v-if="useCustomDatePicker"
        ref="customDateTimePicker"
        :confirm-button-text="'完成'"
        :columns="dateTimeColums"
        :class="[{'yh-datePicker-time':datePicker.item&&datePicker.item.element=='timePicker'},'yh-pickerClm-'+dateTimeColums.length]"
        :show-toolbar="showToolbar"
        class="yh-datePicker"
        @change="customDateChange"
        @confirm="customDateConfirm"
        @cancel="datePicker.show=false;dateTimeOptions.value = null"
      />
    </van-popup>
    <!-- 底部弹出-选择 -->
    <van-popup v-model="select.show" position="bottom">
      <van-picker
        v-if="select.item"
        ref="vantSelect"
        :confirm-button-text="'完成'"
        :columns="select.item.options"
        :value-key="select.item.optionLabelName||'label'"
        :show-toolbar="showToolbar"
        class="yh-datePicker"
        @confirm="onSelectConfirm"
        @cancel="select.show=false"
      />
    </van-popup>
    <!-- 向右弹出 -->
    <right-popup ref="rightPopup" :cat-title="catTitle" @confirm="rightConfirm"/>
    <vueTreeSelect ref="rightPopupTreeSelect" :default-array="userList" :cat-title="catTitle" @select-change="selectChange"/>
  </div>
</template>

<script>
export default {
  name: 'BasicForm',
  components: {
    rightPopup: () => import('../rightPopup/index'),
    vueTreeSelect: () => import('@/components/vueTreeSelect/index')
  },
  props: {
    form: {
      type: Array,
      default: () => []
    },
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      // 需要验证的信息数据
      checkTypeName: {},
      errorTips: [], // 储存错误信息
      list: [{ name: 'labelTables' }],
      isLoading: false,
      useCustomDatePicker: true, // 遗留默认设置初始值，选择每月时间变化时，选择项消失,值不变是，确认未选中默认
      // 自定义日期时间选择项
      dateTimeOptions: {
        year: {
          // begin: 2008,
          begin: 1900,
          end: 2028
        },
        month: {
          begin: 1,
          end: 12
        },
        day: {
          begin: 1,
          end: 31
        },
        hour: {
          begin: 8,
          end: 20
        },
        timeList: [
          '00',
          '05',
          '10',
          '15',
          '20',
          '25',
          '30',
          '35',
          '40',
          '45',
          '50',
          '55'
        ]
      },
      // 自定义日期时间选择项
      dateTimeColums: [],
      errorMsg: {},
      catTitle: null,
      showToolbar: true,
      autoSize: { minHeight: 150 },
      datePicker: {
        show: false,
        value: new Date()
      },
      select: {
        show: false
      },
      numberOption: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, '10+', '15+'],
      personArr: [],
      userList: []
    }
  },
  watch: {
    data: {
      handler(newName, oldName) {
        // 抄送人
        // const scheduleuserList = this.data.scheduleuserList
        // this.userList = scheduleuserList.map(item => {
        //   return {
        //     label: item.NAME,
        //     value: item.ID,
        //     src: item.FACE_PATH
        //   }
        // })
      },
      immediate: true
    }
  },
  created() {
    this.dataInit()
  },
  mounted() {},
  methods: {
    focus() {
      if (this.baseConfig.ENV !== 'PROD') {
        return
      }
      this.bfscrolltop = document.body.scrollTop
      document.getElementsByClassName(
        'yh-basic-form'
      )[0].clientHeight = this.bfscrolltop
      this.interval = setInterval(() => {
        document.body.scrollTop = document.body.scrollHeight
      }, 100)
    },
    blur() {
      clearInterval(this.interval)
      document.body.scrollTop = this.bfscrolltop
    },
    // 添加标签
    addInput(index) {
      if (this.form[index].options.length >= 5) {
        return
      }
      this.form[index].options.push({})
    },
    // 删除标签
    delInput(index, optIdx) {
      this.form[index].options.splice(optIdx, 1)
    },
    dataInit() {
      // 初始化时间
      const initDate = item => {
        if (
          !(
            item.element === 'datePicker' ||
            item.element === 'timePicker' ||
            item.element === 'datetimePicker'
          )
        ) {
          return
        }
        const result = this.data[item.name] || new Date()
        this.data[item.name] =
          item.element === 'datetimePicker'
            ? this.formatDateTime(result, 'yyyy-MM-dd HH:mm')
            : item.element === 'datePicker'
              ? this.formatDateTime(result, 'yyyy-MM-dd')
              : this.formatDateTime(result, 'HH:mm')
        if (this.useCustomDatePicker) {
          // datePickerCus--------->设置自定义时期初始数据
          const time = this.data[item.name]
          if (time.indexOf(':') > -1) {
            this.data[item.name] =
              time.slice(0, time.length - 5) +
              (item.label.indexOf('结束') > -1 ? '17:00' : '08:00')
            // 2018-12-28
          }
        }
      }
      this.form.map(item => {
        //  // 初始化数据-多选设置空数组
        if (item.multiple && item.type === 'upload') {
          this.data[item.name] = this.data[item.name] || []
        }
        // 初始化默认表单数据设置
        if (
          item.name &&
          item.defaultValue !== undefined &&
          item.defaultValue !== null
        ) {
          this.$set(this.data, item.name, item.defaultValue)
        }
        // // 初始化时间
        if (!item.notInit) {
          initDate(item)
        }
      })
    },
    // datePickerCus--------->设置自定义时期初始数据
    setCustomDate(type) {
      const setting = this.dateTimeOptions[type]
      const list = []
      for (let i = setting.begin; i <= setting.end; i++) {
        // debugger
        if (type !== 'year') {
          i = i < 10 ? `0${i}` : i
        }
        list.push(i)
      }
      return list
    },
    // datePickerCus--------->自定义时间选择器变换时
    customDateChange(picker, values) {
      const type = this.datePicker.item.element
      if (type !== 'timePicker') {
        const newDaysEnd = this.mGetDate(values[0], values[1])
        if (this.dateTimeOptions.day.end !== newDaysEnd) {
          this.dateTimeOptions.day.end = newDaysEnd
          picker.setColumnValues(2, this.setCustomDate('day'))
          values[2] = '01'
          picker.setColumnIndex(2, 0)
        }
      }
      if (type === 'datetimePicker') {
        this.dateTimeOptions.value = `${values[0]}-${values[1]}-${values[2]} ${
          values[3]
        }:${values[4]}`
      }
      if (type === 'timePicker') {
        this.dateTimeOptions.value = `${values[0]}:${values[1]}`
      }
      if (type === 'datePicker') {
        this.dateTimeOptions.value = `${values[0]}-${values[1]}-${values[2]}`
      }
    },
    // datePickerCus--------->设置打开时默认选中
    setCustomDefualtIndex(item) {
      const value = this.data[item.name]
      const obj = value
        ? {
          year: item.element !== 'timePicker' && value.slice(0, 4),
          month: item.element !== 'timePicker' && value.slice(5, 7),
          day: item.element !== 'timePicker' && value.slice(8, 10),
          hour:
              item.element === 'timePicker'
                ? value.slice(0, 2)
                : value.slice(11, 13),
          minute:
              item.element === 'timePicker'
                ? value.slice(3, 5)
                : value.slice(14, 16)
        }
        : {}
      this.dateTimeOptions.day.end = obj.year
        ? this.mGetDate(obj.year, obj.month)
        : this.dateTimeOptions.month.end
      if (obj.year && this.dateTimeColums.length >= 3) {
        this.dateTimeColums[2].values = this.setCustomDate('day')
        this.$refs.customDateTimePicker.setColumnValues(
          2,
          this.setCustomDate('day')
        )
      }
      let j = 0

      for (const i in obj) {
        if (obj[i]) {
          if (this.dateTimeColums[j].values.length) {
            this.dateTimeColums[j].values.map((item, index) => {
              if (item.toString() === obj[i]) {
                this.dateTimeColums[j].defaultIndex = index
                this.$refs.customDateTimePicker.setColumnIndex(j, index)
              }
            })
          }
          j++
        }
      }
    },
    // datePickerCus--------->自定义时间选择器变换时
    customDateConfirm() {
      const item = this.datePicker.item
      const dateTimeColums = this.dateTimeColums
      let defaultValue
      // 2018-12-28,处理空数据，不选择时，确认选择第一个选项的问题
      switch (item.element) {
        case 'timePicker':
          defaultValue = `${dateTimeColums[0].values[0]}:${
            dateTimeColums[1].values[0]
          }`
          break
        case 'dateTimePicker':
          defaultValue = `${dateTimeColums[0].values[0]}-${
            dateTimeColums[1].values[0]
          }-${dateTimeColums[2].values[0]} ${dateTimeColums[3].values[0]}:${
            dateTimeColums[4].values[0]
          }`
          break
        default:
          defaultValue = `${dateTimeColums[0].values[0]}-${
            dateTimeColums[1].values[0]
          }-${dateTimeColums[2].values[0]}`
          break
      }
      this.data[item.name] =
        this.dateTimeOptions.value || this.data[item.name] || defaultValue
      // 2018-12-28,处理其他选择了，再点开另外一个控件，不选择，确认问题
      this.dateTimeOptions.value = null
      this.datePicker.show = false
    },
    // 打开右侧页面-选人
    routerTo(item, index) {
      // console.log(item)
      this.catTitle = item.label
      this.select.item = item
      this.select.index = index
      // this.$refs.rightPopup.showPopup()
      this.$refs.rightPopupTreeSelect.showPopup()
      // ios12页面的关系，打开子页面的时候与'has-comment'css样式冲突，打开右侧弹出页面，样式去掉，关闭右侧页面需要恢复（headerx组件中)
      const content = document.getElementsByClassName('has-comment')
      content[0].classList.remove('has-comment')
      // header[0].style.display = 'none'
      if (item.type === 'person') {
        this.$refs.rightPopup.getCheckedList(this.select.item)
      }
    },
    selectChange(arr) {
      this.userList = arr
      const arrId = []
      const arrName = []
      this.userList.map(item => {
        arrId.push(item.value)
        arrName.push(item.label)
      })
      this.$set(this.data, 'SCHEDULEUSER_IDS', arrId.join(','))
      this.$set(this.data, 'SCHEDULEUSER_NAMES', arrName.join(','))
      this.form.map((item, index) => {
        if (item.type === 'person' || item.multiple) {
          this.$set(this.form[index], 'options', arr)
        }
      })
      console.log('this.data:', this.data)
    },
    rightPopupOpen(item, index) {
      console.log('item-1:', item)
      console.log('index-2:', index)
      this.catTitle = item.label
      this.select.item = item
      this.select.index = index
      this.$refs.rightPopup.showPopup()
      // this.$refs.rightPopupTreeSelect.showPopup()
      // ios12页面的关系，打开子页面的时候与'has-comment'css样式冲突，打开右侧弹出页面，样式去掉，关闭右侧页面需要恢复（headerx组件中)
      const content = document.getElementsByClassName('has-comment')
      console.log('content:', content)
      content[0].classList.remove('has-comment')
      // header[0].style.display = 'none'
      if (item.type === 'person') {
        this.$refs.rightPopup.getCheckedList(this.select.item)
      }
    },
    // 右侧弹框关闭数据时接收数据-人员选择
    rightConfirm(val, index) {
      index = index || this.select.index
      if (!Array.isArray(val)) {
        // 选择公司
        this.$set(this.data, this.form[index].name, val.name)
        this.$set(this.data, this.form[index].nameId, val.checked)
        return
      }
      this.$set(this.form[index], 'optionLabelName', 'NAME')
      this.$set(this.form[index], 'optionIdName', 'ID')
      this.$set(this.form[index], 'options', val)
      const arr = [],
        arrName = []
      this.form[index].options.map(item => {
        arr.push(item.ID)
        arrName.push(item.NAME)
      })
      this.$set(this.data, this.form[index].nameId, arr.join(','))
      this.$set(this.data, this.form[index].name, arrName.join(','))
    },
    // 删除人员
    deletePeople(index, optIdx) {
      const optValue = this.form[index].options[optIdx].value
      this.form[index].options.splice(optIdx, 1)
      const _arr = JSON.parse(localStorage.getItem('sure-list'))
      _arr.map((item, index) => {
        if (item.value == optValue) {
          item.check = ''
          _arr.splice(index, 1)
        }
      })
      localStorage.setItem('sure-list', JSON.stringify(_arr))
    },
    deletePerson(index, optIdx) {
      this.form[index].options.splice(optIdx, 1)
      this.$refs.rightPopup.getCheckedList(this.form[index])
      this.rightConfirm(this.form[index].options, index)
    },
    // 打开下拉选
    iconShow(item, index) {
      if (
        item.type === 'company' ||
        item.type === 'OA' ||
        item.type === 'project' ||
        item.type === 'workFlow'
      ) {
        this.rightPopupOpen(item, index)
        return
      }
      if (
        item.element === 'datePicker' ||
        item.element === 'timePicker' ||
        item.element === 'datetimePicker'
      ) {
        this.datePicker.show = true
        this.datePicker.item = item
        if (!this.useCustomDatePicker) {
          this.datePicker.value = this.data[item.name] || new Date()
          this.datePicker.value =
            item.element === 'timePicker'
              ? this.formatDateTime(this.datePicker.value, 'HH:mm')
              : new Date(
                typeof this.datePicker.value === 'string'
                  ? this.datePicker.value.replace(/-/g, '/')
                  : this.datePicker.value
              )
        } else {
          const setCustomDatetimePickerOptions = type => {
            const dateTimeColums = []
            type !== 'timePicker' &&
              dateTimeColums.push({ values: this.setCustomDate('year') })
            type !== 'timePicker' &&
              dateTimeColums.push({ values: this.setCustomDate('month') })
            type !== 'timePicker' &&
              dateTimeColums.push({ values: this.setCustomDate('day') })
            type !== 'datePicker' &&
              dateTimeColums.push({ values: this.setCustomDate('hour') })
            type !== 'datePicker' &&
              dateTimeColums.push({
                values: this.dateTimeOptions.timeList
              })
            this.$set(this, 'dateTimeColums', dateTimeColums)
          }
          setCustomDatetimePickerOptions(item.element)
          // 2018-12-28，处理取消默认选中错误的问题
          setTimeout(() => {
            this.setCustomDefualtIndex(item)
          }, 100)
        }
        return
      }

      if (item.element === 'select') {
        this.select.show = true
        this.select.item = item
        if (this.data[item.nameId]) {
          this.select.item.options.map((option, idx) => {
            if (this.data[item.nameId] === option[item.optionIdName || 'id']) {
              this.select.defaultIndex = idx
            }
          })
          setTimeout(() => {
            this.$refs.vantSelect.setColumnIndex(0, this.select.defaultIndex)
          })
        }
      }
    },
    // 弹出框日期确认按钮
    popupConfirm(type) {
      type = type || 'datePicker'
      const item = this[type].item
      if (type === 'datePicker') {
        this.data[item.name] =
          item.element === 'datetimePicker'
            ? this.formatDateTime(this[type].value, 'yyyy-MM-dd HH:mm')
            : item.element === 'datePicker'
              ? this.formatDateTime(this[type].value, 'yyyy-MM-dd')
              : this[type].value
      }
      this[type].show = false
    },
    // 人数选择
    chooseNum(name, val) {
      this.$set(this.data, name, val)
    },
    // 普通下拉确认按钮
    onSelectConfirm(val, index) {
      const type = 'select'
      const item = this[type].item

      this.data[item.name] = val[item.optionLabelName || 'label']
      this.$set(this.data, item.nameId, val[item.optionIdName || 'id'])
      this[type].show = false
    },
    setRadioCheck(name, val) {
      this.$set(this.data, name, val)
    },
    setCheckBox(index, optIdx) {
      const val = this.form[index].options[optIdx].selected === true
      this.$set(this.form[index].options[optIdx], 'selected', !val)
      const arr = []
      this.form[index].options.map(item => {
        if (item.selected) {
          arr.push(item[this.form[index].optionIdName || 'id'])
        }
      })
      this.$set(this.data, this.form[index].name, arr.join(','))
    },
    fileChanged(files) {
      this.updateFiles(files)
    },
    fileChanged2(files) {
      this.updateFiles(files, '/fileAction/uploadOA.do', 'uploadFiles2')
    },
    updateFiles(files, uploadUrl, dataName) {
      dataName = dataName || 'uploadFiles'
      uploadUrl = uploadUrl || this.form[this.form.length - 1].uploadUrl
      const update = file => {
        this.$axios.postFile(uploadUrl, file.file, res => {
          this.data[dataName].push(res.dataContent[0])
        })
      }
      // files
      if (files.length) {
        files.map(file => {
          update(file)
        })
      } else {
        update(files)
      }
    },
    deleteFile(index, dataName) {
      dataName = dataName || 'uploadFiles'
      this.data[dataName].splice(index, 1)
    },
    submit(type) {
      const formVerify = (data, basicForm) => {
        let result = true
        basicForm.map(item => {
          if (
            item.required &&
            (data[item.name] === null ||
              data[item.name] === undefined ||
              data[item.name] === '')
          ) {
            this.Toast('请输入必填项')
            result = false
          }
        })
        return result
      }
      if (formVerify(this.data, this.form)) {
        this.data.submitType = type
        this.isLoading = true
        setTimeout(() => {
          this.isLoading = false
        }, 2000)
        this.$emit('submit', this.data)
      }
      if (this.baseConfig.ENV !== 'PROD') {
        this.$emit('submit', this.data)
      }
    },
    reset() {
      this.$emit('reset')
    }
  }
}
</script>

<style lang="scss">
// @import './style/index.scss';
</style>
