import {request} from "@/plugins/request";

// 获取公共的文章列表
export const getArticles = params => {
  return request({
    method: 'GET',
    url: '/api/articles',
    params
  })
}

// 获取关注的的文章列表
export const getFeedArticles = params => {
  return request({
    method: 'GET',
    url: '/api/articles/feed',
    // 注意数据格式
    // headers: {
    //   Authorization: `Token eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTkwMzIyLCJ1c2VybmFtZSI6IjVjb2RlciIsImV4cCI6MTYzMjUzNTA0NH0.i0tpsAKIB-462Vg_dOyCABZNcFwNMqRtvQ-jzoDTY6k`
    // },
    params
  })
}

// 添加点赞
export const addFavorite = slug => {
  return request({
    method: 'POST',
    url: `api/articles/${slug}/favorite`
  })
}

// 取消点赞
export const deleteFavorite = slug => {
  return request({
    method: 'DELETE',
    url: `api/articles/${slug}/favorite`
  })
}


// 获取文章详情
export const getArticle = slug => {
  return request({
    method: 'GET',
    url: `/api/articles/${slug}`,
  })
}

// 获取文章评论
export const getComments = slug => {
  return request({
    method: 'GET',
    url: `/api/articles/${slug}/comments`,
  })
}

// 发布文章
export const postArticle = data => {
  return request({
    method: 'POST',
    url: `/api/articles`,
    data
  })
}