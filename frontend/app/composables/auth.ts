import { organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/vue";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000/",
  basePath: "/auth",
  plugins: [organizationClient()],
});

export function useAuth() {
  const orgs = authClient.useListOrganizations();
  const session = authClient.useSession();
  const isSignedIn = computed(() => Boolean(session.value.data?.user));
  const activeOrganization = authClient.useActiveOrganization();

  function signIn() {
    authClient.signIn.social({
      provider: "discord",
      callbackURL: `${window.location.origin}/`,
    });
  }

  function signOut() {
    authClient.signOut();
  }

  function setActiveOrganization(orgId: string) {
    authClient.organization.setActive({ organizationId: orgId });
  }

  return {
    orgs,
    session,
    isSignedIn,
    activeOrganization,
    signIn,
    signOut,
    setActiveOrganization,
  };
}
