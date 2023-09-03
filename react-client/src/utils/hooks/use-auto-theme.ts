import useDetectColorScheme from 'utils/hooks/use-detect-color-scheme'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

const useAutoTheme = (defaultTheme: string = 'light'): [string, Dispatch<SetStateAction<string | null>>] => {
  const detectedScheme: string | null = useDetectColorScheme()
  const [autoTheme, setAutoTheme] = useState(detectedScheme || defaultTheme)
  const [overriddenTheme, overrideAutoTheme] = useState<string | null>(null)
  useEffect(() => {
    if (overriddenTheme) {
      setAutoTheme(overriddenTheme)
      return
    }
    if (!detectedScheme && !overriddenTheme) {
      setAutoTheme(defaultTheme)
      return
    }
    if (detectedScheme) {
      setAutoTheme(detectedScheme)
    }
  }, [defaultTheme, detectedScheme, overriddenTheme])
  return [autoTheme, overrideAutoTheme]
}

export default useAutoTheme
