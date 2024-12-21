import React from 'react'

interface Props {
  children: React.ReactNode | React.ReactNode[],
  value?: boolean
}

/** Context that components can query to determine if a modal (exclusive input) components is visible. */
const ModalityContext = React.createContext(false)

/**
 * Injects a context for determining if a modal component is visible.
 * @param props
 * @constructor
 */
const ModalityProvider = (props: Props): React.JSX.Element => {
  const [isModalVisible] = React.useState(false)
  return (<ModalityContext.Provider value={isModalVisible} {...props} />)
}

export { ModalityContext, ModalityProvider }
