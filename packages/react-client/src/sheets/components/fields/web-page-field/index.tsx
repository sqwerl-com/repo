import ApplicationContext from '@/context/application'
import { BasicThing } from '@/utilities/types'
import { Link } from 'react-router-dom'
import LinkUrlBuilder from '@/sheets/components/link-url-builder'
import ReadOnlyFieldLabel from '@/sheets/components/read-only-field-label'
import type { SheetState } from '@/properties'
import { useIntl } from 'react-intl'
import { useContext } from 'react'

export interface Props {
  description: string | undefined
  webPage: BasicThing
  state: SheetState
}

/**
 * Renders a read-only field that displays links to a web page.
 * @param props
 */
const WebPageField = (props: Props): React.JSX.Element => {
  const { description, state, webPage } = props
  const { configuration, currentRepositoryName } = state
  const context = useContext(ApplicationContext)
  const { id, name, type } = webPage
  const intl = useIntl()

  return (
    <div className='sqwerl-properties-read-only-field'>
      <ReadOnlyFieldLabel
        description={description || ''}
        labelText={intl.formatMessage({ id: 'webPage.label' })}
      />
      <div className='sqwerl-properties-read-only-field-value'>
        <span className='sqwerl-read-only-field-sub-item'>
          <Link
            className='sqwerl-hyperlink-underline-on-hover'
            to={LinkUrlBuilder(context, configuration.applicationName, currentRepositoryName, id, type)}
          >
            {name}
          </Link>
        </span>
      </div>
    </div>
  )
}

export default WebPageField
