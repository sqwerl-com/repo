import { AggregatedChange } from '@/utilities/change-aggregator.ts'
import ChangesGraphContainer from '@/repository-changes-graph/changes-graph-container'
import ReadOnlyFieldLabel from '@/sheets/components/read-only-field-label'
import { SheetState } from '@/properties'
import { Thing } from '@/utilities/types'
import { useIntl } from 'react-intl'
import * as React from 'react'

type Props = {
  changes: AggregatedChange[]
  repository: Thing
  state: SheetState
}

/**
 * Renders the history of changes to a repository of thing's things (content).
 * @param props
 * @constructor
 */
const ContentsField = (props: Props) => {
  const { changes, repository: thing, state } = props
  const intl = useIntl()

  return (
    <div className='sqwerl-properties-read-only-field'>
      <ReadOnlyFieldLabel
        description={intl.formatMessage({ id: 'contents.field.description' })}
        labelText={intl.formatMessage({ id: 'contents.field.label' })}
      />

      <div className='sqwerl-properties-read-only-field-value'>
        <ChangesGraphContainer
          changes={changes}
          repository={thing}
          state={state}
        />
      </div>
    </div>
  )
}

export default ContentsField
