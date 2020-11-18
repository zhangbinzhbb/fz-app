/*
 * @Author: Wendy
 * @Date: 2019-11-27 08:23:33
 * @Last Modified by: Wendy
 * @Last Modified time: 2019-11-27 08:23:33
 * 注意：用resolve方法，可以只加载当前页面用到的相关js，优化打开速度
 */
import Layout from '@/layout'
import { resolve } from 'path'
const Home = resolve => require(['@/views/home/index'], resolve)
const qichacha = resolve => require(['@/views/home/qichacha'], resolve)
const LoginNew = resolve => require(['@/views/login/login'], resolve)

// 会议部分
const MeetingRoom = resolve => require(['@/views/meetingApply/meetingRoom'], resolve)
const MeetingNew = resolve => require(['@/views/meetingApply/new'], resolve)
const MeetingList = resolve => require(['@/views/meetingApply/newList'], resolve)
const MeetingDetail = resolve => require(['@/views/meetingApply/detail'], resolve)
const ProjectProcessNew = resolve => require(['@/views/project/process/new'], resolve)
const SearchList = resolve => require(['@/views/search/index'], resolve)
// 日程部分
const MySchedule = resolve => require(['@/views/schedule/myNewSchedule'], resolve)
const ScheduleNew = resolve => require(['@/views/schedule/new'], resolve)
const ScheduleDetail = resolve => require(['@/views/schedule/detail'], resolve)
const ScheduleUserList = resolve => require(['@/views/schedule/components/showUserList'], resolve)
const ScheduleFollowDetail = resolve => require(['@/views/schedule/components/scheduleDetail'], resolve)
const Follow = resolve => require(['@/views/pages/follow'], resolve)

const NewsDetail = resolve => require(['@/views/news/detail'], resolve)
const NewsList = resolve => require(['@/views/news/list'], resolve)
const InfoComment = resolve => require(['@/views/news/comment'], resolve)
const NewsComment = resolve => require(['@/views/news/comment'], resolve)
const it = resolve => require(['@/views/application/it'], resolve)

// 签到部分
const signCode = resolve => require(['@/views/code/code'], resolve)
const myInitiation = resolve => require(['@/views/code/myInitiation'], resolve)
const myJoin = resolve => require(['@/views/code/myJoin'], resolve)
const meetingInfo = resolve => require(['@/views/code/meetingInfo'], resolve)
const signInInfo = resolve => require(['@/views/code/signInInfo'], resolve)
const signInResult = resolve => require(['@/views/code/signResult'], resolve)
// 人力资源部分
const jobsList = resolve => require(['@/views/hr/jobs/list'], resolve)
const jobsNew = resolve => require(['@/views/hr/jobs/new'], resolve)
const jobsDetail = resolve => require(['@/views/hr/jobs/detail'], resolve)
const workFlowList = resolve => require(['@/views/hr/workFlow/list'], resolve)
const workFlowDetail = resolve => require(['@/views/hr/workFlow/detail'], resolve)
const workFlowNew = resolve => require(['@/views/hr/workFlow/new'], resolve)
const resumeList = resolve => require(['@/views/hr/resume/list'], resolve)
const resumeNew = resolve => require(['@/views/hr/resume/new'], resolve)
const resumeDetail = resolve => require(['@/views/hr/resume/detail'], resolve)
const memberResumeList = resolve => require(['@/views/hr/memberResume/list'], resolve)
const dismissList = resolve => require(['@/views/hr/dismiss/list'], resolve)
const dismissDetail = resolve => require(['@/views/hr/dismiss/detail'], resolve)
const applicationList = resolve => require(['@/views/hr/Application/list'], resolve)
const applicationDetail = resolve => require(['@/views/hr/Application/detail'], resolve)
// 平台
const platform = resolve => require(['@/views/platform/platform'], resolve)
const platformList = resolve => require(['@/views/platform/index'], resolve)
const personStructure = resolve => require(['@/views/platform/personStructure'], resolve)
const invDecision = resolve => require(['@/views/platform/invDecision'], resolve)
const invPay = resolve => require(['@/views/platform/invPay'], resolve)
const bizInfo = resolve => require(['@/views/platform/bizInfo'], resolve)
const bizRelated = resolve => require(['@/views/platform/bizRelated'], resolve)
const bizPlan = resolve => require(['@/views/platform/bizPlan'], resolve)
const platFunds = resolve => require(['@/views/platform/platFunds'], resolve)
const platStatics = resolve => require(['@/views/platform/platStatics'], resolve)
const platFiles = resolve => require(['@/views/platform/platFiles'], resolve)
const keyPoint = resolve => require(['@/views/platform/keyPoint'], resolve)
const bizContract = resolve => require(['@/views/platform/bizContract'], resolve)
const platStaticsNotFinished = resolve => require(['@/views/platform/platStaticsNotFinished'], resolve)
const platStaticsFinished = resolve => require(['@/views/platform/platStaticsFinished'], resolve)
// 基金
const fundsList = resolve => require(['@/views/funds/list'], resolve)
const fund = resolve => require(['@/views/funds/fund'], resolve)
const basicInfo = resolve => require(['@/views/funds/basicInfo'], resolve)
const fundsInv = resolve => require(['@/views/funds/fundsInv'], resolve)
const fundsContract = resolve => require(['@/views/funds/fundsContract'], resolve)
const fundsAchieve = resolve => require(['@/views/funds/fundsAchieve'], resolve)
const fundsReport = resolve => require(['@/views/funds/fundsReport'], resolve)
const fundsEmail = resolve => require(['@/views/funds/fundsEmail'], resolve)
const fundsFolder = resolve => require(['@/views/funds/fundsFolder'], resolve)
const fundsEvalue = resolve => require(['@/views/funds/fundsEvalue'], resolve)
const fundsTeam = resolve => require(['@/views/funds/fundsTeam'], resolve)
const fundsPayment = resolve => require(['@/views/funds/fundsPayment'], resolve)
const fundsMeetingRecordList = resolve => require(['@/views/funds/meetingRecord/list'], resolve)
const fundsMeetingRecordAdd = resolve => require(['@/views/funds/meetingRecord/add'], resolve)
const fundsMeetingRecordDetail = resolve => require(['@/views/funds/meetingRecord/detail'], resolve)

// 运营监控
const fundPerformance = resolve => require(['@/views/Fundperformance/index'], resolve)

// 子基金
const subFoudsList = resolve => require(['@/views/subFunds/list'], resolve)
const subFundsInv = resolve => require(['@/views/subFunds/subFundsInv'], resolve)
const subfund = resolve => require(['@/views/subFunds/subfund'], resolve)
const subfundCash = resolve => require(['@/views/subFunds/subfundCash'], resolve)
const subfundFiles = resolve => require(['@/views/subFunds/subfundFiles'], resolve)
const subfundPrj = resolve => require(['@/views/subFunds/subfundPrj'], resolve)

// 流程中心 process
const process = resolve => require(['@/views/process/process'], resolve)
const processSetting = resolve => require(['@/views/process/setting'], resolve)
const processSettingNew = resolve => require(['@/views/process/newSetting'], resolve)
const processDetail = resolve => require(['@/views/process/detail'], resolve)

// 知识管理
const knowledgeList = resolve => require(['@/views/knowledge/list'], resolve)
const knowledgeDetail = resolve => require(['@/views/knowledge/detail'], resolve)
const knowledgeComment = resolve => require(['@/views/knowledge/comment'], resolve)
// 客户信息
const customerList = resolve => require(['@/views/customer/list'], resolve)
const customerDetail = resolve => require(['@/views/customer/detail'], resolve)
// 我的消息
const messageList = resolve => require(['@/views/message/list'], resolve)
const messageDetail = resolve => require(['@/views/message/detail'], resolve)
// 请假申请
const LeaveApply = resolve => require(['@/views/leaveApply/index'], resolve)
const LeaveAdd = resolve => require(['@/views/leaveApply/add'], resolve)
// 项目
const Project = resolve => require(['@/views/projectXm/project'], resolve)
const ProjectNew = resolve => require(['@/views/projectXm/projectNew'], resolve)
const ProjectDetail = resolve => require(['@/views/projectXm/projectDetail'], resolve)
const ProjectDetailBusiness = resolve => require(['@/views/projectXm/projectDetailBusiness'], resolve)
const ProjectBasicInfo = resolve => require(['@/views/projectXm/basicInfo'], resolve)
const ProjectChangeRecord = resolve => require(['@/views/projectXm/projectChangeRecord'], resolve)
const ProjectFinancing = resolve => require(['@/views/projectXm/projectFinancing'], resolve)
const ProjectAssess = resolve => require(['@/views/projectXm/projectAssess'], resolve)
const ProjectMoney = resolve => require(['@/views/projectXm/projectMoney'], resolve)
const ProjectContract = resolve => require(['@/views/projectXm/projectContract'], resolve)
const ProjectImportant = resolve => require(['@/views/projectXm/projectImportant'], resolve)
const ProjectList = resolve => require(['@/views/projectXm/projectList'], resolve)
const ProjectCash = resolve => require(['@/views/projectXm/projectCash'], resolve)
const ProjectEmail = resolve => require(['@/views/projectXm/projectEmail'], resolve)
const ProjectEmailDetail = resolve => require(['@/views/projectXm/projectEmailDetail'], resolve)
const ProjectFile = resolve => require(['@/views/projectXm/projectFile'], resolve)
const ProjectXm = resolve => require(['@/views/projectXm/xm/project'], resolve)
const ProjectXmDetail = resolve => require(['@/views/projectXm/xm/projectDetail'], resolve)
const ProjectProgress = resolve => require(['@/views/projectXm/xm/projectProgress'], resolve)
const ProjectXmProgress = resolve => require(['@/views/projectXm/projectProgress'], resolve)
const ProjectHomeProcessNew = resolve => require(['@/views/project/projectProcessNew2'], resolve)
const ProjectHomeProcessNew1 = resolve => require(['@/views/project/projectProcessNew3'], resolve)
const ProjectHomeProcessNew2 = resolve => require(['@/views/project/projectProcessNew4'], resolve)
const ProjectCommunity = resolve => require(['@/views/projectXm/projectCommunity'], resolve)
const ProjectCommunityDetail = resolve => require(['@/views/projectXm/projectCommunityDetail'], resolve)
// 项目进展新增回复
const projectReply = resolve => require(['@/views/project/projectReply'], resolve)

// 会议记录
const meetingRecordList = resolve => require(['@/views/meetingRecord/list'], resolve)
const meetingRecordDetail = resolve => require(['@/views/meetingRecord/detail'], resolve)
const meetingRecordAdd = resolve => require(['@/views/meetingRecord/add'], resolve)

// 来访接待
const visitList = resolve => require(['@/views/visit/list'], resolve)
const visitDetail = resolve => require(['@/views/visit/detail'], resolve)
const visitAdd = resolve => require(['@/views/visit/add'], resolve)

// 文件查看
const attachDetail = resolve => require(['@/components/attachment/attachDetail'], resolve)
const Fundperformance = resolve => require(['@/views/Fundperformance/index'], resolve)
const Fundperdetail = resolve => require(['@/views/Fundperdetail/index'], resolve)

// 健康上报
const healthy = resolve => require(['@/views/healthy/healthy'], resolve)
const healthList = resolve => require(['@/views/healthy/list'], resolve)
const allHealthList = resolve => require(['@/views/healthy/allList'], resolve)
const healthStatistics = resolve => require(['@/views/healthy/statistics'], resolve)
const healthDetail = resolve => require(['@/views/healthy/detail'], resolve)
// const healthy = resolve => require(['@/views/healthy/index'], resolve)
// 订餐
const orderingMeals = resolve => require(['@/views/ordering/index'], resolve)
const orderingList = resolve => require(['@/views/ordering/list'], resolve)
const routes = [{
  path: '/',
  component: Layout,
  children: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/qichacha',
      name: 'qichacha',
      component: qichacha
    },
    {
      path: '/attachDetail',
      name: 'attachDetail',
      component: attachDetail
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/fundperformance',
      name: 'fundperformance',
      component: Fundperformance
    },
    {
      path: '/Fundperdetail',
      name: 'Fundperdetail',
      component: Fundperdetail
    },
    {
      path: '/login-new',
      name: 'login',
      component: LoginNew
    },
    {
      path: '/meetingRoom',
      name: 'meetingRoom',
      component: MeetingRoom
    },
    {
      path: '/meetingList',
      name: 'meetingList',
      component: MeetingList,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/meetingNew',
      name: 'meetingNew',
      component: MeetingNew
    },
    {
      path: '/meetingDetail',
      name: 'meetingDetail',
      component: MeetingDetail
    },
    {
      path: '/projectProcessNew',
      name: 'projectProcessNew',
      component: ProjectProcessNew
    },
    {
      path: '/projectReply',
      name: 'projectReply',
      component: projectReply
    },
    {
      path: '/search',
      name: 'search',
      component: SearchList
    }, {
      path: '/newsDetail',
      name: 'newsDetail',
      component: NewsDetail
    },
    {
      path: '/newsList',
      name: 'newsList',
      component: NewsList,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/infoComment',
      name: 'infoComment',
      component: InfoComment
    },
    {
      path: '/newsComment',
      name: 'newsComment',
      component: NewsComment
    },
    {
      path: '/mySchedule',
      name: 'mySchedule',
      component: MySchedule
    },
    {
      path: '/scheduleNew',
      name: 'scheduleNew',
      component: ScheduleNew
    },
    {
      path: '/scheduleDetail',
      name: 'scheduleDetail',
      component: ScheduleDetail
    },
    {
      path: '/scheduleUserList',
      name: 'scheduleUserList',
      component: ScheduleUserList
    },
    {
      path: '/follow',
      name: 'follow',
      component: Follow
    },
    {
      path: '/scheduleFollowDetail',
      name: 'scheduleFollowDetail',
      component: ScheduleFollowDetail
    },
    // 签到
    {
      path: '/signInCode',
      name: 'signInCode',
      component: signCode
    },
    {
      path: '/myInitiation',
      name: 'myInitiation',
      component: myInitiation
    },
    {
      path: '/myJoin',
      name: 'myJoin',
      component: myJoin
    },
    {
      path: '/meetingInfo',
      name: 'meetingInfo',
      component: meetingInfo
    },
    {
      path: '/signInInfo',
      name: 'signInInfo',
      component: signInInfo
    },
    {
      path: '/signInResult',
      name: 'signInResult',
      component: signInResult
    },
    {
      path: '/it',
      name: 'it',
      component: it
    },
    {
      path: '/jobsList',
      name: 'jobsList',
      component: jobsList,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/jobsNew',
      name: 'jobsNew',
      component: jobsNew
    },
    {
      path: '/jobsDetail',
      name: 'jobsDetail',
      component: jobsDetail
    },
    {
      path: '/workFlowList',
      name: 'workFlowList',
      component: workFlowList,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/workFlowDetail',
      name: 'workFlowDetail',
      component: workFlowDetail
    },
    {
      path: '/workFlowNew',
      name: 'workFlowNew',
      component: workFlowNew
    },
    {
      path: '/resumeList',
      name: 'resumeList',
      component: resumeList,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/resumeNew',
      name: 'resumeNew',
      component: resumeNew
    },
    {
      path: '/resumeDetail',
      name: 'resumeDetail',
      component: resumeDetail
    },
    {
      path: '/memberResumeList',
      name: 'memberResumeList',
      component: memberResumeList,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/dismissList',
      name: 'dismissList',
      component: dismissList,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/dismissDetail',
      name: 'dismissDetail',
      component: dismissDetail
    },
    {
      path: '/applicationList',
      name: 'applicationList',
      component: applicationList,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/applicationDetail',
      name: 'applicationDetail',
      component: applicationDetail
    },
    // 基金
    {
      path: '/fundsList',
      name: 'fundsList',
      component: fundsList,
      meta: {
        keepAlive: true
      }
    }, {
      path: '/fund',
      name: 'fund',
      component: fund
    },
    {
      path: '/basicInfo',
      name: 'basicInfo',
      component: basicInfo
    }, {
      path: '/fundsInv',
      name: 'fundsInv',
      component: fundsInv
    }, {
      path: '/fundsContract',
      name: 'fundsContract',
      component: fundsContract
    }, {
      path: '/fundsAchieve',
      name: 'fundsAchieve',
      component: fundsAchieve
    }, {
      path: '/fundsReport',
      name: 'fundsReport',
      component: fundsReport
    }, {
      path: '/fundsEmail',
      name: 'fundsEmail',
      component: fundsEmail,
      meta: {
        keepAlive: true
      }
    }, {
      path: '/fundsFolder',
      name: 'fundsFolder',
      component: fundsFolder
    }, {
      path: '/fundsEvalue',
      name: 'fundsEvalue',
      component: fundsEvalue
    }, {
      path: '/fundsTeam',
      name: 'fundsTeam',
      component: fundsTeam
    }, {
      path: '/fundsPayment',
      name: 'fundsPayment',
      component: fundsPayment
    }, {
      path: '/fundsMeetingRecordList',
      name: 'fundsMeetingRecordList',
      component: fundsMeetingRecordList,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/fundsMeetingRecordAdd',
      name: 'fundsMeetingRecordAdd',
      component: fundsMeetingRecordAdd
    }, {
      path: '/fundsMeetingRecordDetail',
      name: 'fundsMeetingRecordDetail',
      component: fundsMeetingRecordDetail
    },

    // 运营监控
    {
      path: '/fundPerformance',
      name: 'fundPerformance',
      component: fundPerformance
    },
    // 平台
    {
      path: 'platform',
      name: 'platform',
      component: platform,
      meta: {
        keepAlive: true
      }
    },
    {
      path: 'platformList',
      name: 'platformList',
      component: platformList
    },
    {
      path: 'personStructure',
      name: 'personStructure',
      component: personStructure
    },
    {
      path: 'invDecision',
      name: 'invDecision',
      component: invDecision
    },
    {
      path: 'invPay',
      name: 'invPay',
      component: invPay
    },
    {
      path: 'bizInfo',
      name: 'bizInfo',
      component: bizInfo
    },
    {
      path: 'bizRelated',
      name: 'bizRelated',
      component: bizRelated
    },
    {
      path: 'bizPlan',
      name: 'bizPlan',
      component: bizPlan
    },
    {
      path: 'platFunds',
      name: 'platFunds',
      component: platFunds
    },
    {
      path: 'platStatics',
      name: 'platStatics',
      component: platStatics
    },
    {
      path: 'platFiles',
      name: 'platFiles',
      component: platFiles
    },
    {
      path: 'platStaticsNotFinished',
      name: 'platStaticsNotFinished',
      component: platStaticsNotFinished
    },
    {
      path: 'platStaticsFinished',
      name: 'platStaticsFinished',
      component: platStaticsFinished
    },
    {
      path: 'keyPoint',
      name: 'keyPoint',
      component: keyPoint
    },
    {
      path: 'bizContract',
      name: 'bizContract',
      component: bizContract
    },
    {
      path: '/process',
      name: 'process',
      component: process
    },
    {
      path: '/processSetting',
      name: 'processSetting',
      component: processSetting
    },
    {
      path: '/processSettingNew',
      name: 'processSettingNew',
      component: processSettingNew
    },
    {
      path: '/processDetail',
      name: 'processDetail',
      component: processDetail
    },
    {
      path: '/knowledgeList',
      name: 'knowledgeList',
      component: knowledgeList,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/knowledgeDetail',
      name: 'knowledgeDetail',
      component: knowledgeDetail
    },
    {
      path: '/knowledgeComment',
      name: 'knowledgeComment',
      component: knowledgeComment
    },
    {
      path: '/customerList',
      name: 'customerList',
      component: customerList,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/customerDetail',
      name: 'customerDetail',
      component: customerDetail
    },
    {
      path: '/messageList',
      name: 'messageList',
      component: messageList,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/messageDetail',
      name: 'messageDetail',
      component: messageDetail
    },
    {
      path: '/leaveApply',
      name: 'leaveApply',
      component: LeaveApply
    },
    {
      path: '/leaveAdd',
      name: 'leaveAdd',
      component: LeaveAdd
    },
    // 项目
    {
      path: '/projectXm',
      name: 'projectXm',
      component: Project
    },
    {
      path: '/projectNew',
      name: 'projectNew',
      component: ProjectNew
    },
    {
      path: '/projectDetail',
      name: 'projectDetail',
      component: ProjectDetail
    },
    {
      path: '/projectDetailBusiness',
      name: 'projectDetailBusiness',
      component: ProjectDetailBusiness
    },
    {
      path: '/projectBasicInfo',
      name: 'projectBasicInfo',
      component: ProjectBasicInfo
    },
    {
      path: '/projectChangeRecord',
      name: 'projectChangeRecord',
      component: ProjectChangeRecord
    },
    {
      path: '/projectFinancing',
      name: 'projectFinancing',
      component: ProjectFinancing
    },
    {
      path: '/projectAssess',
      name: 'projectAssess',
      component: ProjectAssess
    },
    {
      path: '/projectMoney',
      name: 'projectMoney',
      component: ProjectMoney
    },
    {
      path: '/projectContract',
      name: 'projectContract',
      component: ProjectContract
    },
    {
      path: '/projectImportant',
      name: 'projectImportant',
      component: ProjectImportant
    },
    {
      path: '/projectList',
      name: 'projectList',
      component: ProjectList
    },
    {
      path: '/projectCash',
      name: 'projectCash',
      component: ProjectCash
    },
    {
      path: '/projectEmail',
      name: 'projectEmail',
      component: ProjectEmail
    },
    {
      path: '/projectEmailDetail',
      name: 'projectEmailDetail',
      component: ProjectEmailDetail
    },
    {
      path: '/projectFile',
      name: 'projectFile',
      component: ProjectFile
    },
    {
      path: '/projectIndex',
      name: 'projectIndex',
      component: ProjectXm
    },
    {
      path: '/projectXmDetail',
      name: 'projectXmDetail',
      component: ProjectXmDetail
    },
    {
      path: '/projectProgress',
      name: 'projectProgress',
      component: ProjectProgress
    },
    {
      path: '/projectXmProgress',
      name: 'projectXmProgress',
      component: ProjectXmProgress
    },
    {
      path: '/projectHomeProcessNew',
      name: 'projectHomeProcessNew',
      component: ProjectHomeProcessNew
    },
    {
      path: '/projectHomeProcessNew1',
      name: 'projectHomeProcessNew1',
      component: ProjectHomeProcessNew1
    },
    {
      path: '/projectHomeProcessNew2',
      name: 'projectHomeProcessNew2',
      component: ProjectHomeProcessNew2
    },
    {
      path: '/projectCommunity',
      name: 'projectCommunity',
      component: ProjectCommunity
    },
    {
      path: '/projectCommunityDetail',
      name: 'projectCommunityDetail',
      component: ProjectCommunityDetail
    },
    // 会议记录
    {
      path: '/meetingRecordList',
      name: 'meetingRecordList',
      component: meetingRecordList,
      meta: {
        keepAlive: true
      }
    },
    // 会议记录详细
    {
      path: '/meetingRecordDetail',
      name: 'meetingRecordDetail',
      component: meetingRecordDetail
    },
    // 会议记录新增
    {
      path: '/meetingRecordAdd',
      name: 'meetingRecordAdd',
      component: meetingRecordAdd
    },
    // 来访接待
    {
      path: '/visitList',
      name: 'visitList',
      component: visitList,
      meta: {
        keepAlive: true
      }
    },
    // 来访接待详情
    {
      path: '/visitDetail',
      name: 'visitDetail',
      component: visitDetail
    },
    // 来访接待新增编辑
    {
      path: '/visitAdd',
      name: 'visitAdd',
      component: visitAdd
    },
    // 子基金
    {
      path: '/subFoudsList',
      name: 'subFoudsList',
      component: subFoudsList,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/subFundsInv',
      name: 'subFoudsInv',
      component: subFundsInv
    }, {
      path: '/subfund',
      name: 'subfund',
      component: subfund
    }, {
      path: '/subfundCash',
      name: 'subfundCash',
      component: subfundCash
    }, {
      path: '/subfundPrj',
      name: 'subfundPrj',
      component: subfundPrj
    }, {
      path: '/subfundFiles',
      name: 'subfundFiles',
      component: subfundFiles
    },
    {
      path: '/healthy',
      name: 'healthy',
      component: healthy
    },
    {
      path: '/healthList',
      name: 'healthList',
      component: healthList
    },
    {
      path: '/allHealthList',
      name: 'allHealthList',
      component: allHealthList
    },
    {
      path: '/healthStatistics',
      name: 'healthStatistics',
      component: healthStatistics
    },
    {
      path: '/healthDetail',
      name: 'healthDetail',
      component: healthDetail
    },
    {
      path: '/orderingMeals',
      name: 'orderingMeals',
      component: orderingMeals
    },
    {
      path: '/orderingList',
      name: 'orderingList',
      component: orderingList
    }
  ]
}]
export default routes

