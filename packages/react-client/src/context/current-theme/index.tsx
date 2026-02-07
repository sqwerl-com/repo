import * as React from 'react'

export interface Props {
  children: React.ReactNode | React.ReactNode[]
  themeName: string
}

/** Context that components can query to get the name of the current UI theme (for example: 'dark' or 'light') */
const CurrentThemeContext = React.createContext('light')

/**
 * Injects a context for retrieving the current user interface theme's name.
 * @param props
 */
const CurrentThemeProvider = (props: Props): React.JSX.Element => {
  return (<CurrentThemeContext.Provider value={props.themeName} { ...props } />)
}

export { CurrentThemeContext, CurrentThemeProvider }
