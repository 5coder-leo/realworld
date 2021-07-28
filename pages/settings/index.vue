<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <form>
            <fieldset>
              <fieldset class="form-group">
                <input class="form-control" type="text" placeholder="URL of profile picture" v-model="data.user.image">
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" type="text" placeholder="Your Name"
                       v-model="data.user.username">
              </fieldset>
              <fieldset class="form-group">
                <textarea class="form-control form-control-lg" rows="8" placeholder="Short bio about you"
                          v-model="data.user.bio"></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" type="text" placeholder="Email" v-model="data.user.email">
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" type="password" placeholder="Password"
                       v-model="data.user.password">
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right" type="button" @click="update">
                Update Settings
              </button>
              <hr>
              <button class="btn btn-outline-danger" @click="logout">
                Or click here to logout.
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {updateUser} from "@/api/user";
import {mapState} from 'vuex'
// 仅在客户端加载js-cookie
const Cookie = process.client ? require('js-cookie') : undefined
export default {
  // 在路由匹配组件之前会先执行中间件处理
  middleware: 'authenticated',
  name: "SettingsIndex",
  data() {
    return {
      data: {
        user: {
          image: '',
          email: '',
          bio: '',
          username: '',
          password: ''
        }
      }
    }
  },
  computed: {
    ...mapState(['user'])
  },
  async mounted() {
    const userData = this.$store.state.user
    this.data.user.image = userData.image
    this.data.user.email = userData.email
    this.data.user.bio = userData.bio
    this.data.user.username = userData.username
    this.data.user.password = userData.password
  },
  methods: {
    logout() {
      // // 1.清空持久化cookie中的数据
      Cookie.remove('user')
      // // 2.跳转路由到首页
      this.$router.push('/')
    },
    async update() {
      const {data} = await updateUser(this.data)
      // 更改store.state.user中的数据
      this.$store.commit('setUser', data.user)
      this.$router.push(`profile/${data.user.username}`)
    }
  }
}
</script>

<style scoped>

</style>