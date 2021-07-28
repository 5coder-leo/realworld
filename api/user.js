import { request } from "@/plugins/request";


// 用户登录
export const login = data => {
  return request({
    method: 'POST',
    url: '/api/users/login',
    data
  })
}

// 用户注册
export const register = data => {
  return request({
    method: 'POST',
    url: '/api/users',
    data
  })
}

// 更新用户
export const updateUser = data => {
  return request({
    method: 'PUT',
    url: '/api/user',
    data
  })
}

// 关注用户
export const followUser = username => {
  return request({
    method: 'POST',
    url: `/api/profiles/${username}/follow`,
  })
}

// 取消关注用户
export const unfollowUser = username => {
  return request({
    method: 'DELETE',
    url: `/api/profiles/${username}/follow`,
  })
}