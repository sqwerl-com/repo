import { IntlShape, useIntl } from 'react-intl'
import ReadOnlyFieldLabel from '@/sheets/components/read-only-field-label'
import * as React from 'react'

export interface Props {
  status: string
}

/**
 * Renders a read-only field that displays a project's status. For example: active, cancelled, completed, or
 * suspended.
 * @param props
 */
const ProjectStatusField = (props: Props): React.JSX.Element => {
  const { status } = props
  const intl = useIntl()

  return (
    <div className='sqwerl-properties-read-only-field'>
      <ReadOnlyFieldLabel
        description={intl.formatMessage({ "id": "projectStatus.field.description" })}
        labelText={intl.formatMessage({ id: 'projectStatus.field.label' })}
      />
      <div
        className='sqwerl-properties-read-only-field-value'
        dangerouslySetInnerHTML={{ __html: statusText(intl, status) }}
      />
    </div>
  )
}

/**
 * Returns text to display to describe a project's current status.
 * @param intl Internationalization information.
 * @param status A project's current status.
 */
const statusText = (intl: IntlShape, status: string) => {
  switch (status) {
    case 'active':
      return intl.formatMessage({ id: 'projectStatus.active' })

    case 'cancelled':
      return intl.formatMessage({ id: 'projectStatus.cancelled' })

    case 'completed':
      return intl.formatMessage({ id: 'projectStatus.completed' })

    case 'suspended':
      return intl.formatMessage({ id: 'projectStatus.suspended' })

    default:
      return ''
  }
}

export default ProjectStatusField
