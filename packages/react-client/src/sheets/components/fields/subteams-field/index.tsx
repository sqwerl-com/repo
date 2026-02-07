import ApplicationContext from '@/context/application'
import { CollectionType, Thing } from '@/utilities/types'
import Field from '@/sheets/components/fields/field'
import { IntlShape, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import LinkUrlBuilder from '@/sheets/components/link-url-builder'
import type { SheetState } from '@/properties'
import { useContext } from 'react'

export interface Props {
  state: SheetState
  subteams: CollectionType<Thing>
}

/**
 * Renders a read-only field that lists teams of contributors that are children of a parent team of contributors.
 * @param props
 */
const SubteamsField = (props: Props): React.JSX.Element => {
  const intl = useIntl()
  const { subteams, state } = props

  return (
    <Field
      collection={subteams}
      createLink={subteamsLink}
      fieldLabel={intl.formatMessage({ id: 'subteams.field.label' }, { count: subteams.totalCount })}
      property='subteams'
      state={state}
    />
  )
}

/**
 * Renders hyperlinks to teams of contributors that are children of a parent team of contributors.
 * @param _intl
 * @param subteam
 * @param state
 */
const subteamsLink = (_intl: IntlShape, subteam: Thing, state: SheetState): React.JSX.Element => {
  const { configuration, currentRepositoryName } = state
  const context = useContext(ApplicationContext)
  const { id, name, type } = subteam

  return (
    <span className='sqwerl-read-only-field-sub-item'>
      <Link
        className='sqwerl-hyperlink-underline-on-hover'
        to={LinkUrlBuilder(context, configuration.applicationName, currentRepositoryName, id, type)}
      >
        {name}
      </Link>
    </span>
  )
}

export default SubteamsField
