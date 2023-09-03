import NavigationBack from 'navigation/navigation-back'
import NavigationTitle from 'navigation/navigation-title'
import NavigationToolbar from 'navigation/navigation-toolbar'
import * as React from 'react'

interface Props {
  currentName: string
  goBackUrl: string
  isHome: boolean
  itemCount: number
  parentName: string
  popPath: Function
  setAnimationClassName: Function
  setSelectedItemId: Function
  showProperties: Function
}

const NavigationBar = (props: Props): React.JSX.Element => {
  const {
    currentName,
    goBackUrl,
    isHome,
    itemCount,
    parentName,
    popPath,
    setAnimationClassName,
    setSelectedItemId,
    showProperties
  } = props
  return (
    <header className='sqwerl-navigation-bar'>
      {!isHome &&
        <NavigationBack
          goBackUrl={goBackUrl}
          popPath={popPath}
          setAnimationClassName={setAnimationClassName}
          setSelectedItemId={setSelectedItemId}
          showProperties={showProperties}
          title={parentName}
        />}
      <NavigationTitle isHome={isHome} itemCount={itemCount} title={currentName} />
      <NavigationToolbar />
    </header>
  )
}

export default NavigationBar
