import * as React from 'react'

const IsBusyContext = React.createContext(false)

function IsBusyProvider (props: any) {
  const [isBusy, setIsBusy] = React.useState(false)
  const value = React.useMemo(() => [isBusy, setIsBusy], [isBusy])
  return <IsBusyContext.Provider value={value} {...props} />
}

export { IsBusyContext, IsBusyProvider }
