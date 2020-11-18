<template>
  <div id="Knowledge" class="newsarticle has-comment">
    <headerx :cat-title="catTitle"/>
    <div class="comment-content no-comment">
      <div class="personDetail">
        <!--        个人信息-->
        <van-row class="person-wraper personInfo">
          <van-col span="10" class="person-img">
            <img :src="photoUrl" alt="">
          </van-col>
          <van-col span="17" class="person-info">
<!--            <p><span class="bigColor">{{ list.PersonalInfo.name | filterValue }}</span>{{ list.PersonalInfo.emergencyCompany || '&#45;&#45;' }} | {{ list.PersonalInfo.emergencyPost | filterValue }} </p>-->
            <p><span class="bigColor">{{ list.PersonalInfo.name | filterValue }}</span></p>
<!--            <p>{{ list.PersonalInfo.birthProvinceName | filterValue }} <em class="vertical-line">|</em> {{ list.PersonalInfo.birthCityName | filterValue }} <em class="vertical-line">|</em> 初始工作日期: {{ filterDate(list.PersonalInfo.firstJobDate) | filterValue }}</p>-->
            <p>{{ list.PersonalInfo.sexName | filterValue }} <em class="vertical-line">|</em> {{ filterDate(list.PersonalInfo.birthday) | filterValue }} <em class="vertical-line">|</em> {{ list.PersonalInfo.birthProvinceName | filterValue }}{{ list.PersonalInfo.birthCityName | filterValue }} <em class="vertical-line">|</em> {{ list.PersonalInfo.marriageName }}{{ list.PersonalInfo.procreateName }}</p>
            <p>{{ list.PersonalInfo.politicsStatusName | filterValue }} <em class="vertical-line">|</em> {{ list.PersonalInfo.highestAcademicName | filterValue }} <em class="vertical-line">|</em> {{ list.PersonalInfo.highestDegreeName }}</p>
<!--            <van-col span="24" class="person-zyname">-->
<!--              <span>{{ list.PersonalInfo.highestAcademicName }}</span>-->
<!--              <span>{{ list.PersonalInfo.highestDegreeName }}</span>-->
<!--              <span>{{ list.PersonalInfo.marriageName }}</span>-->
<!--              <span>{{ list.PersonalInfo.procreateName }}</span>-->
<!--            </van-col>-->
          </van-col>
<!--          <van-col span="24">-->
<!--            <p :style="{backgroundImage:'url('+require('@/assets/images/icon/resume-info.png')+')'}" class="resumeBg">{{ list.PersonalInfo.birthday | filterValue }} &nbsp;| {{ list.PersonalInfo.sexName | filterValue }} <em class="vertical-line">&nbsp;|</em> {{ list.PersonalInfo.highestAcademicName | filterValue }}</p>-->
<!--          </van-col>-->
          <van-col span="24">
            <span :style="{backgroundImage:'url('+require('@/assets/images/icon/resume-phone.png')+')'}" class="resumeBg resumePhone">{{ list.PersonalInfo.mobilePhoneNo | filterValue }}</span>
            <span :style="{backgroundImage:'url('+require('@/assets/images/icon/resume-email.png')+')'}" class="resumeBg resumeEmail">{{ list.PersonalInfo.email | filterValue }}</span>
          </van-col>
          <van-col span="24">
            <span :style="{backgroundImage:'url('+require('@/assets/images/schedule/address.png')+')'}" class="resumeBg resumeAdd">{{ list.PersonalInfo.currentAddrProvinceName }} {{ list.PersonalInfo.currentAddrCityName }} {{ list.PersonalInfo.currentAddrDetail | filterValue }}</span>
          </van-col>
        </van-row>
        <!--        简历编号信息-->
        <van-row class="person-wraper personResumeInfo">
          <span>{{ list.ApplicantInfo.channelTypeName || '' }}</span>
          <van-col span="12">
            <p>应聘公司 <span>{{ list.ApplicantInfo.companyName || '--' }}</span> </p>
            <p>应聘岗位 <span>{{ list.ApplicantInfo.post || '--' }}</span></p>
          </van-col>
          <van-col span="12">
            <p>填写时间 <span>{{ filterDate(list.ApplicantInfo.commitDt) || '--' }}</span> </p>
            <p>最快入职时间 <span>{{ filterDate(list.ApplicantInfo.entryDate) || '--' }}</span></p>
          </van-col>
          <van-col span="12">
            <p>期望年薪(万元) <span>{{ list.ApplicantInfo.expectAnnualSalary || '--' }} 至 {{ list.ApplicantInfo.expectAnnualSalary2 }}</span></p>
          </van-col>
          <van-col span="12">
            <p>渠道 <span>{{ list.ApplicantInfo.channelDesc || '--' }}</span></p>
          </van-col>
        </van-row>
        <!--        家庭成员-->
        <van-row  class="person-wraper edcInfo socInfo">
          <van-col span="24" class="title bf-6">家庭成员情况 <span v-if="!list.FamilyInfoList.length>0">(无)</span></van-col>
          <van-row v-if="list.FamilyInfoList.length>0">
            <van-col v-for="(item, index) in list.FamilyInfoList" :key="index" span="24" class="family-member">
              <p class="first-child">
                <span>{{ item.name | filterValue }}</span>
                <span>{{ item.relationName | filterValue }}</span>
                <span>{{ filterDate(item.birthDate) | filterValue }}</span>
                <span>{{ item.phone || '--' }}</span>
              </p>
              <p v-if="item.job || item.address">{{ item.jobCompany | filterValue }} | {{ item.post | filterValue }}</p>
            </van-col>
          </van-row>
        </van-row>
        <!--        教育背景-->
        <van-row id="educational-background" class="person-wraper edcInfo">
          <van-col span="24"  class="title bf-6">教育背景 <span v-if="!(list.EducationInfoList.length>0 && list.EducationMajorList.length>0)">(无)</span></van-col>
          <van-row v-if="list.EducationInfoList.length>0 && list.EducationMajorList.length>0">
            <van-col v-for="(item, index) in list.EducationInfoList" :key="index" span="24" class="edc_cicon educational-background">
              <van-icon :style="{backgroundImage:'url('+require('@/assets/images/schedule/red-dian.png')+')'}" class="cicon"/>
              <p class="first-child">
                <span> {{ filterDate(item.educationStart) | filterValue }} - {{ filterDate(item.educationEnd) | filterValue }} </span>
                <span class="title"> {{ item.educationStageName | filterValue }}</span>
              </p>
              <div class="edcLabels">
                <span> {{ item.educationTypeName | filterValue }}</span>
                <span> 班前{{ item.certificateName | filterValue }}</span>
              </div>
              <p>
                <span>{{ item.graduatedUniversity }}</span>
                <span>{{ item.college | filterValue }}</span>
                {{ item.educationMajor | filterValue }}
              </p>
              <p class="EducationMajorListNew" v-if="item.educationStage == itemMajor.educationStage" v-for="(itemMajor, indexMajor) in list.EducationMajorList" :key="indexMajor">
                <span v-if="itemMajor.educationStageName"> {{ itemMajor.educationStageName }}</span>
                <span v-if="itemMajor.isObtainDiplomaName=='是'">学历证书</span>
                <span v-if="itemMajor.isObtainDegreeName=='是'">学位证书</span>
                <span v-if="itemMajor.gpa && itemMajor.gpa2" class="gpa">GPA {{ itemMajor.gpa }}/{{ itemMajor.gpa2 }}</span>
                <em>
                  <i v-if="itemMajor.coreCourse">{{ itemMajor.coreCourse }} （ 核心课程 ）</i>
                  <i v-if="itemMajor.thesisTopics">{{ '《' + itemMajor.thesisTopics + '》' | filterValue }}</i>
                </em>
              </p>
            </van-col>
            <!--        专业情况-->
<!--            <van-row style="margin:0px!important;border-bottom: none;padding-bottom: 0;"  id="EducationMajorList" class="person-wraper edcInfo">-->
<!--&lt;!&ndash;              <van-col span="24" class="title">专业情况</van-col>&ndash;&gt;-->
<!--              <van-row >-->
<!--                <van-col v-for="(item, index) in list.EducationMajorList" :key="index" class="EducationMajorList" span="24">-->
<!--                  <van-icon :style="{backgroundImage:'url('+require('@/assets/images/schedule/red-dian.png')+')'}" class="cicon"/>-->
<!--                  <p class="first-child"> &lt;!&ndash; <span class="title">学历</span> &ndash;&gt;-->
<!--                    <span v-if="item.educationStageName"> {{ item.educationStageName }}</span>-->
<!--                    <span v-if="item.isObtainDiplomaName=='是'">学历证书</span>-->
<!--                    <span v-if="item.isObtainDegreeName=='是'">学位证书</span>-->
<!--                    <span v-if="item.gpa && item.gpa2" class="gpa">GPA {{ item.gpa }}/{{ item.gpa2 }}</span>-->
<!--                    <em>-->
<!--                      <i v-if="item.coreCourse">{{ item.coreCourse }} （ 核心课程 ）</i>-->
<!--                      <i v-if="item.thesisTopics">{{ '《' + item.thesisTopics + '》' | filterValue }}</i>-->
<!--                    </em>-->
<!--                  </p>-->
<!--                  &lt;!&ndash; <p class="first-child"> <span class="title">获得学历证书</span> <span> {{ item.isObtainDiplomaName }}</span></p> &ndash;&gt;-->
<!--                  &lt;!&ndash; <p class="first-child"> <span class="title">获得学位证书</span> <span> {{ item.isObtainDegreeName }}</span></p> &ndash;&gt;-->
<!--                  &lt;!&ndash; <p class="first-child thesisTopics"> <span class="title">核心课程</span> <span> {{ item.coreCourse }}</span></p> &ndash;&gt;-->
<!--                  &lt;!&ndash; <p class="first-child thesisTopics"> <span class="title">毕业论文题目</span> <span> {{ item.thesisTopics }}</span></p> &ndash;&gt;-->
<!--                  &lt;!&ndash; <p class="first-child"> <span class="title">GPA</span> <span> {{ item.gpa }}/{{ item.gpa2 }}</span></p> &ndash;&gt;-->
<!--                </van-col>-->
<!--              </van-row>-->
<!--            </van-row>-->
          </van-row>

        </van-row>

        <!--        校园任职-->
        <van-row  class="person-wraper edcInfo">
          <van-col span="24" class="title bf-6">校园任职 <span v-if="!list.CampusPostList.length>0">(无)</span></van-col>
          <van-row v-if="list.CampusPostList.length>0">
            <van-col v-for="(item, index) in list.CampusPostList" :key="index" class="CampusPostList" span="24">
              <van-icon :style="{backgroundImage:'url('+require('@/assets/images/schedule/red-dian.png')+')'}" class="cicon"/>
              <p class="first-child">
                <span> {{ filterDate(item.startDate) | filterValue }} - {{ filterDate(item.endDate) | filterValue }} </span>
                <span class="title"> {{ item.orgNameDisplay | filterValue }}</span>
                <span class="orgLevelName" style="color:rgba(3,170,74,1)!important">{{ item.orgLevelName | filterValue }}</span>
              </p>
              <p><span>{{ item.deptName | filterValue }}</span>{{ item.post | filterValue }}</p>
            </van-col>
          </van-row>
        </van-row>
        <!--        在校荣誉-->
        <van-row  class="person-wraper edcInfo">
          <van-col span="24" class="title bf-6">在校荣誉 <span v-if="!list.CampusAwardListType1.length>0"> (无)</span></van-col>
          <van-row v-if="list.CampusAwardListType1.length>0">
            <van-col v-for="(item, index) in list.CampusAwardListType1" :key="index" class="CampusPostList" span="24">
              <van-icon :style="{backgroundImage:'url('+require('@/assets/images/schedule/red-dian.png')+')'}" class="cicon"/>
              <p class="first-child"> <span> {{ filterDate(item.obtainDate) | filterValue }}</span> <span style="color:#4c4c4c!important" class="title honorTitle"> {{ item.issueAuthority | filterValue }} </span></p>
              <p><span>{{ item.honourContent | filterValue }}</span></p>
            </van-col>
          </van-row>
        </van-row>
        <!--        学术成果-->
        <van-row  class="person-wraper edcInfo">
          <van-col span="24" class="title bf-6">学术成果<span v-if="!list.CampusAwardListType2.length>0"> (无)</span></van-col>
          <van-row v-if="list.CampusAwardListType2.length>0">
            <van-col v-for="(item, index) in list.CampusAwardListType2" :key="index" class="CampusPostList academic-achievements" span="24">
              <van-icon :style="{backgroundImage:'url('+require('@/assets/images/schedule/red-dian.png')+')'}" class="cicon"/>
              <p class="first-child"><span> {{ filterDate(item.obtainDate) }}</span> <span class="title" style="color:#4c4c4c!important;width:60%!important"> {{ item.honourContent }}</span> </p>
              <p class="first-child"> <span v-if="item.issueAuthority"> {{ '《' + item.issueAuthority + '》' | filterValue }}</span></p>
            </van-col>
          </van-row>
        </van-row>
        <!--        工作经历-->
        <van-row  id="work-experience" class="person-wraper edcInfo">
          <van-col span="24" class="title bf-6">工作经历<span v-if="!list.WorkExperienceList.length>0"> (无)</span></van-col>
          <van-row v-if="list.WorkExperienceList.length>0">
            <van-col v-for="(item, index) in list.WorkExperienceList" :key="index" span="24" class="work-experience">
              <van-icon :style="{backgroundImage:'url('+require('@/assets/images/schedule/red-dian.png')+')'}" class="cicon"/>
              <p class="first-child"> <span> {{ filterDate(item.startDate) | filterValue }} - {{ filterDate(item.endDate) | filterValue }} </span><span class="title workTitle"> {{ item.companyName | filterValue }}</span></p>
              <p class="first-child labelsWorks"> <span class="labelsWork"> {{ item.deptName | filterValue }} </span><span class="labelsWork"> {{ item.post | filterValue }}</span><span class="labelsWork"> {{ item.annualSalary | filterValue }}万元 </span></p>
              <p class="first-child"> <span class="title">向上汇报</span> <span> {{ item.upperPosition | filterValue }}</span></p>
              <p class="first-child thesisTopics"> <span class="title">证明人及电话</span> <span> {{ item.witness | filterValue }}/{{ item.witnessPhoneNo | filterValue }}</span></p>
              <p class="thesisTopics"><span class="title">突出业绩</span><span class="spanColor">
                <!-- <span v-if="item.outstandingPerform.length<20">{{ item.outstandingPerform || '--' }}</span> -->
                <span v-if="item.outstandingPerform&&item.outstandingPerform.length<50">
                  {{ item.outstandingPerform||'--' }}
                </span>
                <span v-else>
                  <span v-show="!showAll">
                    {{ item.outstandingPerform.substring(0, 48) + '...' }}
                    <i
                      v-if="item.outstandingPerform.length>50"
                      class="active-money active-text"
                      @click="toggleAll"
                    >
                      展开
                    </i>
                  </span>
                  <span v-show="showAll">
                    {{ item.outstandingPerform }}
                    <i
                      v-if="item.outstandingPerform.length>50"
                      class="active-money active-text"
                      @click="toggleAll"
                    >
                      收起
                    </i>
                  </span>
                </span>
              </span></p>

              <p class="thesisTopics"><span class="title">离职原因</span>
                <span class="spanColor">
                  <span v-if="item.leavingReason&&item.leavingReason.length<50">
                    {{ item.leavingReason||'--' }}
                  </span>
                  <span v-else>
                    <span v-show="!showAll1">
                      {{ item.leavingReason.substring(0, 48) + '...' }}
                      <i
                        v-if="item.leavingReason.length>50"
                        class="active-money active-text"
                        @click="toggleAll1"
                      >
                        展开
                      </i>
                    </span>
                    <span v-show="showAll1">
                      {{ item.leavingReason }}
                      <i
                        v-if="item.leavingReason.length>50"
                        class="active-money active-text"
                        @click="toggleAll1"
                      >
                        收起
                      </i>
                    </span>
                  </span>
              </span></p>
            </van-col>
          </van-row>
        </van-row>
        <!--        实习经历-->
        <van-row  class="person-wraper edcInfo">
          <van-col span="24" class="title bf-6">实习经历<span v-if="!list.PracticeExperienceList.length>0"> (无)</span></van-col>
          <van-row v-if="list.PracticeExperienceList.length>0">
            <van-col v-for="(item, index) in list.PracticeExperienceList" :key="index" span="24" class="work-experience">
              <van-icon :style="{backgroundImage:'url('+require('@/assets/images/schedule/red-dian.png')+')'}" class="cicon"/>
              <p class="first-child">  <span> {{ filterDate(item.startDate) | filterValue }} - {{ filterDate(item.endDate) | filterValue }} </span><span class="title workTitle"> {{ item.companyName | filterValue }}</span></p>
              <p class="first-child"> <span class="title">职位</span> <span> {{ item.post | filterValue }}</span></p>
              <p class="first-child"> <span class="title">证明人及电话</span> <span> {{ item.witness | filterValue }}/{{ item.witnessPhoneNo | filterValue }}</span></p>
            </van-col>
          </van-row>
        </van-row>
        <!--        资格证书-->
        <van-row  class="person-wraper edcInfo">
          <van-col span="24" class="title bf-6">资格证书 <span v-if="!list.QualificationList.length>0"> (无)</span></van-col>
          <van-row v-if="list.QualificationList.length>0">
            <van-col v-for="(item, index) in list.QualificationList" :key="index" class="QualificationList" span="24">
              <van-icon :style="{backgroundImage:'url('+require('@/assets/images/schedule/red-dian.png')+')'}" class="cicon"/>
              <p class="first-child">
                <span> {{ filterDate(item.certificateDate) | filterValue }}</span>
                <span class="title" style="color:#4c4c4c!important" v-if="item.certificateName"> {{ '《'+item.certificateName+'》' | filterValue }}</span>
                <span class="title" style="color:#4c4c4c!important" v-else> {{ item.certificateName | filterValue }}</span>
              </p>
              <p class="first-child">
                <span> {{ item.rank | filterValue }}</span>
                <span> {{ item.issueAuthority | filterValue }}</span>
              </p>
              <!-- <p class="first-child thesisTopics"> <span class="title">证书名称(职称/资质/外语等最高认证)</span> <span> {{ item.certificateName | filterValue }}</span></p> -->
              <!-- <p class="first-child"> <span class="title">获得年月</span> <span> {{ item.certificateDate | filterValue }}</span></p> -->
              <!-- <p class="first-child thesisTopics"> <span class="title">颁发机构</span> <span> {{ item.issueAuthority | filterValue }}</span></p> -->
              <!-- <p class="first-child thesisTopics"> <span class="title">分数/等级</span> <span> {{ item.rank | filterValue }}</span></p> -->
            </van-col>
          </van-row>
        </van-row>
        <!--        培训经历-->
        <van-row  class="person-wraper edcInfo">
          <van-col span="24" class="title bf-6">培训经历<span v-if="!list.TrainingExperienceList.length>0"> (无)</span></van-col>
          <van-row v-if="list.TrainingExperienceList.length>0">
            <van-col v-for="(item, index) in list.TrainingExperienceList" :key="index" class="QualificationList" span="24">
              <van-icon :style="{backgroundImage:'url('+require('@/assets/images/schedule/red-dian.png')+')'}" class="cicon"/>
              <p class="first-child">
                <span> {{ filterDate(item.trainingStart) | filterValue }}-{{ filterDate(item.trainingEnd) | filterValue }}</span>
                <span class="title titleWork" style="color:#4c4c4c!important"> {{ item.trainingAuthority | filterValue }}</span>
              </p>
              <p class="first-child">
                <span> {{ item.trainingContent | filterValue }}</span>
              </p>
              <!-- <p class="first-child thesisTopics"> <span class="title">培训机构</span> <span> {{ item.trainingAuthority | filterValue }}</span></p> -->
              <!-- <p class="first-child"> <span class="title">起止年月</span> <span> {{ item.trainingStart | filterValue }}-{{ item.trainingEnd | filterValue }}</span></p> -->
              <!-- <p class="first-child thesisTopics"> <span class="title">培训内容</span> <span> {{ item.trainingContent | filterValue }}</span></p> -->
            </van-col>
          </van-row>
        </van-row>
        <!--        其他情况-->
        <van-row  class="person-wraper edcInfo">
          <van-col span="24" class="title bf-6">其他情况 <span v-if="!list.OtherInformationList.length>0">(无)</span></van-col>
          <van-row v-if="list.OtherInformationList.length>0">
            <van-col v-for="(item, index) in list.OtherInformationList" :key="index" class="QualificationList other-situations" span="24">
              <van-icon :style="{backgroundImage:'url('+require('@/assets/images/schedule/red-dian.png')+')'}" class="cicon"/>
              <p v-for="(other, indexOther) in otherInformation" id="yesOrNo" :key="indexOther" class="first-child thesisTopics">
                <span class="title">{{ other.label }}</span> <span :class="{'no-span':item[other.value]!='是'}"> {{ item[other.value] || '否' }} </span>
              </p>
            </van-col>
          </van-row>
        </van-row>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  filters: {
    filterValue: function(val) {
      if (val) {
        return val
      } else {
        return '--'
      }
    }
  },
  data() {
    return {
      showAll: false,
      showAll1: false,
      catTitle: '人员信息',
      photoUrl: '',
      list: {
        CampusAwardListType1: [],
        CampusAwardListType2: []
      },
      otherInformation: [
        {
          label: '业余爱好',
          value: 'avocation'
        },
        {
          label: '个人优点',
          value: 'advantage'
        },
        {
          label: '个人不足',
          value: 'shortcoming'
        },
        {
          label: '3-5年职业规划',
          value: 'careerPlanning'
        },
        {
          label: '是否有竞业协议',
          value: 'careerPlanningName'
        },
        {
          label: '是否曾患重大疾病或接受过手术治疗',
          value: 'isOperationName'
        },
        {
          label: '是否曾因违法行为被通缉或劳动教养',
          value: 'isWantedName'
        },
        {
          label: '是否曾有过精神治疗史/吸毒史',
          value: 'isMentalOrDrugName'
        },
        {
          label: '是否曾因行为不当或工作失误被用人单位辞职',
          value: ' isFiredName'
        },
        {
          label: '是否有亲友在元禾控股及元禾系其他公司任职',
          value: 'isRelativesYhName'
        },
        {
          label: '是否曾应聘过元禾控股及元禾系其他公司岗位',
          value: 'isApplyYhName'
        },
        {
          label: '是否与区内机关、企事业单位领导干部有直系亲属关系',
          value: 'isUnitFamilyName'
        }
      ]
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    /* isToggleAll(status, content) {
      return (status, content) => {
        if (content && content.length > 20) {
          content = content.substring(0, 18) + '...'
        } else {
          content = '--'
        }
        return content
      }
    }, */
    toggleAll() {
      this.showAll = !this.showAll
    },
    toggleAll1() {
      this.showAll1 = !this.showAll1
    },
    filterImg: function(val) {
      if (val && val != '') {
        return val.substring(val.length - 1, val.length)
      }
    },
    filterDate: function(val) {
      if (val) {
        if (val.length > 7) {
          return val.substring(0, val.length - 3).replace(/-/g, '/')
        } else {
          return val.replace(/-/g, '/')
        }
      } else {
        return '无'
      }
    },
    getDetail() {
      // 头像
      this.$axios.get(
        '/aiPersonalPhotoAction/getPhoto.do',
        { bpiId: this.$route.query.id },
        res => {
          if (res.dataContent.photoUrl != '') {
            this.photoUrl = res.dataContent.photoUrl
          } else if (res.dataContent.photoBlob != '') {
            const photoBlob = 'data:image/jpeg;base64,' + encodeURI(res.dataContent.photoBlob)
            this.photoUrl = photoBlob
          }
          // this.$set(this.list, 'ApplicantInfo', res.data)
        }
      )
      // 简历基本信息
      this.$axios.get(
        '/BPI/ApplicantInfo/',
        { bpiID: this.$route.query.id, interviewDate: this.$route.query.interviewDate, length: 20000, currPage: 1 },
        res => {
          this.$set(this.list, 'ApplicantInfo', res.data)
        }
      )
      // 个人基本信息
      this.$axios.get(
        '/BPI/PersonalInfo/' + this.$route.query.no,
        { length: 20000, currPage: 1 },
        res => {
          this.$set(this.list, 'PersonalInfo', res.data)
          console.log(this.list)
        }
      )
      const urlList = [
        'FamilyInfoList', // 家庭信息
        'EducationInfoList', // 教育信息
        'EducationMajorList', // 专业情况
        'CampusPostList', // 校园任职
        'CampusAwardList', // 在校荣誉
        'WorkExperienceList', // 往期工作信息
        'PracticeExperienceList', // 实习经历
        'QualificationList', // 资格证书
        'OtherInformationList', // 其他信息
        'TrainingExperienceList' // 培训
      ]
      urlList.map(item => {
        this.$axios.get(
          '/BPI/' + item,
          { bpiId: this.$route.query.id, length: 20000, currPage: 1 },
          res => {
            this.$set(this.list, item, res.data)
            if (item === 'CampusAwardList') {
              this.list.CampusAwardList.map(houner => {
                if (houner.honourType == '1') {
                  this.list.CampusAwardListType1.push(houner)
                  // this.$set(this.list, 'CampusAwardListType1', houner)
                } else if (houner.honourType == '2') {
                  this.list.CampusAwardListType2.push(houner)

                  // this.$set(this.list, 'CampusAwardListType2', houner)
                }
              })
            }
            console.log(this.list)
          }
        )
      })
    }
  }
}
</script>
<style scoped lang="scss">
  .comment-content{
    background-color:#fff;
  }
  .personDetail{
    font-size:25px;
    font-family:PingFangSC-Medium,PingFang SC;
    font-weight:500;
    color:rgba(86,97,101,1);
    line-height:28px;

    .person-wraper{
      margin:0 40px;
      padding:40px 0
    }
    .personResumeInfo{
      position: relative;
      border-bottom:18px solid rgba(248,248,248,1);
      margin:0px;
      padding:40px;
      padding-bottom:5px;
      >span{
        font-size:24px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(237,125,17,1);
        line-height:33px;
        padding:3px 8px;
        background:rgba(248,141,38,0.14);
        position: absolute;
        right:40px;
      }
      p{
        margin-bottom:35px;
        font-size:25px;
        font-family:PingFangSC-Medium,PingFang SC;
        font-weight:500;
        color:rgba(158,158,157,1);
        line-height:33px;
        span{
          display: block;
          font-size:26px;
          font-family:PingFangSC-Medium,PingFang SC;
          font-weight:500;
          color:rgba(76,76,76,1);
          line-height:40px;
          padding-top:7px
        }
      }
    }
    .personInfo{
      border-bottom: 2px solid rgba(240,240,240,1);
      .person-img{
        margin-right:30px;
        width:160px;
        height:160px;
        // margin-top:-10px;
        margin-bottom: 40px;
        img{
          width:160px;
          height:160px;
          border-radius: 50%;
        }
        div{
          width:160px;
          height:160px;
          border-radius: 50%;
          text-align: center;
          line-height: 160px;
          font-size:34px;
          color:#15191A

        }
      }
      .person-info{
        margin-bottom:20px;
        p:first-child{
          // height:37px;
          font-size:26px;
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(21,25,26,1);
          line-height:37px;
          margin-bottom: 10px;
          margin-top: 14px;
          span.bigColor{
            font-size:30px;
            // height:42px;
            font-family:PingFangSC-Medium,PingFang SC;
            font-weight:500;
            color:rgba(21,25,26,1);
            line-height:42px;
            margin-right:24px;
          }
        }

      }
      p{
        margin-bottom:20px;
        // height:28px;
        font-size:26px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(158,158,157,1);
        line-height:28px;
        letter-spacing: 0.31px;
      }
      .resumeBg{
        background-repeat: no-repeat;
        background-size:19px 20px;
        padding-left:29px;
        background-position-y: center;
        margin-bottom: 10px;
        display: inline-block;
        height:28px;
        font-size:26px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(86,97,101,1);
        line-height:28px;
        margin-bottom: 18px;
      }
      .resumeBg.resumePhone{
        background-size:15px 20px;
        padding-right:35px;
        border-right:1px solid #4c4c4c;
      }
      .resumeBg.resumeEmail{
        background-size:19px 16px;
        margin-left:30px;
      }
      .resumeBg.resumeAdd{
        background-size:15px 20px;
        padding-right:35px;
        border-right:none;
      }
    }
    .person-zyname{
      font-size:22px;
      margin-bottom:6px;
      span{
        padding:5px 8px;
        margin-right:14px;
        // margin-bottom:14px;
        display: inline-block;
        text-align: center;
        font-weight: 400;
      }
      span:nth-of-type(3n+1){
        color:#03AA4A;
        background-color:rgba(58,204,120,0.23);
      }
      span:nth-of-type(3n+2){
        color:#E89E00;
        background-color:rgba(248,187,57,0.23);
      }
      span:nth-of-type(3n+3){
        color:#3195FC;
        background-color:rgba(49,149,252,0.23);
      }
    }
    .edcInfo{
      border-bottom: 2px solid rgba(240,240,240,1);
      .van-row{
        .van-col{
          padding-bottom:20px;
          position: relative;
          border-left:2px solid #e5e5e5;
          &:nth-last-of-type(1){
            border-left: 0;
          }
          .cicon{
            width:38px;
            height:38px;
            background-size:100% 100%;
            position: absolute;
            top:-10px;
            left:-19px
          }
          p{
            padding-bottom:10px;
            padding-left:28px;
            line-height: 40px;
            color:#4C4C4C;
          }
          p.first-child{
            display: flex;
            justify-content: space-between;
            margin-top:-10px;
            span:last-child{
              font-size:25px;
              color: #999998;
              font-family:PingFangSC-Medium,PingFang SC;
              font-weight:400;
              text-align: right;
              /*color:rgba(153,153,152,1);*/
              /*line-height:44px;*/
            }
          }
          /*两行显示*/
          p.thesisTopics{
            display: block;
            span:last-child{
              display: block;
              font-size:25px;
              font-family:PingFangSC-Medium,PingFang SC;
              font-weight:500;
              text-align: left;
              /*color:rgba(153,153,152,1);*/
              /*line-height:44px;*/
            }
          }
          p:nth-of-type(2){
            font-size:25px;
            font-family:PingFangSC-Medium,PingFang SC;
            font-weight:500;
            color:rgba(153,153,152,1);
            line-height:44px;
            span:first-child{
              margin-right:30px;
            }
          }
        }
        .van-col:first-child{
          margin-top:26px;
        }
        .van-col:last-child{
          padding-bottom:0;
          p:last-child{
            margin-bottom:0;
          }
        }
      }
    }
    .family-member{
      padding-top: 0 !important;
      padding-bottom: 0 !important;
      margin-top: 14px;
      p.first-child{
        display: block !important;
        margin-top: 0 !important;
        padding: 0 !important;
        text-align: right!important;
        position: relative;
      }
      span{
        display: inline-block;
        &:nth-of-type(1){
          font-size:25px;
          font-family:PingFangSC-Medium,PingFang SC;
          font-weight:500;
          color:rgba(76,76,76,1);
          line-height:37px;
          margin-right: 34px;
          margin-bottom: 15px;
          position: absolute;
          left:0
        }
        &:nth-of-type(2){
          font-size:25px;
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(3,170,74,1);
          line-height:30px;
          background:rgba(58,204,120,0.23);
          padding: 5px 8px;
          margin-right: 14px;
          margin-bottom: 15px;
        }
        &:nth-of-type(3){
          font-size:25px;
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:500;
          color:rgba(49,149,252,1);
          line-height:30px;
          background:rgba(49,149,252,0.23);
          padding: 5px 8px;
          margin-bottom: 15px;
        }
        &:nth-of-type(4){
          display: block;
          font-size:25px;
          font-family:PingFangSC-Medium,PingFang SC;
          font-weight:500;
          color:rgba(153,153,152,1);
          line-height:33px;
          text-align: left !important;
        }
      }
    }
    #educational-background,
    #EducationMajorList,
    #work-experience{
      .van-row .van-col{
        margin-top: 60px;
        &:nth-of-type(1){
          margin-top: 80px;
        }
        .cicon{
          margin-top: -38px;
        }
        p:nth-of-type(1){
          margin-top: -50px;
        }
      }
    }
    .edc_cicon{
      margin:15px 0!important;
      padding-bottom:0!important;
      .cicon{
        top:30px!important;
      }
    }
    .edc_cicon:first-child{
      margin-top:30px!important;
    }
    .educational-background{
      p:nth-of-type(1){
        display: inline-block !important;
        width:60% !important;
        .title{
          width: auto !important;
        }
        span{
          margin-right: 20px;
          &:nth-of-type(3){
            font-size:25px;
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(3,170,74,1);
            line-height:30px;
            padding: 5px 8px;
            background:rgba(58,204,120,0.23)
          }
          &:nth-of-type(4){
            font-size:25px;
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(232,158,0,1) !important;
            line-height:30px;
            padding: 5px 8px;
            background:rgba(248,187,57,0.23);
          }
          &:nth-of-type(4){
            margin-right: 0;
            float: right;
          }
        }
      }
      div.edcLabels{
        display: inline-block;
        position: absolute;
        top:0;
        right:0;
        span{
          margin-right: 10px;
          &:nth-of-type(1){
            font-size:25px;
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(3,170,74,1);
            line-height:30px;
            padding: 5px 8px;
            background:rgba(58,204,120,0.23)
          }
          &:nth-of-type(2){
            font-size:25px;
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(232,158,0,1) !important;
            line-height:30px;
            padding: 5px 8px;
            background:rgba(248,187,57,0.23);
          }
          &:nth-of-type(2){
            margin-right: 0;
            /*float: right;*/
          }
        }
      }
      p:nth-of-type(2){
        span{
          margin-right: 30px !important;
        }
      }
    }
    #educational-background{
      .van-row{
        >.educational-background{
          border-left:none;
          >.cicon{
           margin-top:-35px;
          }
          >p:nth-of-type(2){
            border-left:1px solid #e5e5e5;
          }
        }
      }
    }
    .EducationMajorList{
      p.first-child{
        display: block !important;
        span{
          margin-bottom: 13px;
          display: inline-block;
          &:nth-of-type(1){
            font-size:25px;
            font-family:PingFangSC-Medium,PingFang SC;
            font-weight:500;
            color:rgba(76,76,76,1);
            line-height:37px;
            margin-right: 34px;
          }
          &:not(:first-child){
            font-size:25px;
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(170,3,3,1);
            line-height:30px;
            background:rgba(204,58,58,0.23);
            padding: 5px 8px;
            margin-right: 15px;
          }
          &.gpa{
            font-size:25px;
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(184,114,245,1);
            line-height:30px;
            background:rgba(184,114,245,0.23);
            padding: 5px 8px;
          }
        }
        em{
          font-style: normal;
          display: block;
          i{
            font-style: normal;
            font-size:25px;
            font-family:PingFangSC-Medium,PingFang SC;
            font-weight:500;
            color:rgba(153,153,152,1);
            line-height:33px;
            &:nth-of-type(1){
              margin-right: 30px;
            }
          }
        }
      }
    }
    .academic-achievements{
      p.first-child{
        padding-bottom: 10px !important;
      }
    }
    .CampusPostList{
      padding-bottom: 12px !important;
      border-left:0 !important;
      i{
        display: none;
      }
      p{
        display: block !important;
        padding: 0 !important;
        .title{
          width: auto !important;
          font-size:25px;
          font-family:PingFangSC-Medium,PingFang SC;
          font-weight:500;
          color:rgba(76,76,76,1);
          line-height:37px;
        }
        .honorTitle{
          width:60% !important;
        }
        .orgLevelName{
          font-size:25px;
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(3,170,74,1);
          line-height:30px;
          background:rgba(58,204,120,0.23);
          padding: 5px 8px;
          margin-left: 36px;
        }
        &:nth-of-type(2){
          // margin-top: 15px;
          font-size:25px;
          font-family:PingFangSC-Medium,PingFang SC;
          font-weight:500;
          color:rgba(153,153,152,1);
          line-height:33px;
          span{
            font-size:25px;
            font-family:PingFangSC-Medium,PingFang SC;
            font-weight:500;
            color:rgba(153,153,152,1);
            line-height:33px;
          }
        }
        &:nth-of-type(1){
          span{
            &:nth-last-of-type(1){
              display: inline-block !important;
              text-align: right !important;
              float: right;
            }
          }
        }

      }
    }
    .work-experience{
      .active-text{
        font-style: normal;
        display: inline;
        color: #4a90e2!important;
      }
      p.first-child:nth-of-type(1){
        display: flex !important;
        .title{
          width: 60%;
        }
      }
      p.first-child{
        display: block !important;
        .title{
          display: block;
          width: 100%;
          font-size:25px;
          color:rgba(76,76,76,1);
        }
        span{
          line-height:44px;
          font-family:PingFangSC-Medium,PingFang SC;
          font-weight:500;
          &:nth-of-type(2){
            display: block;
            font-size:25px;
            color:rgba(153,153,152,1);
            text-align: left !important;
          }
        }
        span.title.workTitle{
          color:#4c4c4c!important;
          text-align: right!important;
          font-size: 25px!important;
          width:50% !important
        }
      }
      p.first-child.labelsWorks{
        span.labelsWork{
          padding:5px 8px!important;
          display: inline-block;
          margin-right:10px!important;
          text-align: center!important;
          line-height: 28px!important;
        }
        span.labelsWork:nth-of-type(3n+1){
          color:#03AA4A;
          background-color:rgba(58,204,120,0.23);
        }
        span.labelsWork:nth-of-type(3n+2){
          color:#E89E00;
          background-color:rgba(248,187,57,0.23);
        }
        span.labelsWork:nth-of-type(3n+3){
          color:#3195FC;
          background-color:rgba(49,149,252,0.23);
        }
      }
    }
    .QualificationList{
      padding-bottom: 12px !important;
      border-left:0 !important;
      i{
        display: none;
      }
      p{
        display: block !important;
        padding: 0 !important;
        margin-bottom: 10px;
        .title{
          font-size:25px;
          font-family:PingFangSC-Medium,PingFang SC;
          font-weight:500;
          color:rgba(76,76,76,1);
          line-height:37px;
        }

        &:nth-of-type(1){
          span{
            &:nth-last-of-type(1){
              display: inline-block !important;
              text-align: right !important;
              float: right;
            }
            &.title.workTitle{
              color:#4c4c4c!important;
              text-align: right!important;
              font-size: 25px!important;
              width:50% !important
            }
          }
        }
        &:nth-of-type(2){
          // margin-top: 15px;
          font-size:25px;
          font-family:PingFangSC-Medium,PingFang SC;
          font-weight:500;
          color:rgba(153,153,152,1);
          line-height:33px;
          span{
            font-size:25px;
            font-family:PingFangSC-Medium,PingFang SC;
            font-weight:500;
            color:rgba(153,153,152,1);
            line-height:33px;
          }
        }

      }
    }
    .QualificationList.other-situations{
      display: none;
      &:nth-of-type(1){
        display: block;
      }
      p.first-child.thesisTopics{
        display: block !important;
      }
      p:nth-of-type(1){
        span{
          display: block !important;
          width: 100%;
          &:nth-of-type(2){
            text-align: left !important;
            float: none !important;
          }
        }
        span.title.workTitle{
          color:#4c4c4c!important;
          text-align: right!important;
          font-size: 25px!important;
          width:50% !important
        }
      }
      p:nth-of-type(2){
        span{
          font-size:25px;
          font-family:PingFangSC-Medium,PingFang SC;
          font-weight:500;
          color:rgba(76,76,76,1);
          line-height:37px;
          &:nth-of-type(2){
            font-size:25px;
            font-family:PingFangSC-Medium,PingFang SC;
            font-weight:500;
            color:rgba(153,153,152,1);
            line-height:33px;
          }
        }
      }
      #yesOrNo{
        &:nth-of-type(5),
        &:nth-of-type(6),
        &:nth-of-type(7),
        &:nth-of-type(8),
        &:nth-of-type(9),
        &:nth-of-type(10),
        &:nth-of-type(11),
        &:nth-of-type(12){
          position: relative;
          margin-top: 0;
          span:nth-of-type(2){
            position: absolute;
            right: 0;
            top: 0;
            /*background:rgba(204,58,58,0.23);*/
            border:1px solid rgba(170,3,3,1);
            font-size:25px;
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(170,3,3,1);
            line-height:30px;
            padding: 5px 8px;
          }
          .no-span{
            background: #fff !important;
            color:#444444!important;
            border:1px solid #000 !important
          }
        }
      }
    }
    .socInfo{
      .van-col{
        border-left: none!important;
        p.first-child{
          font-size:25px!important;
          font-family: PingFangSC-Regular,PingFang SC;
          font-weight: 400;
          color: #4c4c4c!important;
        }

      }
      .van-col.bf-6{
        border-left:6px solid #B60005!important;
      }
      .van-col:not(:first-child){
        padding-top:20px;
        // border-top:1px solid #f0f0f0;
      }
    }
    .bigColor{
      font-size:30px;
      font-family:PingFangSC-Medium,PingFang SC;
      font-weight:500;
      color:rgba(21,25,26,1);
      line-height:42px;
    }
    .title{
      font-size:25px;
      font-family:PingFangSC-Medium,PingFang SC;
      font-weight:500;
      color:rgba(76,76,76,1);
      line-height:40px;
      width:60%;
    }
    .vertical-line{
      font-style: normal;
      font-size: 20px;
      font-weight: bold;
      line-height: 28px;
      vertical-align: bottom;
      font-family:PingFangSC-Regular,PingFang SC;
    }
  }
  .spanColor{
    color:#999998;
  }
.bf-6{
  border-left:6px solid #B60005;
  font-size: 28px;
  padding-left:20px;
  line-height: inherit!important;
}
  p.EducationMajorListNew{
    display: block !important;
    span{
      margin-bottom: 13px;
      display: inline-block;
      &:nth-of-type(1){
        font-size:25px;
        font-family:PingFangSC-Medium,PingFang SC;
        font-weight:500;
        color:rgba(76,76,76,1);
        line-height:37px;
        margin-right: 34px;
      }
      &:not(:first-child){
        font-size:25px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(170,3,3,1);
        line-height:30px;
        background:rgba(204,58,58,0.23);
        padding: 5px 8px;
        margin-right: 15px;
      }
      &.gpa{
        font-size:25px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(184,114,245,1);
        line-height:30px;
        background:rgba(184,114,245,0.23);
        padding: 5px 8px;
      }
    }
    em{
      font-style: normal;
      display: block;
      i{
        font-style: normal;
        font-size:25px;
        font-family:PingFangSC-Medium,PingFang SC;
        font-weight:500;
        color:rgba(153,153,152,1);
        line-height:33px;
        &:nth-of-type(1){
          margin-right: 30px;
        }
      }
    }
  }
</style>
