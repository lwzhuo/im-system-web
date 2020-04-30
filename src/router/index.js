import Vue from 'vue'
import Router from 'vue-router'
import LoginView from '@/views/login/index' // 登录页
import IndexView from '@/views/home/index' // 主页
import WelcomeView from '@/views/welcome/index' // 欢迎页
import TestView from '@/views/test' // 测试
Vue.use(Router)

const MessageDialog = resolve => require(['@/components/dialog/messageDialog'], resolve)
const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta:{requiresAuth:false}
    },
    {
      path: '/',
      name: 'index',
      component: IndexView,
      meta:{requiresAuth:true},
      children:[
        {
          path: 'messages/messageChat/:channelType/:channelId',
          name: 'messageDialog',
          component: MessageDialog
        },
        {
          path:'welcome',
          name:'welcome',
          component:WelcomeView
        }
      ]
    },
    {
      path: '/test',
      name: 'test',
      component: TestView,
      meta:{requiresAuth:false}
    }
  ]
})

// 控制跳转 用户身份校验
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('token')
  if (to.meta.requiresAuth) {// 需要权限校验
    if (token) {// 检查token
      next()
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  } else {
    next()
  }
})

export default router