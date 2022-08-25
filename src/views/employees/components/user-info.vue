<template>
  <div class="app-container">
    <!-- 个人信息 -->
    <el-form ref="fm" label-width="100px" :model="userInfo" :rules="rules">
      <!--手机 聘用形式  -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="部门" prop="departmentName">
            <el-input v-model="userInfo.departmentName" />
          </el-form-item>
        </el-col>
      </el-row>
      <!--手机 聘用形式  -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="userInfo.mobile" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 工号 入职时间 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="入职时间" prop="timeOfEntry">
            <el-date-picker
              v-model="userInfo.timeOfEntry"
              type="date"
              class="inputW"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 员工照片 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="员工头像">
            <!-- 放置上传图片 -->
            <!-- <el-image :src="require('@/assets/common/head.jpg')"></el-image> -->
            <UploadImg :staff-photo.sync="userInfo.staffPhoto" />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 保存个人信息 -->
      <el-row class="inline-info" type="flex" justify="center">
        <el-col :span="12">
          <el-button type="primary" @click="hSaveUserDetailById">
            保存更新
          </el-button>
          <el-button @click="$router.back()">返回</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { saveUserDetailById } from '@/api/user'

export default {
  props: {
    userInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      rules: {
        departmentName: [
          { required: true, message: '部门不能为空', trigger: ['blur', 'change'] }
        ],
        timeOfEntry: [
          { required: true, message: '请选择入职时间', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    hSaveUserDetailById () {
      this.$refs.fm.validate(async flag => {
        if (!flag) return
        // 使用最新修改数据覆盖源数据 作为接口提交数据
        // 添加用户头像=>从子组件实例中获取COS上传的头像地址
        // const uploadImg = this.$refs.upi.imageUrl
        // if (uploadImg) {
        //   // 上传了图片才更新
        //   this.userInfo.staffPhoto = uploadImg
        // }
        await saveUserDetailById(this.userInfo)
        // 更新登录人信息
        this.$store.dispatch('user/getUserInfo')
        this.$message.success('更新成功')
      })
    }
  }
}
</script>
