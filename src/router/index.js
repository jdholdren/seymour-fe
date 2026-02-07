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
        },
        {
          path: '/subscriptions',
          name: "subscriptions",
          component: () => import("../views/dashboard/SubscriptionsView.vue"),
        },
        {
          path: '/subscriptions/new',
          name: "new-subscription",
          component: () => import("../views/dashboard/NewFeedView.vue"),
        },
        {
          path: '/account',
          name: "account",
          component: () => import("../views/dashboard/AccountView.vue"),
        },
        {
          path: '/account/prompt',
          name: 'prompt',
          component: () => import("../views/dashboard/PromptView.vue"),
        },
        {
          path: '/article/:articleID',
          name: "article",
          component: () => import("../views/dashboard/ReaderView.vue"),
        },
        {
          path: '/alpha',
          name: 'alpha',
          component: () => import("../views/dashboard/AlphaDisclaimerView.vue"),
        },
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
