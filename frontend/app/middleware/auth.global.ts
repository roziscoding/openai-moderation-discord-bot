import { authClient } from '~/composables/auth'

const UNPROTECTED_ROUTES = ['/', '/login']

export default defineNuxtRouteMiddleware(async (to) => {
  const session = await authClient.getSession().catch(() => ({ data: null }))
  const isSignedIn = session.data?.user

  if (!isSignedIn && !UNPROTECTED_ROUTES.includes(to.path)) {
    return navigateTo({ path: '/login', query: { redirect: to.path } })
  }

  if (isSignedIn && to.path === '/login') {
    return navigateTo({ path: '/dashboard' })
  }

  const activeOrganization = session.data?.session.activeOrganizationId
  if (!activeOrganization && isSignedIn && to.path !== '/select-org') {
    return navigateTo({ path: '/select-org', query: { redirect: to.path } })
  }
})
