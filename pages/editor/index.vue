<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-10 offset-md-1 col-xs-12">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {postArticle} from "@/api/article";

export default {
  // 在路由匹配组件之前会先执行中间件处理
  middleware: 'authenticated',
  name: "EditorIndex",
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
}
</script>

<style scoped>

</style>