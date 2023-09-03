import { AggregatedLibraryChange } from 'utils/library-change-aggregator'
import { format } from 'date-fns'
import { FormattedMessage, useIntl } from 'react-intl'
import { SheetState } from 'properties'
import * as React from 'react'

interface Props {
  changes: AggregatedLibraryChange[]
  state: SheetState
}

/**
 * Renders a read-only form that lists, and contains links to, the changes made to a library of things on the same day.
 * @param props
 * @constructor
 */
const ChangesByDayDetails = (props: Props): React.JSX.Element => {
  const { changes } = props
  const intl = useIntl()
  const changeGroups: React.ReactNode[] = []
  if (changes && (changes.length > 0)) {
    changes.forEach((commit, index) => {
      const numberOfChangesAtTimeTitle =
        intl.formatMessage(
          {
            id: 'librariesSheet.numberChangesAtTimeTitle'
          },
          {
            count: changes[index].changesCount,
            time: format(new Date(commit.date), 'h:mm a')
          })
      if (changes.length > 1) {
        changeGroups.push(
          <div
            className='sqwerl-library-changes-details-time'
            dangerouslySetInnerHTML={{ __html: numberOfChangesAtTimeTitle }}
          />)
      }
      changeGroups.push(
        <table className='sqwerl-library-changes-by-day-details-table' key={index}>
          <thead>
            <tr className='sqwerl-library-changes-by-day-details-table-heading'>
              <th className='sqwerl-changes-by-day-item-ordinal' />
              <th
                className='sqwerl-changes-by-day-details-name-table-column'
                title={intl.formatMessage({ id: 'librariesSheet.detailsTable.nameColumn.tooltip' })}
              >
                <FormattedMessage id='librariesSheet.detailsTable.nameColumn.text' />
              </th>
              <th
                className='sqwerl-changes-by-day-details-table-change-column'
                title={intl.formatMessage({ id: 'librariesSheet.detailsTable.nameColumn.tooltip' })}
              >
                <FormattedMessage id='librariesSheet.detailsTable.typeColumn.text' />
              </th>
              <th
                className='sqwerl-changes-by-day-details-table-type-of-thing-column'
                title={intl.formatMessage({ id: 'librariesSheet.detailsTable.typeOfChangeColumn.tooltip' })}
              >
                <FormattedMessage id='librariesSheet.detailsTable.typeOfChangeColumn.text' />
              </th>
            </tr>
          </thead>
          <tbody key={index}>
            {/*
              <IndividualChanges
                changes={commit.members}
                key={index}
                offset={count}
                state={state}
              />
              */}
          </tbody>
        </table>)
    })
  }
  return (<div className='sqwerl-home-view-changes-details'>{changeGroups}</div>)
}

export default ChangesByDayDetails
