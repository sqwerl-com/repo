/* global MediaQueryList, MediaQueryListEvent */

import { useEffect, useState } from 'react'

const COLOR_SCHEME_MEDIA_QUERIES: any = {
  DARK: '(prefers-color-scheme: dark)',
  LIGHT: '(prefers-color-scheme: light)'
}

/**
 * Hook that returns the users' preferred CSS color scheme (for example: light or dark).
 */
const useDetectColorScheme = (): string | null => {
  const [colorScheme, setColorScheme] = useState<string | null>(null)
  useEffect(() => {
    if (!window.matchMedia) {
      return
    }
    const listener = (ev: MediaQueryListEvent) => {
      if (!ev || !ev.matches) {
        return
      }
      const colorSchemaNames = Object.keys(COLOR_SCHEME_MEDIA_QUERIES)
      for (const name of colorSchemaNames) {
        if (ev.media === COLOR_SCHEME_MEDIA_QUERIES[name]) {
          setColorScheme(name.toLowerCase())
          break
        }
      }
    }
    let activeMatches: MediaQueryList[] = []
    for (const name of Object.keys(COLOR_SCHEME_MEDIA_QUERIES)) {
      const mediaQueryList = window.matchMedia(COLOR_SCHEME_MEDIA_QUERIES[name])
      mediaQueryList.addEventListener('change', listener)
      activeMatches.push(mediaQueryList)
    }
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setColorScheme('dark')
    }
    return () => {
      activeMatches.forEach(mediaQueryList => mediaQueryList.removeEventListener('change', listener))
      activeMatches = []
    }
  }, [])
  return colorScheme
}

export default useDetectColorScheme
