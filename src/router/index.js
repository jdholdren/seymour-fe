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
  ],
})

router.beforeEach(async (to) => {
  // Ensure that viewer has loaded:
  if (!loaded.value) {
    await getViewer()
  }

  // If they're not logged in, send them to "welcome".
  //
  // Also make sure they're not already navigating to "welcome",
  // otherwise it's an infinite redirect.
  if (to.name !== "welcome" && !viewer.value.user_id) {
    return { name: "welcome" }
  }
})

export default router
