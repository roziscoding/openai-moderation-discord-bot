export function useRedirect(defaultRedirect = '/select-org') {
  const { query } = useRoute()
  const redirect = computed(() => {
    if (!query.redirect) {
      return defaultRedirect
    }

    if (!Array.isArray(query.redirect)) {
      return query.redirect
    }

    return query.redirect[0] ?? defaultRedirect
  })

  return {
    redirect,
  }
}
