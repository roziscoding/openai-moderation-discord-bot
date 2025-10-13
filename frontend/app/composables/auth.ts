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
  const organizationMetadata = computed(() => {
    return JSON.parse(activeOrganization.value.data?.metadata ?? '{}')
  })

  async function signIn(redirect = '/select-org') {
    await authClient.signIn.social({
      provider: 'discord',
      callbackURL: `${window.location.origin}${redirect}`,
    })
  }

  async function signOut() {
    await authClient.signOut()
    navigateTo('/login')
  }

  async function setActiveOrganization(orgId: string) {
    await authClient.organization.setActive({ organizationId: orgId })
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
    organizationMetadata,
    otherOrgs,
    hasOrgs,
    hasOtherOrgs,
    signIn,
    signOut,
    setActiveOrganization,
  }
}
