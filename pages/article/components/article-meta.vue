<template>
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
      <nuxt-link :to="{
        name: 'profile',
        params: {
          username: article.author.username
        }
      }" class="author">{{ article.author.username }}
      </nuxt-link>
      <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
    </div>
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
    <button
        class="btn btn-sm btn-outline-primary"
        :class="{
          active: article.favorited
        }"
        @click="onFavorite(article)"
    >
      <i class="ion-heart"></i>
      Favorite Post <span class="counter">({{ article.favoritesCount }})</span>
    </button>
  </div>
</template>

<script>
import {addFavorite, deleteFavorite} from "@/api/article";
import {unfollowUser, followUser} from "@/api/user";

export default {
  name: "ArticleMeta",
  props: {
    article: {
      type: Object,
      required: true
    }
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
    },
    async onFollow(article) {
      article.authorDisabled = true
      // 如果已经关注，则点击为取消关注
      console.log(article)
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
  },
  head() {
    return {
      title: `${this.article.title} - RealWorld`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.article.description
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>