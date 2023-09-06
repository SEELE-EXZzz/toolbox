import Vue from 'vue'
import VueRouter from 'vue-router'
import appContents from '../pages/appContents'
import setting from '../pages/setting'
import shortsCut from '../pages/setting/shortsCut'
import show from '../pages/setting/show'

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    component: appContents
  },
  {
    path:'/setting',
    component: setting,
    children:[{
        path:'shortsCut',
        component: shortsCut
      },
      {
        path:'show',
        component: show
      }]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
