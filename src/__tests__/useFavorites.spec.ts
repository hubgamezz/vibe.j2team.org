import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'

type UseFavorites = (typeof import('@/composables/useFavorites'))['useFavorites']

describe('useFavorites', () => {
  let useFavorites: UseFavorites

  beforeEach(async () => {
    vi.resetModules()
    vi.doMock('@vueuse/core', () => ({
      useLocalStorage: (_key: string, defaultValue: string[]) => ref([...defaultValue]),
    }))
    const mod = await import('@/composables/useFavorites')
    useFavorites = mod.useFavorites
  })

  it('starts with empty favoritePaths', () => {
    const { favoritePaths } = useFavorites()
    expect(favoritePaths.value).toEqual([])
  })

  it('toggleFavorite adds a path when not present', () => {
    const { favoritePaths, toggleFavorite } = useFavorites()
    toggleFavorite('/test-app')
    expect(favoritePaths.value).toEqual(['/test-app'])
  })

  it('toggleFavorite removes a path when already present', () => {
    const { favoritePaths, toggleFavorite } = useFavorites()
    toggleFavorite('/test-app')
    toggleFavorite('/test-app')
    expect(favoritePaths.value).toEqual([])
  })

  it('isFavorite returns true after adding, false after removing', () => {
    const { isFavorite, toggleFavorite } = useFavorites()
    toggleFavorite('/app-a')
    expect(isFavorite('/app-a')).toBe(true)
    toggleFavorite('/app-a')
    expect(isFavorite('/app-a')).toBe(false)
  })

  it('toggle same path twice restores original state', () => {
    const { favoritePaths, toggleFavorite } = useFavorites()
    toggleFavorite('/round-trip')
    toggleFavorite('/round-trip')
    expect(favoritePaths.value).toEqual([])
  })

  it('tracks multiple distinct paths independently', () => {
    const { favoritePaths, toggleFavorite, isFavorite } = useFavorites()
    toggleFavorite('/app-a')
    toggleFavorite('/app-b')
    toggleFavorite('/app-c')

    expect(favoritePaths.value).toHaveLength(3)
    expect(isFavorite('/app-a')).toBe(true)
    expect(isFavorite('/app-b')).toBe(true)
    expect(isFavorite('/app-c')).toBe(true)

    toggleFavorite('/app-b')
    expect(isFavorite('/app-b')).toBe(false)
    expect(favoritePaths.value).toHaveLength(2)
  })

  it('multiple useFavorites() calls share the same singleton state', () => {
    const first = useFavorites()
    const second = useFavorites()

    first.toggleFavorite('/shared')
    expect(second.isFavorite('/shared')).toBe(true)
    expect(second.favoritePaths.value).toEqual(['/shared'])
  })
})
