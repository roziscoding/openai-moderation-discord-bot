import { organizationClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/vue'

export const authClient = createAuthClient({
  baseURL: 'http://localhost:3000/',
  basePath: '/auth',
  plugins: [organizationClient()],
})

export function useAuth() {
  const orgs = authClient.useListOrganizations()
  const session = authClient.useSession()
  const isSignedIn = computed(() => Boolean(session.value.data?.user))
  const activeOrganization = authClient.useActiveOrganization()

  function signIn() {
    authClient.signIn.social({
      provider: 'discord',
      callbackURL: `${window.location.origin}/select-org`,
    })
  }

  function signOut() {
    authClient.signOut()
  }

  function setActiveOrganization(orgId: string) {
    authClient.organization.setActive({ organizationId: orgId })
  }

  const otherOrgs = computed(() => {
    return orgs.value.data?.filter(org => org.id !== activeOrganization.value.data?.id) ?? []
  })

  const hasOrgs = computed(() => {
    return !orgs.value.isPending && !orgs.value.isRefetching && !orgs.value.error && Boolean(otherOrgs.value.length)
  })

  const hasOtherOrgs = computed(() => {
    return !orgs.value.isPending && !orgs.value.isRefetching && !orgs.value.error && Boolean(otherOrgs.value.length)
  })

  return {
    orgs,
    session,
    isSignedIn,
    activeOrganization,
    otherOrgs,
    hasOrgs,
    hasOtherOrgs,
    signIn,
    signOut,
    setActiveOrganization,
  }
}
