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
          path: '/read',
          name: 'read',
          component: () => import("../views/dashboard/ReadView.vue"),
          meta: {
            title: "Read"
          },
        },
        {
          path: '/subscriptions',
          name: "subscriptions",
          component: () => import("../views/dashboard/SubscriptionsView.vue"),
          meta: {
            title: "Subscriptions"
          },
        },
        {
          path: '/subscriptions/new',
          name: "new-subscription",
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

  console.log(to)

  if (!viewer.value.user_id && !unauthenticatedRoutes.includes(to.name)) {
    return { name: "welcome" }
  }
  if (!to.name) {
    return { name: "read" }
  }
})

export default router
