import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { logger } from '@/utils/logger'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('@/views/Users.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/documents',
    name: 'Documents',
    component: () => import('@/views/Documents.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/Settings.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Track if auth has been initialized
let authInitialized = false

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()

  // Initialize auth on first navigation
  if (!authInitialized) {
    authInitialized = true
    logger.log('🔐 Initializing auth...')
    const authenticated = await authStore.initialize()
    logger.log('🔐 Auth initialized, authenticated:', authenticated)
    logger.log('🔐 authStore.isAuthenticated:', authStore.isAuthenticated)
    logger.log('🔐 Navigating to:', to.name, 'requiresAuth:', to.meta.requiresAuth)

    // After initialization, handle routing based on authentication
    if (authenticated) {
      if (to.name === 'Login') {
        logger.log('✅ Authenticated user on login page, redirecting to dashboard')
        return next({ name: 'Dashboard' })
      }
      // User is authenticated, allow navigation
      logger.log('✅ Authenticated, allowing navigation to:', to.name)
      return next()
    } else {
      if (to.meta.requiresAuth) {
        logger.log('❌ Not authenticated, redirecting to login')
        return next({ name: 'Login' })
      }
      // Not authenticated but route doesn't require auth
      logger.log('➡️ Not authenticated, but route is public, allowing navigation')
      return next()
    }
  }

  // Subsequent navigations - check current auth state
  logger.log('🔄 Subsequent navigation to:', to.name)
  logger.log('🔄 isAuthenticated:', authStore.isAuthenticated)

  // Check authentication for protected routes
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    logger.log('❌ Protected route, not authenticated, redirecting to login')
    return next({ name: 'Login' })
  }

  // Redirect authenticated users away from login page
  if (to.name === 'Login' && authStore.isAuthenticated) {
    logger.log('✅ Authenticated user trying to access login, redirecting to dashboard')
    return next({ name: 'Dashboard' })
  }

  logger.log('✅ Allowing navigation')
  next()
})

export default router
