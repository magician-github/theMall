<template>
  <el-container class="container">
    <el-header class="el_header">
      <div class="logo">
        <img src="../assets/happy.jpg" class="logoImg" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="loginOut" class="loginOut">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse?'64px':'200px'" class="el_aside">
        <div class="toggle_button" @click="toggleMenu">|||</div>
        <el-menu background-color="#333744" :default-active="activePath" text-color="#fff" router :collapse-transition="false" unique-opened class="el_menu" :collapse="isCollapse">
          <el-submenu :index="item.id+''" v-for="(item) in menuList" :key="item.id">
            <template slot="title">
              <i class="iconfont" :class="menuIconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>

            <el-menu-item :index="'/'+subItem.path" @click="saveNavState('/'+subItem.path+'')" v-for="subItem in item.children" :key="subItem.id">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="el_main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  components:{
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem('activePath');
  },
  data() {
    
    return {
      menuList: [],
      menuIconObj: {
        125: "el-icon-s-custom",
        103: "el-icon-s-operation",
        101: "el-icon-s-goods",
        102: "el-icon-s-order",
        145: "el-icon-s-marketing"
      },
      activePath:'',
      isCollapse:false
    }
  },
  methods: {
    loginOut() {
      window.sessionStorage.removeItem("token")
      this.$router.push("/login")
    },
    async getMenuList() {
      const { data: resp } = await this.$http.get("menus")
      if (resp.meta.status == 400)
        return this.$message.console.error(resp.meta.msg)
      this.menuList = resp.data
    },
    toggleMenu(){
      this.isCollapse = !this.isCollapse;
    },
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath',activePath);
      this.activePath = activePath;

    }
  }
}
</script>

<style lang="less" scoped>
.toggle_button {
  color:#fff;
  letter-spacing: 5px;
  text-align: center;
  cursor: pointer;
  

}
.toggle_button:hover{
  opacity: 0.5;
}
.el-container {
  height: 100%;
  overflow: auto;
}
.logoImg {
  width: 30px;
}
.logo {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  span {
    margin-left: 10px;
    color: #fff;
    font-size: 17px;
  }
}
.el_header {
  display: flex;
  align-content: space-between;
  background-color: #373d41;
  align-items: center;
}
.el_aside {
  background-color: #333744;
  .el_menu{
    border-right: none;
  }
}
.el_main {
  background-color: #eaedf1;
}
</style>