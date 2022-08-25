<template>
  <div class="app-container">
    <!-- 放置表单 -->
    <el-form ref="userForm" label-width="60px" :model="fd" :rules="rules">
      <el-form-item label="姓名:" prop="username">
        <el-input v-model="fd.username" style="width: 300px" />
      </el-form-item>
      <el-form-item label="密码:">
        <el-input
          v-model="fd.password"
          type="password"
          disabled
          style="width: 300px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="hSaveUserDetailById">更新</el-button>
        <el-button @click="$router.back()">返回</el-button>
      </el-form-item>
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
      // 避免引用处理
      fd: {
        id: '',
        username: '',
        password: ''
      },
      rules: {
        username: [{ required: true, min: 2, max: 10, message: '用户名必填！', trigger: 'change' }]
      }
    }
  },
  watch: {
    // 监控传值变化
    userInfo (userInfo) {
      // 接口必要数据
      this.fd.id = userInfo.id
      this.fd.mobile = userInfo.mobile
      // 表单数据
      this.fd.username = userInfo.username
      this.fd.password = userInfo.password
    }
  },
  methods: {
    hSaveUserDetailById () {
      this.$refs.userForm.validate(async flag => {
        if (!flag) return
        // 使用最新修改数据覆盖源数据 作为接口提交数据
        await saveUserDetailById(this.fd)
        this.$message.success('更新成功')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
