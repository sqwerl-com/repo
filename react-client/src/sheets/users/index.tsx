import ArchivedField from '../components/fields/archived-field'
import FirstNameField from 'sheets/components/fields/first-name-field'
import GroupsField from 'sheets/components/fields/groups-field'
import HasAttendedField from 'sheets/components/fields/has-attended-field'
import HasListenedToField from 'sheets/components/fields/has-listened-to-field'
import HasReadField from 'sheets/components/fields/has-read-field'
import HasViewedField from 'sheets/components/fields/has-viewed-field'
import HistoryField from 'sheets/components/fields/history-field'
import IsAttendingField from 'sheets/components/fields/is-attending-field'
import IsReadingField from 'sheets/components/fields/is-reading-field'
import LastNameField from 'sheets/components/fields/last-name-field'
import Logger, { LoggerType } from 'logger'
import MiddleNameOrInitialField from 'sheets/components/fields/middle-name-or-initial-field'
import OwnsField from 'sheets/components/fields/owns-field'
import ScrollableContent from 'sheets/components/scrollable-content'
import type { SheetState } from 'properties'
import TitleBar from 'sheets/components/title-bar'
import * as React from 'react'

let logger: LoggerType

interface Props {
  state: SheetState
}

/**
 * Renders a read-only form that displays information that describes a user.
 * @param props
 * @constructor
 */
const UsersSheet = (props: Props): React.JSX.Element => {
  logger = Logger(UsersSheet, UsersSheet)
  const connectionProperties = [
    'addedBy', 'archived', 'groups', 'hasAttended', 'hasListenedTo', 'hasRead', 'hasViewed', 'owns'
  ]
  logger.info('Rendering Users property sheet')
  const { state } = props
  const { configuration, thing } = state
  if (thing == null) {
    return (<></>)
  }
  const {
    addedBy,
    addedOn,
    archived,
    firstName,
    groups,
    hasAttended,
    hasListenedTo,
    hasRead,
    hasViewed,
    isAttending,
    isReading,
    lastName,
    middleNameOrInitial,
    name,
    owns
  } = thing
  return (
    <>
      <TitleBar
        configuration={configuration}
        connectionProperties={connectionProperties}
        icon=''
        iconDescription=''
        thing={thing}
        titleTextId='usersSheet.title'
        titleTextValues={{ name }}
      />
      <ScrollableContent>
        {archived && <ArchivedField archived={archived} />}
        {firstName && <FirstNameField firstName={firstName} state={state} />}
        {middleNameOrInitial &&
          <MiddleNameOrInitialField middleNameOrInitial={middleNameOrInitial} state={state} />}
        {lastName && <LastNameField lastName={lastName} state={state} />}
        {groups && <GroupsField groups={groups} state={state} />}
        {hasRead && <HasReadField hasRead={hasRead} state={state} />}
        {isReading && <IsReadingField isReading={isReading} state={state} />}
        {hasAttended && <HasAttendedField hasAttended={hasAttended} state={state} />}
        {isAttending && <IsAttendingField isAttending={isAttending} state={state} />}
        {hasListenedTo && <HasListenedToField hasListenedTo={hasListenedTo} state={state} />}
        {hasViewed && <HasViewedField hasViewed={hasViewed} state={state} />}
        {owns && <OwnsField owns={owns} state={state} />}
        {addedBy && addedOn && <HistoryField addedBy={addedBy} addedOn={addedOn} state={state} />}
      </ScrollableContent>
    </>
  )
}

export default UsersSheet
