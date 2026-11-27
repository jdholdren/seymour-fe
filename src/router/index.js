import { createRouter, createWebHistory } from 'vue-router'
import { getViewer, loaded, isLoggedIn } from '@/me'
import { normalizeReturnPath } from '@/use/authNavigation'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('../views/LandingView.vue'),
    },
    {
      path: '/workspace',
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
          path: '/article/:articleID',
          name: 'article',
          component: () => import('../views/ReaderView.vue'),
        },
      ],
    },
    {
      path: '/landing',
      redirect: (to) => ({ name: 'landing', query: to.query, hash: to.hash }),
    },
    {
      path: '/login',
      redirect: (to) => ({ name: 'landing', query: to.query, hash: to.hash }),
    },
  ],
})

router.beforeEach(async (to) => {
  // Ensure that viewer has loaded:
  if (!loaded.value) {
    const reachable = await getViewer({ redirectOnUnauthorized: false })

    if (!reachable) {
      return to.name === 'landing' ? true : { name: 'landing', query: { redirect: to.fullPath } }
    }
  }

  if (to.name === 'landing') {
    if (isLoggedIn.value) return normalizeReturnPath(to.query?.redirect)
    return
  }

  if (!isLoggedIn.value) return { name: 'landing', query: { redirect: to.fullPath } }

  if (!to.name) {
    return { name: 'timeline' }
  }
})

export default router
