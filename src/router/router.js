import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import User from '../components/user/User.vue'
Vue.use(VueRouter)
const routes = [
  { name: 'login', path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [{
      path: '/welcome', component: Welcome
    }, { path: '/users', component: User }]
  }
]
const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  // 如果路由为login, 放行
  // 如果没有token, 跳转到login页面
  // 如果有token, 放行
  // console.log(to)
  // console.log(from)
  if (to.path === '/login') return next()
  if (!window.sessionStorage.getItem('token')) return next('/login')
  next()
})
export default router
