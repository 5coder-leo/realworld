<template>
  <div class="profile-page">

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

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
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
          </div>

          <div class="article-preview" v-for="article in myArticles">
            <div class="article-meta">
              <a href=""><img :src="article.author.image"/></a>
              <div class="info">
                <nuxt-link
                    class="author"
                    :to="{
                      name: 'profile',
                      params: {
                        slug: article.author.username
                      }
                    }"
                >{{ article.author.username }}
                </nuxt-link>
                <span class="date">{{ article.createAt | date('MMMM D') }}</span>
              </div>
              <button
                  class="btn btn-outline-primary btn-sm pull-xs-right"
                  :class="{
                      active: article.favorited
                  }"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link
                class="preview-link"
                :to="{
                  name: 'article',
                  params: {
                    slug: article.slug
                  }
                }"
            >
              <h1>{{ article.title }}</h1>
              <p>{{ article.body }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import {getArticles} from "@/api/article";

export default {
  // 在路由匹配组件之前会先执行中间件处理
  middleware: 'authenticated',
  name: "UserProfile",
  watchQuery: ['tab'],
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
  computed: {
    ...mapState(['user'])
  }
}
</script>

<style scoped>

</style>