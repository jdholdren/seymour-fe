import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import { getViewer, loaded, viewer } from '@/me'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/welcome',
      name: 'welcome',
      // route level code-splitting
      // this generates a separate chunk (Welcome.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/WelcomeView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      // route level code-splitting
      // this generates a separate chunk (Welcome.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/RegisterView.vue'),
    },
  ],
})

router.beforeEach(async (to) => {
  // Ensure that viewer has loaded:
  if (!loaded.value) {
    await getViewer()
  }

  if (!viewer.value.user_id && viewer.value.remote_id && to.name != "register") {
    return { name: "register" }
  }

  // If they're not logged in, send them to "welcome".
  //
  // Also make sure they're not already navigating to "welcome",
  // otherwise it's an infinite redirect.
  if (!viewer.value.user_id && to.name !== "welcome" && to.name !== "register") {
    return { name: "welcome" }
  }
})

export default router
