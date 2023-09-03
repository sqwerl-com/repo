import * as React from 'react'

const ModalityContext = React.createContext(false)

function ModalityProvider (props: any) {
  const [isModalVisible, setIsModalVisible] = React.useState(false)
  const value = React.useMemo(() => [isModalVisible, setIsModalVisible], [isModalVisible])
  return <ModalityContext.Provider value={value} {...props} />
}

export { ModalityContext, ModalityProvider }
