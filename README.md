
自动部署地址：http://106.75.130.241:3000/


# 使用 NuxtJS 实现 RealWorld 全部功能

## 一、退出登录

### 1.添加退出登录按钮

```html
<hr>
<button class="btn btn-outline-danger">
  Or click here to logout.
</button>
```

### 2.绑定退出登录事件

```html
<button class="btn btn-outline-danger" @click="logout">
  Or click here to logout.
</button>
```

```js
methods: {
  logout() {
    // // 1.清空持久化cookie中的数据
    Cookie.remove('user')
    // // 2.跳转路由到首页
    this.$router.push('/')
  }
}
```

## 二、更新个人信息

### 1.封装请求

```js
// 更新用户
export const updateUser = data => {
  return request({
    method: 'PUT',
    url: '/api/users',
    data
  })
}
```

### 2.绑定页面表单数据

- 初始化`vm`实例中的`data`数据为空字符串
- 表单使用`v-model`绑定数据
- 在`mounted`生命周期函数中利用`store`中的`user`数据给`vm.data`重新赋值

- 从`state`中获取用户数据

### 3.按钮点击事件

- 绑定按钮点击事件
  - 提交用户信息并获取返回的`user`对象
  - 将返回的`user`对象重新利用`store`中的`mutations`中的`setUser`方法给`store.state.user`重新赋值
  - 跳转页面至用户个人信息页面

```js
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
```

## 三、关注/取关用户

### 1.封装请求

`api/user.js`

```js
// 关注用户
export const followUser = username => {
  return request({
    method: 'POST',
    url: `/api/profiles/:${username}/follow`,
  })
}
```

```js
// 取消关注用户
export const unfollowUser = username => {
  return request({
    method: 'DELETE',
    url: `/api/profiles/${username}/follow`,
  })
}
```

### 2.按钮绑定方法

按钮按照是否关注动态渲染

```html
<span v-if="article.author.following">Unfollow {{ article.author.username }}</span>
<span v-else>Follow {{ article.author.username }}</span>
```

`profile/index.vue`

```html

```

`article/component/artice-meta.vue`

```html
<button
    class="btn btn-sm btn-outline-secondary"
    :class="{
      active: article.author.following
    }"
    :disabled="article.authorDisabled"
    @click="onFollow(article)"
  >
  <i class="ion-plus-round"></i>
  <span v-if="article.author.following">Unfollow {{ article.author.username }}</span>
  <span v-else>Follow {{ article.author.username }}</span>
  <span class="counter"></span>
</button>
```

```js
async onFollow(article) {
  article.authorDisabled = true
  // 如果已经关注，则点击为取消关注
  if (article.author.following) {
    await unfollowUser(article.author.username)
    article.author.following = false
  } else {
    // 如果未关注，则点击为关注
    await followUser(article.author.username)
    article.author.following = true
  }
  article.authorDisabled = false
}
```

## 四、文章发布

### 1.封装请求

`api/article.js`

```js
// 发布文章
export const postArticle = data => {
  return request({
    method: 'POST',
    url: `/api/articles`,
    data
  })
}
```

### 2.绑定数据

使用v-model绑定数据到vm实例上

`pages/editor/index.vue`

```html
<form>
  <fieldset>
    <fieldset class="form-group">
      <input type="text" class="form-control form-control-lg" placeholder="Article Title"
             v-model="data.article.title">
    </fieldset>
    <fieldset class="form-group">
      <input type="text" class="form-control" placeholder="What's this article about?"
             v-model="data.article.description">
    </fieldset>
    <fieldset class="form-group">
      <textarea class="form-control" rows="8" placeholder="Write your article (in markdown)"
                v-model="data.article.body"></textarea>
    </fieldset>
    <fieldset class="form-group">
      <input type="text" class="form-control" placeholder="Enter tags" v-model="data.article.tagList">
      <div class="tag-list"></div>
    </fieldset>
    <button class="btn btn-lg pull-xs-right btn-primary" type="button" @click="articleSubmit">
      Publish Article
    </button>
  </fieldset>
</form>
```

```js
data() {
    return {
      data: {
        article: {
          title: '',
          description: '',
          body: '',
          tagList: [],
        }
      }
    }
  },
```

### 3.请求API、跳转路由

给button绑定事件，由于发布文章页面不需要SEO，所以这里使用vue methods方式去请求数据。

```html
<button class="btn btn-lg pull-xs-right btn-primary" type="button" @click="articleSubmit">
  Publish Article
</button>
```

绑定事件执行成功后，进行跳转页面，携带slug参数

```js
methods: {
  async articleSubmit() {
    try {
      const {data} = await postArticle(this.data)
      // 跳转到首页
      this.$router.push(`/article/${data.article.slug}`)
    } catch (e) {
      console.error(e)
    }

  }
}
```



## 五、个人信息页面

### 1.渲染用户信息

使用mapState获取用户信息，在模板进行渲染

```js
computed: {
  ...mapState(['user'])
}
```

```html
<div class="user-info">
  <div class="container">
    <div class="row">
      <div class="col-xs-12 col-md-10 offset-md-1">
        <img :src="user.image" class="user-img"/>
        <h4>{{ user.username }}</h4>
        <p>
          {{ user.bio }}
        </p>
        <button class="btn btn-sm btn-outline-secondary action-btn">
          <i class="ion-plus-round"></i>
          Follow {{ user.username }}
        </button>
      </div>
    </div>
  </div>
</div>
```

### 2.My Articles && Favorited Articles

- 动态绑定active属性
- 设置tab属性
- 依据tab属性调用方法getArticles时传递不同的参数
- 渲染模板

```html
<ul class="nav nav-pills outline-active">
  <li class="nav-item">
    <nuxt-link
        class="nav-link"
        :class="{
          active: tab === 'my_articles'
        }"
        exact
        :to="{
          name: 'profile',
          query: {
            tab: 'my_articles'
          }
        }"
    >My Articles
    </nuxt-link>
  </li>
  <li class="nav-item">
    <nuxt-link
        class="nav-link"
        :class="{
          active: tab === 'favorited_articles'
        }"
        exact
        :to="{
          name: 'profile',
          query: {
            tab: 'favorited_articles'
          }
        }"
    >Favorited Articles
    </nuxt-link>
  </li>
</ul>
```

```js
watchQuery: ['tab'], // 精准匹配
async asyncData({query, store}) {
  const page = Number.parseInt(query.page || 1)
  const limit = 10

  const tab = query.tab || 'my_articles'
  if (tab === 'my_articles') {
    const {data} = await getArticles({author: store.state.user.username})
    const myArticles = data.articles
    return {
      myArticles,
      data,
      tab
    }
  } else {
    console.log('favorited')
    const {data} = await getArticles({favorited: store.state.user.username})
    const myArticles = data.articles
    return {
      myArticles,
      data,
      tab
    }
  }
},
```

```html
<div class="article-preview" v-for="article in myArticles">
  <div class="article-meta">
    <a href=""><img :src="article.author.image"/></a>
    <div class="info">
      <a href="" class="author">{{ article.author.username }}</a>
      <span class="date">{{ article.createAt | date('MMMM D') }}</span>
    </div>
    <button class="btn btn-outline-primary btn-sm pull-xs-right">
      <i class="ion-heart"></i> {{ article.favoritesCount }}
    </button>
  </div>
  <a href="" class="preview-link">
    <h1>{{ article.title }}</h1>
    <p>{{ article.body }}</p>
    <span>Read more...</span>
  </a>
</div>
```

## 六、TODO

- 文章更新
- 文章删除
- 各种Follow按钮、点赞按钮等
