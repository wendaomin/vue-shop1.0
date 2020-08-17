<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="">
        <span>黑马电商管理系统</span>
      </div>
     <el-button type="info" round @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="flod_box" @click="collapseToggle">|||</div>
        <el-menu background-color="#333744" text-color="#fff" :unique-opened='true' :collapse="isCollapse" :collapse-transition="false" active-text-color="#409EFF" router :default-active="activePath">
        <!-- 一级菜单 -->
        <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
        <template slot="title">
          <i :class="iconObj[item.id]"></i>
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->
         <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/'+subItem.path)">
           <template slot="title">
          <i class="el-icon-menu"></i>
          <span>{{subItem.authName}}</span>
        </template>
         </el-menu-item>
        </el-submenu>
    </el-menu>
    </el-aside>
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      menuList: [],
      iconObj: {
        125: 'iconfont icon-icon-test',
        103: 'iconfont icon-icon-test1',
        101: 'iconfont icon-icon-test2',
        102: 'iconfont icon-icon-test4',
        145: 'iconfont icon-icon-test3'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      // 失败
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    collapseToggle() {
      this.isCollapse = !this.isCollapse
    },
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>
<style lang="less" scoped>
.el-header {
  display: flex;
  background-color: #373D41;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  > div{
    display: flex;
    align-items: center;
    > span{
      color: #fff;
      font-size: 20px;
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu{
    border-right: none;
}
  .flod_box {
  background-color: #4A5064;
  text-align: center;
  font-size: 15px;
  line-height: 24px;
  color: #fff;
  letter-spacing: 0.2em;
  cursor: pointer
}
}
.el-main {
  background-color: #EAEDF1;
}
.home-container {
  height: 100%;
}
.iconfont {
  margin-right: 10px;
}

</style>
