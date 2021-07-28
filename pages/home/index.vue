<template>
  <div class="home-page">

    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">

        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li v-if="user" class="nav-item">
                <nuxt-link class="nav-link"
                           :class="{
                              active: tab === 'your_feed'
                           }"
                           exact
                           :to="{
                              name: 'home',
                              query: {
                                tab: 'your_feed'
                              }
                           }" href="">Your Feed
                </nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link
                    class="nav-link"
                    :class="{
        active: tab === 'global_feed'
      }"
                    exact
                    :to="{
        name: 'home',
        query: {
          tab: 'global_feed'
        }
      }">Global Feed
                </nuxt-link>
              </li>
              <li v-if="tag" class="nav-item">
                <nuxt-link
                    class="nav-link"
                    :class="{
        active: tab === 'tag'
      }"
                    exact
                    :to="{
        name: 'home',
        query: {
          tab: 'tag',
          tag: tag
        }
      }">#{{ tag }}
                </nuxt-link>
              </li>
            </ul>
          </div>
          <!--Articles List-->
          <div
              class="article-preview"
              v-for="article in articles"
              :key="article.slug"
          >
            <div class="article-meta">
              <nuxt-link :to="{
                name: 'profile',
                params: {
                  username: article.author.username
                }
              }">
                <img :src="article.author.image"/>
              </nuxt-link>
              <div class="info">
                <nuxt-link class="author" :to="{
                  name: 'profile',
                  params: {
                    username: article.author.username
                  }
                  }">{{ article.author.username }}
                </nuxt-link>
                <span class="date">{{ article.createAt | date('MMM DD, YYYY') }}</span>
              </div>
              <button class="btn btn-outline-primary btn-sm pull-xs-right"
                      :class="{
          active: article.favorited
        }" @click="onFavorite(article)"
                      :disabled="article.favoriteDisabled"
              >
                <i class="ion-heart"></i>
                {{ article.favoritesCount }}
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
              <p>{{ article.description }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>
          <!-- 分页列表 -->
          <nav>
            <ul class="pagination">
              <!--使用计算属性计算出totalPage，遍历循环出页面，并且绑定动态样式active-->
              <li class="page-item" v-for="item in totalPage" :key="item"
                  :class="{
                    active: item === page
                  }"
              >
                <!--绑定to属性，动态传递page参数-->
                <nuxt-link class="page-link" :to="{
                      name: 'home',
                      query: {
                        page: item,
                        tag: $route.query.tag,
                        tab: tab
                      }
                  }">{{ item }}
                </nuxt-link>
              </li>
            </ul>
          </nav>
        </div>
        <!--Popular Tags-->
        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>
            <div class="tag-list">
              <nuxt-link :to="{
                    name: 'home',
                    query: {
                      tag: item,  // 添加tag查询参数
                      tab: 'tag'
                    }
                  }" class="tag-pill tag-default" v-for="item in tags" :key="item" v-if="item">{{ item }}
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>

</template>

<script>
import {getArticles, getFeedArticles, addFavorite, deleteFavorite} from "@/api/article";
import {getTags} from "@/api/tag";

import {mapState} from 'vuex'

export default {
  name: "HomeIndex",
  // 有利于SEO
  watchQuery: ['page', 'tag', 'tab'],
  async asyncData({query, store}) {
    // 从url中获取页码：localhost:3000?page=3
    const page = Number.parseInt(query.page || 1)
    const limit = 20
    const {tag} = query
    const tab = query.tab || 'global_feed'
    const loadArticles = store.state.user && tab === 'your_feed'
        ? getFeedArticles
        : getArticles

    const [articlesResponse, tagResponse] = await Promise.all([
      loadArticles({
        limit,
        offset: (page - 1) * limit,
        tag,
      }),
      getTags()
    ])

    const {articles, articlesCount} = articlesResponse.data
    const {tags} = tagResponse.data
    articles.forEach(articles => articles.favoriteDisabled = false)
    return {
      articles,
      articlesCount,
      limit,
      page,
      tags,
      tag,
      tab: query.tab || 'global_feed'
    }
  },
  computed: {
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit)
    },
    ...mapState(['user'])
  },
  methods: {
    async onFavorite(article) {
      article.favoriteDisabled = true
      // 如果已经点赞了，则取消点赞，否则则添加点赞
      if (article.favorited) {
        await deleteFavorite(article.slug)
        // 处理视图
        article.favorited = false
        article.favoritesCount += -1
      } else {
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount += 1
      }
      article.favoriteDisabled = false
    }
  }
}
</script>

<style scoped>

</style>