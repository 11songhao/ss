<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />
    <!-- <div class="app-breadcrumb">
      {{ $t("navbar.title") }}
      <span class="breadBtn">体验版</span>
    </div> -->

    <div class="right-menu">
      <lang class="rm-item" />
      <!-- 控制全屏 -->
      <ScreenFull class="rm-item" />
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img
            v-imgerror="require('@/assets/common/head.jpg')"
            :src="avatar"
            class="user-avatar"
          />
          <span class="name">{{ name }}</span>
          <i class="el-icon-caret-bottom" style="color: #fff" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item> 首页 </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://gitee.com">
            <el-dropdown-item> 项目地址 </el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name'
    ])
  },
  methods: {
    toggleSideBar () {
      this.$store.dispatch('app/toggleSideBar')
    },
    logout () {
      this.$confirm('确认退出登录吗?', '提示').then(async () => {
        this.$store.dispatch('user/logout')
        console.log('2', this.$route)
        this.$router.push(`/login`)
      }).catch(console.log)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-breadcrumb__inner a {
  color: #fff;
}
::v-deep .app-breadcrumb.el-breadcrumb .no-redirect {
  color: #fff;
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  // background: #fff;
  background-image: -webkit-linear-gradient(left, #5b8cff, #3d6df8);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    // 控制全屏按钮和多语言
    .rm-item {
      display: inline-block;
      vertical-align: middle;
      margin-right: 16px;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      // 右侧头像等显示控制
      .avatar-wrapper {
        // margin-top: 5px;
        position: relative;
        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 15px;
          vertical-align: middle;
        }
        .name {
          color: #fff;
          vertical-align: middle;
          margin-left: 5px;
        }
        .user-dropdown {
          color: #fff;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 20px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
