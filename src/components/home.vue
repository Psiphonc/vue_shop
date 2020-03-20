<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header height="80px">
      <div>
        <img src="../assets/favicon.png" alt="logo" />
        <span>后台管理系统</span>
      </div>
      <el-button type="primary" class="logout-btn" @click="logout"
        >退出</el-button
      >
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="menuWidth">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="menu.id + ''"
            v-for="menu in menuList"
            :key="menu.id"
          >
            <!-- 一级菜单的模版区 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[menu.id]"></i>
              <!-- 文本 -->
              <span>{{ menu.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="subMenu.id + ''"
              v-for="subMenu in menu.children"
              :key="subMenu.id"
            >
              <!-- 二级菜单的模版区 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subMenu.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体内容 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  // 生命周期钩子函数
  created: function() {
    this.getMenuList()
  },
  methods: {
    logout: function() {
      // 清空token
      window.sessionStorage.clear()
      // 重定向到登陆页
      this.$router.push('login')
    },
    getMenuList: async function() {
      const res = await this.$http.get('menus')
      console.log(res)
      if (res.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data.data
    },
    toggleCollapse: function() {
      this.isCollapse = !this.isCollapse
    }
  },
  data: function() {
    return {
      // 左侧菜单栏
      menuList: [],
      iconObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 右侧菜单是否折叠
      isCollapse: false
    }
  },
  computed: {
    menuWidth: function() {
      if (this.isCollapse) return '64px'
      else return '200px'
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
  .el-header {
    // height: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    border-bottom: 1px solid #dcdfe6;
    padding-left: 10px;
    font-size: 20px;
    > div {
      display: flex;
      align-items: center;
      > span {
        margin-left: 15px;
      }
    }
    img {
      width: 70px;
      height: 70px;
    }
  }
  .el-aside {
    background: #fff;
    border-right: 1px solid #dcdfe6;
    .el-menu {
      border: none;
    }
    .iconfont {
      margin-right: 10px;
    }
    .toggle-button {
      color: balck;
      // background: linear-gradient(to right, #c2e9fb, #a1c4fd);
      text-align: center;
      border-bottom: #dcdfe6 solid 1px;
      font-size: 10px;
      line-height: 24px;
      letter-spacing: 0.2em;
      cursor: pointer;
    }
  }
  .el-main {
    background-color: #fff;
  }
}
</style>
