<template>
    <div class="login_container">
        <div class="login_box">
           <div class="logo">
               <img class="img1" src="../assets/logo.png" alt="">
           </div>
            <el-form ref="loginFormRef" class='login_form' :model="loginForm" :rules="loginFormRules">
                <!-- 用户 -->
                <el-form-item prop='username'>
                    <el-input prefix-icon="iconfont icon-icon-1" v-model="loginForm.username"></el-input>
                </el-form-item>
                <el-form-item prop='password'>
                    <el-input prefix-icon="iconfont icon-icon-" v-model="loginForm.password"></el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="primary" @click="resetLoginForm">重置</el-button>
                    <el-button @click='login'>登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }]
      }
    }
  },
  methods: {
    resetLoginForm () {
      // console.log(this)
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.error('登录失败！')
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
        this.$message.success('登录成功')
        // console.log(this.$message)
      })
    }
  }
}
</script>
<style lang='less' scoped>
.login_container{
    position: relative;
    background-color: #2b4b6b;
    height: 100%;
}
.login_box{
    position: absolute;
    width: 450px;
    height: 300px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    border-radius: 3px;
}
.logo{
    position: absolute;
    height: 130px;
    width: 130px;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background-color: #fff;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    img{
        height: 100%;
        width: 100%;
        border-radius: 50%;
        background-color: #eee;
    }
}
.login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
.btns {
    display: flex;
    justify-content: flex-end;
}
</style>
