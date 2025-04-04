import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw, RouteLocationNormalized, NavigationGuardNext } from 'vue-router'

const checkAuth = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  let isAuth = false
  if (sessionStorage.getItem('loggedUser') && !isAuth) {
    isAuth = true
    next()
  } else if (!sessionStorage.getItem('loggedUser') && !isAuth) {
    isAuth = true
    next('/auth')
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/PageHome.vue'),
    beforeEnter: checkAuth
  },
  {
    path: '/auth',
    name: 'auth',
    component: () => import('@/pages/PageAuth.vue')
  },
  {
    path: '/list',
    name: 'list',
    component: () => import('@/pages/PageList.vue'),
    beforeEnter: checkAuth
  },
  {
    path: '/editor/:project/:type',
    name: 'editor',
    component: () => import('@/pages/PageEditor.vue'),
    props: true,
    beforeEnter: checkAuth
  },
  {
    path: '/editor',
    redirect: '/list'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

export default router
