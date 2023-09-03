import ArchivedField from '../components/fields/archived-field'
import AttendedByField from 'sheets/components/fields/attended-by-field'
import CollectionsField from 'sheets/components/fields/collections-field'
import Description from 'sheets/components/fields/description-field'
import HistoryField from 'sheets/components/fields/history-field'
import LinksField from 'sheets/components/fields/links-field'
import ListenersField from 'sheets/components/fields/listeners-field'
import Logger, { LoggerType } from 'logger'
import NotesField from 'sheets/components/fields/notes-field'
import RecommendationsField from 'sheets/components/fields/recommendations-field'
import RecommendedByField from 'sheets/components/fields/recommended-by-field'
import RepresentationsField from 'sheets/components/fields/representations-field'
import ScrollableContent from 'sheets/components/scrollable-content'
import type { SheetState } from 'properties'
import SpeakersField from 'sheets/components/fields/speakers-field'
import TagsField from 'sheets/components/fields/tags-field'
import TitleBar from 'sheets/components/title-bar'
import * as React from 'react'

let logger: LoggerType

interface Props {
  state: SheetState
}

/**
 * Renders a read-only form that displays information describing a talk given to an audience.
 * @param props
 * @constructor
 */
const TalksSheet = (props: Props): React.JSX.Element => {
  logger = Logger(TalksSheet, TalksSheet)
  const connectionProperties = [
    'addedBy',
    'archived',
    'attendedBy',
    'collections',
    'links',
    'listeners',
    'notes',
    'recommendations',
    'recommendedBy',
    'representations',
    'speakers',
    'tags'
  ]
  logger.info('Render Talks property sheet')
  const { state } = props
  const { configuration, thing } = state
  if (thing == null) {
    return (<></>)
  }
  const {
    addedBy,
    addedOn,
    archived,
    attendedBy,
    collections,
    description,
    links,
    listeners,
    name,
    notes,
    speakers,
    recommendations,
    recommendedBy,
    representations,
    tags
  } = thing
  return (
    <>
      <TitleBar
        configuration={configuration}
        connectionProperties={connectionProperties}
        icon=''
        iconDescription=''
        thing={thing}
        titleTextId='talksSheet.title'
        titleTextValues={{ name }}
      />
      <ScrollableContent>
        {archived && <ArchivedField archived={archived} />}
        {description && <Description description={description} state={state} />}
        {speakers && <SpeakersField speakers={speakers} state={state} />}
        {collections && <CollectionsField collections={collections} state={state} />}
        {representations &&
          <RepresentationsField
            fieldTitleId='representations.field.label'
            representations={representations}
            state={state}
          />}
        {notes && <NotesField notes={notes} state={state} />}
        {attendedBy && <AttendedByField attendedBy={attendedBy} state={state} />}
        {listeners && <ListenersField listeners={listeners} state={state} />}
        {recommendedBy && <RecommendedByField recommendedBy={recommendedBy} state={state} />}
        {recommendations && <RecommendationsField recommendations={recommendations} state={state} />}
        {links && <LinksField links={links} state={state} />}
        {tags && <TagsField tags={tags} state={state} />}
        {addedBy && addedOn && <HistoryField addedBy={addedBy} addedOn={addedOn} state={state} />}
      </ScrollableContent>
    </>
  )
}

export default TalksSheet
