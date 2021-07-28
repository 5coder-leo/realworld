export default function ({store, redirect}) {
  // 如果用户没有登录
  if (!store.state.user) {
    return redirect('/login')
  }
}