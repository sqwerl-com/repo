import ArchivedField from '@/sheets/components/fields/archived-field'
import ControlsField from '@/sheets/components/fields/controls-field'
import FirstNameField from '@/sheets/components/fields/first-name-field'
import HasAttendedField from '@/sheets/components/fields/has-attended-field'
import HasListenedToField from '@/sheets/components/fields/has-listened-to-field'
import HasReadField from '@/sheets/components/fields/has-read-field'
import HasViewedField from '@/sheets/components/fields/has-viewed-field'
import HistoryField from '@/sheets/components/fields/history-field'
import IsAttendingField from '@/sheets/components/fields/is-attending-field'
import IsReadingField from '@/sheets/components/fields/is-reading-field'
import LastNameField from '@/sheets/components/fields/last-name-field'
import Logger, { LoggerType } from '@/logger'
import MiddleNameOrInitialField from '@/sheets/components/fields/middle-name-or-initial-field'
import RecommendationsField from '@/sheets/components/fields/recommendations-field'
import ScrollableContent from '@/sheets/components/scrollable-content'
import SubscriptionsField from '@/sheets/components/fields/subscriptions-field'
import type { SheetState } from '@/properties'
import TeamsField from '@/sheets/components/fields/teams-field'
import TitleBar from '@/sheets/components/title-bar'
import * as React from 'react'

let logger: LoggerType

interface Props {
  state: SheetState
}

/**
 * Renders a read-only form that displays information that describes a contributor.
 * @param props
 * @constructor
 */
const ContributorsSheet = (props: Props): React.JSX.Element => {
  logger = Logger(ContributorsSheet, ContributorsSheet)
  const connectionProperties = [
    'addedBy', 'archived', 'controls', 'hasAttended', 'hasListenedTo', 'hasRead', 'hasViewed', 'teams'
  ]

  logger.info('Rendering Contributors property sheet')

  const { state } = props
  const { configuration, thing } = state

  if (thing == null) {
    return (<></>)
  }

  const {
    addedBy,
    addedOn,
    archived,
    controls,
    firstName,
    hasAttended,
    hasListenedTo,
    hasRead,
    hasViewed,
    isAttending,
    isReading,
    lastName,
    middleNameOrInitial,
    name,
    recommendations,
    subscriptions,
    teams
  } = thing
  return (
    <>
      <TitleBar
        configuration={configuration}
        connectionProperties={connectionProperties}
        icon=''
        iconDescription=''
        state={state}
        thing={thing}
        titleTextId='contributorsSheet.title'
        titleTextValues={{ name }}
      />
      <ScrollableContent>
        {archived && <ArchivedField archived={archived} />}
        {firstName && <FirstNameField firstName={firstName} state={state} />}
        {middleNameOrInitial &&
          <MiddleNameOrInitialField middleNameOrInitial={middleNameOrInitial} state={state} />}
        {lastName && <LastNameField lastName={lastName} state={state} />}
        {teams && <TeamsField teams={teams} state={state} />}
        {recommendations && <RecommendationsField recommendations={recommendations} state={state} />}
        {hasRead && <HasReadField hasRead={hasRead} state={state} />}
        {isReading && <IsReadingField isReading={isReading} state={state} />}
        {hasAttended && <HasAttendedField hasAttended={hasAttended} state={state} />}
        {isAttending && <IsAttendingField isAttending={isAttending} state={state} />}
        {hasListenedTo && <HasListenedToField hasListenedTo={hasListenedTo} state={state} />}
        {hasViewed && <HasViewedField hasViewed={hasViewed} state={state} />}
        {subscriptions && <SubscriptionsField subscriptions={subscriptions} state={state} />}
        {controls && <ControlsField controls={controls} state={state} />}
        {addedBy && addedOn && <HistoryField addedBy={addedBy} addedOn={addedOn} state={state} />}
      </ScrollableContent>
    </>
  )
}

export default ContributorsSheet
