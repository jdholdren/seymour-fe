import { createRouter, createWebHistory } from 'vue-router'
import { getViewer, loaded, viewer } from '@/me'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/dashboard/DashboardView.vue'),
      children: [
        {
          path: '/',
          component: () => import("../views/dashboard/FeedsView.vue"),
        }
      ],
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

  console.log(viewer.value)

  if (!viewer.value.user_id) {
    let name = to.name
    // If they have a remote id, they want to be going to "register
    if (viewer.value.remote_id) {
      name = "register"
    } else { // Otherwise go to the landing
      name = "welcome"
    }

    // If they are not already headed to the right spot, send them
    if (to.name !== name) {
      return { name }
    }
  } else if (to.name === "welcome" || to.name === "register") { // Send them to dashboard if they're in signup
    return { name: "dashboard" }
  }
})

export default router
