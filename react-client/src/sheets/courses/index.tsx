import ArchivedField from '../components/fields/archived-field'
import AttendedByField from 'sheets/components/fields/attended-by-field'
import AttendingField from 'sheets/components/fields/attending-field'
import CollectionsField from 'sheets/components/fields/collections-field'
import DescriptionField from 'sheets/components/fields/description-field'
import HistoryField from 'sheets/components/fields/history-field'
import InstructorsField from 'sheets/components/fields/instructors-field'
import LinksField from 'sheets/components/fields/links-field'
import Logger, { LoggerType } from 'logger'
import NotesField from 'sheets/components/fields/notes-field'
import RecommendationsField from 'sheets/components/fields/recommendations-field'
import RecommendedByField from 'sheets/components/fields/recommended-by-field'
import ScrollableContent from 'sheets/components/scrollable-content'
import type { SheetProps } from 'properties'
import TagsField from 'sheets/components/fields/tags-field'
import TitleBar from 'sheets/components/title-bar'
import * as React from 'react'

let logger: LoggerType

/**
 * Renders a read-only form that displays information about an academic course.
 * @param props
 * @constructor
 */
const CoursesSheet = (props: SheetProps): React.JSX.Element => {
  logger = Logger(CoursesSheet, CoursesSheet)
  const connectionProperties = [
    'addedBy',
    'archived',
    'attendedBy',
    'attending',
    'collections',
    'instructors',
    'links',
    'notes',
    'recommendations',
    'recommendedBy',
    'tags'
  ]
  logger.info('Rendering Courses property sheet')
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
    attending,
    collections,
    description,
    instructors,
    links,
    name,
    notes,
    recommendations,
    recommendedBy,
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
        titleTextId='coursesSheet.title'
        titleTextValues={{ name }}
      />
      <ScrollableContent>
        {archived && <ArchivedField archived={archived} />}
        {description && <DescriptionField description={description} state={state} />}
        {instructors && <InstructorsField instructors={instructors} state={state} />}
        {collections && <CollectionsField collections={collections} state={state} />}
        {notes && <NotesField notes={notes} state={state} />}
        {attendedBy && <AttendedByField attendedBy={attendedBy} state={state} />}
        {attending && <AttendingField attending={attending} state={state} />}
        {recommendedBy && <RecommendedByField recommendedBy={recommendedBy} state={state} />}
        {recommendations && <RecommendationsField recommendations={recommendations} state={state} />}
        {tags && <TagsField tags={tags} state={state} />}
        {links && <LinksField links={links} state={state} />}
        {addedBy && addedOn && <HistoryField addedBy={addedBy} addedOn={addedOn} state={state} />}
      </ScrollableContent>
    </>
  )
}

export default CoursesSheet
