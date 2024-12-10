import * as React from 'react'

type Props = {
  children: React.ReactNode | React.ReactNode[]
}

/** Context that components can query to determine if the application is busy: processing server responses. */
const IsBusyContext = React.createContext(false)

/**
 * Injects a context for determining that the application is busy processing server responses.
 * @params props
 * @constructor
 */
function IsBusyProvider (props: Props) {
  const [isBusy, setIsBusy] = React.useState(false)
  const value = React.useMemo(() => [isBusy, setIsBusy], [isBusy])
  // @ts-expect-error Value is a boolean or a memo.
  return <IsBusyContext.Provider value={value} {...props} />
}

export { IsBusyContext, IsBusyProvider }
