import { createRouter, createWebHistory } from 'vue-router'
import { getViewer, loaded, isLoggedIn } from '@/me'

const workspaceRoutes = [
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
  {
    path: '/alpha',
    name: 'alpha',
    component: () => import('../views/AlphaDisclaimerView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../views/DashboardView.vue'),
      children: [...workspaceRoutes],
    },
    {
      path: '/demo',
      meta: { demo: true },
      component: () => import('../views/DashboardView.vue'),
      children: [
        { path: '', redirect: { name: 'demo-inbox' } },
        ...workspaceRoutes.map(({ path, name, component }) => ({
          path: path.slice(1),
          name:
            {
              timeline: 'demo-inbox',
              subscriptions: 'demo-feeds',
              'new-subscription': 'demo-new-feed',
            }[name] || `demo-${name}`,
          component,
        })),
        {
          path: 'saved',
          name: 'demo-saved',
          component: () => import('../views/TimelineView.vue'),
        },
        {
          path: 'archive',
          name: 'demo-archive',
          component: () => import('../views/TimelineView.vue'),
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
      redirect: (to) => ({ name: 'landing', query: to.query, hash: to.hash }),
    },
  ],
})

const PUBLIC_ROUTES = ['landing']

router.beforeEach(async (to) => {
  if (to.meta?.demo) return true

  // Ensure that viewer has loaded:
  if (!loaded.value) {
    const reachable = await getViewer()

    if (!reachable) {
      if (to.name === 'landing') return true
      if (to.path === '/') return { name: 'demo-inbox' }
      return { name: 'landing' }
    }
  }

  if (!PUBLIC_ROUTES.includes(to.name) && !isLoggedIn.value) {
    return { name: 'landing', query: { redirect: to.fullPath } }
  }

  if (!to.name) {
    return { name: 'timeline' }
  }
})

export default router
