import { createRouter, createWebHistory } from 'vue-router'
import { getViewer, loaded, isLoggedIn } from '@/me'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../views/DashboardView.vue'),
      children: [
        {
          path: '/timeline',
          name: 'timeline',
          component: () => import('../views/TimelineView.vue'),
        },
        {
          path: '/subscriptions',
          name: 'subscriptions',
          component: () => import('../views/SubscriptionsView.vue'),
        },
        {
          path: '/subscriptions/new',
          name: 'new-subscription',
          component: () => import('../views/NewFeedView.vue'),
        },
        {
          path: '/prompt',
          name: 'prompt',
          component: () => import('../views/PromptView.vue'),
        },
        {
          path: '/article/:articleID',
          name: 'article',
          component: () => import('../views/ReaderView.vue'),
        },
        {
          path: '/alpha',
          name: 'alpha',
          component: () => import('../views/AlphaDisclaimerView.vue'),
        },
      ],
    },
    {
      path: '/landing',
      name: 'landing',
      component: () => import('../views/LandingView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
  ],
})

const PUBLIC_ROUTES = ['landing', 'login']

router.beforeEach(async (to) => {
  // Ensure that viewer has loaded:
  if (!loaded.value) {
    const reachable = await getViewer()

    if (!reachable) {
      return to.name === 'landing' ? true : { name: 'landing' }
    }
  }

  if (!PUBLIC_ROUTES.includes(to.name) && !isLoggedIn.value) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (!to.name) {
    return { name: 'timeline' }
  }
})

export default router
