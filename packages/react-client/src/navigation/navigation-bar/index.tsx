import NavigationBack from '@/navigation/navigation-back'
import NavigationTitle from '@/navigation/navigation-title'
import NavigationToolbar from '@/navigation/navigation-toolbar'
import { State as ApplicationState } from '@/application'
import * as React from 'react'

interface Props {
  currentName: string | string[]
  goBackUrl: string
  isHome: boolean
  itemCount: number
  parentName: string | null
  popPath: (state: ApplicationState) => void
  setAnimationClassName: (className: string) => void
  setSelectedItemId: (id: string) => void
  showProperties: (path: string) => void
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
          title={parentName || ''}
        />}
      <NavigationTitle isHome={isHome} itemCount={itemCount} title={currentName} />
      <NavigationToolbar />
    </header>
  )
}

export default NavigationBar
