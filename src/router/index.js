import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
Vue.use(VueRouter)
import NotFound from '../components/NotFound'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path:'/home',
    component:()=>import('../components/Home'),
    redirect:'/welcome',
    children:[
      {
        path:'/welcome',
        component:()=>import('../components/Welcome')
      },
      {
        path:'/users',
        component:()=>import('../components/user/User')
      },
      {
        name:"rights",
        path:'/rights',
        component:()=>import('../components/right/Right')
      },
      {
        path:'/roles',
        component:()=>import ('../components/right/Roles')
      },
      {
        path:"/notfound",
        component:NotFound
      },
      {
        path:'/*',
        redirect:'/notfound'
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to,from,next)=>{
  if(to.path == '/login') next();
  if(to.path === '/home'){
    console.log("start")
    const tokenStr = window.sessionStorage.getItem('token');
    if(!tokenStr) {
      alert("请先登录");
      next('/login');
      return;
    }
  }
  next();
})

export default router
