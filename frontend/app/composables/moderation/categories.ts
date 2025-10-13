const CATEGORIES = {
  'harassment': 'harassment',
  'harassment/threatening': 'threatening harassment',
  'hate': 'hate speech',
  'hate/threatening': 'threatening hate speech',
  'illicit': 'illicit activities',
  'illicit/violent': 'violent illicit activities',
  'self-harm': 'self-harm',
  'self-harm/instructions': 'self-harm instructions',
  'self-harm/intent': 'self-harm with intent',
  'sexual': 'sexual content',
  'sexual/minors': 'sexual content involving minors',
  'violence': 'violence',
  'violence/graphic': 'graphic violence',
} as const

export interface CategoryConfig {
  category: string
  name: string
  actions: any[]
  slug: string
}

export function useCategories(config: Ref<{
  actions: Partial<Record<keyof typeof CATEGORIES, any[]>>
  defaultActions: any[]
  adminRoleId: string
}> = ref({
  actions: {},
  defaultActions: [],
  adminRoleId: '',
})) {
  const actionsByCategory = computed(() => {
    return new Map(
      Object.entries(CATEGORIES)
        .sort(([, categoryNameA], [, categoryNameB]) => categoryNameA.localeCompare(categoryNameB))
        .map(([category, name]) => {
          const categoryKey = category as keyof typeof CATEGORIES
          const categoryActionNames = config.value?.actions[categoryKey] ?? []
          const slug = category.replace('/', '-')

          return [
            slug,
            {
              category,
              name,
              actions: categoryActionNames,
              slug,
            } satisfies CategoryConfig,
          ]
        }),
    )
  })

  function capitalize(str: string) {
    if (!str)
      return str
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  function unslugify(str: string) {
    return actionsByCategory.value.get(str)?.category
  }

  function categoryName(category: string) {
    const categoryKey = unslugify(category)
    return capitalize(CATEGORIES[categoryKey as keyof typeof CATEGORIES])
  }

  return {
    categories: CATEGORIES,
    actionsByCategory,
    categoryName,
  }
}
