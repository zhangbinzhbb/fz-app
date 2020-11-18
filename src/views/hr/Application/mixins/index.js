// export default {
//   data () {
//     return {
//       detail: {
//         uploadFiles: []
//       },
//       totalCountAll: null,
//       basicForm: [
//         {
//           label: '姓名',
//           type: '',
//           element: 'input',
//           placeholder: '',
//           name: 'userName',
//           required: true,
//           checktypename: 'chineseName'
//         },
//         {
//           label: '性别',
//           type: '',
//           element: 'select',
//           placeholder: '请选择性别',
//           optionLabelName: 'label',
//           optionIdName: 'value',
//           options: [],
//           name: 'userSex',
//           required: true
//         },
//         {
//           label: '出生日期',
//           element: 'datePicker',
//           placeholder: '',
//           name: 'birthday'
//         },
//         {
//           label: '手机号',
//           type: '',
//           element: 'input',
//           placeholder: '',
//           name: 'telephone',
//           checktypename: 'telephone',
//           required: true,
//           maxlength: '11'
//         },
//         {
//           label: '身份证号',
//           type: '',
//           element: 'input',
//           placeholder: '',
//           name: 'idCard',
//           checktypename: 'idCard',
//           maxlength: 18
//         },
//         {
//           label: '毕业院校',
//           type: '',
//           element: 'input',
//           placeholder: '',
//           name: 'graduateSchool',
//           required: true
//         },
//         {
//           label: '最高学历',
//           type: '',
//           element: 'select',
//           optionLabelName: 'label',
//           optionIdName: 'value',
//           options: [],
//           name: 'highestDegreeName',
//           nameId: 'highestDegree',
//           required: true
//         },
//         {
//           label: '专业',
//           type: '',
//           element: 'input',
//           placeholder: '请输入专业',
//           name: 'major',
//           required: true
//         },
//         {
//           label: '入库时间',
//           type: '',
//           element: 'text',
//           placeholder: '',
//           name: 'storageTime'
//           // required: true
//           // disabled: true
//         },
//         {
//           label: '简历编号',
//           type: '',
//           element: 'text',
//           placeholder: '',
//           name: 'resumeNum'
//           // disabled: true
//         },
//         {
//           label: '推荐公司',
//           type: '',
//           element: 'select',
//           placeholder: '',
//           name: 'groupName',
//           nameId: 'groupId',
//           required: true,
//           optionLabelName: 'groupNameAndJobName',
//           optionIdName: 'jobId',
//           options: []
//         },
//         {
//           label: '岗位名称',
//           type: '',
//           element: 'select',
//           placeholder: '',
//           name: 'jobName',
//           nameId: 'jobId',
//           required: true,
//           optionLabelName: 'groupNameAndJobName',
//           optionIdName: 'jobId',
//           options: []
//           // disabled: true,
//         },
//         {
//           label: '简历来源',
//           type: '',
//           element: 'select',
//           optionLabelName: 'label',
//           optionIdName: 'value',
//           options: [],
//           name: 'resumeSourceName',
//           nameId: 'resumeSource',
//           required: true
//         },
//         {
//           label: '来源单位',
//           type: '',
//           element: 'input',
//           placeholder: '',
//           name: 'unit'
//         },
//         {
//           label: '简历状态',
//           type: '',
//           element: 'text',
//           optionLabelName: 'label',
//           optionIdName: 'value',
//           options: [],
//           name: 'resumeStatusName',
//           nameId: 'resumeStatus'
//           // required: true
//         },
//         {
//           label: '标签',
//           type: 'addInput',
//           element: 'other',
//           placeholder: '',
//           options: [],
//           name: 'labelTables'
//         },
//         {
//           label: '备注',
//           type: 'textarea',
//           element: 'input',
//           placeholder: '   ',
//           name: 'resumeRemak'
//         }
//       ]
//     }
//   },
//   created () {
//     this.getDetail()
//   },
//   watch: {
//     //  选择公司后
//     'detail.groupId' (val) {
//       this.basicForm[10].options.map((item, index) => {
//         if (item.jobId === this.detail.groupId) {
//           this.basicForm.map((v, k) => {
//             if (v.name === 'jobName') {
//               // this.basicForm[k].disabled = true
//             }
//           })
//           this.$set(this.detail, 'groupName', item.groupName)
//           this.$set(this.detail, 'jobName', item.jobName)
//           this.$set(this.detail, 'jobId', item.jobId)
//         }
//       })
//     },
//     // 选择岗位后
//     'detail.jobId' (val) {
//       this.basicForm[11].options.map((item, index) => {
//         if (item.jobId === this.detail.jobId) {
//           this.basicForm.map((v, k) => {
//             if (v.name === 'groupName') {
//               // this.basicForm[k].disabled = true
//             }
//           })
//           this.$set(this.detail, 'jobName', item.jobName)
//           this.$set(this.detail, 'jobId', item.jobId)
//           this.$set(this.detail, 'groupName', item.groupName)
//         }
//       })
//     }
//   },
//   methods: {
//     addBeforeShow (callback) {
//       // //入库时间 简历编号
//       this.$axios.get('/resumeManagement/getResumeNumAndDate', {}, res => {
//         this.$set(this.detail, 'storageTime', res.data.model.storageTime)
//         this.$set(this.detail, 'resumeNum', res.data.model.resumeNum)
//       })
//       // 性别
//       this.$axios.get(
//         '/commonTCode/getCodeByParentId.do',
//         {
//           parentId: '2603'
//         },
//         res => {
//           this.basicForm[1].options = res.data.options
//           //  最高学历
//           this.$axios.get(
//             '/commonTCode/getCodeByParentId.do',
//             {
//               parentId: '2604'
//             },
//             res => {
//               this.basicForm.map((item, index) => {
//                 if (item.name === 'highestDegreeName') {
//                   this.basicForm[index].options = res.data.options
//                 }
//               })
//               //  简历来源
//               this.$axios.get(
//                 '/commonTCode/getCodeByParentId.do',
//                 {
//                   parentId: '2605'
//                 },
//                 res => {
//                   this.basicForm.map((item, index) => {
//                     if (item.name === 'resumeSourceName') {
//                       this.basicForm[index].options = res.data.options
//                     }
//                   })
//                   //  简历状态
//                   this.$axios.get(
//                     '/commonTCode/getCodeByParentId.do',
//                     {
//                       parentId: '2601'
//                     },
//                     res => {
//                       this.basicForm.map((item, index) => {
//                         if (item.name === 'resumeStatusName') {
//                           // this.basicForm[index].options = res.data.options
//                           // this.basicForm[index].required = false
//                           // this.basicForm[index].element = 'text'
//                           this.basicForm[index].options = res.data.options
//                           this.$set(
//                             this.detail,
//                             'resumeStatus',
//                             res.data.options[0].value
//                           )
//                           this.$set(
//                             this.detail,
//                             'resumeStatusName',
//                             res.data.options[0].label
//                           )
//                         }
//                       })
//                       if (callback) {
//                         callback()
//                       }
//                     }
//                   )
//                 }
//               )
//             }
//           )
//         }
//       )
//       // 公司
//       this.$axios.postJson(
//         '/jobDemand/list',
//         {
//           IS_PAGE: true,
//           curPage: 1,
//           pageSize: 1000000,
//           jobStatus: 1
//           // keyword: ''
//         },
//         res => {
//           this.basicForm.map((item, index) => {
//             if (item.name === 'groupName') {
//               res.data.map(v => {
//                 v.groupNameAndJobName = v.groupName + '---' + v.jobName
//               })
//               this.basicForm[index].options = res.data
//             }
//           })
//         }
//       )
//       // 岗位名称
//       this.$axios.postJson(
//         '/jobDemand/list',
//         {
//           IS_PAGE: true,
//           curPage: 1,
//           pageSize: 1000000,
//           jobStatus: 1
//           // keyword: ''
//         },
//         res => {
//           this.basicForm.map((item, index) => {
//             if (item.name === 'jobName') {
//               res.data.map(v => {
//                 v.groupNameAndJobName = v.groupName + '---' + v.jobName
//               })
//               this.basicForm[index].options = res.data
//             }
//           })
//         }
//       )
//       // })
//     },
//     beforeInit () {
//       if (this.initData) {
//         this.detail = JSON.parse(JSON.stringify(this.initData))
//       } else {
//         this.addBeforeShow()
//         this.initData = JSON.parse(JSON.stringify(this.detail))
//       }
//     },
//     getDetail () {
//       // 点击重置按钮   标签不会增加
//       this.basicForm[this.basicForm.length - 2].options.splice(0)
//       if (this.$route.query.id > 0) {
//         this.addBeforeShow(() => {
//           this.$axios.get(
//             '/resumeManagement/detail/' + this.$route.query.id,
//             {},
//             res => {
//               const setLabelTables = labelTables => {
//                 if (labelTables) {
//                   labelTables = labelTables.split(',')
//                   labelTables.map(option => {
//                     this.basicForm[this.basicForm.length - 2].options.push({
//                       label: option
//                     })
//                   })
//                 }
//               }
//               setLabelTables(res.data.model.labelTables)
//               this.cmpData = JSON.parse(JSON.stringify(res.data.model))
//               this.detail = res.data.model
//               // this.$set(this.detail, 'userSexName', res.data.model.userSex)
//               this.$set(
//                 this.detail,
//                 'highestDegreeName',
//                 res.data.model.highestDegree
//               )
//               this.$set(
//                 this.detail,
//                 'resumeSourceName',
//                 res.data.model.resumeSource
//               )
//               this.$set(
//                 this.detail,
//                 'resumeStatusName',
//                 res.data.model.resumeStatus
//               )
//               this.basicForm.map((item, index) => {
//                 //  性别
//                 if (item.name === 'userSex') {
//                   this.basicForm[index].options.map(v => {
//                     if (res.data.model.userSex === v.label) {
//                       this.$set(this.detail, 'userSex', v.value)
//                     }
//                   })
//                 }
//                 //  最高学历
//                 if (item.name === 'highestDegreeName') {
//                   this.basicForm[index].options.map(v => {
//                     if (res.data.model.highestDegree === v.label) {
//                       this.$set(this.detail, 'highestDegree', v.value)
//                     }
//                   })
//                 }
//                 // // 简历状态
//                 if (item.name === 'resumeStatusName') {
//                   this.basicForm[index].options.map(v => {
//                     if (res.data.model.resumeStatus === v.label) {
//                       this.$set(this.detail, 'resumeStatus', v.value)
//                     }
//                   })
//                 }
//                 //  校招 简历来源
//                 if (item.name === 'resumeSourceName') {
//                   this.basicForm[index].options.map(v => {
//                     if (res.data.model.resumeSource === v.label) {
//                       this.$set(this.detail, 'resumeSource', v.value)
//                     }
//                   })
//                 }
//               })
//               // this.detail.resumeFile = res.data.resumeFile
//               // this.detail.resumeId = this.$route.query.id
//               this.detail.IS_FIRST = this.detail.IS_FIRST || 0
//             }
//           )
//         })
//       } else {
//         this.beforeInit()
//       }
//     }
//   }
// }
