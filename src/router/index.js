import { createRouter, createWebHistory } from 'vue-router'
import { getViewer, loaded, viewer } from '@/me'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../views/dashboard/DashboardView.vue'),
      children: [
        {
          path: '/',
          name: 'read',
          component: () => import("../views/dashboard/AllFeedsView.vue"),
          meta: {
            title: "Read"
          },
        },
        {
          path: '/feeds',
          name: "manage-feeds",
          component: () => import("../views/dashboard/YourFeedsView.vue"),
          meta: {
            title: "Manage Feeds"
          },
        },
        {
          path: '/new-feed',
          component: () => import("../views/dashboard/NewFeedView.vue"),
          meta: {
            title: "Add a new feed"
          },
        },
        {
          path: '/account',
          name: "account",
          component: () => import("../views/dashboard/AccountView.vue"),
          meta: {
            title: "Your Account"
          },
        }
      ],
    },
    {
      path: '/welcome',
      name: 'welcome',
      component: () => import('../views/WelcomeView.vue'),
    },
  ],
})

const unauthenticatedRoutes = [
  "welcome",
]

router.beforeEach(async (to) => {
  // Ensure that viewer has loaded:
  if (!loaded.value) {
    await getViewer()
  }

  console.log(viewer.value)

  if (!viewer.value.user_id && !unauthenticatedRoutes.includes(to.name)) {
    return { name: "welcome" }
  }
})

export default router
