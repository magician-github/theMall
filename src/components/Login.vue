<template>
  <div class="login_container">
    <div class="login_box">
      <div class="aventar">
        <img src="../assets/happy.jpg" alt />
      </div>
      <div class="login_area">
        <el-form class="login_form" ref="loginFormRef" :model="loginFormData" :rules="loginRules">
          <el-form-item prop="username">
            <el-input prefix-icon="iconfont icon-yonghu" v-model="loginFormData.username"></el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              type="password"
              prefix-icon="iconfont icon-mima1"
              v-model="loginFormData.password"
            ></el-input>
          </el-form-item>

          <el-form-item class="btns">
            <el-button type="success" @click="login">登录</el-button>
            <el-button type="info" @click="handleClick">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loginFormData: {
        username: "admin",
        password: "123456"
      },
      loginRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    handleClick() {
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        const { data: resp } = await this.$http.post(
          "login",
          this.loginFormData
        );
        if (resp.meta.status !== 200) return this.$message.error("登录失败");
        // this.$message.success('登录成功',1000);
        this.$message({
          showClose: true,
          message: "登录成功",
          type: "success",
          duration:700
        });
        window.sessionStorage.setItem("token", resp.data.token);
        this.$router.push("/welcome");
      });
    }
  }
};
</script>
<style lang="less" scoped>
// @import url('../assets/font/iconfont.css');
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .login_area {
      .login_form {
        padding: 0 20px;
        position: absolute;
        bottom: 0;
        width: 100%;
        box-sizing: border-box;
      }
      .btns {
        display: flex;
        justify-content: center;
      }
    }
    .aventar {
      width: 100px;
      height: 100px;
      border: 1px solid #ccc;
      border-radius: 50%;
      padding: 10px;
      position: absolute;
      left: 50%;
      background-color: #fff;
      transform: translate(-50%, -50%);

      img {
        width: 100%;
        background-color: #ccc;
        height: 100%;
        border-radius: 50%;
      }
    }
  }
}
</style>