<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">{{ isLogin ? 'Sign in' : 'Sign up' }}</h1>
          <p class="text-xs-center">
            <nuxt-link v-if="isLogin" to="/register">Need an account?</nuxt-link>
            <nuxt-link v-else to="/login">Have an account?</nuxt-link>
          </p>

          <ul class="error-messages">
            <template v-for="(messages, field) of errors">
              <li v-for="(message,index) in messages" :key="index">{{ field }} {{ message }}</li>
            </template>
          </ul>

          <!--添加submit提交事件，并使用prevent取消默认提交事件-->
          <form @submit.prevent="onSubmit">
            <fieldset v-if="!isLogin" class="form-group">
              <input class="form-control form-control-lg" type="text" placeholder="Your Name" v-model="user.username">
            </fieldset>
            <!--使用v-model绑定数据-->
            <fieldset class="form-group">
              <input class="form-control form-control-lg" type="email" required placeholder="Email"
                     v-model="user.email">
            </fieldset>
            <fieldset class="form-group">
              <input class="form-control form-control-lg" type="password" minlength="8" required placeholder="Password"
                     v-model="user.password">
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right">
              {{ isLogin ? 'Sign in' : 'Sign up' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {login, register} from '../../api/user'
// 仅在客户端加载js-cookie
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  middleware: 'not-authenticated',
  name: "LoginIndex",
  data() {
    return {
      user: {
        username: '',
        email: '',
        password: ''
      },
      errors: {}  // 错误信息
    }
  },
  computed: {
    isLogin() {
      return this.$route.name === 'login'
    }
  },
  methods: {
    async onSubmit() {
      try {
        // 提交表单请求登录
        const {data} = this.isLogin ? await login({
          user: this.user
        }) : await register({
          user: this.user
        })
        // 保存用户登录状态到容器
        this.$store.commit('setUser', data.user)

        // 为了防止刷新页面数据丢失，需要将数据持久化
        Cookie.set('user', data.user)

        // 跳转到首页
        this.$router.push('/')
      } catch (err) {
        // 请求失败
        console.dir(err)
        this.errors = err.response.data.errors
      }
    }
  }
}
</script>

<style scoped>

</style>