import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import useAutoTheme from 'utils/hooks/use-auto-theme'

const AUTO_THEME = 'auto'
const LIGHT_THEME = 'light'

const useDerivedTheme = (selectedTheme: string, defaultTheme: string = LIGHT_THEME):
[string, Dispatch<SetStateAction<string | null>>] => {
  const [derivedTheme, overrideAutoTheme] = useAutoTheme(defaultTheme)
  const [environmentTheme, setEnvironmentTheme] = useState<string | null>(null)
  useEffect(() => {
    if (environmentTheme && (selectedTheme === AUTO_THEME)) {
      overrideAutoTheme(environmentTheme)
      return
    }
    if (selectedTheme !== AUTO_THEME) {
      overrideAutoTheme(selectedTheme)
    } else {
      overrideAutoTheme(null)
    }
  }, [environmentTheme, overrideAutoTheme, selectedTheme])
  return [derivedTheme, setEnvironmentTheme]
}

export default useDerivedTheme
