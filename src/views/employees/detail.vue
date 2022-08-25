<template>
  <div class="employees-container">
    <div class="app-container">
      <el-card>
        <el-tabs v-model="ac">
          <el-tab-pane name="ls" label="登录账户设置">
            <LoginSet :user-info="userInfo" />
          </el-tab-pane>
          <el-tab-pane name="yx" label="个人详情">
            <UserInfo :user-info="userInfo" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import LoginSet from './components/login-setting'
import UserInfo from './components/user-info'
// 获取个人信息接口
import { getUserDetailById } from '@/api/user'
export default {
  components: {
    LoginSet,
    UserInfo
  },
  data () {
    return {
      ac: 'yx',
      userId: this.$route.params.id,
      userInfo: {}
    }
  },
  mounted () {
    this.hGetUserInfoById()
  },
  methods: {
    async hGetUserInfoById () {
      const data = await getUserDetailById(this.userId)
      console.log('个人详情：', data)
      this.userInfo = data
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
