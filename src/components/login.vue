<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 头像区 -->
      <div class="avatar-box">
        <img src="../assets/logo.png" alt="avatar" />
      </div>
      <!-- 登陆表单区 -->
      <!-- ref属性表示该组件的应用名 可以随便起 -->
      <!-- 添加了这个属性后就可以在script代码中获取该组件了 -->
      <el-form ref="loginFormRef" class="login-form" :model="loginForm" :rules="loginFormRules">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item class="btn-group">
          <!-- 绑定登陆事件 -->
          <el-button @click="login" type="primary">登陆</el-button>
          <!-- 绑定重置事件 -->
          <el-button @click="resetLoginForm" type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      // 登陆表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证规则
      loginFormRules: {
        username: [
          { require: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度为3-10个字符', trigger: 'blur' }
        ],
        password: [
          { require: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码长度为6-15个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm: function () {
      // 通过内置属性$ref获取模版中设置过ref属性的子组件
      this.$refs.loginFormRef.resetFields()
    },
    login: function () {
      // validate方法可以验证表单内容，接收一个cb函数，参数是校验结果
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        // 发起登陆请求，这里的$http是在app.vue挂载到Vue原型对象上的axios对象
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        // 将登陆成功后的token保存到客户端的sessionStorage中
        // 必须保证项目中除了登陆以外的任何接口，必须在登陆后才可以访问
        // 且token只能在当前网站打开期间生效，所以将token保存在sessionStorage中
        window.sessionStorage.setItem('token', res.data.token)
        // 登陆成功后使用编程式跳转到后台主页
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  background-color: #2b4b6b;
  height: 100%;
  .login-box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .avatar-box {
    width: 130px;
    height: 130px;
    border-radius: 50%;
    border: 1px solid #eee;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .login-form {
    position: absolute;
    bottom: 0px;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
    .btn-group {
      display: flex;
      justify-content: flex-end;
      margin-right: 15px;
    }
  }
}
</style>
