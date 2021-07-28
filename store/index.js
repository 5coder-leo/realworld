import cookieparser from 'cookieparser'

// 在服务端渲染期间，运行的都是同一个实例，为了防止数据冲突，务必将state定义为一个函数，返回数据对象
// 确保每次创建实例时，state都要通过一个函数动态的创建一个对象，这样数据就不会冲突和污染
export const state = () => {
  return {
    // 当前登录用户的登录状态数据
    user: null
  }
}

export const mutations = {
  setUser(state, data) {
    state.user = data
  }
}

export const actions = {
  // nuxtServerInit是一个特殊的action方法，尽在服务端渲染期间调用
  // 初始化容器数据，从cookie中取出来放到state中
  nuxtServerInit({commit}, {req}) {
    let user = null
    // 如果请求头中有Cookie
    if (req.headers.cookie) {
      // 使用cookieparser结构成对象
      const parsed = cookieparser.parse(req.headers.cookie)
      try {
        user = JSON.parse(parsed.user)
      } catch (e) {
        // No Valid cookie found
      }
    }
    // 提交mutation修改state状态
    commit('setUser', user)
  }
}