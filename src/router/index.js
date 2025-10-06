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
          path: '/timeline',
          name: 'timeline',
          component: () => import("../views/dashboard/TimelineView.vue"),
          meta: {
            title: "All Subscriptions"
          },
        },
        {
          path: '/subscriptions',
          name: "subscriptions",
          component: () => import("../views/dashboard/SubscriptionsView.vue"),
          meta: {
            title: "Manage Subscriptions"
          },
        },
        {
          path: '/subscriptions/new',
          name: "new-subscription",
          component: () => import("../views/dashboard/NewFeedView.vue"),
          meta: {
            title: "New Subscription"
          },
        },
        {
          path: '/account',
          name: "account",
          component: () => import("../views/dashboard/AccountView.vue"),
          meta: {
            title: "Account"
          },
        }
      ],
    },
    {
      path: '/welcome',
      name: 'welcome',
      component: () => import('../views/welcome/WelcomeView.vue'),
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

  if (!viewer.value.user_id && !unauthenticatedRoutes.includes(to.name)) {
    return { name: "welcome" }
  }
  if (!to.name) {
    return { name: "timeline" }
  }
})

export default router
